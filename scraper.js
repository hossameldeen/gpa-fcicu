// Also, a singleton!
function ScraperSingleton() {
  if ((this instanceof ScraperSingleton) === false)
    throw Error("Use the created instace `scraper`. Yes, it's not so "
                     + "clean");
  var phases = [logout, login, getYears, scrapeGrades, logout];
  var phaseRunner = null;
  var user, pass, callback, callbackAfterLastStopped = null;
  this.start = function(userParam, passParam, callbackParam,
                        callbackAfterLastStoppedParam/*optional*/) {
    user = userParam; pass = passParam; callback = callbackParam;
    callbackAfterLastStopped = callbackAfterLastStoppedParam;
    if (phaseRunner !== null)
      phaseRunner.stopEarly(startActual);
      // it's also okay to call if had already finished successfully
    else
      startActual(null);
  }
  function startActual(result) {
    if (!(typeof callbackAfterLastStopped === 'undefined' ||
          callbackAfterLastStopped === null))
      callbackAfterLastStopped();
    // If interested, first print the result for debugging purposes.
    phaseRunner = new PhaseRunner(phases,
                                  {'err': [], 'user': user, 'pass': pass},
                                  callback);
    callbackAfterLastStopped = undefined;
  }
}

var scraper = new ScraperSingleton();
