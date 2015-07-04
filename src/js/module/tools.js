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

    // Checks if this is the first time opening the app
    function firstTime(afirmative, negative) {
        chrome.storage.local.get("notFirstTime", function(storage) {
            if (false || !storage.notFirstTime) {
                // If it is the first time
                afirmative();
                chrome.storage.local.set({
                    "notFirstTime": true
                });
            } else {
                // If it is not
                negative();
            }
        });
    }

    // Publish API
    return {
        i18n: i18n,
        i18nMsg: i18nMsg,
        firstTime: firstTime
    };
})();
