"use strict";
(function() {
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

    function start() {
        checkVersion();
    }

    function checkVersion() {
        var landingUrl = "http://timedoser.daniguardiola.me?installed=true";
        var version = chrome.runtime.getManifest().version;
        var updatedUrl;
        chrome.storage.local.get("versionNumber", function(storage) {
            var versionNumber = storage.versionNumber;
            if (!versionNumber) {
                openPopup(landingUrl);
            } else if (versionNumber !== version) {
                updatedUrl = updatedUrl = "http://timedoser.daniguardiola.me/#changes?update=true&version=" + version;
                openPopup(updatedUrl);
            }
            chrome.storage.local.set({
                "versionNumber": version
            });
        });
    }

    function openPopup(url) {
        //window.open(url);
    }

    window.addEventListener("load", start);
})();
