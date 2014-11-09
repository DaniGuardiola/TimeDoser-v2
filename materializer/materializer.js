var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);

    // SUBMIT
    // Adding
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm, this.enterKeyListener, 'keypress');
      }
    // Removing
    } else if(attrname==='md-action' && oldvalue==='submit' && newvalue.indexOf('custom:') == -1) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm);
      }
    }

    // CUSTOM
    if(attrname==='md-action' &&  newvalue.indexOf('custom:') != -1) {
      var f = newvalue.substring(newvalue.indexOf('custom:') + 'custom:'.length).trim();
      setListener(MDIconButton, function() {
        callFunction(f);
      });
    }
  };

  MDButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if(e.keyCode===13) {
      el.submit();
    }
  }

  MDButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'submit': 
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          callFunction(f, el);
        }
        break;
    }   
  };

  var submitForm= function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();
    }    
  }

  var resetForm= function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();  
    }    
  }

  var snackbarDismiss= function(target) {
    console.log("snackbar dismiss clicked!")
  }

  var callFunction= function(functionName, args, context) {
    console.log('[MD] callFunction - Calling ' + functionName + '(' + args + ')');
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    if (!context) {
      context = window;
    }
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if (args) {
    console.log("dew1");
        return context[func].apply(this, args);
    } else {      
      console.log(context + func);
        return context[func]();
    }
  }

  var setListener= function(who, what, when) {
    if (who.nodeType === 1) {      
      // Removing all listeners by replacing the element with a clone
      whoClone = who.cloneNode(true);
      who.parentNode.replaceChild(whoClone, who);
      who = whoClone;
      if (typeof what === "function") {
        if (when == '' || typeof when != "string") {
          // Defautl event
          when = 'click';
        }
        // Ading new event Listener
        who.addEventListener(when, function() {
          what();
        });
      }
    } 
  }

  var findParentForm= function(element) {
    var el = element.parentNode;

    do {
      if(el.tagName=="FORM") {
        return el;
      } else if(el.tagName=="BODY") {
        return null;
      }
    } while((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDButton.addEventListener('click', MDButton.clickListener);

  // If not md-action then submit is the default, set form key listener
  if(!MDButton.getAttribute('md-action')) {
      var parentForm = findParentForm(MDButton);
      if(parentForm) {
        parentForm.addEventListener('keypress', MDButton.enterKeyListener);
      }    
  }

  // SET INITIAL PROPERTIES
  if(MDButton.getAttribute('md-action')) {
    MDButton.attributeChangedCallback('md-action', '', MDButton.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDButton, config);

}
var initGlobalMDFunctions = function(MDElement) {
  MDElement.changeProperty= function(property, oldvalue, newvalue) {
    var attribute = this.getAttribute(property); 

    if(attribute) {
      var values = attribute.split(' ');
      var oldvalueIndex = values.indexOf(oldvalue);

      if(oldvalueIndex >= 0) {
        values.splice(oldvalueIndex, 1, newvalue);
      } else {
        values.push(newvalue);
      }

      this.setAttribute(property, values.join(' '));    
    }    
  }
}
var initMDIconButton = function(MDIconButton) {
  MDIconButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);

    // SUBMIT
    // Adding
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm, this.enterKeyListener, 'keypress');
      }
    // Removing
    } else if(attrname==='md-action' && oldvalue==='submit' && newvalue.indexOf('custom:') == -1) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        setListener(parentForm);
      }
    }

    // CUSTOM
    if(attrname==='md-action' &&  newvalue.indexOf('custom:') != -1) {
      var f = newvalue.substring(newvalue.indexOf('custom:') + 'custom:'.length).trim();
      setListener(MDIconButton, function() {
        callFunction(f);
      });
    }
  };

  MDIconButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if(e.keyCode===13) {
      el.submit();
    }
  }

  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'submit': 
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          callFunction(f, el);
        }
        break;
    }   
  };

  var submitForm= function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();
    }    
  }

  var resetForm= function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();  
    }    
  }

  var snackbarDismiss= function(target) {
    console.log("snackbar dismiss clicked!")
  }

  var callFunction= function(functionName, args, context) {
    console.log('[MD] callFunction - Calling ' + functionName + '(' + args + ')');
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    if (!context) {
      context = window;
    }
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if (args) {
    console.log("dew1");
        return context[func].apply(this, args);
    } else {      
      console.log(context + func);
        return context[func]();
    }
  }

  var setListener= function(who, what, when) {
    if (who.nodeType === 1) {      
      // Removing all listeners by replacing the element with a clone
      whoClone = who.cloneNode(true);
      who.parentNode.replaceChild(whoClone, who);
      who = whoClone;
      if (typeof what === "function") {
        if (when == '' || typeof when != "string") {
          // Defautl event
          when = 'click';
        }
        // Ading new event Listener
        who.addEventListener(when, function() {
          what();
        });
      }
    } 
  }

  var findParentForm= function(element) {
    var el = element.parentNode;

    do {
      if(el.tagName=="FORM") {
        return el;
      } else if(el.tagName=="BODY") {
        return null;
      }
    } while((el = el.parentNode) != null);
    return null;
  }

  // SET INITIAL PROPERTIES
  if(MDIconButton.getAttribute('md-action')) {
    MDIconButton.attributeChangedCallback('md-action', '', MDIconButton.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDIconButton, config);

}
var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-image' && newvalue!="") {
      var image=this.getAttribute('md-image');
      var svgFileURI = materializer.path + "md-resources/icon/" + newvalue + ".svg";
      replaceSVG(svgFileURI, this);
    }
  };

  var createSVG= function(svgData) {
      var div = document.createElement('div');
      div.innerHTML = svgData;
      var svg = div.children[0];
      div.removeChild(svg);
      return svg;
  }

  var replaceSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){
        var newSVG = createSVG(xhr.responseText);
        var oldSVG = element.children[0];

        if(oldSVG) {
          // Si hay svg antiguo, se le pone opacidad 0
          oldSVG.style.opacity="0";
          // Se elimina cuando la transición acaba
          oldSVG.addEventListener(transitionend, function(e) {
            element.removeChild(oldSVG);
          });
          // Se inicializa el nuevo svg desde opacity 0
          newSVG.style.opacity="0";
        }
        // Se añade, independientemente de si había svg antiguo o no
        element.appendChild(newSVG);        
        // element.innerHTML = xhr.responseText;
        // Se elimina la opacity 0 inline, por lo que transiciona al opacity 1 del propio elemento
        setTimeout(function(){
          newSVG.style.opacity="";
          console.log("hola?");
        },50);
    });
    xhr.send();
  }

  // Init image
  if(MDIcon.getAttribute('md-image')) {
    MDIcon.attributeChangedCallback('md-image','', MDIcon.getAttribute('md-image'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDIcon, config);
}
var initMDList = function(MDList) {
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';

    switch(action) {
      case 'none':
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          callFunction(f, el);
        } else if(action.indexOf('link:') != -1) {
          var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
          linkRedirect(f, el);
        }
        break;
    }   
  };

  var linkRedirect= function(linkattr, target) {
    var link = target.getAttribute(linkattr);
    document.location.href = link;
  }

  var callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  };

  // Initialize listerner
  [].forEach.call(MDList.querySelectorAll('md-tile'), function(tile) {
    tile.addEventListener('click', MDList.clickListener);
  });

  // SET INITIAL PROPERTIES  
  if(MDList.getAttribute('md-action')) {
    MDList.attributeChangedCallback('md-action', '', MDList.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDList, config);
}
var initMDSnackBar = function(MDSnackBar) {
  MDSnackBar.animationIn=function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='bottom, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
          this.style.bottom="24px";
          this.style.opacity="1";
      } else {
          this.style.transitionProperty='top, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
          this.style.top="24px";
          this.style.opacity="1";      
      }
    }  
  };  

  MDSnackBar.animationOut=function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='opacity';
          this.style.transitionDuration="0.5s";      
          this.style.opacity="0";
      } else {
          this.style.transitionProperty='opacity';
          this.style.transitionDuration="0.5s";      
          this.style.opacity="0";      
      }
    }
  };

  MDSnackBar.animationEnd = function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='';
          this.style.transitionDuration="";      
          this.style.bottom="-24px";
      } else {
          this.style.transitionProperty='';
          this.style.transitionDuration="";      
          this.style.top="-24px";      
      }
    }

    this.removeEventListener(transitionend, this.animationEnd);
  };

  MDSnackBar.animate=function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() { 
      _this.animationOut(); 
      _this.addEventListener(transitionend, _this.animationEnd);
    }, 2000);
  };

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if(action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  };

}
var initMDSideMenu = function(MDSidemenu) {
  MDSidemenu.open = function() {
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
  }

  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
  }

  MDSidemenu.switch = function() {
    if (MDSidemenu.getAttribute('md-state') === "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }
 
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSidemenu.autoResize = function() {
    var viewport = getViewport();
    if (viewport.width <= 768) { // We should generate display vars from md-settings.json
      MDSidemenu.style.width = (viewport.width - 56) + "px";
      if (MDSidemenu.getAttribute('md-state') !== "open") {
        console.log("shouldn't be open");
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

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSidemenu, config);
}
var Materializer= function() {
  var path = '';
}

Materializer.prototype.init= function() {
  // Init materializer path
  var url = document.querySelector("link[href*='materializer.css']").href;
  this.path = url ? url.substring(0, url.indexOf('materializer.css')) : '';

  // Init materializer objects
  var elements = document.getElementsByTagName('*');
  var length = elements.length;
  for(var i=0; i<elements.length; i++) {
    console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
    var el = elements[i];
    console.log("ENCONTRADO " + el.tagName);
    if(el.tagName.indexOf('MD') === 0) {
      console.log("VOY A PROCESAR " + el.tagName);
      this.addMDMethods(el);
      console.log("PROCESADO " + el.tagName);
    }    
  }
/*  
  elements.forEach(function(el) {
    console.log("ENCONTRADO " + el.tagName);
    if(el.tagName.indexOf('MD') === 0) {
      console.log("PROCESADO " + el.tagName);
      _this.addMDMethods(el);      
    }
  });
*/
};

Materializer.prototype.addMDMethods= function(element) {
  var tag = element.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element);

    if(tag=="md-snackbar") {
      initMDSnackBar(element, this);
    } else if(tag=="md-button") {
      initMDButton(element, this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(element, this);
    } else if(tag=="md-list") {
      initMDList(element, this);
    } else if(tag=="md-icon") {
      initMDIcon(element, this);
    } else if(tag=="md-sidemenu") {
      initMDSideMenu(element, this);
    } else if(tag=="md-icon-button") {
      initMDIconButton(element, this);
    }
  }
};


var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      console.log(what);
    }
  },
  change: function(element,classOut,classIn){
    if (element) {
      if (classOut) {
        if (element.classList.contains(classOut)) {
          element.classList.remove(classOut);
        }
      }
      if (classIn) {
        if (element.classList.contains(classIn) != true) {
          element.classList.add(classIn);
        }
      }
      // properties.log("properties.change | " + query);
    } else {
      // properties.log("!! properties.change | query not specified or not valid");
    }
  }
}

var transitionEndEventName= function() {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
}

var transitionend = transitionEndEventName();

var executeFunctionByName= function(functionName, context, args) {
       console.log(args);
       var namespaces = functionName.split(".");
       var func = namespaces.pop();
       for (var i = 0; i < namespaces.length; i++) {
           context = context[namespaces[i]];
       }
       if (args) {
           return context[func].apply(this, args);
       } else {
           return context[func];
       }
   }

var getViewport = function() {
  var e = window;
  var a = 'inner';
  if ( !( 'innerWidth' in window ) )
    {
      a = 'client';
      e = document.documentElement || document.body;
    }
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
