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
