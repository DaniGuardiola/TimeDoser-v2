API.dom = (function() {
    "use strict";
    // Renders the timer section
    function renderTimer(callback) {
        // Create close button
        var close = document.createElement("paper-icon-button");
        close.id = "close-button";
        close.setAttribute("icon", "close");
        close.setAttribute("title", "Close");
        close.setAttribute("i18nTitle", "18");
        close.addEventListener("click", function(event) {
            API.timer.stop(function() {
                exitAnimation(event);
            });
        });

        var pinClickListener = function(event) {
            var button = event.currentTarget;
            if (API.window.togglePin()) {
                button.setAttribute("icon", "visibility-off");
                button.setAttribute("title", button.getAttribute("i18n2"));
            } else {
                button.setAttribute("icon", "visibility");
                button.setAttribute("title", button.getAttribute("i18n1"));
            }
        };

        // Create pin button
        var pin = document.createElement("paper-icon-button");
        pin.id = "pin-button";
        pin.setAttribute("icon", "visibility");
        pin.setAttribute("title", "Show on top of other windows");
        pin.setAttribute("i18n1", "19");
        pin.setAttribute("i18nTitle", "19");
        pin.setAttribute("i18n2", "20");
        pin.addEventListener("click", pinClickListener);

        var miniClickListener = function(event) {
            var button = event.currentTarget;
            if (API.window.mini.is()) {
                API.window.mini.off();
                button.setAttribute("title", button.getAttribute("i18n1"));
                //event.currentTarget.setAttribute("icon", "chevron-left");
            } else {
                API.window.mini.on();
                button.setAttribute("title", button.getAttribute("i18n2"));
                //event.currentTarget.setAttribute("icon", "chevron-right");
            }
        };

        // Create mini button
        var mini = document.createElement("paper-icon-button");
        mini.id = "mini-button";
        mini.setAttribute("icon", "chevron-left");
        mini.setAttribute("title", "Show on top of other windows");
        mini.setAttribute("i18n1", "21");
        mini.setAttribute("i18nTitle", "21");
        mini.setAttribute("i18n2", "22");
        mini.setAttribute("title", "Collapse");
        mini.addEventListener("click", miniClickListener);

        // Create FAB
        var fab = document.createElement("paper-fab");
        fab.id = "main-fab";
        fab.setAttribute("icon", "av:play-arrow");
        fab.setAttribute("position", "right");

        // Create container
        var container = document.createElement("div");
        container.id = "timer-container";

        API.storage.settings.get(["mini", "alwaysOnTop"]).then(function(storage) {
            if (storage.mini) {
                container.classList.add("mini");
                mini.setAttribute("title", mini.getAttribute("i18n2"));
            }
            if (storage.alwaysOnTop) {
                pin.click();
                pin.setAttribute("title", pin.getAttribute("i18n2"));
            }
        });

        // Create timer text
        var time = document.createElement("div");
        time.id = "timer-text";
        time.textContent = "00:00";

        // Create settings button
        var settings = document.createElement("paper-icon-button");
        settings.id = "settings-button";
        settings.setAttribute("icon", "settings");
        settings.setAttribute("i18nTitle", "23");
        settings.setAttribute("title", "Open settings");
        settings.addEventListener("click", openSettings);

        // Create pause button
        var pause = document.createElement("paper-icon-button");
        pause.id = "pause-button";
        pause.setAttribute("icon", "av:pause");
        pause.setAttribute("i18nTitle", "38");
        pause.setAttribute("title", "Pause");
        pause.addEventListener("click", API.timer.pause);

        // Create animation helper
        var animationHelper = document.createElement("div");
        animationHelper.id = "animation-helper";
        animationHelper.style.transition = "none";

        // Create blocker element
        var blocker = document.createElement("div");
        blocker.id = "blocker";
        blocker.style.transition = "none";

        // Append elements to container
        container.appendChild(close);
        container.appendChild(pin);
        container.appendChild(mini);
        container.appendChild(settings);
        container.appendChild(pause);
        container.appendChild(time);
        container.appendChild(animationHelper);
        container.appendChild(fab);

        // Append container to body
        document.body.appendChild(blocker);
        document.body.appendChild(container);

        // Initialize the settings
        initSettings();

        // Execute load animation
        loadAnimation(callback);

        // i18n
        API.tools.i18nElement();

        fixTooltips();
    }

    // Fixes tooltips
    function fixTooltips() {
        var tooltips = document.querySelectorAll("paper-tooltip");
        for (var i = tooltips.length - 1; i >= 0; i--) {
            tooltips[i].show();
            tooltips[i].hide();
            tooltips[i].show();
            tooltips[i].hide();
            tooltips[i].show();
            tooltips[i].hide();
            tooltips[i].show();
            tooltips[i].hide();
        }
        // I know how bad it looks
    }

    // Inserts a tooltip
    /*
    function insertTooltip(where) {
        var tooltip = document.createElement("paper-tooltip");
        tooltip.textContent = where.getAttribute("tooltip") || where.getAttribute("title");
        where.appendChild(tooltip);
    }
    */

    // Disable or enable an element
    function disableElement(element, enable, allBut) {
        if (element.nodeType) {
            if (enable) {
                if (allBut && (allBut.indexOf(element) > -1)) {
                    disableElement(element);
                    return;
                }
                element.removeAttribute("disabled");
            } else {
                if (allBut && (allBut.indexOf(element) > -1)) {
                    disableElement(element, true);
                    return;
                }
                element.setAttribute("disabled", "");
            }
        } else if (element.constructor === Array || element.constructor === NodeList) {
            for (var i = element.length - 1; i >= 0; i--) {
                disableElement(element[i], enable, allBut);
            }
        }
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
        var back = settings.querySelector(".back-button");

        var elements = settings.querySelectorAll("paper-slider,paper-toggle-button,paper-icon-button");
        elements = Array.prototype.slice.call(elements);

        disableElement(elements);

        back.addEventListener("click", closeSettings);

        API.storage.settings.getAll().then(function(settings) {
            var i;
            for (i = 0; i < sliderDivs.length; i++) {
                time = sliderDivs[i].querySelector(".time");
                slider = sliderDivs[i].querySelector("paper-slider");
                if (settings[slider.name]) {
                    slider.value = settings[slider.name];
                }
                slider.setAttribute("last-value", slider.value);
                slider.addEventListener("immediate-value-change", updateSlider);
                slider.addEventListener("change", updateSlider);
            }
            for (i = 0; i < switches.length; i++) {
                if (settings[switches[i].getAttribute("name")]) {
                    switches[i].checked = settings[switches[i].getAttribute("name")];
                }
                switches[i].setAttribute("last-value", switches[i].checked);
                switches[i].addEventListener("change", updateSwitch);
            }
        });

    }

    function updateSlider(event, value) {
        var slider = event.currentTarget;
        var div = slider.parentNode;
        var time = div.querySelector(".time");

        value = value || slider.immediateValue;
        time.textContent = value;
        API.storage.settings.set(slider.name, value);
        //slider.value = value;
    }

    function updateSwitch(event) {
        var button = event.currentTarget;
        API.storage.settings.set(button.getAttribute("name"), button.checked);
    }

    // Opens the settings section
    function openSettings(event) {
        if (API.window.mini.is()) {
            getTimerContainer().classList.remove("mini");
        }
        API.window.resize("settings");
        getTimerContainer().style.height = "100%";
        var height = window.screen.avalHeight < 664 ? window.screen.avalHeight : 664;
        var target = event && event.currentTarget ? event.currentTarget : false;
        API.timer.changeStatus({
            color: "#2196f3",
            cover: true,
            time: false,
            expand: height * 2,
            close: true,
            fab: {
                position: "right",
                icon: "av:play-arrow"
            },
            callback: function() {
                getSettings().classList.add("on");
                var elements = getSettings().querySelectorAll("paper-slider,paper-toggle-button,paper-icon-button");
                elements = Array.prototype.slice.call(elements);
                var allElements = document.querySelectorAll("paper-slider,paper-toggle-button,paper-icon-button,paper-fab");
                allElements = Array.prototype.slice.call(allElements);
                disableElement(allElements, false, elements);
            }
        }, target);
    }

    // Closes the settings section
    function closeSettings() {
        var target = event && event.currentTarget ? event.currentTarget : false;
        var height = window.screen.avalHeight < 664 ? window.screen.avalHeight : 664;
        API.timer.changeStatus({
            color: "#9c27b0",
            expand: height * 2 + 10,
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
                API.storage.settings.get(["mini"]).then(function(storage) {
                    if (storage.mini) {
                        getTimerContainer().classList.add("mini");
                        API.window.resize("mini");
                    } else {
                        API.window.resize("standard");
                    }
                });
                var elements = getSettings().querySelectorAll("paper-slider,paper-toggle-button,paper-icon-button");
                elements = Array.prototype.slice.call(elements);
                var allElements = document.querySelectorAll("paper-slider,paper-toggle-button,paper-icon-button,paper-fab");
                allElements = Array.prototype.slice.call(allElements);
                disableElement(allElements, true, elements);
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

    // Gets the animation helper
    function getBlocker() {
        return document.getElementById("blocker");
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

    // Gets the pause button
    function getPauseButton() {
        return document.getElementById("pause-button");
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
        getBlocker: getBlocker,
        getTime: getTime,
        getClose: getClose,
        getPin: getPin,
        getMini: getMini,
        getSettingsButton: getSettingsButton,
        getPauseButton: getPauseButton,
        updateTime: updateTime,
        fixTooltips: fixTooltips
    };
})();
