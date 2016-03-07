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
