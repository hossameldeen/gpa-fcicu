/*
Each phase will be sent like that:
[logout, login, ..]
and then called:
phases[ind](prevResult, callback)
*/


function logout(prevResult, callback) {
  requestRunner.addRequestToQueue({
    'fn': 'GET',
    'url': 'http://my.fci.cu.edu.eg/logout.php',
    'handler': handler,
    'infoForHandler': {'user': prevResult.user}
  });
  function handler(xhr) {
    if (xhr.readyState != 4)
      return;
    callback(prevResult); // i.e., gives the user & pass & everything as-is
  }
}


function login(prevResult, callback) {
  requestRunner.addRequestToQueue({
    'fn': 'POST',
    'url': 'http://my.fci.cu.edu.eg/index.php',
    'handler': handler,
    'paramObject': {
      'stid': '',
      'user': prevResult.user,
      'pass': prevResult.pass,
      'login': 'Login'
    },
    'infoForHandler': {'user': prevResult.user}
  });
  var result = {'err': [], 'user': prevResult.user};
  function handler(xhr) {
    if (xhr.readyState != 4)
      return;
    var doc = handlerBase(xhr);
    if (doc === true)
      result.err.push(Error(doc));
    callback(result);
  }
}


function getYears(prevResult, callback) {
  var baseLink = 'http://my.fci.cu.edu.eg/content.php?pg=studgroup_term';
  var terms = [baseLink + '1.php', baseLink + '2.php', baseLink + '3_m.php'];
  for (var i = 0; i < terms.length; ++i)
    requestRunner.addRequestToQueue({
      'fn': 'GET',
      'url': terms[i],
      'handler': handler,
      'infoForHandler': {'termIndex': i, 'user': prevResult.user}
    });
  var termsCount = 0; // -1 if error happened & already called callback
  var result = {'err': [], 'user': prevResult.user, 'years': [[], [], []]};
  function handler(xhr) {
    if (termsCount == -1)
      return;
    if (xhr.readyState != 4)
      return;
    var doc = handlerBase(xhr);
    if (doc === true) {
      result.err.push(Error(doc));
      termsCount = -1;
      callback(result);
      return;
    }
    var years;
    try {
      years = doc.getElementsByTagName('select')[0].children;
    }
    catch(err) {
      result.err.push(Error("The page structure wasn't as expected."));
      termsCount = -1;
      callback(result);
      return;
    }
    for (var i = 0; i < years.length; ++i)
      result.years[xhr.info.termIndex].push(years[i].textContent);
    ++termsCount;
    if (termsCount == terms.length)
      callback(result);
  }
}


function scrapeGrades(prevResult, callback) {
  var baseLink = 'http://my.fci.cu.edu.eg/content.php?pg=studgroup_term';
  var terms = [baseLink + '1.php', baseLink + '2.php', baseLink + '3_m.php'];
  for (var i = 0; i < terms.length; ++i)
    for (var j = 0; j < prevResult.years[i].length; ++j)
      requestRunner.addRequestToQueue({
        'fn': 'POST',
        'url': terms[i],
        'handler': handler,
        'infoForHandler': {'termIndex': i, 'year': prevResult.years[i][j],
                           'user': prevResult.user},
        'paramObject': {'prev_years': prevResult.years[i][j]}
      });
  var doneCnt = [0, 0, 0];
  var errorHappened = false;
  var result = {'err': [], 'gradeTables': {}};
  function handler(xhr) {
    if (errorHappened)
      return;
    if (xhr.readyState != 4)
      return;
    var doc = handlerBase(xhr);
    if (doc === true) {
      result.err.push(Error("Couldn't find "));
      errorHappened = true;
      callback(result);
      return;
    }
    if (typeof result.gradeTables[xhr.info.year] === 'undefined')
      result.gradeTables[xhr.info.year] = [];
    result.gradeTables[xhr.info.year][xhr.info.termIndex] =
      doc.getElementsByClassName("FormTable")[0];
    ++doneCnt[xhr.info.termIndex];
    var allDone = true;
    for (var i = 0; i < terms.length; ++i)
      if (doneCnt[i] !== prevResult.years[i].length)
        allDone = false;
    if (allDone)
      callback(result);
  }
}
