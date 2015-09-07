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
        API.tools.i18nElement();
        API.storage.settings.get(["notFirstTime", "mini"]).then(function(storage) {
            API.dom.renderTimer(function() {
                if (storage.mini) {
                    API.window.mini.on();
                } else {
                    API.window.resize("standard");
                }
                API.timer.init();
                API.storage.settings.set("notFirstTime", false);
                /*if (!storage.notFirstTime) {
                    API.tour.start();
                    API.storage.settings.set("notFirstTime", true);
                }*/
            });
        });
    }

    // Add load listener
    window.addEventListener("load", start);
})();
