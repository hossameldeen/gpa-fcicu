/*
So, request final structure:
{'fn':String either 'GET' or 'POST', 'url':String, 'handler':Function(xhr),
 'infoForHandler':Object}
And if it's 'POST', there's one more param which is 'paramObject'Oobject
*/
function RequestRunnerSingleton(delayParam) {
  if ((this instanceof RequestRunnerSingleton) === false)
    throw Error("Use the created instace `rr`. Yes, it's not so clean");
  var that = this,
      delay = delayParam,
      requestQ = [],
      interval = null;
  this.changeDelay = function(delayParam) {
    delay = delayParam;
    clearInterval(interval);
    interval = setInterval(applyRequest, delay);
  }
  this.emptyQueue = function() {
    requestQ = [];  // next time interval is called, it's cleared and stopped.
  }
  this.addRequestToQueue = function(request) {
    requestQ.push(request);
    if (interval === null)
      interval = setInterval(applyRequest, delay);
  }
  function applyRequest() {
    if (requestQ.length == 0) {
      that.emptyQueue();
      clearInterval(interval);  // Reminder: No race conditions because of JS
                                // concurrency model (Event Loop).
      interval = null;
      return;
    }
    var req = requestQ[0];
    requestQ.shift();
    if (req.fn === 'GET')
      sendGET(req.url, req.handler, req.infoForHandler);
    else if (req.fn === 'POST')
      sendPOST(req.url, req.paramObject, req.handler, req.infoForHandler);
    else
      throw Error('requestQ[0].fn is neither GET nor POST.<br/>'
                + 'requestQ[0].fn = ' + req.fn);
  }
}

var requestRunner = new RequestRunnerSingleton(1000);
