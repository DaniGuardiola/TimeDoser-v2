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
        setTimeout(function() {
            clear("work");
        }, 10000);
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
        setTimeout(function() {
            clear("break");
        }, 10000);
    }

    function create(id, opt) {
        chrome.notifications.clear(id);
        chrome.notifications.create(id, opt);
    }

    function clear(id) {
        chrome.notifications.clear(id);
    }

    return {
        "create": create,
        "work": work,
        "break": breakNotification
    };
})();
