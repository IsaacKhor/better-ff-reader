function toggleReadingMode(tab) {
  // The tabs api default to current tab if id is not provided
  var tabid = tab ? tab.id : null

  // Guarantee order of script loading
  var readabilityPr = browser.tabs.executeScript(tabid, { file: "/libs/Readability.js" })
  readabilityPr.then(
    function() {
      browser.tabs.executeScript(tabid, { file: "/scripts/content.js" })
    },
    function() {
      console.log("Readability failed to load")
    })
  console.log("Toggle reading mode")
}

function processCommand(cmd) {
  if (cmd == "toggle-reader-mode") {
    toggleReadingMode()
  }
}

browser.commands.onCommand.addListener(processCommand)
browser.pageAction.onClicked.addListener(toggleReadingMode)
browser.browserAction.onClicked.addListener(toggleReadingMode)