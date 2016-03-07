"use strict";
var API = {};
(function(){"use strict";
(function() {
    function start() {
        checkVersion(function() {
            API.windows.timer.open();
        });
    }

    window.addEventListener("load", start);
})();

API.version = (function() {
    "use strict";

    function checkVersion(callback) {
        var version = chrome.runtime.getManifest().version;
        var data;
        chrome.storage.local.get("versionNumber", function(storage) {
            var versionNumber = storage.versionNumber;
            if (!versionNumber) {
                data = {
                    type: "install",
                    version: version
                };
            } else if (versionNumber !== version) {
                data = {
                    type: "update",
                    version: version,
                    from: versionNumber
                };
            }
            callback(data);
            chrome.storage.local.set({
                "versionNumber": version
            });
        });
    }

    function run() {
        checkVersion(handler);
    }

    function handler(data) {
        var url = "http://timedoser.daniguardiola.me";
        if (data.type === "update") {
            var updateUrl = "?update=true&version=" + data.version + "&from=" + data.from;
            webview(updateUrl);
        } else if (data.type === "install") {
            var installUrl = url + "?install=true" + "&from=" + data.from;
            webview(installUrl);
        }
    }

    function webview(url) {
        console.log("URL: " + url);
    }

    return {
        run: run
    };
}());
"use strict";
/**
 * @namespace API.windows
 */
API.windows = (function() {
    /**
     * @namespace timer
     * @memberOf API.windows
     */

    /**
     * @alias open
     * @memberof API.windows.timer
     */
    function openTimer() {
        chrome.app.runtime.onLaunched.addListener(function() {
            chrome.app.window.create("view/timer.html", {
                "id": "timer",
                "frame": "none",
                "resizable": false,
                //"alwaysOnTop": true,
                "bounds": {
                    "width": 224,
                    "height": 112,
                    "left": 32,
                    "top": 32
                }
            });
        });
    }

    return {
        timer: {
            open: openTimer
        }
    };
})();
}());