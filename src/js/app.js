// Define the API
(function() {
    "use strict";
    window.API = {};
    // Start the app
    function start() {
        chrome.runtime.getPlatformInfo(function(info) {
            document.body.classList.add(info.os);
            if (info.os === "win") {
                document.body.classList.add("minsizebug");
            }
        });
        API.window.resize("standard");
        API.storage.settings.get(["notFirstTime"]).then(function(storage) {
            API.dom.renderTimer(function() {
                API.timer.init();
                API.storage.settings.set("notFirstTime", false);
                if (!storage.notFirstTime) {
                    //API.tour.start();
                    //API.storage.settings.set("notFirstTime", true);
                }
            });
        });
    }

    // Add load listener
    window.addEventListener("load", start);
})();
