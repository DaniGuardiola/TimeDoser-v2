API.dom = (function() {
    "use strict";
    // Renders the timer section
    function renderTimer(callback) {
        // Create close button
        var close = document.createElement("paper-icon-button");
        close.id = "close-button";
        close.setAttribute("icon", "close");
        close.setAttribute("title", "Close TimeDoser");
        close.addEventListener("click", function(event) {
            API.timer.stop(function() {
                exitAnimation(event);
            });
        });

        var pinClickListener = function(event) {
            if (API.window.togglePin()) {
                event.currentTarget.setAttribute("icon", "visibility-off");
            } else {
                event.currentTarget.setAttribute("icon", "visibility");
            }
        };

        // Create pin button
        var pin = document.createElement("paper-icon-button");
        pin.id = "pin-button";
        pin.setAttribute("icon", "visibility");
        pin.setAttribute("title", "Show in top of other windows");
        pin.addEventListener("click", pinClickListener);

        var miniClickListener = function(event) {
            if (API.window.mini.is()) {
                API.window.mini.off();
                //event.currentTarget.setAttribute("icon", "chevron-left");
            } else {
                API.window.mini.on();
                //event.currentTarget.setAttribute("icon", "chevron-right");
            }
        };

        // Create mini button
        var mini = document.createElement("paper-icon-button");
        mini.id = "mini-button";
        mini.setAttribute("icon", "chevron-left");
        mini.setAttribute("title", "Toggle mini mode");
        mini.addEventListener("click", miniClickListener);

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
        settings.setAttribute("title", "Open settings");
        settings.addEventListener("click", openSettings);

        // Create animation helper
        var animationHelper = document.createElement("div");
        animationHelper.id = "animation-helper";
        animationHelper.style.transition = "none";

        // Append elements to container
        container.appendChild(close);
        container.appendChild(pin);
        container.appendChild(mini);
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
        var switches = settings.querySelectorAll("paper-toggle-button");
        var time, slider;
        var discard = settings.querySelector(".discard-button");
        var save = settings.querySelector(".save-button");

        discard.addEventListener("click", function() {
            discardSettings();
            closeSettings();
        });
        save.addEventListener("click", function() {
            saveSettings();
            closeSettings();
        });

        API.storage.settings.getAll().then(function(settings) {
            var i;
            for (i = 0; i < sliderDivs.length; i++) {
                time = sliderDivs[i].querySelector(".time");
                slider = sliderDivs[i].querySelector("paper-slider");
                if (settings[slider.name]) {
                    slider.value = settings[slider.name];
                }
                slider.setAttribute("last-value", slider.value);
                slider.addEventListener("immediate-value-change", updateSliderTime);
                slider.addEventListener("change", updateSliderTime);
            }
            for (i = 0; i < switches.length; i++) {
                if (settings[switches[i].getAttribute("name")]) {
                    switches[i].checked = settings[switches[i].getAttribute("name")];
                }
                switches[i].setAttribute("last-value", switches[i].checked);
            }
        });

    }

    function updateSliderTime(event, value) {
        var slider = event.currentTarget;
        var div = slider.parentNode;
        var time = div.querySelector(".time");

        console.log("UPDATED TIME function LOL");
        console.log(time);
        value = value || slider.immediateValue;
        console.log(value);
        time.textContent = value;
        //slider.value = value;
        console.log(time);
    }

    // Opens the settings section
    function openSettings(event) {
        if (API.window.mini.is()) {
            API.dom.getMini().click();
        }
        API.window.resize("settings");
        getTimerContainer().style.height = "100%";
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#2196f3",
            cover: true,
            time: false,
            expand: 570,
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

    // Discard settings
    function discardSettings() {
        var settings = getSettings();
        var i;
        // Sliders
        var sliders = settings.querySelectorAll("paper-slider");
        for (i = sliders.length - 1; i >= 0; i--) {
            sliders[i].value = sliders[i].getAttribute("last-value");
            updateSliderTime({
                currentTarget: sliders[i]
            }, sliders[i].getAttribute("last-value"));
        }
        // Switches
        var switches = settings.querySelectorAll("paper-toggle-button");
        for (i = switches.length - 1; i >= 0; i--) {
            switches[i].checked = switches[i].getAttribute("last-value") === "true";
        }
    }

    // Saves the settings
    function saveSettings() {
        var settings = getSettings();
        var i;
        // Sliders
        var sliders = settings.querySelectorAll("paper-slider");
        for (i = sliders.length - 1; i >= 0; i--) {
            API.storage.settings.set(sliders[i].name, sliders[i].value);
            sliders[i].setAttribute("last-value", sliders[i].value);
        }
        // Switches
        var switches = settings.querySelectorAll("paper-toggle-button");
        for (i = switches.length - 1; i >= 0; i--) {
            API.storage.settings.set(switches[i].getAttribute("name"), switches[i].checked);
            switches[i].setAttribute("last-value", switches[i].checked);
        }
    }

    // Closes the settings section
    function closeSettings() {
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#9c27b0",
            expand: 680,
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

    // Gets the pin button
    function getPin() {
        return document.getElementById("pin-button");
    }

    // Gets the pin button
    function getMini() {
        return document.getElementById("mini-button");
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
        getPin: getPin,
        getMini: getMini,
        getSettingsButton: getSettingsButton,
        updateTime: updateTime
    };
})();
