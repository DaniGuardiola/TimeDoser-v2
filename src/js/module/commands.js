(function() {
    "use strict";
    // Listen to commands
    chrome.commands.onCommand.addListener(function(command) {

        if (command === "start-stop-command") {
            var status = API.timer.getStatus();
            if (status === "standby" || status === "work") {
                API.tour.simulateClick(API.dom.getFAB());
                API.window.get().focus();
            } else {
                API.timer.setStatus("standby");
            }
        }

        if (command === "alwaysOnTop-command") {
            API.tour.simulateClick(API.dom.getPin());
        }

        /* TODO
        if (command === "pause-command") {

        }
        */

        if (command === "mini-command") {
            API.tour.simulateClick(API.dom.getMini());
            API.window.get().focus();
        }
    });
})();
