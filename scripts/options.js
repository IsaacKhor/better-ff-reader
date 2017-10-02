function save() {
  browser.storage.sync.set({
    enableRegexes: listEditor.getValue().split('\n'),
    stylesheet: stylesheetEditor.getValue()
  })
}

(function() {
  var stylesheetEditor = CodeMirror.fromTextArea(
    document.getElementById("edit-stylesheet"),
    { lineNumbers: true })

  var listEditor = CodeMirror.fromTextArea(
    document.getElementById("edit-autolist"),
    { lineNumbers: true })

  document.getElementById("btn-save").addEventlistener('click', save())
})()