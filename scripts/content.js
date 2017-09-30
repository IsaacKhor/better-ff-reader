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
  document.documentElement.classList.remove("no-scroll")
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
    container.appendChild(createMetaHeader(document.title))
    container.appendChild(createContentContainer(parsed.content))

    document.addEventListener('keyup', keyUpHandler)
    ifb.appendChild(container)

    // Make links target the whole page, not just the iframe
    Array.prototype.forEach.call(ifd.links, function(e,i) {
      e.setAttribute("target", "_top")
    })

    iframe.focus()
  })

  if(!document.querySelector(".page-css"))
    addStylesheet("/css/page.css", document, "page-css")

  // Prevent the original document from scrolling
  document.documentElement.classList.add("no-scroll")
  iframe.focus()

  function createContainer() {
    var container = document.createElement("div")
    container.id = "container"
    return container
  }

  function createContentContainer(content) {
    var contentContainer = document.createElement("div")
    contentContainer.id = "reader-mode"
    contentContainer.innerHTML = content
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
    var readability = new Readability(uri, document.cloneNode(true))
    var parsed = null
    try { parsed = readability.parse() }
    catch(e) {
      console.log("Error parsing the page")
      return {
        title: "",
        content: "<p>An error occured while parsing the page; please report the bug <a href=\"https://github.com/mozilla/readability/issues\">here</a>.</p><p>Error: <br/><pre>" + e.toString() + "</pre></p>"
      }
    }
    if (!parsed) {
      parsed = {
        title: "",
        content: "Sorry, but the page could not be parsed. If you feel like this page should have been parsed correctly, please report it <a href=\"https://github.com/mozilla/readability/issues\">here</a> (this extension uses the same parsing engine as Firefox's builtin reading mode, so bugs should be reported there)."
      }
    }
    return parsed
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

  function keyUpHandler(e) {
    if (e.keyCode == 27) closeOverlay()
  }
}

function main() {
  if (document.getElementById("reader-mode") == null) {
    enableOverlay()
  } else {
    closeOverlay()
  }
}

(function preMain() {
  var initCheck = setInterval(checkInit, 100)

  function checkInit() {
    if(Readability) {
      clearInterval(initCheck)
      main()
    }
  }
})()