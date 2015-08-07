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

    // Publish API
    return {
        i18n: i18n,
        i18nMsg: i18nMsg
    };
})();
