function fail(e) {
  console.log(e)
}

function toggleReadingMode(tab) {
  // The tabs api default to current tab if id is not provided
  var tabid = tab ? tab.id : null

  // Guarantee order of script loading
  browser.tabs.executeScript(tabid, { file: "/libs/Readability.js" })
  browser.tabs.executeScript(tabid, { file: "/scripts/content.js" })
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