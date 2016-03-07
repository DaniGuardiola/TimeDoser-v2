API.tools = (function() {
    "use strict";
    // Gets a localized string
    function i18n(message) {
        return chrome.i18n.getMessage(message);
    }

    // Gets a localized message
    function i18nMsg(message) {
        return i18n("msg" + message);
    }

    // Localizes element and subelements
    function i18nElement(element) {
        var from = document;
        if (element && element.nodeType) {
            if (element.hasAttribute("msg") ||
                element.hasAttribute("i18nTitle") ||
                element.hasAttribute("i18n1") ||
                element.hasAttribute("i18n2")) {

                if (element.hasAttribute("msg")) {
                    element.innerText = i18nMsg(element.getAttribute("msg"));
                }

                if (element.hasAttribute("i18nTitle")) {
                    element.setAttribute("title", i18nMsg(element.getAttribute("i18nTitle")));
                }

                if (element.hasAttribute("i18n1")) {
                    element.setAttribute("i18n1", i18nMsg(element.getAttribute("i18n1")));
                }

                if (element.hasAttribute("i18n2")) {
                    element.setAttribute("i18n2", i18nMsg(element.getAttribute("i18n2")));
                }

                element.classList.add("i18nDone");
                return;
            } else {
                from = element;
            }
        }

        var elements = from.querySelectorAll("[msg]:not(.i18nDone),[i18nTitle]:not(.i18nDone),[i18n1]:not(.i18nDone),[i18n2]:not(.i18nDone)");
        for (var i = elements.length - 1; i >= 0; i--) {
            i18nElement(elements[i]);
        }
    }

    // Publish API
    return {
        i18n: i18n,
        i18nMsg: i18nMsg,
        i18nElement: i18nElement
    };
})();
