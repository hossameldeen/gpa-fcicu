function PhaseRunner(phasesParam, someInputParam, callbackParam) {
  if ((this instanceof PhaseRunner) === false)
    return new PhaseRunner(phasesParam, someInputParam, callbackParam);
  this.start() = function() {
    if (curInd === -1)
      throw Error('PhaseRunner already started. Either create a new one or '
                + 'stop this one first.');
    callNext(someInput);
  }
  this.stopEarly() = function() {
    lastResult.err.push(Error('Stopped early!'));
    finish();
  }
  var that = this,
      phases = phasesParam, someInput = someInputParam,
        callBack = callbackParam,
      lastResult = {'err':[]}, curInd = -1;
  function finish() {
    var tempLastResult = lastResult;
    lastResult = {'err':[]};
    curInd = -1;
    callback(tempLastResult);
  }
  function callNext(result) {
    lastResult = result;
    if (lastResult.err > 0) {
      that.stopEarly();
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
