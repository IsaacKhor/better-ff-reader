function toggleReadingMode(tab) {
  // The tabs api default to current tab if id is not provided
  var tabid = tab ? tab.id : null;
  browser.tabs.executeScript(tabid, {
    allFrames: false,
    file: "/libs/Readability.js",
    runAt: "document_idle"
  });
  browser.tabs.executeScript(tabid, {
    allFrames: false,
    file: "/scripts/content.js",
    runAt: "document_idle"
  });
  console.log("hello i am pressed thingy yay!");
}

function processCommand(cmd) {
  if (cmd == "toggle-reader-mode") {
    toggleReadingMode()
  }
}

browser.commands.onCommand.addListener(processCommand)
browser.pageAction.onClicked.addListener(toggleReadingMode)
browser.browserAction.onClicked.addListener(toggleReadingMode)