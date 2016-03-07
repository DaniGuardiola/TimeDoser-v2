API.tour = (function() {
    "use strict";
    // True while tour is ongoing
    var on = false;

    // Starts the tour
    function start() {
        if (on) {
            console.error("The tour has already started");
            return;
        }

        // Set on to true
        on = true;

        // Set the standby status
        API.timer.setStatus("standby");

        // Resize window and set body class to tour
        API.window.resize("tour");
        document.body.classList.add("tour");

        // Block the timer
        blockTimer();
    }

    // Ends the tour
    function end() {
        if (!on) {
            console.error("The tour is not started");
            return;
        }

        // Set the standby status
        API.timer.setStatus("standby");

        // Remove tour class from body 
        document.body.classList.remove("tour");

        // Resize window and disable timer blocking
        setTimeout(function() {
            API.window.resize("standard");
            unblockTimer();
            // Set on to false
            on = false;
        }, 500);
    }

    // Blocks the timer container
    function blockTimer() {
        // Get the timer container
        var timer = API.dom.getTimerContainer();

        // Create the blocker element
        var blocker = document.createElement("div");
        blocker.id = "tour-blocker";

        // Append the blocker to the timer
        timer.appendChild(blocker);
    }

    // Gets the blocker
    function getBlocker() {
        return document.getElementById("tour-blocker");
    }

    // Disables the timer blocking
    function unblockTimer() {
        API.dom.getTimerContainer().removeChild(getBlocker());
    }

    // Simulates a click on an element
    function simulateClick(target) {
        var ripple = target.root ? target.root.querySelector("paper-ripple") : false;
        if (ripple) {
            ripple.simulatedRipple();
        }
        target.click();
    }

    return {
        start: start,
        end: end,
        simulateClick: simulateClick
    };
})();
