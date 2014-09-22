libs.notifications = {
    create: function(what) {
        if (what === "work") {
            var opt = {
                type: "basic",
                title: chrome.i18n.getMessage("workNotifyTITLE"),
                message: chrome.i18n.getMessage("workNotifyMSG"),
                iconUrl: "img/shared/work.svg"
            };
        } else if (what === "break") {
            var opt = {
                type: "basic",
                title: chrome.i18n.getMessage("breakNotifyTITLE"),
                message: chrome.i18n.getMessage("breakNotifyMSG"),
                iconUrl: "img/shared/break.svg"
            };
        } else {
            var opt = {
                type: "basic",
                title: "[notifications] ERROR: [create]",
                message: "If you are not Dani Guardiola, tell him you are reading this text",
                iconUrl: libs.vars.root + "img/shared/work.svg"
            };
        }
        chrome.notifications.clear(what, function() {});
        chrome.notifications.create(what, opt, function(id) {});
        console.log("[notifications]: [create] Creating notification: " + what);
    }
};