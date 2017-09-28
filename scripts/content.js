function addStylesheet(css, doc) {
  var absPath = browser.extension.getURL(css)
  var link = doc.createElement("link")
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", absPath);
  doc.head.appendChild(link)
}

function getParsedArticle() {
  var loc = document.location
  var uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  }
  return new Readability(uri, document.cloneNode(true)).parse()
}

function createContentContainer(article) {
  var contentContainer = document.createElement("div")
  contentContainer.id = "reader-mode"
  contentContainer.innerHTML = article.content
  return contentContainer
}

function createCloseButton() {
  var closeButton = document.createElement("button")
  closeButton.className = "btn-close"
  closeButton.textContent = "X"
  closeButton.addEventListener('click', closeOverlay)
  return closeButton
}

function closeOverlay() {
  var elem = document.querySelector("#reader-mode")
  elem.parentNode.removeChild(elem)
}

function enableOverlay() {
  var iframe = document.createElement("iframe")
  iframe.id = "reader-mode"

  // Append to DOM now so that contentWindow is generated
  document.body.appendChild(iframe)
  addStylesheet("/css/page.css", document)

  var parsed = getParsedArticle()
  var ifb = iframe.contentWindow.document.body
  ifb.appendChild(createCloseButton())
  ifb.appendChild(createContentContainer(parsed))

  iframe.focus()
}

if (document.getElementById("reader-mode") == null) {
  enableOverlay()
} else {
  closeOverlay()
}