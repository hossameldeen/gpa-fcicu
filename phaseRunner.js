function PhaseRunner(phasesParam, someInputParam, callbackParam) {
  if ((this instanceof PhaseRunner) === false)
    return new PhaseRunner(phasesParam, someInputParam, callbackParam);
  var that = this,
      phases = phasesParam, someInput = someInputParam,
        callback = callbackParam,
      lastResult = {'err':[]}, curInd = -1,
      stopCallback = null;
  callNext(someInput);

  this.stopEarly = function(stopCallbackParam) {
    stopCallback = stopCallbackParam;
    if (curInd === -1) {
      stopCallback();
      stopCallback = null;
    }
    // else wait for next callNext to call stopCallback
  }
  function finish() {
    var tempCurInd = curInd;
    curInd = -1;
    if (tempCurInd !== -1)
      callback(lastResult);
    if (stopCallback !== null) {
      var tempStopCallback = stopCallback;
      stopCallback = null;
      tempStopCallback();
    }
  }
  function callNext(result) {
    lastResult = result;
    if (lastResult.err.length > 0 || stopCallback !== null) {
      if (stopCallback !== null)
        lastResult.err.push('Stopped early!');
      finish();
      return;
    }
    ++curInd;
    if (curInd === phases.length) {
      finish();
      return;
    }
    phases[curInd](lastResult, callNext);
  }
}
