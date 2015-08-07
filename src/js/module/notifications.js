API.notifications = (function() {
    "use strict";

    // Work preset
    function work() {
        create("work", {
            type: "basic",
            title: chrome.i18n.getMessage("msg3"),
            message: chrome.i18n.getMessage("msg4"),
            iconUrl: "/meta/icon-128.png"
            // iconUrl: "/img/work.png"
        });
    }

    // Break preset
    function breakNotification() {
        create("break", {
            type: "basic",
            title: chrome.i18n.getMessage("msg5"),
            message: chrome.i18n.getMessage("msg6"),
            iconUrl: "/meta/icon-128.png"
            // iconUrl: "/img/break.png"
        });
    }

    function create(id, opt) {
        chrome.notifications.clear(id);
        chrome.notifications.create(id, opt);
    }

    return {
        "create": create,
        "work": work,
        "break": breakNotification
    };
})();
