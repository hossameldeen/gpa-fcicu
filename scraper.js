/*
- user, pass: Account login information of user to calculate the GPA for.
- DELAY: An integer representing the minimum duration in milliseconds between
  requests to the site. For not getting suspected of DOS (the ecom seems to
  suspect those that several many requests in a small time.).
- `callback` should be a function that accepts one parameter:
  function callback(result) {...}
- `callback` is called when either
  (1) An error occured.
  (2) Finished reading.
- `result` will have the following structure:
  { 'err': an array of strings describing the errors. Has length of zero iff no
    error occured. If an error occured, there's no guarantee on the other
    entries' values.
  , 0 or more strings representing the academic years each of which will have
    an array of 3 items corresponding to First, Second and Summer terms,
    respectively, each of which is either an HTML table with the same structure
    as the HTML table in the ecom page, or undefined if no table was found.
  }
  Example:
    { 'err': []
    , '13': [HTML Table, HTML Table, undefined]
    , '12': [undefined, HTML Table, HTML Table]
    }
*/
function Scraper() {

  this.start = function(userParam, passParam, DELAYParam, callbackParam) {
    if (working) {
      callback({'err': "This Scraper is currently processing. Stop it first or"
      + " create another Scraper."});
      return;
    }
    user = userParam; pass = passParam;
    DELAY = DELAYParam; callback = callbackParam;
    working = true;
    interval = window.setInterval(sendRequest, DELAY);
    requestQ = [];
    result = {'err': []}; // May have more entries later.
    termsYearsCount = [];
    doneTermsYearsCount = [];
    startScraping(); // The start point
  };
  this.stopAndCallCallback = function() {
    if (working)
      clearInterval(interval);  // Because of JS's EventLoop, it's guaranteed
                                // that another function wouldn't be running.
    working = false; interval = null;
    result.err.push('Stopped before finishing!');
    callback(result);
  }

  function endAllThis() {
    clearInterval(interval);
    working = false; interval = null;
    callback(result);
  }

  var user, pass, DELAY, callback;
  var that = this;
  var working = false,  // Same as interval != null
      interval = null;
  var requestQ, result;
  var termsYearsCount, doneTermsYearsCount;
  function sendRequest() {
    if (result.err.length > 0) {
      that.stopAndCallCallback();
      return;
    }
    var done = doneTermsYearsCount.length > 0;
    for (var i = 0; i < 3; ++i)
      if (doneTermsYearsCount[i] !== termsYearsCount[i])
        done = false;
    if (done) {
      endAllThis();
      return;
    }
    if (requestQ.length == 0)
      return;
    requestQ[0].fn.apply(null, requestQ[0].param);
    requestQ.shift();
  }


  function startScraping() {
    logout();
  }

  function logout() {
    requestQ.push({
      'fn': sendGET,
      'param': ['http://my.fci.cu.edu.eg/logout.php', logoutHandler],
    });
  }

  function logoutHandler(xhr) {
    if (xhr.readyState != 4)
      return;
    login();
  }

  function login() {
    var paramString = 'stid&user=' + user + '&pass=' + pass + '&login=Login';
    requestQ.push({
      'fn': sendPOST,
      'param': ['http://my.fci.cu.edu.eg/index.php', paramString, loginHandler]
    });
  }

  function handlerBase(xhr) {
    if (xhr.readyState != 4)
      return true;
    var doc = parseHTML(xhr.responseText);
    var state = checkUser(user, doc);
    if (state !== true) {
      result.err.push(state);
      return true;
    }
    return doc;
  }

  function loginHandler(xhr) {
    var doc = handlerBase(xhr);
    if (doc === true)
      return;
    collectYears();
  }

  function collectYears() {
    var baseLink = 'http://my.fci.cu.edu.eg/content.php?pg=studgroup_term';
    var terms = [baseLink + '1.php', baseLink + '2.php', baseLink + '3_m.php'];
    for (var i = 0; i < terms.length; ++i)
      requestQ.push({
        'fn': sendGET, 'param': [terms[i], collectYearsHandler,
                                 {'url': terms[i], 'termIndex': i}]
      });
    }

  function collectYearsHandler(xhr) {
    var doc = handlerBase(xhr);
    if (doc === true)
      return;
    var years;
    try {
      years = doc.getElementsByTagName('select')[0].children;
    }
    catch(err) {
      result.err.push("The page structure wasn't as expected. A possible reaso"
      + "n is the site is down or Internet connectivity.");
      return;
    }
    termsYearsCount[xhr.info.termIndex] = years.length;
    doneTermsYearsCount[xhr.info.termIndex] = 0;
    for (var i = 0; i < years.length; ++i)
      requestQ.push({
        'fn': sendPOST,
        'param': [xhr.info.url, 'prev_years=' + years[i].textContent,
                  termHandler, {'termIndex': xhr.info.termIndex,
                                 'year': years[i].textContent}]
      });
  }

  function termHandler(xhr) {
    var doc = handlerBase(xhr);
    if (doc === true)
      return;
    ++doneTermsYearsCount[xhr.info.termIndex];
    if (typeof result[xhr.info.year] === 'undefined')
      result[xhr.info.year] = []; // No race conditions because of JS's
                                  // EventLoop.
    result[xhr.info.year][xhr.info.termIndex] =
      doc.getElementsByClassName("FormTable")[0];
  }

}
