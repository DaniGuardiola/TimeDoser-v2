API.dom = (function() {
    "use strict";
    // Renders the timer section
    function renderTimer(callback) {
        // Create close button
        var close = document.createElement("paper-icon-button");
        close.id = "close-button";
        close.setAttribute("icon", "close");
        close.addEventListener("click", function(event) {
            API.timer.stop(function() {
                exitAnimation(event);
            });
        });

        // Create FAB
        var fab = document.createElement("paper-fab");
        fab.id = "main-fab";
        fab.setAttribute("icon", "av:play-arrow");
        fab.setAttribute("position", "right");

        // Create container
        var container = document.createElement("div");
        container.id = "timer-container";

        // Create timer text
        var time = document.createElement("div");
        time.id = "timer-text";
        time.textContent = "00:00";

        // Create settings button
        var settings = document.createElement("paper-icon-button");
        settings.id = "settings-button";
        settings.setAttribute("icon", "settings");
        settings.addEventListener("click", openSettings);

        // Create animation helper
        var animationHelper = document.createElement("div");
        animationHelper.id = "animation-helper";
        animationHelper.style.transition = "none";

        // Append elements to container
        container.appendChild(close);
        container.appendChild(settings);
        container.appendChild(time);
        container.appendChild(animationHelper);
        container.appendChild(fab);

        // Append container to body
        document.body.appendChild(container);

        // Initialize the settings
        initSettings();

        // Execute load animation
        loadAnimation(callback);
    }

    // Gets the settings section
    function getSettings() {
        return document.getElementById("timedoser-settings");
    }

    // Sets up the settings section
    function initSettings() {
        var settings = getSettings();
        getTimerContainer().appendChild(settings);
        var sliderDivs = settings.querySelectorAll(".slider-setting");
        var time, slider;
        var discard = settings.querySelector(".discard-button");
        var save = settings.querySelector(".save-button");

        discard.addEventListener("click", closeSettings);
        save.addEventListener("click", closeSettings);

        function updateTime(event) {
            var slider = event.currentTarget;
            var div = slider.parentNode;
            var time = div.querySelector(".time");
            time.textContent = slider.immediateValue;
        }

        for (var i = 0; i < sliderDivs.length; i++) {
            time = sliderDivs[i].querySelector(".time");
            slider = sliderDivs[i].querySelector("paper-slider");

            slider.addEventListener("immediate-value-change", updateTime);
        }
    }

    // Opens the settings section
    function openSettings(event) {
        API.window.resize("settings");
        getTimerContainer().style.height = "100%";
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#2196f3",
            cover: true,
            time: false,
            expand: 450,
            close: true,
            fab: {
                position: "right",
                icon: "av:play-arrow"
            },
            callback: function() {
                getSettings().classList.add("on");
            }
        }, target);
    }

    // Closes the settings section
    function closeSettings() {
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#9c27b0",
            expand: 550,
            time: false,
            close: true,
            cover: true,
            settings: true,
            fab: {
                fadein: true,
                position: "right",
                icon: "av:play-arrow"
            },
            callback: function() {
                API.window.resize("standard");
                getSettings().classList.remove("on");
                getTimerContainer().style.height = "";
            }
        }, target);
    }

    // Load animation
    function loadAnimation(callback) {
        setTimeout(function() {
            getFAB().classList.add("on");
            setTimeout(callback, 300);
        }, 50);
    }

    // Exit animation
    function exitAnimation(event) {
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#fff",
            cover: true,
            time: false,
            close: false,
            expand: 500,
            fab: {
                position: "right",
                icon: "play"
            },
            callback: function() {
                document.body.classList.add("exit");
                setTimeout(API.window.close, 100);
            }
        }, target);
    }

    // Gets the timer container
    function getTimerContainer() {
        return document.getElementById("timer-container");
    }

    // Gets the FAB
    function getFAB() {
        return document.getElementById("main-fab");
    }

    // Gets the animation helper
    function getAnimationHelper() {
        return document.getElementById("animation-helper");
    }

    // Gets the timer text
    function getTime() {
        return document.getElementById("timer-text");
    }

    // Gets the close button
    function getClose() {
        return document.getElementById("close-button");
    }

    // Gets the settings button
    function getSettingsButton() {
        return document.getElementById("settings-button");
    }

    // Updates the time text and the window title
    function updateTime(minute, second) {
        // Import i18n msg tool
        var msg = API.tools.i18nMsg;
        var text;

        minute = minute + "" || "00";
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        second = second + "" || "00";
        if (second.length === 1) {
            second = "0" + second;
        }
        var time = minute + ":" + second;
        getTime().textContent = time;
        if (API.timer.getStatus() === "work") {
            text = msg(1);
        } else {
            text = msg(2);
        }
        document.title = time + " (" + text + ") - " + API.tools.i18n("appname");
    }

    // Export the module
    return {
        renderTimer: renderTimer,
        getSettings: getSettings,
        openSettings: openSettings,
        closeSettings: closeSettings,
        getTimerContainer: getTimerContainer,
        getFAB: getFAB,
        getAnimationHelper: getAnimationHelper,
        getTime: getTime,
        getClose: getClose,
        getSettingsButton: getSettingsButton,
        updateTime: updateTime
    };
})();
