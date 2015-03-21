/* global getEl, initGlobalMDFunctions, initMDSnackBar, initMDButton, initMDInputSubmit, initMDInput, initMDList, initMDIcon, initMDSidemenu, initMDIconButton, initMDGreylayer, initMDMenu, initMDTabBar, initMDToolBar, initMDSwitch, initMDFab, initMDPager */
/* exported transitionend, isMobile, executeFunctionByName */

/**
 * TODO: Documentation
 */
var Paperkit = function() {
  /* Current path */
  this.path = "";

  /* Init function */
  this.initFuncs = [];

  /* Elements */
  this.greylayer = null;

  /* Side menu */
  this.sidemenu = null;

  /* Main fab button */
  this.fab = null;

  /* Main content element */
  this.content = null;

  /* Paperkit observer */
  this.observer = null;

  /* TODO: Review ??? */
  this.tmpDiv = null;
};

/**
 * TODO: Documentation
 *
 * @param func
 */
Paperkit.prototype.initListener = function(func) {
  this.initFuncs.push(func);
};

/**
 * TODO: Documentation
 *
 * @param tag
 * @returns
 */
Paperkit.prototype.createElement = function(tag) {
  var element = document.createElement(tag);
  this.addMDMethods(element);
  return element;
};

/**
 * TODO: Documentation
 */
Paperkit.prototype.init = function() {
  // Init paperkit path
  var url = document.querySelector("link[href*='paperkit.css']").href;
  this.path = url ? url.substring(0, url.indexOf("paperkit.css")) : "";

  // Init elements
  if (!document.querySelector("md-greylayer")) {
    document.body.appendChild(document.createElement("md-greylayer"));
  }

  // Init paperkit objects
  var elements = document.getElementsByTagName("*");
  var length = elements.length;
  for (var i = 0; i < length; i++) {
    var el = elements[i];
    if (el.tagName.indexOf("MD") === 0) {
      this.addMDMethods(el);
    }
  }

  // Mutation observer initializing...
  this.observer = new MutationObserver(this.observeMDElements);
  var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  };
  this.observer.observe(document.body, config);

  this.initFuncs.forEach(function(initFunc) {
    initFunc();
  });
};

/**
 * TODO: Documentation
 * @param element
 */
Paperkit.prototype.addMDMethods = function(element) {
  var tag = element.tagName.toLowerCase();

  if (tag.indexOf("md-") >= 0) {
    if (element.alreadyInitialized) {
      return;
    }
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if (tag === "md-snackbar") {
      initMDSnackBar(element, this);
    } else if (tag === "md-button") {
      initMDButton(element, this);
    } else if (tag === "md-input-submit") {
      initMDInputSubmit(element, this);
    } else if (tag === "md-input") {
      initMDInput(element, this);
    } else if (tag === "md-list") {
      initMDList(element, this);
    } else if (tag === "md-icon" || tag === "md-avatar") {
      initMDIcon(element, this);
    } else if (tag === "md-sidemenu") {
      initMDSidemenu(element, this);
      this.sidemenu = element;
    } else if (tag === "md-icon-button") {
      initMDIconButton(element, this);
    } else if (tag === "md-greylayer") {
      initMDGreylayer(element, this);
      this.greylayer = element;
    } else if (tag === "md-menu") {
      initMDMenu(element, this);
    } else if (tag === "md-tabbar") {
      initMDTabBar(element, this);
    } else if (tag === "md-toolbar") {
      initMDToolBar(element, this);
      if (element.parentNode.tagName.toLowerCase() === "body") {
        this.toolbar = element;
      }
    } else if (tag === "md-switch") {
      initMDSwitch(element, this);
    } else if (tag === "md-fab") {
      initMDFab(element, this);
      this.fab = element;
    } else if (tag === "md-content") {
      this.content = element;
    } else if (tag === "md-pager") {
      initMDPager(element, this);
    }
  }
};

/**
 * TODO: Documentation
 * @param what
 * @param opt
 */
Paperkit.prototype.create = function(what, opt) {
  if (what === "snackbar") {
    var newSnackbar = document.createElement("md-snackbar");
    if (opt.text) {
      var text = document.createElement("md-text");
      text.contentText = opt.text;
      newSnackbar.appendChild(text);
    }
    if (opt.position) {
      newSnackbar.setAttribute("md-position", opt.position);
    } else {
      newSnackbar.setAttribute("md-position", "bottom right");
    }
    document.body.appendChild(newSnackbar);
    initMDSnackBar(newSnackbar);
  }
};

/**
 * TODO: Documentation
 * @param mutations
 */
Paperkit.prototype.observeMDElements = function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "childList") {
      [].forEach.call(mutation.addedNodes, function(node) {
        if (!node.tagName) {
          return;
        }
        if (node.tagName.indexOf("MD-") === 0) {
          Paperkit.prototype.addMDMethods(node);
        }
      });
    }
  });
};

/**
 * Calculates text width when it's rendered with the given style.
 * It has the cost of rendering and removing a hidden div element.
 *
 * @param {string}  string              The string to calculate width
 * @param {style}   CSSStyleDeclaration The style to apply to string
 * @return {object} Metrics object containing width and height properties.
 */
Paperkit.prototype.calcTextMetrics = function(string, style) {
  if (!this.tmpDiv) {
    this.tmpDiv = document.createElement("div");
    document.body.appendChild(this.tmpDiv);
  }

  this.tmpDiv.style.position = "absolute";
  this.tmpDiv.style.visibility = "hidden";
  this.tmpDiv.style.top = "0px";
  this.tmpDiv.style.left = "0px";
  this.tmpDiv.style.zIndex = "-1";
  this.tmpDiv.style.height = "auto";
  this.tmpDiv.style.width = "auto";
  this.tmpDiv.style.whiteSpace = "nowrap";
  this.tmpDiv.style.fontSize = style.fontSize;
  this.tmpDiv.textContent = string;

  var metricsWidth = this.tmpDiv.clientWidth;
  var metricsHeight = this.tmpDiv.clientHeight;
  // document.body.removeChild(tmpDiv);
  return {
    "width": metricsWidth,
    "height": metricsHeight
  };
};

/**
 * Initializes an element and all it's subelements by
 * applying material initialization to this element, and all it's
 * subelements.
 *
 * @param {object} element The element to initialize.
 */
Paperkit.prototype.initElement = function(element) {
  // first init this element
  this.addMDMethods(element);

  // then init child elements
  for (var i = 0; i < element.children.length; i++) {
    this.initElement(element.children[i]);
  }
};

/**
 * TODO: Documentation
 * @param dowhat
 */
Paperkit.prototype.justInCase = function(dowhat) {
  if (dowhat === "reload") {
    var elements = document.getElementsByTagName("*");
    var length = elements.length;
    for (var i = 0; i < length; i++) {
      var el = elements[i];
      if (el.tagName.indexOf("MD") === 0) {
        this.addMDMethods(el);
      }
    }
  }
};

/**
 * TODO: Documentation
 * @param what
 * @param where
 * @param onload
 * @param param
 */
Paperkit.prototype.ajaxInsert = function(what, where, onload) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", what);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.addEventListener("load", function() {
    getEl(where).innerHTML = xhr.responseText;
    onload(xhr.responseText, where);
  });
  xhr.send();
};

/**
 *
 */
Paperkit.prototype.consoleBanner = "M! ";

/**
 *
 */
function transitionEndEventName() {
  var i;
  var el = document.createElement("div");
  var transitions = {
    "transition": "transitionend",
    "OTransition": "otransitionend", // oTransitionEnd in very old Opera
    "MozTransition": "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  };

  for (i in transitions) {
    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
      return transitions[i];
    }
  }
}

/**
 *
 */
var transitionend = transitionEndEventName();

/**
 *
 */
function executeFunctionByName(functionName, context, args) {
  var namespaces = functionName.split(".");
  var func = namespaces.pop();

  if (!context && namespaces.length > 0) {
    context = eval(namespaces.shift());
  } else if (!context) {
    context = window;
  }

  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }

  if (args) {
    return context[func].apply(context, args);
  } else {
    return context[func].apply(context, ["false"]);
  }
}

/**
 *
 */
function getViewport() {
  var e = window;
  var a = "inner";
  if (!("innerWidth" in window)) {
    a = "client";
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + "Width"],
    height: e[a + "Height"]
  };
}

/**
 *
 */
function isMobile() {
  if (getViewport().width < 768) {
    return true;
  } else {
    return false;
  }
}

/**
 * Action initializer draft
 * @param  {element} el  Element being initialized
 * @param  {object} opt Options
 * @return {boolean}     True on success, false on error
 */
// Paperkit.prototype.init.action = function(el, opt) {

//   /**
//    * Action listener, has multiple predetermined actions and a custom one
//    * @param  {event} e Event fired that contains the element with md-action
//    */
//   el.actionListener = function(e) {
//     var el = e.currentTarget;
//     var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

//     switch(action) {
//       case 'submit': 
//         submitForm(el);
//         break;
//       case 'reset':
//         resetForm(el);
//         break;
//       case 'snackbar-dismiss':
//         snackbarDismiss(el);
//         break;
//       case 'morph':
//         transition.morph(el);
//         break;
//       case 'chrome-app-close':
//         chrome.app.window.current().close();
//         break;
//       default:
//         if(action.indexOf('custom:') != -1) {
//           var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
//           this.callFunction(f, el);
//         } else if (action = "chrome-app-close") {
//           chrome.app.window.current().close();
//         }
//         break;
//     }
//   };

//   var submitForm= function(target) {
//     console.log("submit from clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();
//     }    
//   }

//   var resetForm= function(target) {
//     console.log("reset form clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();  
//     }    
//   }

//   var snackbarDismiss= function(target) {
//     console.log("snackbar dismiss clicked!")
//   }

//   el.callFunction= function(f, target) {
//     console.log("calling function " + f);
//     executeFunctionByName(f, window, [ target ]);
//   }

//   var findParentForm= function(element) {
//     var el = element.parentNode;

//     do {
//       if(el.tagName=="FORM") {
//         return el;
//       } else if(el.tagName=="BODY") {
//         return null;
//       }
//     } while((el = el.parentNode) != null);
//     return null;
//   }

//   // Initialize listener and parent form keypress listener
//   el.addEventListener('click', el.clickListener);

//   // If not md-action then submit is the default, set form key listener
//   if(!el.getAttribute('md-action')) {
//       var parentForm = findParentForm(el);
//       if(parentForm) {
//         parentForm.addEventListener('keypress', el.enterKeyListener);
//       }    
//   }

//   // SET INITIAL PROPERTIES
//   if(el.getAttribute('md-action')) {
//     el.attributeChangedCallback('md-action', '', el.getAttribute('md-action'));
//   }

//   // INIT OBSERVER
//   var observer = new MutationObserver(function(mutations) { 
//       mutations.forEach(function(mutation) {
//         var element = mutation.target;
//         element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
//       });
//   });

//   var config = { attributes: true, childList: false, characterData: false };
//   observer.observe(el, config);

// }
var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === 'md-action' && newvalue === 'submit') {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if (attrname === 'md-action' && (oldvalue !== 'submit' || oldvalue === '')) {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
    }
  };

  MDButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if (e.keyCode === 13) {
      el.submit();
    }
  }

  MDButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch (action) {
      case 'submit':
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      case 'morph':
        transition.morph(el);
        break;
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callUserFunction(f, [el]);
        } else if (action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          window.open(f, '_self');
        } else if (action.indexOf('link-out:') != -1) {
          var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
          window.open(f);
        } else if (action = "chrome-app-close") {
          chrome.app.window.current().close();
        }
        break;
    }
  };

  var submitForm = function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var resetForm = function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var snackbarDismiss = function(target) {
    console.log("snackbar dismiss clicked!")
  }

  var findParentForm = function(element) {
    var el = element.parentNode;

    do {
      if (el.tagName == "FORM") {
        return el;
      } else if (el.tagName == "BODY") {
        return null;
      }
    } while ((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDButton.addEventListener('click', MDButton.clickListener);

  // If not md-action then submit is the default, set form key listener
  if (!MDButton.getAttribute('md-action')) {
    var parentForm = findParentForm(MDButton);
    if (parentForm) {
      parentForm.addEventListener('keypress', MDButton.enterKeyListener);
    }
  }

  // SET INITIAL PROPERTIES
  if (MDButton.getAttribute('md-action')) {
    MDButton.attributeChangedCallback('md-action', '', MDButton.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDButton, config);

}

var initMDFab = function(MDFab, paperkit) {
  MDFab.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === 'md-action' && newvalue === 'submit') {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if (attrname === 'md-action' && (oldvalue !== 'submit' || oldvalue === '')) {
      var parentForm = findParentForm(this);
      if (parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
    }
  };

  MDFab.updateIcon = function() {
    var image = this.getAttribute('md-image') ? this.getAttribute('md-image') : '';
    var type = this.getAttribute('md-type') ? this.getAttribute('md-type') : 'icon';

    var iconElement = this.querySelector('md-icon');
    if (!iconElement) {
      iconElement = document.createElement('md-icon');
      paperkit.initElement(iconElement);
      this.appendChild(iconElement);
    }

    iconElement.setAttribute('md-type', type);
    iconElement.setAttribute('md-image', image);
  }
  MDFab.updateIcon();

  MDFab.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if (e.keyCode === 13) {
      el.submit();
    }
  }

  MDFab.set = function(key, value) {
    if (key == 'image' || key == 'md-image') {
      MDFab.querySelector('md-icon').setAttribute('md-image', 'icon:' + value);
    } else if (key.indexOf('md-') === -1) {
      MDFab.setAttribute('md-' + key, value);
    }
  }

  MDFab.hide = function() {
    MDFab.style.bottom = "-56px";
  }

  MDFab.show = function() {
    MDFab.style.bottom = "";
  }

  MDFab.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch (action) {
      case 'submit':
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      case 'morph':
        transition.morph(el);
        break;
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callFunction(f, el);
        } else if (action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          window.open(f, '_self');
        } else if (action.indexOf('link-out:') != -1) {
          var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
          window.open(f);
        } else if (action = "chrome-app-close") {
          chrome.app.window.current().close();
        }
        break;
    }
  };

  MDFab.onClick = function(action) {
    if (action) {
      MDFab.setAttribute('md-action', action);
      console.log(MDFab.paperkit.consoleBanner + "md-fab has a new action: " + action);
    } else {
      MDFab.removeAttribute('md-action');
      console.log(MDFab.paperkit.consoleBanner + "md-fab has no action");
    }
  }

  var submitForm = function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var resetForm = function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if (form) {
      form.submit();
    }
  }

  var snackbarDismiss = function(target) {
    console.log("snackbar dismiss clicked!")
  }

  MDFab.callFunction = function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [target]);
  }

  var findParentForm = function(element) {
    var el = element.parentNode;

    do {
      if (el.tagName == "FORM") {
        return el;
      } else if (el.tagName == "BODY") {
        return null;
      }
    } while ((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDFab.addEventListener('click', MDFab.clickListener);

  // If not md-action then submit is the default, set form key listener
  if (!MDFab.getAttribute('md-action')) {
    var parentForm = findParentForm(MDFab);
    if (parentForm) {
      parentForm.addEventListener('keypress', MDFab.enterKeyListener);
    }
  }

  // SET INITIAL PROPERTIES
  if (MDFab.getAttribute('md-action')) {
    MDFab.attributeChangedCallback('md-action', '', MDFab.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDFab, config);

}

var initGlobalMDFunctions = function(MDElement, paperkit) {
  /* Paperkit object */
  MDElement.paperkit = paperkit;
  /* True if element is already initialized */
  MDElement.alreadyInitialized = true;

  /**
   * Changes  a value of a property, supporting multiple value properties;
   * If oldvalue is null, it adds the new value. If oldvalue is set, then
   * it's replaced by new value.
   *
   * @param  {string} property Property name.
   * @param  {string} oldvalue Old value to replace.
   * @param  {string} newvalue New value to set.
   */
  MDElement.changeProperty = function(property, oldvalue, newvalue) {
    var attribute = this.getAttribute(property);

    if (attribute) {
      var values = attribute.split(' ');
      var oldvalueIndex = values.indexOf(oldvalue);

      if (oldvalueIndex >= 0) {
        values.splice(oldvalueIndex, 1, newvalue);
      }

      if (newvalue) {
        values.push(newvalue);
      }

      this.setAttribute(property, values.join(' '));
    }
  }

  /**
   * Generates aleatory unique id
   * @return {string} Aleatory unique id
   */
  MDElement.makeId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  /**
   * Calls a user function, setting window as context.
   *
   * @param  {string} f      function name
   * @param  {array}  target parameters pased to function. in this case the target of the event.
   */
  MDElement.callUserFunction = function(functionName, params) {
    console.log("Calling user function " + functionName);
    executeFunctionByName(functionName, window, params);
  }
}

var initMDGreylayer = function(MDGreylayer) {
  /**
   * Shows the grey layer.
   */
  MDGreylayer.show = function() {
    MDGreylayer.removeEventListener(transitionend, MDGreylayer.noZIndex);
    MDGreylayer.style.zIndex = "400";
    MDGreylayer.setAttribute("md-state", "on");
  }

  /**
   * Hides the grey layer.
   */
  MDGreylayer.hide = function() {
    MDGreylayer.setAttribute("md-state", "off");
    MDGreylayer.addEventListener(transitionend, MDGreylayer.noZIndex);
  }

  /**
   * Toggles grey layer state, showing or hiding it.
   */
  MDGreylayer.toggle = function() {
    if (MDGreylayer.getAttribute('md-state') !== "on") {
      MDGreylayer.show();
    } else {
      MDGreylayer.hide();
    }
  }

  /** 
   * Removes z-index from grey layer.
   * TODO: REVIEW
   */
  MDGreylayer.noZIndex = function() {
    MDGreylayer.style.zIndex = "";
  }

  /**
   * Callback function, called when an attribute changes.
   * @param {string} attrname Changed attribute name
   * @param {string} oldvalue Old value for attribute or null if previous value does not exist.
   * @param {string} newvalue New value for attribute or null if value removed.
   */
  MDGreylayer.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDGreylayer, config);
}

// TODO: Review, it doesn't work with new menu...
var initMDIconButton = function(MDIconButton, paperkit) {
  //  Herencia no funciona como planeado...
  //  TODO: Buscar otra forma de hacerlo, esto da muchos problemas de reescritura de objetos y funciones
  //  initMDButton(MDIconButton);
  //  MDIconButton.removeEventListener('click', MDIconButton.clickListener);
  //  this.observer.disconnect();

  MDIconButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE IN MD-ICON-BUTTON " + attrname + " VALUE " + newvalue);
    if (this.tagName === 'MD-ICON-BUTTON') { // Sanity Check
      if (attrname === 'md-image' || attrname === 'md-type' || attrname === 'md-size' || attrname === 'md-transition') {
        this.updateIcon();
      }
    }
  };

  MDIconButton.updateIcon = function() {
    var image = this.getAttribute('md-image') ? this.getAttribute('md-image') : '';
    var type = this.getAttribute('md-type') ? this.getAttribute('md-type') : 'icon';
    var size = this.getAttribute('md-size') ? this.getAttribute('md-size') : '';
    var transition = this.getAttribute('md-transition') ? this.getAttribute('md-transition') : '';

    var iconElement = this.querySelector('md-icon');
    if (!iconElement) {
      iconElement = document.createElement('md-icon');
      paperkit.initElement(iconElement);
      this.appendChild(iconElement);
    }

    iconElement.setAttribute('md-type', type);
    iconElement.setAttribute('md-image', image);
    iconElement.setAttribute('md-size', size);
    iconElement.setAttribute('md-transition', transition);
  }


  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch (action) {
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          el.callUserFunction(f, [el, e]);
        } else if (action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          window.open(f, '_self');
        } else if (action.indexOf('link-out:') != -1) {
          var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
          window.open(f);
        } else if (action.indexOf('menu:') != -1) {
          var f = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
          el.openMenu(f);
        }
        break;
    }
  };

  MDIconButton.openMenu = function(menuName, el) {
    var menu = document.getElementById(menuName);

    if (menu) {
      if (menu.status == "closed") {
        menu.setAttribute("md-position", "parentIcon");
        menu.setCallback(this.menuListener);
        menu.open(this);

      }
    }
  }

  /**
   * Listener for menu selection. Callback for the menu object.
   *
   * @param {element} tile The selected tile element.
   */
  MDIconButton.menuListener = function(tile, menu) {
    // Close the menu.
    menu.close(true);
  }

  // Initialization
  MDIconButton.updateIcon();
  MDIconButton.addEventListener('click', MDIconButton.clickListener);

  //INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDIconButton, config);
}

var initMDIcon = function(MDIcon, paperkit) {
  var avatarSVG = "<svg width=\"40\" height=\"40\">" +
    "<defs>" +
    "<pattern id=\"$$IMAGENAME$$\" x=\"0\" y=\"0\" patternUnits=\"userSpaceOnUse\" height=\"40\" width=\"40\">" +
    "<image x=\"0\" y=\"0\" height=\"40\" width=\"40\" xlink:href=\"$$IMAGE$$\"></image>" +
    "</pattern>" +
    "</defs>" +
    "<circle id=\"top\" cx=\"20\" cy=\"20\" r=\"20\" fill=\"url(#$$IMAGENAME$$)\"/>" +
    "</svg>";

  /**
   *
   */
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE IN MD-ICON " + attrname + " VALUE " + newvalue);
    if (attrname === "md-image") {
      var svgFileURI = this.getImageURI(newvalue);
      if (svgFileURI) {
        this.loadSVG(svgFileURI);
      }
    }
  }

  /**
   * Returns an image URI for the given md-image attribute value.
   * @param {string} value The md-image attribute value.
   * @returns {string} The image URI.
   */
  MDIcon.getImageURI = function(value) {
    if (value.indexOf("icon:") != -1) {
      var iconName = paperkit.path + "resources/icon/" + value.substring(5).trim() + ".svg";
    } else {
      var iconName = value;
    }
    return iconName;
  }

  /**
   * Generates a new SVG and then replaces de OLD one.
   * @param {string} svgData Data of the new SVG to generate.
   */
  MDIcon.generateSVG = function(svgData) {
    var tmpDiv = document.createElement("div");
    tmpDiv.innerHTML = svgData;
    var svgElement = tmpDiv.children[0];
    tmpDiv.removeChild(svgElement);

    // Animated SVG Replacement
    this.replaceSVG(svgElement);
  }

  /**
   * Replaces the old svg with the given one,
   * and does a simple fade-in-out animation.
   * @param {Element} newSVGElement The element with the loaded svg.
   */
  MDIcon.replaceSVG = function(newSVGElement) {
    var _this = this;
    var oldSVGElement = _this.children.length > 0 ? _this.querySelector('svg:not(.transition)') : null;

    var oldSVGElementParent = oldSVGElement != null ? oldSVGElement.parentElement : null;
    if (oldSVGElementParent != null) {
      var transition = _this.getAttribute('md-transition');
      console.log(_this);
      if (transition == "fade-in-out") {
        _this.fadeInOutTransition(newSVGElement, oldSVGElement);
      } else if (transition == "up") {
        _this.upTransition(newSVGElement, oldSVGElement);
      } else if (transition == "down") {

      } else {
        _this.fadeInOutTransition(newSVGElement, oldSVGElement);
      }
    } else {
      _this.fadeInOutTransition(newSVGElement, oldSVGElement);
    }
  }

  /**
   * The newSVGElement makes a fade in transition and the oldSVGElement
   * makes afade out transition
   * @param {Element} newSVGElement The element with the new svg.
   * @param {Element} oldSVGElement The element with the old svg.
   */
  MDIcon.fadeInOutTransition = function(newSVGElement, oldSVGElement) {
    var _this = this;
    newSVGElement.style.opacity = "0";
    this.appendChild(newSVGElement);

    if (oldSVGElement) {
      oldSVGElement.addEventListener(transitionend, function(e) {
        _this.removeChild(oldSVGElement);
      });

      oldSVGElement.style.opacity = "0";
      oldSVGElement.classList.add("transition");
    }
    newSVGElement.style.opacity = "";
  }

  MDIcon.upTransition = function(newSVGElement, oldSVGElement) {
    var _this = this;

    if (oldSVGElement) {
      oldSVGElement.addEventListener(transitionend, function(e) {
        _this.removeChild(oldSVGElement);
        oldSVGElement.style.opacity = "0";
        this.appendChild(newSVGElement);
        newSVGElement.style.top = "";
        newSVGElement.style.opacity = "0";
      });
      oldSVGElement.style.top = "5";
      oldSVGElement.classList.add("transition");
    }
  }

  /**
   * Loads a SVG File from the server and uses it in this md-button.
   * It generates an avatar image or a icon image depending on the type of md-icon this is.
   * @param {string} svgFileURI The file URI to load.
   */
  MDIcon.loadSVG = function(fileURI) {
    if (this.getAttribute('md-type') === 'icon' || !this.getAttribute('md-type')) {
      var xhr = new XMLHttpRequest;
      var _this = this;
      xhr.open("GET", fileURI, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.addEventListener("load", function(e) {
        _this.generateSVG(xhr.responseText);
      });
      xhr.send();
    } else {
      var imgName = this.makeId();
      var svgData = avatarSVG.replace('$$IMAGE$$', fileURI).replace(/\$\$IMAGENAME\$\$/g, imgName);
      this.generateSVG(svgData);
    }
  }

  // Init image
  MDIcon.attributeChangedCallback('md-image', '', MDIcon.getAttribute('md-image') ? MDIcon.getAttribute('md-image') : '');

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDIcon, config);
}

var initMDInputCheckbox = function(MDCheckbox) {
  MDCheckbox.toggle = function(e) {
    if (MDCheckbox.hasAttribute('checked')) {
      this.uncheck();
    } else {
      this.check();
    }
  }

  MDCheckbox.check = function() {
    this.setAttribute("checked", "");
    this.state = "checked";
  }

  MDCheckbox.uncheck = function() {
    this.removeAttribute('checked');
    this.state = "unchecked";
  }

  MDCheckbox.addEventListener('click', MDCheckbox.toggle);

  MDCheckbox.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDCheckbox.state = "unchecked";

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDCheckbox, config);
}

/**
 *
 */
var initMDInputList = function(MDInputList) {
  MDInputList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;

    if (el.tagName === 'MD-TILE' && parentList === this) {
      this.setSelectedItem(el);
    }
  }

  MDInputList.unsetSelected = function(tile) {
    tile.removeAttribute("selected");
    var multiple = this.getAttribute("md-multiple");
    if (multiple === "checkbox") {
      var checkbox = tile.querySelector('md-input[type="checkbox"]');
      if (checkbox) {
        checkbox.removeAttribute("checked");
      }
    } else {
      tile.removeAttribute("md-color");
    }
  }

  MDInputList.setSelected = function(tile) {
    tile.setAttribute("selected", "");
    var checkbox = tile.querySelector('md-input[type="checkbox"]');
    var multiple = this.getAttribute("md-multiple");
    if (multiple === "checkbox") {
      if (checkbox) {
        checkbox.setAttribute("checked", "");
      }
    } else {
      var backgroundColorClass = this.getAttribute("md-selected-color");
      if (backgroundColorClass) {
        tile.setAttribute("md-color", backgroundColorClass);
      }
    }
  }

  MDInputList.getSelectedValues = function() {
    var values = [];
    var options = MDInputList.querySelectorAll("md-tile");
    for (var i = 0; i < options.length; i++) {
      if (options[i].hasAttribute("selected")) {
        values.push(options[i].value);
      }
    }
    return values;
  }

  MDInputList.getSelectedItem = function() {
    var tile = this.querySelector("md-tile[selected]");
    return tile;
  }

  MDInputList.setSelectedItem = function(tile) {
    if (this.getAttribute("md-multiple")) {
      if (tile.hasAttribute("selected")) {
        this.unsetSelected(tile);
      } else {
        this.setSelected(tile);
      }
    } else {
      var oldTile = getSelectedItem();
      if (oldTile) {
        this.unsetSelected(oldTile);
      }

      if (oldTile !== tile) {
        this.setSelected(tile);
      }
    }
  }

  MDInputList.addItem = function(value, label, selected) {
    var tile = document.createElement("md-tile");
    tile.value = value;

    if (this.getAttribute("md-multiple") === 'checkbox') {
      var checkbox = document.createElement("md-input");
      checkbox.setAttribute("type", "checkbox");
      paperkit.initElement(checkbox);
      tile.appendChild(checkbox);
    }

    var text = document.createElement("md-text");
    text.textContent = label;
    paperkit.initElement(text);
    tile.appendChild(text);

    paperkit.initElement(tile);
    tile.addEventListener('click', this.clickListener.bind(this));
    this.appendChild(tile);

    if (selected) {
      this.setSelectedItem(tile);
    }
  }

  var options = MDInputList.querySelectorAll("option");
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    MDInputList.removeChild(option);
    MDInputList.addItem(option.value, option.textContent, option.hasAttribute("selected") ? true : false);
  }

  return MDInputList;
}

/**
 * Select input element initializer
 *
 * @param {element} el Element being initialized
 */
var initMDInputSelect = function(MDInputSelect, paperkit) {
  var spanText;
  var value;
  var menu;
  var input;

  /**
   * Click listener
   *
   * @param {Event} e Listener for click events in this element
   */
  MDInputSelect.clickListener = function(e) {
    var el = e.currentTarget;
    console.log("CLICK EN INPUT SELECT");
    if (el.tagName === "MD-INPUT" && el === this) {
      if (!this.menu) {
        this.menu = document.createElement('md-menu');
        this.menu.id = this.getMenuId();
        paperkit.initElement(this.menu);
        document.body.appendChild(this.menu);
      }

      this.menu.setAttribute("md-position", "parentInputSelect");
      this.menu.clearOptions();

      // TODO: Should this be done allways???? 
      // It's slow as hell if there are lots of options...
      // Add options as md-tiles
      [].forEach.call(this.querySelectorAll('option'), function(option) {
        this.menu.addOption(option.getAttribute('value'), option.textContent);
      }, this);

      this.value = this.getAttribute('value');
      this.menu.setSelectedValue(this.getAttribute('value'));
      this.menu.setCallback(this.menuListener.bind(this));
      this.menu.open(this);
    }

    if (e.stopPropagation) {
      e.stopPropagation(this.menuListener)
    } else {
      e.cancelBubble = true
    }
  }

  /**
   * Listener for menu selection. Callback for the menu object.
   *
   * @param {element} tile The selected tile element.
   */
  MDInputSelect.menuListener = function(tile, menu) {
    if (tile) {
      var text = tile.querySelector('md-text').textContent;
      var value = this.value = tile.getAttribute('value');


      // Change selected option, text and value.
      this.spanText.textContent = text;
      this.setAttribute('value', value);

      // Change list selected option
      // TODO: Is this this element responsability? Does this element have to know list internal structure?
      menu.setSelectedValue(value);
    }

    // Close the menu.
    menu.close(true);
  }

  /**
   * Generates child menu ID
   *
   * @return {string} the child menu ID.
   */
  MDInputSelect.getMenuId = function() {
    return this.id + "-menu";
  }

  /**
   * Initializes md-input elements
   */
  MDInputSelect.initElements = function() {
    // Add span for text
    this.spanText = document.createElement("span");
    this.spanText.classList.add('text');
    this.appendChild(this.spanText);

    // Add icon
    var icon = document.createElement('md-icon');
    icon.setAttribute('md-image', 'icon:arrow_drop_down');
    icon.setAttribute('md-fill', 'grey');
    initMDIcon(icon, paperkit);
    this.appendChild(icon);

    var divLine = document.createElement("div");
    divLine.classList.add("line");
    this.appendChild(divLine);

    this.calcWidth();

    this.input = document.createElement("input");
    this.input.type = "hidden";
    this.input.value = this.getAttribute('value') ? this.getAttribute('value') : '';
    this.input.name = this.getAttribute('name') ? this.getAttribute('name') : '';
    this.appendChild(this.input);

    var value = this.getAttribute('value');
    this.setValue(value);
    this.addEventListener('click', this.clickListener.bind(this));

  }

  /**
   * Sets the value of this select
   * @param {string} value The value to set.
   */
  MDInputSelect.setValue = function(value) {
    var option = null;

    if ((option = this.getOption(value))) {
      this.value = this.input.value = value;
      this.spanText.textContent = option.textContent;
    }
  }

  /**
   * Clears all options from this select.
   */
  MDInputSelect.clearOptions = function() {
    for (var i = this.children.length - 1; i >= 0; i--) {
      var child = this.children[i];
      if (child.tagName == "OPTION") {
        this.removeChild(child);
      }
    }
  }

  /**
   * Removes an option from this select.
   * @param {string} option The option to remove.
   */
  MDInputSelect.removeOption = function(value) {
    var option = null;
    if ((option = this.getOption(value))) {
      this.removeChild(option);
    }
  }

  /**
   * Adds an option to this select.
   * @param {string} value The value for the option.
   * @param {string} label The label for the option.
   */
  MDInputSelect.addOption = function(value, label) {
    var option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    this.appendChild(option);

    if (this.getAttribute('value') === value) {
      this.setValue(value);
    }

    this.calcWidth();
  }

  /**
   *
   */
  MDInputSelect.getOption = function(value) {
    var option = this.querySelector('option[value="' + value + '"]');
    return option;
  }


  /**
   * Calculates width of element based on font size.
   */
  MDInputSelect.calcWidth = function() {
    var longestString = "";
    var elementStyle = window.getComputedStyle(this.querySelector('span.text'));

    [].forEach.call(this.querySelectorAll("option"), function(option) {
      longestString = option.textContent.length > longestString.length ? option.textContent : longestString;
    });

    this.style.width = (paperkit.calcTextMetrics(longestString,
      elementStyle).width + 36) + "px";
  }

  MDInputSelect.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === "value") {
      this.setValue(newvalue);
    }
  }

  /**
   * Initialization.
   */
  MDInputSelect.initElements();

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDInputSelect, config);
}

var initMDInputText = function(MDInput) {
  var spanHint;
  var spanError;
  var input;
  var value;

  MDInput.initElements = function() {
    var value = this.getAttribute('value');

    this.spanHint = document.createElement("span");
    this.spanHint.id = "placeholder";
    this.spanHint.classList.add("placeholder");
    this.spanHint.innerHTML = this.getAttribute("placeholder") ? this.getAttribute("placeholder") : "";
    this.appendChild(this.spanHint);

    this.spanError = document.createElement("span");
    this.spanError.classList.add("error");
    this.spanError.innerHTML = this.getAttribute("md-error") ? this.getAttribute("md-error") : "";
    this.appendChild(this.spanError);

    var divLine = document.createElement("div");
    divLine.classList.add("line");
    this.appendChild(divLine);

    this.input = document.createElement("input");
    this.input.id = this.id + "-input";
    this.input.type = this.getAttribute("type");
    this.value = this.input.value = this.getAttribute("value") ? this.getAttribute("value") : "";
    this.input.name = this.getAttribute("name");
    this.appendChild(this.input);


    // Sets initial status
    var mode = this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

    if (mode === "hint") {
      this.spanHint.classList.add("hint");
    } else if (mode === "placeholder") {
      if (this.input.value && this.input.value !== "") {
        this.spanHint.style.visibility = "hidden";
      }
      this.input.addEventListener('input', MDInput.setFocus.bind(this));
    } else {
      if (this.input.value && this.input.value !== "") {
        this.spanHint.classList.add("hint");
      }
      this.input.addEventListener('focus', MDInput.setFocus.bind(this));
      this.input.addEventListener('blur', MDInput.removeFocus.bind(this));
    }

    this.input.addEventListener('change', MDInput.changeValue.bind(this));
  }

  /**
   * Sets hint or placeholder mode.
   * @param {string} mode the mode to set, "placeholder" or "hint"
   */
  MDInput.setHintMode = function(mode) {
    if (mode === "placeholder") {
      this.spanHint.classList.remove("hint");
    } else if (mode === "hint") {
      this.spanHint.classList.add("hint");
    }
  }

  /* ---- EVENT LISTENERS ---- */

  /**
   * Listener for value change in input element.
   * Sets md-input value to element value.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.changeValue = function(e) {
    if (this === MDInput) { // Sanity check.
      var el = e.currentTarget;
      this.value = el.value;
      this.setAttribute("value", this.value);
    }
  }

  /**
   * Listener for focus entry and content change, handles focus and input event for input object
   * moves placeholder to hint.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.setFocus = function(e) {
    if (this == MDInput) { // sanity check
      var mode = this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

      if (mode === "placeholder") {
        if (this.input.value === "") {
          this.spanHint.style.visibility = "visible";
        } else {
          this.spanHint.style.visibility = "hidden";
        }
      } else if (mode === "animated") {
        this.setHintMode('hint');
      }

      // this.input.focus();
    }
  }

  /**
   * Listener for focus exit, handles blur event for input object
   * moves hint to placeholder if there is content.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDInput.removeFocus = function(e) {
    if (this == MDInput) { // sanity check
      if (this.input.value === "") {
        this.setHintMode('placeholder');
      }
    }
  }

  /**
   * Attribute change listener.
   * Actually only checks for changes in the placeholder.
   *
   * @param  {string} attrname Name of the changed attribute.
   * @param  {string} oldvalue Old value of the attribute, or null if no old value.
   * @param  {string} newvalue New value of the attribute.
   */
  MDInput.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if (attrname === "placeholder") {
      this.spanHint.innerHTML = newvalue;
    } else if (attrname === "value") {
      this.value = this.input.value = newvalue;
      this.setFocus();
    } else if (attrname === "name") {
      this.input.name = newvalue;
    } else if (attrname === "id") {
      this.input.id = newvalue + "-input"
    } else if (attrname === "md-error") {
      this.spanError.innerHTML = newvalue;
    }
  };

  /* ---- OBJECT INITIALIZATION ---- */
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDInput, config);

  MDInput.initElements();
}

var initMDInput = function(MDInput, paperkit) {
  var inputtype = MDInput.getAttribute("type");

  if (inputtype === "text" || inputtype === "password" || inputtype === "email" || inputtype === "tel" || inputtype === "number" || inputtype === "url") {
    initMDInputText(MDInput, paperkit);
  } else if (inputtype === "select") {
    initMDInputSelect(MDInput, paperkit);
  } else if (inputtype === "checkbox") {
    initMDInputCheckbox(MDInput, paperkit);
  } else if (inputtype === "list") {
    initMDInputList(MDInput, paperkit);
  }
}

// TODO: Review callFunction and execuieFunctionByName calls

var initMDList = function(MDList, paperkit) {
  /**
   * Callback for attribute change
   * @param {string} attrname Attribute name
   *
   */
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;

    if (el.tagName === 'MD-TILE' && parentList === this) {
      console.log("Fired click on " + el.tagName);
      if (el.getAttribute('md-action')) {
        var action = el.getAttribute('md-action');
      } else {
        var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';
      }

      switch (action) {
        case 'none':
          break;
        default:
          if (action.indexOf('custom:') != -1) {
            var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            callFunction(f, el);
          } else if (action.indexOf('ajax:') != -1) {
            var f = action.substring(action.indexOf('ajax:') + 'ajax:'.length).trim();
            paperkit.ajaxInsert(el.getAttribute('md-ajax'), getEl(f), function(resp, container) {
              paperkit.initElement(container);
              if (el.getAttribute('md-ajax-callback')) {
                callFunction(el.getAttribute('md-ajax-callback'), el);
              };
            });
          } else if (action.indexOf('link:') != -1) {
            var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
            linkRedirect(f, el);
          } else if (action.indexOf('link-out:') != -1) {
            var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
            window.open(f);
          }
          break;
      }
    }
  };

  var linkRedirect = function(linkattr, target) {
    var link = target.getAttribute(linkattr);
    document.location.href = link;
  }

  var callFunction = function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, false, [target]);
  };

  MDList.initList = function() {
    var children = MDList.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName === 'MD-TILE') {
        var tile = children[i];
        tile.addEventListener('click', MDList.clickListener.bind(this));
      }
    }
  }

  /**
   * Clears the options list
   */
  MDList.clearItems = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * Adds an option to the list.
   * @param {string} id The id for the option
   * @param {string} label The label for the option
   * @returns {Element} The created tile
   */
  MDList.addItem = function(id, label) {
    var tile = document.createElement('md-tile');
    tile.id = id;
    tile.innerHTML = '<md-text>' + label + '</md-text>';
    tile.addEventListener('click', MDList.clickListener.bind(this));
    this.appendChild(tile);
    return tile;
  }

  // Initialize listerner
  MDList.initList();

  // SET INITIAL PROPERTIES  
  if (MDList.getAttribute('md-action')) {
    MDList.attributeChangedCallback('md-action', '', MDList.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDList, config);
}

/**
 * @class MDMenu
 */
var initMDMenu = function(MDMenu) {
  // Status of menu (opened | closed).
  MDMenu.status = "closed";

  // Parent element of menu.
  MDMenu.callbackFunction = null;
  MDMenu.bindedListener = null;

  // Calculated height
  MDMenu.calulatedHeight = null;

  /**
   * Inits the menu.
   * Sets width according to options and multiple widths.
   */
  MDMenu.init = function() {
    console.log("INITIALIZING MD-MENU");
    this.status = "closed";
  }

  /**
   * Opens the menu.
   * @param {Element} parent Parent element this menu depends on.
   */
  MDMenu.open = function(parent) {
    var openMode = this.getAttribute("md-position");

    // Recalculates width
    this.generateWidth();

    if (openMode === "parentInputSelect") {
      this.parentInputSelectOpen(parent);
    } else if (openMode === "parentIcon") {
      this.parentIconOpen(parent);
    } else {
      // TODO: SIMPLY SHOW UP
    }

    // TODO: Review transition, not working well.
    // Show and animate
    var endHeight = this.style.maxHeight;
    this.style.maxHeight = "0px";
    this.style.transition = "max-height 0.25s ease-in-out";
    this.style.visibility = "visible";
    this.style.maxHeight = endHeight;

    // TODO: Review, should this be done on animation end?
    // Add listener and set status
    this.bindedListener = this.clickListener.bind(this); // Trick to be able to remove binded listener
    document.addEventListener('click', this.bindedListener);
    this.status = "opened";
  }

  /**
   * Closes the menu.
   * @param {boolean} Optionally destroy menu element...
   */
  MDMenu.close = function(destroy) {
    // Transition
    this.style.overflow = 'hidden';
    this.calculatedHeight = this.style.maxHeight;
    this.style.maxHeight = "0px";
    this.addEventListener(transitionend, this.endOfCloseTransition);

    // TODO: Review, should this be done on animation end?
    // Remove listener and set status
    document.removeEventListener('click', this.bindedListener);
    this.status = "closed";
  }

  /**
   * Listener for end of transition.
   * @param {Event} e Event object @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.endOfCloseTransition = function(e) {
    this.style.overflow = '';
    this.style.visibility = "hidden";
    this.style.maxHeight = this.calculatedHeight;
    this.removeEventListener(transitionend, this.endOfCloseTransition);
  }

  /**
   * Generates and sets the menu width.
   */
  MDMenu.generateWidth = function() {
    var stepWidth = isMobile() ? 56 : 64;
    var originalWidth = this.getBoundingClientRect().width;
    var steps = Math.ceil(originalWidth / stepWidth);
    this.style.width = ((steps * stepWidth) < 2 ? 1.5 : (steps * stepWidth)) + "px";
  }

  /**
   * Open this menu related to a parent icon
   * @param {Element} parent Parent icon.
   * TODO: review
   */
  MDMenu.parentIconOpen = function(parent) {
    var parentRect = parent.getBoundingClientRect();
    var viewPort = getViewport();

    this.style.right = (viewPort.width - parentRect.right) + "px";
    this.style.top = parentRect.top + "px";
  }

  /**
   * Open related to a parent input select
   * TODO: REVIEW TOO MANY HARDCODED VALUES!!!?!??!?!?!
   * @param {Element} parent Parent input select
   */
  MDMenu.parentInputSelectOpen = function(parent) {
    var parentRect = parent.getBoundingClientRect();
    var viewPort = getViewport();

    this.style.maxHeight = "200px";
    this.style.overflow = "auto";
    this.style.left = (parentRect.left - 16) + "px";
    this.style.top = (parentRect.top - 6) + "px";

    if (this.children.length < 5 || true) {
      if (this.querySelector('md-tile[selected]')) {
        var selected = this.querySelector('md-tile[selected]');
        this.scrollTop = selected.offsetTop - 8;

        if (this.scrollTop != selected.offsetTop) {
          this.style.top = (parseInt(this.style.top) - (selected.offsetTop - this.scrollTop - 8)) + 'px';
        }
      }
    }

    /**
     * TODO: Review
     * PARA QUE SIRVE ESTO????
     * EL POSICIONAMIENTO SIGUE FUNCIONANDO BIEN SIN ELLO
     *
    menuRect = this.getBoundingClientRect();
    if(menuRect.top < 32) {
      this.style.top = '32px';
    } else if (viewPort.height - menuRect.bottom < 32) {
      this.style.top = (viewPort.height - 32 - menuRect.height) + 'px';
    }
    */
  }

  /**
   * Listener for menu click events.
   * Calls custom functions and callbacks.
   * @param {Event} e Event object. @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.clickListener = function(e) {
    var el = e.currentTarget;
    var target = e.target;
    console.log("CLICK EN MENU");

    if (this.status === "opened") {
      var tile = this.contains(target) ? this.findTile(target) : null;

      var action = this.getAttribute("md-action") ? this.getAttribute('md-action') : 'none';

      switch (action) {
        default: if (action.indexOf('custom:') != -1) {
            var functionName = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            el.callFunction(functionName, tile);
          }
        break;
      }

      if (this.callbackFunction) {
        this.callbackFunction(tile, this);
      }
    }
  }

  /**
   * Callback for menu selection
   * This function gets called when click is done in menu.
   * It receives an argument with the selected tile or null if no tile selected.
   *
   * @param {function} func Callback function.
   */
  MDMenu.setCallback = function(func) {
    this.callbackFunction = func;
  }

  /**
   *
   */
  MDMenu.findTile = function(el) {
    while ((el = el.parentElement) && el.tagName !== "MD-TILE") {
      if (el.tagName === "MD-MENU") {
        return null;
      }
    }
    return el;
  }

  /**
   * Switches menu state from open to closed and viceversa.
   */
  MDMenu.switchState = function() {
    if (this.getAttribute('md-state') !== "open") {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Gets the currently selected element
   * @return {Element} md-tile currently selected
   */
  MDMenu.getSelectedElement = function() {
    var selectedElement = this.querySelector("md-tile[selected]");
    return selectedElement;
  }

  /**
   * Gets the current selected value
   * @return {string} The selected element value.
   */
  MDMenu.getSelectedValue = function() {
    var selectedElement = this.getSelectedElement();
    if (selectedElement) {
      return selectedElement.getAttribute("value");
    }
    return null;
  }

  /**
   * Sets selected value
   * @param {string} value - The value to set.
   */
  MDMenu.setSelectedValue = function(value) {
    if (!value) {
      return;
    }

    var selectedElement = this.getSelectedElement();
    if (selectedElement) {
      selectedElement.removeAttribute('selected');
    }

    var queryByValue = 'md-tile[value="' + value + '"]';
    var element = this.querySelector(queryByValue);
    if (element) {
      element.setAttribute('selected', '');
    }
  }

  /**
   * Clears the options list
   */
  MDMenu.clearOptions = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * Adds an option to the menu.
   * @param {string} value The value for the option
   * @param {string} label The label for the option
   */
  MDMenu.addOption = function(value, label) {
    var tile = document.createElement('md-tile');
    tile.innerHTML = '<md-text>' + label + '</md-text>';
    tile.setAttribute('value', value);
    this.appendChild(tile);
  }

  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  }

  /**
   * Calls an external function
   * TODO: Generalize
   * @param {string} functionName The function name
   * @param {array}  params       Array of parameters
   */
  var callFunction = function(functionName, params) {
    console.log("calling function " + functionName);
    executeFunctionByName(f, window, params);
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDMenu, config);

  // Init Menu
  MDMenu.init();
}

/**
 * MDPager Object.
 * Object code that extends HTML Element to support
 * md-pager element functionality.
 */
var initMDPager = function(MDPager) {
  /**
   * Moves to viewport specified page.
   * @param  {integer} index Page to move to viewport.
   */
  MDPager.moveToPage = function(index) {
    var pages = this.getElementsByTagName("md-page");
    var numberOfPages = pages.length;
    pages[index].style.overflowY = "hidden";
    pages[index].scrollTop = 0;
    pages[0].style.marginLeft = "-" + (100 * index) + "%";
    pages[index].style.overflowY = "";
  }
}

var initMDSidemenu = function(MDSidemenu) {
  /**
   * Opens side menu.
   */
  MDSidemenu.open = function() {
    if (MDSidemenu.paperkit.toolbar.getAttribute('md-drag') === "drag") {
      MDSidemenu.paperkit.toolbar.setAttribute('md-drag', 'no-drag');
    }
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
    MDSidemenu.paperkit.greylayer.show();
    MDSidemenu.paperkit.greylayer.addEventListener('click', function() {
      MDSidemenu.close();
    });
  }

  /**
   * Closes side menu.
   */
  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
    MDSidemenu.paperkit.greylayer.hide();
    if (MDSidemenu.paperkit.toolbar.getAttribute('md-drag') === "no-drag") {
      MDSidemenu.paperkit.toolbar.setAttribute('md-drag', 'drag');
    }
  }

  /**
   * Toggles side menu, opening or closing it.
   */
  MDSidemenu.toggle = function() {
    if (MDSidemenu.getAttribute('md-state') !== "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }

  /**
   * Callback function, called when an attribute changes.
   * @param {string} attrname Changed attribute name
   * @param {string} oldvalue Old value for attribute or null if previous value does not exist.
   * @param {string} newvalue New value for attribute or null if value removed.
   */
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  /**
   * Autoresizes side menu, adapting it to different widths and making it more responsive.
   * TODO: Review, now there are functions to know if this is mobile or desktop, no need to calculate.
   */
  MDSidemenu.autoResize = function() {
    var viewport = getViewport();
    if (viewport.width <= 456) { // We should generate display vars from settings.json
      MDSidemenu.style.width = (viewport.width - 56) + "px";
      if (MDSidemenu.getAttribute('md-state') !== "open") {
        MDSidemenu.style.left = "-" + MDSidemenu.style.width;
      };
    } else {
      MDSidemenu.style.width = "";
    }
  }

  MDSidemenu.autoResize();

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDSidemenu, config);
}

var initMDSnackBar = function(MDSnackBar) {
  MDSnackBar.animationIn = function() {
    var position = this.getAttribute('md-position');

    if (!this.hasAttribute('md-notanimated')) {
      if (position.split(' ').indexOf('bottom') != -1) {
        this.style.transitionProperty = 'bottom, opacity';
        this.style.transitionDuration = "0.25s, 0.5s";
      } else {
        this.style.transitionProperty = 'top, opacity';
        this.style.transitionDuration = "0.25s, 0.5s";
      }
      this.setAttribute("md-notanimated", "");
    }
  };

  MDSnackBar.animationOut = function() {
    var position = this.getAttribute('md-position');

    if (position.split(' ').indexOf('bottom') != -1) {
      this.style.transitionProperty = 'opacity';
      this.style.transitionDuration = "0.5s";
      this.style.opacity = "0";
    } else {
      this.style.transitionProperty = 'opacity';
      this.style.transitionDuration = "0.5s";
      this.style.opacity = "0";
    }
  };

  MDSnackBar.animationEnd = function() {
    var position = this.getAttribute('md-position');

    this.style.transitionProperty = '';
    this.style.transitionDuration = "";
    this.style.opacity = "";
    this.removeAttribute("md-notanimated");

    this.removeEventListener(transitionend, this.animationEnd);
  };

  MDSnackBar.animate = function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() {
      _this.animationOut();
      _this.addEventListener(transitionend, _this.animationEnd);
    }, 2000);
  };

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if (action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  };
}

var initMDSwitch = function(MDSwitch) {
  MDSwitch.toggle = function(e) {
    if (MDSwitch.getAttribute('value') !== "on") {
      this.on();
    } else {
      this.off();
    }
  }

  MDSwitch.on = function() {
    this.setAttribute("value", "on");
    this.value = "on";
  }

  MDSwitch.off = function() {
    this.setAttribute("value", "off");
    this.value = "off";
  }

  MDSwitch.clickListener = function(e) {
    MDSwitch.toggle();
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    if (action.indexOf('custom:') != -1) {
      var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
      el.callUserFunction(f, [el]);
    }
  };

  MDSwitch.addEventListener('click', MDSwitch.clickListener);

  MDSwitch.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSwitch.value = "off";

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDSwitch, config);
}

/**
 * MDTabBar Object.
 * Object code that extends HTML Element to support
 * md-tabbar element functionality.
 */
var initMDTabBar = function(MDTabBar) {
  /* Width of tabs for fixed and fullscreen modes */
  MDTabBar.tabWidth = 0;
  /* Array of tabs */
  MDTabBar.tabs = [];
  /* Selector object */
  MDTabBar.selector = null;

  /**
   * Handles a click on a tab inside this tabbar.
   * If tabbar has a 'md-action: custom' property it calls the user specified function.
   * If tabbar has a 'md-pager' property it calls the movePage method of the specified pager.
   * Both calls are compatible, and both can happen.
   * It moves tabbar indicator to selected tab too.
   *
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDTabBar.clickHandler = function(e) {
    var el = e.currentTarget;
    var parentTabBar = el.parentNode;

    if (el.tagName === "MD-TAB" && parentTabBar === this) {
      /* First it handles custom action */
      var action = this.getAttribute("md-action") ? this.getAttribute('md-action') : 'none';
      if (action === 'none') {
        /* Nothing to do */
      } else {
        if (action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callUserFunction(f, [el, el.index]);
        }
      }

      /* Then it handles md-pager */
      var pagerID = this.getAttribute("md-pager") ? this.getAttribute("md-pager") : null;
      if (pagerID) {
        var pager = document.getElementById(pagerID);
        if (pager && pager.tagName === "MD-PAGER") {
          pager.moveToPage(el.index);
        }
      }

      /* Finally moves indicator */
      this.moveIndicatorToTab(el.index);
    }
  };

  /**
   * Moves indicator to selected tab.
   * @param  {integer} tabNumber Index of tab to move indicator to.
   */
  MDTabBar.moveIndicatorToTab = function(tabNumber) {
    var tabBarRect = this.getBoundingClientRect();
    var tabWidth = tabBarRect.width / this.tabs.length;
    var newLeft = tabNumber * tabWidth;
    var newRight = (((this.tabs.length - tabNumber - 1) * tabWidth));

    if (parseInt(this.selector.style.left) < newLeft) {
      this.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      this.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }

    this.selector.style.left = newLeft + "px";
    this.selector.style.right = newRight + "px";
  }

  /**
   * Inits tabs array, loading each child
   * tab into it. Inits tabs.index and tabbar.width.
   */
  MDTabBar.initTabBar = function() {
    var tabs = MDTabBar.getElementsByTagName("md-tab");

    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      this.tabs.push(tab);
      this.tabWidth = this.tabWidth < tab.getBoundingClientRect().width ? tab.getBoundingClientRect().width : this.tabWidth;
    }

    this.style.width = (!this.getAttribute("md-type") || this.getAttribute("md-type") === "fixed") ?
      this.tabWidth * this.tabs.length + "px" : "100%";

    this.tabs.forEach(function(tab, index) {
      if (!this.getAttribute("md-type") || this.getAttribute("md-type") === "fixed") {
        tab.style.flex = "0 0 " + this.tabWidth + "px";
      } else if (this.getAttribute("md-type") === "fulscreen") {
        tab.style.flex = "1 0 auto";
      }
      tab.index = index;
      tab.addEventListener('click', MDTabBar.clickHandler.bind(this));
    }, this);
  }

  /**
   * Injects selector div as last child of md-tabbar.
   */
  MDTabBar.injectSelector = function() {
    if (!this.selector) {
      this.selector = document.createElement('div');
      this.selector.id = "selector";
      if (this.getAttribute('md-selector-color')) {
        this.selector.style.backgroundColor = this.getAttribute('md-selector-color');
      }
      this.appendChild(this.selector);
    }
  }

  /**
   * Callback that handles changing values of attributes.
   * @param  {string} attrname Attribute name.
   * @param  {string} oldvalue Old value of attribute.
   * @param  {string} newvalue New value of attribute.
   */
  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Initializes tabs.
  MDTabBar.initTabBar();
  MDTabBar.injectSelector();
  MDTabBar.moveIndicatorToTab(0);

  // Initializes attribute change observer.
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDTabBar, config);
}

var initMDTile = function(MDTile, paperkit) {
  var createAvatarTile = function(text, avatarImage, iconImage, handler) {

  }

  var createSimpleTile = function(text, handler) {

  }

  var createIconTile = function(text, iconImage, handler) {

  }

  var createIconButtonTile = function(text, iconButtonImage, handler) {

  }
}

/* exported initMDToolBar */
var initMDToolBar = function(MDToolBar) {
  /*
    MDToolBar.set = function(key,value){
      if (key=='image' || key=='md-image') {
        MDToolBar.querySelector('md-icon').setAttribute('md-image',value);
      } else if (key.indexOf('md-') === -1) {
        MDToolBar.setAttribute('md-'+key,value);
      }
    }

    MDToolBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
      console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    };

    // INIT OBSERVER
    var observer = new MutationObserver(function(mutations) { 
        mutations.forEach(function(mutation) {
          var element = mutation.target;
          element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
        });
    });

    var config = { attributes: true, childList: false, characterData: false };
    observer.observe(MDToolBar, config);
  */
};

/* global whereStyle, destinationRect, parentElement, tmpDiv */
/* exported Transition */

function getEl(el) {
  if (el) {
    if (el.nodeType) {
      return el;
    } else if (document.querySelector(el)) {
      return document.querySelector(el);
    }
  } else {
    return false;
  }
}

var transition = {
  status: {
    lastMorphFrom: false
  },
  copyRect: function(what, where, notrans, nobg) {
    what = getEl(what);
    if (!where) {
      return false;
    }
    if (notrans) {
      what.style.transition = "none";
    } else if (!notrans) {
      what.style.transition = "all 0.5s";
    }
    if (where === "full") {
      what.style.borderRadius = "0";
      what.style.position = "fixed";
      what.style.top = "0";
      what.style.left = "0";
      what.style.width = "100%";
      what.style.height = "100%";
    } else {
      whereStyle = window.getComputedStyle(getEl(where));
      where = getEl(where).getBoundingClientRect();
      what.style.borderRadius = whereStyle.borderRadius;
      if (whereStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && !nobg) {
        what.style.backgroundColor = whereStyle.backgroundColor;
      } else if (!nobg) {
        what.style.backgroundColor = "#fff";
      }
      what.style.position = "fixed";
      what.style.top = where.top + "px";
      what.style.left = where.left + "px";
      what.style.width = where.width + "px";
      what.style.height = where.height + "px";
    }
  },
  morph: function(what, where, callback, id) {
    if (what) {
      transition.status.lastMorphFrom = getEl(what);
    } else {
      return false;
    }
    var whatStyle = window.getComputedStyle(getEl(what));
    if (!where) {
      where = "full";
    }
    var whatClon = document.createElement("div");
    if (id) {
      whatClon.id = id;
    } else {
      whatClon.id = "md-morph";
    }
    whatClon.setAttribute("md-shadow", "shadow-0");
    whatStyle = window.getComputedStyle(getEl(what));
    if (whatStyle.zIndex >= 400) {
      whatClon.style.zIndex = whatStyle.zIndex + 1;
    } else {
      whatClon.style.zIndex = "400";
    }
    whatClon.style.backgroundColor = "transparent";
    transition.copyRect(whatClon, what, false, true);
    document.body.appendChild(whatClon);
    setTimeout(function() {
      whatClon.setAttribute("md-shadow", "shadow-3");
      if (whatStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
        whatClon.style.backgroundColor = whatStyle.backgroundColor;
      } else {
        whatClon.style.backgroundColor = "#fff";
      }
    }, 10);
    setTimeout(function() {
      whatClon.style.transitionTimingFunction = "ease-in";
      transition.copyRect(whatClon, where);
      setTimeout(function() {
        if (callback) {
          callback(whatClon);
        }
      }, 500);
      getEl(what).style.opacity = 0;
    }, 210);
    return whatClon;
  },
  morphBack: function(target, callback) {
    var morphEl = document.getElementById("md-morph");
    if (!morphEl) {
      return false;
    }
    var to;
    if (target && target.nodeType && target.getAttribute("md-morph-back")) {
      to = getEl(target.getAttribute("md-morph-back"));
    } else if (getEl(target)) {
      to = getEl(target);
    } else if (transition.status.lastMorphFrom) {
      to = transition.status.lastMorphFrom;
    } else {
      return false;
    }
    transition.copyRect(morphEl, to);
    morphEl.classList.add("op-0-child");
    setTimeout(function() {
      morphEl.setAttribute("md-shadow", "shadow-0");
      morphEl.style.backgroundColor = "transparent";
      setTimeout(function() {
        document.body.removeChild(morphEl);
        if (callback) {
          callback(morphEl);
        }
      }, 500);
      to.style.opacity = "";
    }, 510);
  }
};


var Transition = function(ownerElement) {
  this.ownerElement = ownerElement;
  this.tmpDiv = document.createElement("div");
  this.tmpDiv.id = "tmpDiv";
  this.tmpDiv.style.position = "absolute";
  this.tmpDiv.style.visibility = "hidden";
  document.body.appendChild(tmpDiv);

  this.morph = function(originElement, destinationElement) {
    if (originElement) {
      this.originElement = originElement;
    }

    if (destinationElement) {
      this.destinationRect = destinationElement.getBoundingClientRect();
    }

    // Initial state...
    this.whatElement.style.borderRadius = "0";
    this.whatElement.style.zIndex = "400";
    this.parentElement.style.position = "absolute";
    this.parentElement.style.top = "0px";
    this.parentElement.style.left = "0px";
    this.parentElement.style.width = originElement.getBoundingClientRect().width;
    this.parentElement.style.height = originElement.getBoundingClientRect().height;

    this.whatElement.style.transition = "all 0.5s";

    this.whatElement.style.top = destinationRect.top + "px";
    this.whatElement.style.left = destinationRect.left + "px";
    this.whatElement.style.width = destinationRect.width + "px";
    this.whatElement.style.height = destinationRect.height + "px";
  };

  this.expand = function() {

    var initialHeight = parentElement ? parentElement.getBoundingClientRect().height : 0;
    var finalHeight = ownerElement.getBoundingClientRect().height;
    /*
    		collectorTile.style.transition = "max-height 0.5s";
    			collectorTile.style.marginTop="20px";
    			collectorTile.style.marginBottom="20px";
    			collectorTile.style.width="114%";
    			collectorTile.style.left="-7%";
    		collectorTile.style.maxHeight = height + "px";
    		collectorTile.parentNode.parentNode.style.overflow="visible";
    */
    ownerElement.style.height = initialHeight + "px";
    ownerElement.style.visibility = "visible";
    ownerElement.style.transition = "height 0.5s ease-in-out";
    ownerElement.style.height = finalHeight + "px";
  };
};

/* global Paperkit */
Paperkit.prototype.viewport = {
  get: function() {
    var e = window;
    var a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + "Width"],
      height: e[a + "Height"]
    };
  }
};
