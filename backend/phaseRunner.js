function PhaseRunner(phasesParam, someInputParam, callbackParam) {
  var that = this,
      phases = phasesParam, someInput = someInputParam,
        callback = callbackParam,
      lastResult = {'err':[]}, curInd = -1,
      receivedStopSignal = false;
  callNext(someInput);

  // Overrides the old callback
  this.stopEarly = function(newCallback) {
    receivedStopSignal = true;
    callback = newCallback;
    if (curInd === -1)
      callback(lastResult);
    lastResult.err.push(Error('Stopped early!'));
    // else wait for next callNext to call stopCallback
  }
  function finish() {
    curInd = -1;
    callback(lastResult);
  }
  function callNext(result) {
    if (receivedStopSignal) {
      finish();
      return;
    }
    lastResult = result;
    if (lastResult.err.length > 0) {
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
