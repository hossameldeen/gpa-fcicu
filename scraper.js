function Scraper() {
  var phases = [logout, login, getYears, scrapeGrades, logout];
  var phaseRunner = null;
  var user, pass, callback, callbackWhenPreviousStopped;
  // NOTE: If I'm working, then you start me twice very fast such that I
  // haven't already called the first callback, what'll happen is that I'll
  // call the last `callback..`  only.
  this.start = function(userParam, passParam, callbackParam,
                        callbackWhenPreviousStoppedParam, callOldCallback) {
    user = userParam; pass = passParam; callback = callbackParam;
    callbackWhenPreviousStopped = callbackWhenPreviousStoppedParam;
    if (phaseRunner !== null)
      phaseRunner.stopEarly(startActual, callOldCallback);
      // it's also okay to call if had already finished successfully
    else
      startActual();
  }
  function startActual() {
    callbackWhenPreviousStopped();
    phaseRunner = new PhaseRunner(phases,
                                  {'err': [], 'user': user, 'pass': pass},
                                  callback);
  }
}
