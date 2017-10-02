(function() {
  var stylesheetEditor = CodeMirror.fromTextArea(
    document.getElementById("edit-stylesheet"),
    { lineNumbers: true })

  var listEditor = CodeMirror.fromTextArea(
    document.getElementById("edit-autolist"),
    { lineNumbers: true })

  browser.storage.sync.get().then(function(o) {
    console.log("Pref values: ", o)
    stylesheetEditor.setValue(o.stylesheet)
    listEditor.setValue(o.enableRegexes.join('\n'))
  })

  document.getElementById("btn-save").addEventListener('click', function(e) {
    browser.storage.sync.set({
      enableRegexes: listEditor.getValue().split('\n'),
      stylesheet: stylesheetEditor.getValue()
    })
  })

  document.getElementById("btn-reset").addEventListener('click', function(e) {
    stylesheetEditor.setValue("")
    listEditor.setValue("")
  })
})()