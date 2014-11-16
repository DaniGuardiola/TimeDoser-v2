var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if(attrname==='md-action' && (oldvalue!=='submit' || oldvalue==='')) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
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
          this.callFunction(f, el);
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

  MDButton.callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
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
var initGlobalMDFunctions = function(MDElement, materializer) {
  MDElement.materializer = materializer;
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

  MDElement.makeId= function()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  MDElement.alreadyInitialized = true;
}
var initMDGreylayer = function(MDGreylayer) {
  MDGreylayer.show = function() {
    MDGreylayer.removeEventListener(transitionend, MDGreylayer.noZIndex);
    MDGreylayer.style.zIndex = "400";
    MDGreylayer.setAttribute("md-state", "on");
  }

  MDGreylayer.hide = function() {
    MDGreylayer.setAttribute("md-state", "off");
    MDGreylayer.addEventListener(transitionend, MDGreylayer.noZIndex);
  }

  MDGreylayer.switch = function() {
    if (MDGreylayer.getAttribute('md-state') !== "on") {
      MDGreylayer.show();
    } else {
      MDGreylayer.hide();
    }
  }

  MDGreylayer.noZIndex = function() {
    MDGreylayer.style.zIndex = "";
  }
 
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

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDGreylayer, config);
}
var initMDIconButton = function(MDIconButton) {
  initMDButton(MDIconButton);

  MDIconButton.removeEventListener('click', MDIconButton.clickListener);

  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          el.callFunction(f, el);
        } else if(action.indexOf('menu:') != -1) {
          var f = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
          el.openMenu(f, el);
        }
        break;
    }   
  };

  MDIconButton.openMenu= function(menuName, el) {
    var menu=document.getElementById(menuName);
    if(menu) {
      if(menu.status=="closed") {
        menu.open(el);
        document.addEventListener('click', closeListener);
        if (event.stopPropagation) {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
      } else {
        menu.close();
        document.removeEventListener('click', closeListener);
      }
    }
  }

  function closeListener(e) {
    var action=MDIconButton.getAttribute("md-action");
    var menuName = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
    var menu=document.getElementById(menuName);
    menu.close();

    /*
    * This event goes down-up, once it reaches the target tile there is no need to
    * go down, let's cancel event bubbling. It acts "almost" like a background modal layer
    */
    if(e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble=true;
    }    

    document.removeEventListener('click', closeListener);
  }

  MDIconButton.addEventListener('click', MDIconButton.clickListener);
}
var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(this.tagName==='MD-ICON') {
      if(attrname==='md-image' && newvalue!="") {
        var svgFileURI = materializer.path + "md-resources/icon/" + newvalue + ".svg";
        loadSVG(svgFileURI, this);
      }
    } else {
      if(attrname==='md-image' && newvalue!="") {
        var imgFileURI = newvalue;
        var imgName = this.makeId();
        var svgData = avatarSVG.replace('$$IMAGE$$', imgFileURI).replace(/\$\$IMAGENAME\$\$/g, imgName);
        replaceSVG(svgData, this);
      } else if(attrname==='md-image') {
        var svgFileURI = materializer.path + "md-resources/icon/account_circle.svg";
        loadSVG(svgFileURI, this);
      }
    }
  };

var avatarSVG= "<svg width=\"40\" height=\"40\">"+
          "<defs>" +
            "<pattern id=\"$$IMAGENAME$$\" x=\"0\" y=\"0\" patternUnits=\"userSpaceOnUse\" height=\"40\" width=\"40\">"+
              "<image x=\"0\" y=\"0\" height=\"40\" width=\"40\" xlink:href=\"$$IMAGE$$\"></image>"+
            "</pattern>"+
          "</defs>"+
          "<circle id=\"top\" cx=\"20\" cy=\"20\" r=\"20\" fill=\"url(#$$IMAGENAME$$)\"/>"+
        "</svg>";

  var createSVG= function(svgData) {
      var div = document.createElement('div');
      div.innerHTML = svgData;
      var svg = div.children[0];
      div.removeChild(svg);
      return svg;
  }

  var replaceSVG= function(svgData, element) {
    var newSVG = createSVG(svgData);
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
    },50);
  }

  var loadSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){ replaceSVG(xhr.responseText, element); });
    xhr.send();
  }

  // Init image
  MDIcon.attributeChangedCallback('md-image','', MDIcon.getAttribute('md-image') ? MDIcon.getAttribute('md-image'): '');

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

    console.log("Fired click on " + el.tagName);
    if(el.tagName==='MD-TILE' && el.parentElement===MDList) {
      if(el.getAttribute('md-action')) {
        var action = el.getAttribute('md-action');
      } else {
        var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';
      }

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

  var initChildrenActions= function() {
    var children = MDList.children;    
    for(var i=0; i<children.length;i++) {
      if(children[i].tagName==='MD-TILE') {        
        var tile = children[i];
        tile.addEventListener('click', MDList.clickListener);
      }
    }
  }

  // Initialize listerner
  initChildrenActions();

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
var initMDMenu = function(MDMenu) {
  MDMenu.status = "closed";

  MDMenu.open = function(parent) {    
    MDMenu.style.display="";
    
    // Positioning
    // Better suppor for Dani's ideas
    // it can be personalized with a md-menu attribute
    // or even with a parent attribute, have to see the best way
    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();
    MDMenu.style.position="fixed";
    MDMenu.style.top= parentRect.bottom + "px";
    MDMenu.style.right=(viewPort.width - parentRect.right) + "px";

    // Animation
    MDMenu.style.height="";
    MDMenu.status = "opened";    
  }

  MDMenu.close = function() {
    MDMenu.style.height = "0px";
    MDMenu.addEventListener(transitionend, MDMenu.endOfTransition);
    MDMenu.status= "closed";
  }

  MDMenu.endOfTransition = function(e) {
    MDMenu.style.display="none";
    MDMenu.removeEventListener(transitionend, MDMenu.endOfTransition);
  }

  MDMenu.switch = function() {
    if (MDMenu.getAttribute('md-state') !== "open") {
      MDMenu.close();
    } else {
      MDMenu.open();
    }
  }
 
  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
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
  observer.observe(MDMenu, config);
}
var initMDSidemenu = function(MDSidemenu) {
  MDSidemenu.open = function() {
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
    MDSidemenu.materializer.greylayer.show();
    MDSidemenu.materializer.greylayer.addEventListener('click', function(){
      MDSidemenu.close();
    });
  }

  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
    MDSidemenu.materializer.greylayer.hide();
  }

  MDSidemenu.switch = function() {
    if (MDSidemenu.getAttribute('md-state') !== "open") {
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
    if (viewport.width <= 456) { // We should generate display vars from md-settings.json
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

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSidemenu, config);
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
var initMDTabBar = function(MDTabBar) {
  MDTabBar.width = 0;
  MDTabBar.selector = null;
  MDTabBar.tabs = MDTabBar.getElementsByTagName("md-tab");
  MDTabBar.selected = 0;

  MDTabBar.clickHandler= function(e) {
    var el = e.currentTarget;
    if(el.tagName==="MD-TAB") {
      var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'none';

      if(action==='none') {
        /* Nothing to do */
      } else if(action==='showpage') {
        MDTabBar.showPage(el.index);
      }

      MDTabBar.moveIndicatorToTab(el.index);
    }
  };

  MDTabBar.moveIndicatorToTab= function(tabNumber) {
    var tabBarRect = MDTabBar.getBoundingClientRect();
    var newLeft = tabNumber * MDTabBar.width;
    var newRight = (((MDTabBar.tabs.length - tabNumber - 1) * MDTabBar.width));
    if(parseInt(MDTabBar.selector.style.left) < newLeft) {
      MDTabBar.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      MDTabBar.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }
    
    MDTabBar.selector.style.left =  newLeft + "px";
    MDTabBar.selector.style.right =  newRight + "px";
  }

  MDTabBar.showPage=function(tabNumber) {
    [].forEach.call(MDTabBar.tabs, function(tab, index) {
      var page = document.querySelector('md-page#'+tab.getAttribute('md-page'));
      var position = index - tabNumber;
      page.style.left=(position * 100) + "%";
    });
  }

  MDTabBar.initTabs= function() {
    [].forEach.call(MDTabBar.tabs, function(tab, index) { 
      MDTabBar.width = tab.getBoundingClientRect().width > MDTabBar.width ? tab.getBoundingClientRect().width : MDTabBar.width;
      tab.style.flex = "1";
      tab.index=index;
      tab.addEventListener('click', MDTabBar.clickHandler);
    });

    MDTabBar.style.minWidth = (MDTabBar.width * MDTabBar.tabs.length) + "px";
  }

  MDTabBar.injectSelector= function() {
    if(!MDTabBar.selector) {
      MDTabBar.selector = document.createElement('div');
      MDTabBar.selector.id="selector";
      MDTabBar.appendChild(MDTabBar.selector);
    }
  }

  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Init tabs
  MDTabBar.injectSelector();
  MDTabBar.initTabs();
  MDTabBar.showPage(0);
  MDTabBar.moveIndicatorToTab(0);

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDTabBar, config);
}
var initMDToolBar = function(MDToolBar) {
  MDToolBar.clickHandler= function(e) {
    var el = e.currentTarget;
  };

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
}
var Materializer= function() {
  this.path = '';
  this.initFuncs = new Array();

  /* Elements */
  this.greylayer = null;
  this.sidemenu = null;
}

Materializer.prototype.initListener= function(func) {
  this.initFuncs.push(func);
}

Materializer.prototype.init= function() {
  // Init materializer path
  var url = document.querySelector("link[href*='materializer.css']").href;
  this.path = url ? url.substring(0, url.indexOf('materializer.css')) : '';

  // Init elements
  if (!document.querySelector('md-greylayer')) {
    document.body.appendChild(document.createElement('md-greylayer'));
  }

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

  this.initFuncs.forEach(function(initFunc){
    initFunc();
  });
};

Materializer.prototype.addMDMethods= function(element) {
  var tag = element.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if(tag=="md-snackbar") {
      initMDSnackBar(element, this);
    } else if(tag=="md-button") {
      initMDButton(element, this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(element, this);
    } else if(tag=="md-list") {
      initMDList(element, this);
    } else if(tag=="md-icon" || tag=="md-avatar") {
      initMDIcon(element, this);
    } else if(tag=="md-sidemenu") {
      initMDSidemenu(element, this);
      this.sidemenu = element;
    } else if(tag=="md-icon-button") {
      initMDIconButton(element, this);
    } else if(tag=="md-greylayer") {
      initMDGreylayer(element, this);
      this.greylayer = element;
    } else if(tag=="md-menu") {
      initMDMenu(element, this);
    } else if(tag=="md-tabbar") {
      initMDTabBar(element, this);
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
