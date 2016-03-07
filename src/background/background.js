"use strict";
(function() {
    function start() {
        checkVersion(function() {
            API.windows.timer.open();
        });
    }

    window.addEventListener("load", start);
})();
