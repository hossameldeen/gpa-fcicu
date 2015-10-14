function Scraper() {
  var phases = [logout, login, getYears, scrapeGrades, logout];
  var phaseRunner = null;
  var user, pass, callback, callbackWhenPreviousStopped;
  this.start = function(userParam, passParam, callbackParam,
                        callbackWhenPreviousStoppedParam) {
    user = userParam; pass = passParam; callback = callbackParam;
    callbackWhenPreviousStopped = callbackWhenPreviousStoppedParam;
    if (phaseRunner !== null)
      phaseRunner.stopEarly(startActual);  // it's also okay to call if had
                                           // already finished successfully
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
