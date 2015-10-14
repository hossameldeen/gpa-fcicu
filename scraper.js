function scrape(user, pass, callback) {
  var phases = [logout, login, getYears, scrapeGrades];
  var phaseRunner = new PhaseRunner(phases, {'user': user, 'pass': pass},
                                    callback);
  phaseRunner.start();
}
