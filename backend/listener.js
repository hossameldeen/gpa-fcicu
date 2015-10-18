chrome.runtime.onMessage.addListener(function(msg, sender, sr) {
  if (msg.dest !== 'backend')
    return;
  if (msg.what === 'GPA') {
    scraper.start
      ( msg.params[0]
      , msg.params[1]
      , function(result) {
          var GPA;
          if (result.err.length > 0) {
            GPA =
              "<span>Failed! Contact hossameldeenfci@gmail.com</span><br/>"
            + "<span>For the extension dev: check the console.</span><br/>";
            console.log(result);
          }
          else
            GPA = "<span>GPA = " + calculateGPAFromResult(result) + "!</span>";
          chrome.runtime.sendMessage({
            'src': 'backend',
            'dest': 'frontend',
            'state': 'GPAGotten',
            'GPA': GPA
          });
        }
      , function() {
          chrome.runtime.sendMessage({
            'src': 'backend',
            'dest': 'frontend',
            'state': 'scrapingStarted'
          });
        }
    );
  }
});
