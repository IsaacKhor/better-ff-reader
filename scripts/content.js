function addStylesheet(css, doc, classN) {
  var absPath = browser.extension.getURL(css)
  var link = doc.createElement("link")
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", absPath);
  if(classN) link.className = classN
  doc.head.appendChild(link)
}

function closeOverlay() {
  var elem = document.querySelector("#reader-mode")
  elem.parentNode.removeChild(elem)
  document.body.classList.remove("no-scroll")
}

function enableOverlay() {
  var parsed = getParsedArticle()
  var iframe = document.createElement("iframe")
  iframe.id = "reader-mode"
  // Append to DOM now so that contentWindow is generated
  document.body.appendChild(iframe)

  iframe.addEventListener("load", function() {
    var ifd = iframe.contentWindow.document
    var ifb = ifd.body

    addStylesheet("/css/reader.css", ifd)

    var container = createContainer()
    container.appendChild(createCloseButton())
    container.appendChild(createMetaHeader(parsed.title))
    container.appendChild(createContentContainer(parsed))

    ifb.appendChild(container)
    iframe.focus()
  })

  if(!document.querySelector(".page-css"))
    addStylesheet("/css/page.css", document, "page-css")

  // Prevent the original document from scrolling
  document.body.classList.add("no-scroll")

  function createContainer() {
    var container = document.createElement("div")
    container.id = "container"
    return container
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

  function getParsedArticle() {
    var loc = document.location
    var uri = {
      spec: loc.href,
      host: loc.host,
      prePath: loc.protocol + "//" + loc.host,
      scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
      pathBase: loc.protocol + "//" + loc.host +
        loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    }
    return new Readability(uri, document.cloneNode(true)).parse()
  }

  function createMetaHeader(title) {
    var mdiv = document.createElement("div")
    mdiv.id = "metadata"

    var titleH = document.createElement("h1")
    titleH.id = "title"
    titleH.textContent = title

    mdiv.appendChild(titleH)
    return mdiv
  }
}

function main() {
  if (document.getElementById("reader-mode") == null) {
    enableOverlay()
  } else {
    closeOverlay()
  }
}

function preMain() {
  var initCheck = setInterval(checkInit, 200)

  function checkInit() {
    if(Readability) {
      clearInterval(initCheck)
      main()
    }
  }
}

preMain()