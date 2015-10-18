function calculateGPA() {
  document.getElementById('GPA').innerHTML = "";
  // Yes, it's NOT generic yet!
  chrome.runtime.sendMessage({
    'src': 'frontend',
    'dest': 'backend',
    'what': 'GPA',
    'params': [
      document.getElementById('user').value,
      document.getElementById('pass').value
    ]
  });
}
chrome.runtime.onMessage.addListener(function(msg, sender, sr) {
  if (msg.dest !== 'frontend')
    return;
  if (msg.state === 'scrapingStarted') {
      document.getElementById('GPA').innerHTML = "Loading...";
  }
  else if (msg.state === 'GPAGotten') {
    document.getElementById('GPA').innerHTML = msg.GPA;
  }
});
  /*scraper.start
    ( document.getElementById('user').value
    , document.getElementById('pass').value
    , function(result) {
        document.getElementById('GPA').innerHTML = "";
        if (result.err.length > 0) {
          document.getElementById('GPA').innerHTML
            = "<span>Failed! Contact hossameldeenfci@gmail.com</span><br/>"
            + "<span>For the extension dev: check the console.</span><br/>";
          console.log(result);
        }
        else
          document.getElementById('GPA').innerHTML
            = "<span>GPA = " + calculateGPAFromResult(result) + "!</span>";
      }
    , function() {
      }
    );
}*/

window.onload = function() {
  document.getElementById('calculateGPA').addEventListener("click",
                                                           calculateGPA);
}
