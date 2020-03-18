// We're using a global variable to store the number of occurrences
var FL_SearchResultCount = 0;

// .. and the occurences themselves
var FL_ResultElements = Array();
var FL_CurrentElementIndex = 0

function FL_scrollToElementIndex(index){
    if (FL_ResultElements[index] != null) {
        FL_scrollTo(FL_ResultElements[index])
    }
}

function FL_clickOnCurrentElement(){
    print("clicking on " + FL_CurrentElementIndex)
    FL_explode(FL_currentElement())
    FL_currentElement().click()
}

function FL_currentElement(){
    return FL_ResultElements[FL_CurrentElementIndex]
}

function FL_scrollToPreviousResult(){
    if(FL_ResultElements[FL_CurrentElementIndex - 1] != null) {
        FL_CurrentElementIndex--
        FL_scrollToElementIndex(FL_CurrentElementIndex)
    } else {
        FL_CurrentElementIndex = FL_ResultElements.length
        FL_scrollToElementIndex(FL_CurrentElementIndex)
    }
}

function FL_scrollToNextResult(){
    if(FL_ResultElements[FL_CurrentElementIndex + 1] != null) {
        FL_CurrentElementIndex++
        FL_scrollToElementIndex(FL_CurrentElementIndex)
    } else {
        FL_CurrentElementIndex = 0
        FL_scrollToElementIndex(FL_CurrentElementIndex)
    }
}

function FL_scrollTo(elem){
    elem.scrollIntoView(false)
    
    // reset all
    FL_ResultElements.forEach(function(el){
                                el.classList.remove('FL_currentInlineHighlight')
                              })
    
    // highlight current
//    elem.style.backgroundColor = "orange";
    elem.classList.add("FL_currentInlineHighlight")
    FL_grow(elem)
}


function isHidden(el) {
//    var style = window.getComputedStyle(el);
    return (el.offsetParent === null)
}


// helper function, recursively searches in elements and their child nodes
function FL_HighlightAllOccurencesOfStringForElement(element,keyword) {
  if (element) {
      if (element.nodeType == 1) {} // image node
      
    if (element.nodeType == 3) {        // Text node
      while (true) {
        var value = element.nodeValue;  // Search for keyword in text node
        var idx = value.toLowerCase().indexOf(keyword);

        if (idx < 0) break;             // text not found, abort
          
        console.log(element.offsetParent)
//        if (element.offsetParent == null) { break }

        var span = document.createElement("span");
        FL_ResultElements.unshift(span)
//          FL_ResultElements.push(span)
          
        var text = document.createTextNode(value.substr(idx,keyword.length));
        span.appendChild(text);
          span.classList.add("FL_inactiveHighlight")
//        span.setAttribute("class","FL_inactiveHighlight");
//        span.style.backgroundColor = "yellow";
//        span.style.color = "black";
        text = document.createTextNode(value.substr(idx+keyword.length));
        element.deleteData(idx, value.length - idx);
        var next = element.nextSibling;
        element.parentNode.insertBefore(span, next);
        element.parentNode.insertBefore(text, next);
        element = text;
        FL_SearchResultCount++;	// update the counter

      }
    } else if (element.nodeType == 1) { // Element node
      if (element.style.display != "none" && element.nodeName.toLowerCase() != 'select') {
        for (var i=element.childNodes.length-1; i>=0; i--) {
          FL_HighlightAllOccurencesOfStringForElement(element.childNodes[i],keyword);
        }
      }
    }
  }
}

// the main entry point to start the search
function FL_HighlightAllOccurencesOfString(keyword) {
  FL_RemoveAllHighlights();
  FL_HighlightAllOccurencesOfStringForElement(document.body, keyword.toLowerCase());
}

// helper function, recursively removes the highlights in elements and their childs
function FL_RemoveAllHighlightsForElement(element) {
  if (element) {
    if (element.nodeType == 1) {
      if (element.classList.contains("FL_inactiveHighlight"))  {
        var text = element.removeChild(element.firstChild);
        element.parentNode.insertBefore(text,element);
        element.parentNode.removeChild(element);
        return true;
      } else {
        var normalize = false;
        for (var i=element.childNodes.length-1; i>=0; i--) {
          if (FL_RemoveAllHighlightsForElement(element.childNodes[i])) {
            normalize = true;
          }
        }
        if (normalize) {
          element.normalize();
        }
      }
    }
  }
  return false;
}

// the main entry point to remove the highlights
function FL_RemoveAllHighlights() {
  FL_SearchResultCount = 0;
  FL_RemoveAllHighlightsForElement(document.body);
    
    // empty the results array
    FL_ResultElements = Array()
    FL_CurrentElementIndex = 0
}

/// animations


function FL_offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}



function FL_animateHighlight(el, classToAdd){
    var elCopy = el.cloneNode(true)
//    elCopy.style = window.getComputedStyle(el)

    elCopy.classList.remove(classToAdd)
    elCopy.classList.add(classToAdd)
    
    // 2 is the padding
    elCopy.style.top = (FL_offset(el).top - 2) + "px"
    elCopy.style.left = FL_offset(el).left + "px"
    
    document.body.appendChild(elCopy)

    elCopy.addEventListener("webkitAnimationEnd", function(){
                          console.log("removed again, elCopy is " + elCopy)
                          console.log(elCopy)
                          elCopy.remove()
                          });
}

function FL_explode(el){
    console.log("exploding " + el)
    FL_animateHighlight(el, 'FL_explode')
}

function FL_grow(el){
    console.log("growing " + el)
//    FL_animateHighlight(el, 'FL_currentHighligt')
}
//
//// debug, take the first whatever
//let el = document.querySelector('.highlight')
