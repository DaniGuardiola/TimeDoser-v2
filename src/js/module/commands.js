(function() {
    "use strict";
    // Listen to commands
    chrome.commands.onCommand.addListener(function(command) {
        console.log("Received command: " + command);
    });
})();
