// Define the API
(function() {
    "use strict";
    window.API = {};
    // Start the app
    function start() {
        API.window.resize("standard");
        API.tools.firstTime(function() {
            // If it is the first time opening the app
            API.dom.renderTimer(function() {
                API.timer.init();
                API.tour.start();
            });
        }, function() {
            // If it is not
            API.dom.renderTimer(function() {
                API.timer.init();
            });
        });
    }

    // Add load listener
    window.addEventListener("load", start);
})();
