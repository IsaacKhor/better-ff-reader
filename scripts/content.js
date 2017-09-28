function enableOverlay() {
  var loc = document.location;
  var uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  };
  var article = new Readability(uri, document.cloneNode(true)).parse();

  var contentContainer = document.createElement("div");
  contentContainer.id = "test";
  contentContainer.innerHTML = article.content
  document.body.appendChild(contentContainer);
}

function closeOverlay() {
  var elem = document.querySelector("#reader-mode")
  elem.parentNode.removeChild(elem)
}

if (document.getElementById("reader-mode") == null) {
  enableOverlay()
} else {
  closeOverlay()
}