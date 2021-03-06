// ============================================================================
// XHR-related ================================================================

function sendGET(url, handler, infoForHandler) {
  var xhr = initReq(url, handler, infoForHandler);
  xhr.open("GET", url, true);
  xhr.send();
}

function sendPOST(url, paramObject, handler, infoForHandler) {
  var xhr = initReq(url, handler, infoForHandler);
  var paramString = '';
  var addAnd = false;
  for (var key in paramObject) {
    if (addAnd) paramString += '&';
    addAnd = true;
    paramString += key + '=' + paramObject[key];
  }
  xhr['paramObject'] = paramObject;
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(paramString);
}

function initReq(url, handler, infoForHandler) {
  var xhr = new XMLHttpRequest();
  if (typeof handler != 'undefined')
    xhr.onreadystatechange = curryXHR(handler, xhr);
  xhr.info = infoForHandler;  // Even if undefined, will work
                                        // correctly, according to my tests.
  return xhr;
}

// Not a generic curry!
function curryXHR(fn, param) {
  return function() {fn(param)};
}

// Remember to turn this into a safe parsing!
function parseHTML(anHTMLString){
  if (typeof anHTMLString !== 'undefined' && anHTMLString !== null)
    return (new DOMParser()).parseFromString(anHTMLString, "text/html");
  return (new DOMParser()).parseFromString('', "text/html");
}

function handlerBase(xhr) {
  if (xhr.readyState != 4)
    return true;
  var doc = parseHTML(xhr.responseText);
  var state = checkUser(xhr.info.user, doc);
  if (state !== true)
    return true;
  return doc;
}

function checkUser(user, doc) {
  var foundUser;
  try {
    foundUser = doc.body.getElementsByClassName("tabledata")[0].children[0].
                children[1].children[1].childNodes[1].textContent;
  }
  catch(err) {
    return "Couldn't find the HTML Element that has the student ID. Probably, "
    + "either the page didn't load correctly (because of, for example, the sit"
    + "e is down), or the ecom changed its page structure.";
  }
  if (' ' + user !== foundUser)
    return "During scraping, the student ID on one of the pages didn't match "
    + "the ID we're calculating the GPA for. You may have logged into another "
    + "account during scraping. Another possibility is that scraping took long"
    + " enough for the ecom to logout us.";
  return true;
}
