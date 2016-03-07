"use strict";
var API = {};
(function(){// Define the API
(function() {
    "use strict";
    window.API = {};
    // Start the app
    function start() {
        chrome.runtime.getPlatformInfo(function(info) {
            document.body.classList.add(info.os);
            if (info.os === "win") {
                document.body.classList.add("minsizebug");
            }
        });
        API.tools.i18nElement();
        API.storage.settings.get(["notFirstTime", "mini"]).then(function(storage) {
            API.dom.renderTimer(function() {
                if (storage.mini) {
                    API.window.mini.on();
                } else {
                    API.window.resize("standard");
                }
                API.timer.init();
                API.storage.settings.set("notFirstTime", false);
                /*if (!storage.notFirstTime) {
                    API.tour.start();
                    API.storage.settings.set("notFirstTime", true);
                }*/
            });
        });
    }

    // Add load listener
    window.addEventListener("load", start);
})();
API.blocker = (function() {
    "use strict";
    var pinned = false;
    var heyyou = false;

    function block() {
        document.body.classList.add("blocked");
        chrome.app.window.current().fullscreen();
        if (!API.window.isPinned()) {
            API.window.togglePin();
        } else {
            pinned = true;
        }
        window.onkeyup = function(e) {
            if (e.keyCode === 27 /* ESC */ ) {
                e.preventDefault();
            }
        };
        window.onkeydown = function(e) {
            if (e.keyCode === 27 /* ESC */ ) {
                e.preventDefault();
                //unblock();
            }
        };
        hey();
    }

    function hey() {
        console.log("heyyyy");
        API.window.get().focus();
        heyyou = setTimeout(hey, 50);
    }

    function heystop() {
        clearTimeout(heyyou);
        heyyou = false;
    }

    function unblock() {
        document.body.classList.remove("blocked");
        chrome.app.window.current().restore();
        if (!pinned) {
            API.window.togglePin();
        }
        pinned = false;
        heystop();
    }

    function isBlocked() {
        return document.body.classList.contains("blocked");
    }

    return {
        block: block,
        unblock: unblock,
        isBlocked: isBlocked
    };
})();
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
API.notifications = (function() {
    "use strict";

    // Work preset
    function work() {
        create("work", {
            type: "basic",
            title: chrome.i18n.getMessage("msg3"),
            message: chrome.i18n.getMessage("msg4"),
            iconUrl: "/meta/icon-128.png"
                // iconUrl: "/img/work.png"
        });
        setTimeout(function() {
            clear("work");
        }, 10000);
    }

    // Break preset
    function breakNotification() {
        create("break", {
            type: "basic",
            title: chrome.i18n.getMessage("msg5"),
            message: chrome.i18n.getMessage("msg6"),
            iconUrl: "/meta/icon-128.png"
                // iconUrl: "/img/break.png"
        });
        setTimeout(function() {
            clear("break");
        }, 10000);
    }

    function create(id, opt) {
        chrome.notifications.clear(id);
        chrome.notifications.create(id, opt);
    }

    function clear(id) {
        chrome.notifications.clear(id);
    }

    return {
        "create": create,
        "work": work,
        "break": breakNotification
    };
})();
API.settings = (function() {
    "use strict";

    // Init local settings object
    var local = {};

    // Default settings
    var defaultValues = {
        "workTime": 25,
        "shortBreakTime": 5,
        "longBreakTime": 15,
        "workTimeAmount": 4,
        "notifications": true,
        "audio": true,
        "expandOnTimeEnd": true,
        "topOnTimeEnd": true
    };

    // Last time updated
    var time = 0;

    // Get setting value
    function get(key) {
        if (!local.hasOwnProperty(key)) {
            throw "Setting " + key + " does not exist";
        }
        return local[key].value;
    }

    // Get all local settings
    function getAll() {
        return local;
    }

    // Update local setting value and time
    function update(key, value) {
        local[key] = {
            value: value,
            time: Date.now()
        };
    }

    // Update local setting time
    function updateTime(key) {
        local[key].time = Date.now();
    }

    // Update all local settings from storage
    function pull() {
        API.storage.settings.getAll().then(function(storage) {
            for (var key in storage) {
                update(key, storage[key]);
            }

            // Update last sync time
            time = Date.now();
        });
    }

    // Update storage settings from local
    function push() {
        var settings = getAll();
        var setting;
        var pendingUpdateTime = [];

        // Object with changes to update
        var set = {};

        for (var key in settings) {
            setting = settings[key];

            // If the setting time is greater than the last synced time,
            // it has changed and needs to be updated on storage
            if (setting.time > time) {
                set[key] = setting.value;
                pendingUpdateTime.push(key);
            }
        }

        // Update on storage
        API.storage.settings.set(set);

        // Update last sync time
        for (var i = 0; i < pendingUpdateTime.length; i++) {
            updateTime(pendingUpdateTime[i]);
        }

        // Update last sync time
        time = Date.now();
    }

    // Inits the settings when added on updates
    // or on first time run
    function initSettings() {
        for (var key in defaultValues) {
            // Check if setting exists
            if (!local.hasOwnProperty(key)) {
                // If not, initialize with default value
                update(key, defaultValues[key]);
            }
        }

        push();
    }

    // Inits the API
    function init() {
        pull();
        initSettings();
    }

    // Initialize the API
    init();

    // Publish API methods
    return {
        push: push,
        get: get,
        getAll: getAll
    };
})();
API.storage = (function() {
    "use strict";

    function getChromeStorageApi() {
        function getStoragePromise(type, storageCache, promises, key) {
            if (!promises[key]) {
                promises[key] = new Promise(function(resolve) {
                    chrome.storage[type].get(key, function(storage) {
                        var storageValue = storage[key];
                        storageCache[key] = storageValue;
                        resolve(storageValue);
                    });
                });
            }
            return promises[key];
        }

        function getStorage(type, storageCache, promises, allFetched, keysParameter) {
            if (typeof keysParameter === "string") {
                if (allFetched) {
                    return Promise.resolve();
                } else {
                    return getStoragePromise(type, storageCache, promises, keysParameter);
                }
            } else {
                if (allFetched) {
                    return Promise.resolve({});
                } else {
                    var keyPromises = keysParameter.map(function(key) {
                        return getStoragePromise(type, storageCache, promises, key);
                    });
                    return Promise.all(keyPromises).then(function() {
                        var storageObjectToReturn = {};
                        keysParameter.forEach(function(key) {
                            storageObjectToReturn[key] = storageCache[key];
                        });
                        return storageObjectToReturn;
                    });
                }
            }
        }

        function getAll(type, storageCache, allFetched) {
            return new Promise(function(resolve) {
                if (allFetched) {
                    resolve(storageCache);
                } else {
                    chrome.storage[type].get(undefined, function(storage) {
                        allFetched = true;
                        storageCache = storage;
                        resolve(storage);
                    });
                }
            });
        }

        function setStorage(type, storageCache, promises, keysParameter, newValue) {
            var storageChangesObject = {};
            if (typeof keysParameter === "string") {
                storageChangesObject[keysParameter] = newValue;
                storageCache[keysParameter] = newValue;
                if (!promises[keysParameter]) {
                    promises[keysParameter] = Promise.resolve(newValue);
                }
            } else {
                storageChangesObject = keysParameter;
                Object.keys(storageChangesObject).forEach(function(key) {
                    var newValue = storageChangesObject[key];
                    storageCache[key] = newValue;
                    promises[key] = Promise.resolve(newValue);
                });
            }
            chrome.storage[type].set(storageChangesObject);
        }

        function removeStorage(type, storageCache, allFetched, keys) {
            /* check if a key or multiple keys are provided, or if the storage hasn't been cleared already */
            if (
                keys === undefined ||
                (allFetched && Object.keys(storageCache).length === 0) ||
                (Array.isArray(keys) && keys.length === 0)
            ) {
                return;
            }
            chrome.storage[type].remove(keys);
        }

        function clearStorage(type, storageCache, allFetched) {
            if (!allFetched) {
                allFetched = true;
            }
            if (Object.keys(storageCache).length > 0) {
                storageCache = {};
                chrome.storage[type].clear();
            }
        }

        function createChromeStorageObject(type) {
            var promises = {};
            var storageCache = {};
            var allFetched = false;

            return Object.create(null, {
                "get": {
                    "value": function(keys) {
                        return getStorage(type, storageCache, promises, allFetched, keys);
                    }
                },
                "getAll": {
                    "value": function() {
                        return getAll(type, allFetched);
                    }
                },
                "set": {
                    "value": function(keys, newValue) {
                        setStorage(type, storageCache, promises, keys, newValue);
                    }
                },
                "remove": {
                    "value": function(keys) {
                        removeStorage(type, storageCache, allFetched, keys);
                    }
                },
                "clear": {
                    "value": function() {
                        clearStorage(type, storageCache, allFetched);
                    }
                }
            });
        }

        return {
            "sync": createChromeStorageObject("sync"),
            "local": createChromeStorageObject("local"),
            "managed": createChromeStorageObject("managed"),
            "available": !!(window.chrome && chrome.storage)
        };
    }

    var storageApi = getChromeStorageApi();

    return {
        cache: storageApi.local,
        settings: storageApi.sync,
        managed: storageApi.managed
    };
})();
API.timer = (function() {
    "use strict";
    // Data
    var data = {
        status: "none",
        pause: false,
        changingStatus: false,
        countdownTimeout: false,
        time: {
            minute: 0,
            second: 0,
            break: 0
        }
    };

    // Temporal stuff
    var tmp = {};

    // Animates a status change
    // TODO: refactor to make more generic
    function statusChangeAnimation(opt, target) {
        // Default values
        opt.color = opt.color || "#9c27b0";
        opt.cover = opt.cover || false;
        opt.time = opt.time !== null ? opt.time : false;
        opt.close = opt.close !== null ? opt.close : true;
        opt.settings = opt.settings !== null ? opt.settings : true;
        opt.pause = opt.pause !== null ? opt.pause : true;
        opt.fab = opt.fab || {};
        opt.fab.fadein = opt.fab.fadein || false;
        opt.fab.position = opt.fab.position || "left";
        opt.fab.icon = opt.fab.icon || "av:play-arrow";
        opt.fab.hide = opt.fab.hide || false;
        opt.callback = opt.callback || function() {
            data.changingStatus = false;
        };

        // Save opt in tmp
        tmp.opt = opt;

        // Get the fab, the helper and the time
        var fab = API.dom.getFAB();
        var helper = API.dom.getAnimationHelper();
        var time = API.dom.getTime();
        var close = API.dom.getClose();
        var pin = API.dom.getPin();
        var mini = API.dom.getMini();
        var settings = API.dom.getSettingsButton();
        var pause = API.dom.getPauseButton();

        // Set target
        target = target || fab;

        // Set expansion size
        var expand = opt.expand || 360;

        // Calculate FAB position
        var position = {
            height: target.getBoundingClientRect().height,
            width: target.getBoundingClientRect().width,
            top: target.getBoundingClientRect().top,
            left: target.getBoundingClientRect().left
        };
        position = {
            top: position.top + (position.height / 2),
            left: position.left + (position.width / 2)
        };

        // Set helper color and initial position and size
        helper.style.top = position.top + "px";
        helper.style.left = position.left + "px";
        helper.style.height = helper.style.width = "0";
        helper.style.backgroundColor = opt.color;

        // Enable transition again
        helper.style.transition = "";

        // Set FAB .cover
        if (opt.cover) {
            helper.classList.add("cover");
        } else {
            helper.classList.remove("cover");
        }

        // Prepare fab fadein
        if (opt.fab.fadein) {
            fab.style.transition = "none";
        }

        // Activate helper
        helper.classList.add("on");

        // Hide time, close, pin and mini button
        time.classList.remove("on");
        close.classList.remove("on");
        pin.classList.remove("on");
        mini.classList.remove("on");
        settings.classList.remove("on");
        pause.classList.remove("on");

        // Set FAB icon
        fab.setAttribute("icon", opt.fab.icon);

        // Use timeout to force transition
        setTimeout(function() {
            // Listen to transitionend
            helper.addEventListener("transitionend", animationHelperTransitionend);

            // Set final position and size
            helper.style.top = (position.top - (expand / 2)) + "px";
            helper.style.left = (position.left - (expand / 2)) + "px";
            helper.style.height = helper.style.width = expand + "px";
        }, 20);
    }

    // Animator helper transitionend listener
    function animationHelperTransitionend() {
        // Get helper, FAB and time
        var helper = API.dom.getAnimationHelper();
        var fab = API.dom.getFAB();
        var time = API.dom.getTime();
        var close = API.dom.getClose();
        var pin = API.dom.getPin();
        var mini = API.dom.getMini();
        var settings = API.dom.getSettingsButton();
        var pause = API.dom.getPauseButton();

        // Get opt from tmp
        var opt = tmp.opt;

        // Set fab fadein
        if (opt.fab.fadein) {
            fab.classList.remove("on");
            setTimeout(function() {
                fab.style.transition = "";
                fab.classList.add("on");
            }, 200);
        }

        // Remove this event listener
        helper.removeEventListener("transitionend", animationHelperTransitionend);

        // Set the status attribute on body
        document.body.setAttribute("status", getStatus());

        // Reset helper
        helper.classList.remove("on");
        helper.style.transition = "none";
        helper.style.top = helper.style.left = helper.style.height = helper.style.width = "";

        // Set FAB position
        fab.setAttribute("position", opt.fab.position);

        // Show time (baby)
        if (opt.time) {
            time.classList.add("on");
        }

        // Show close button
        if (opt.close) {
            close.classList.add("on");
        }
        pin.classList.add("on");
        mini.classList.add("on");

        // Show settings button
        if (opt.settings) {
            settings.classList.add("on");
        }

        // Show pause button
        if (opt.pause) {
            pause.classList.add("on");
        }

        // Remove opt from tmp
        delete tmp.opt;

        // Execute the callback
        opt.callback();
    }

    // Sets the standby status
    function setStandbyStatus() {
        stop(null, true);
        document.title = API.tools.i18n("appname");
        data.changingStatus = true;
        data.status = "standby";
        data.pause = false;
        var expand = API.window.mini.is() ? 140 : false;
        API.storage.settings.get(["mini"]).then(function(storage) {
            statusChangeAnimation({
                color: "#9c27b0",
                time: false,
                expand: expand,
                close: true,
                settings: true,
                pause: false,
                callback: function() {
                    document.body.removeAttribute("loading");
                    API.dom.getPauseButton().setAttribute("icon", "av:pause");
                    data.changingStatus = false;
                },
                fab: {
                    position: "right",
                    icon: "av:play-arrow"
                }
            }, storage.mini ? document.getElementById("timer-text") : null);
        });
    }

    // Sets the work status
    function setWorkStatus() {
        data.changingStatus = true;
        data.status = "work";
        if (API.blocker.isBlocked()) {
            API.blocker.unblock();
        }
        API.storage.settings.get(["notifications"]).then(function(storage) {
            if (storage.notifications) {
                API.notifications.work();
            }
        });
        API.storage.settings.get(["audio"]).then(function(storage) {
            if (storage.audio) {
                document.getElementById("audio-work").play();
            }
        });
        var expand = API.window.mini.is() ? 140 : false;
        statusChangeAnimation({
            color: "#3f51b5",
            time: true,
            expand: expand,
            close: false,
            settings: false,
            pause: true,
            fab: {
                position: "left",
                icon: "av:stop"
            },
            callback: function() {
                API.storage.settings.get(["workTime"]).then(function(storage) {
                    if (window.MUSIC_PLEASE) {
                        setTime(0, 1);
                    } else {
                        setTime(storage.workTime, 0);
                    }
                    data.changingStatus = false;
                    countdown();
                });
            }
        }, document.getElementById("timer-container").classList.contains("mini") ? document.getElementById("timer-text") : null);
    }

    // Sets the break status
    function setBreakStatus() {
        data.changingStatus = true;
        data.status = "break";
        API.storage.settings.get(["notifications"]).then(function(storage) {
            if (storage.notifications) {
                API.notifications.break();
            }
        });
        API.storage.settings.get(["audio"]).then(function(storage) {
            if (storage.audio) {
                document.getElementById("audio-break").play();
            }
        });
        var expand = API.window.mini.is() ? 140 : false;
        statusChangeAnimation({
            color: "#009688",
            expand: expand,
            time: true,
            close: true,
            settings: false,
            pause: true,
            fab: {
                position: "left",
                icon: "av:skip-next"
            },
            callback: function() {
                API.blocker.block();
                API.storage.settings.get(["shortBreakTime", "longBreakTime", "workTimeAmount"]).then(function(storage) {
                    if (window.MUSIC_PLEASE) { // Easter egg
                        setTime(0, 1);
                        data.changingStatus = false;
                        countdown();
                    } else {
                        API.storage.cache.get(["workTimeCount"]).then(function(cache) {
                            var plus = {
                                minute: Math.floor(data.time.break / 60),
                                second: data.time.break % 60
                            };
                            data.time.break = 0;
                            if (+cache.workTimeCount < storage.workTimeAmount - 1) {
                                setTime(storage.shortBreakTime + plus.minute, plus.second);
                                API.storage.cache.set("workTimeCount", +cache.workTimeCount + 1);
                            } else {
                                setTime(storage.longBreakTime + plus.minute, plus.second);
                                API.storage.cache.set("workTimeCount", 0);
                            }
                            countdown();
                            data.changingStatus = false;
                        });
                    }
                });
            }
        }, document.getElementById("timer-container").classList.contains("mini") ? document.getElementById("timer-text") : null);
    }

    // Routes the status input to the appropiate function
    function setStatus(status) {
        if (data.changingStatus) {
            console.error("Status change in progress");
            return;
        }
        if (getStatus() === status) {
            console.error("\"" + status + "\" is the current status");
            return;
        }
        if (status === "standby") {
            setStandbyStatus();
        } else if (status === "work") {
            setWorkStatus();
        } else if (status === "break") {
            setBreakStatus();
        } else {
            console.error("Unknown status \"" + status + "\"");
        }
    }

    // Gets the status
    function getStatus() {
        return data.status;
    }

    // FAB click listener
    function FABClickListener() {
        if (getStatus() === "standby") {
            setStatus("work");
        } else if (getStatus() === "work") {
            setStatus("standby");
        } else if (getStatus() === "break") {
            fastCountdown("work", true);
        }
    }

    // Initializes the timer
    function init() {
        // Initial status
        setStatus("standby");

        // Attach click listener to FAB
        API.dom.getFAB().addEventListener("click", FABClickListener);

        // Temporal debug fix
        var helper = API.dom.getAnimationHelper();
        helper.style.height = helper.style.width = "0";
    }

    // Sets the time
    function setTime(minute, second) {
        var failed = false;
        if (typeof minute !== "number" || isNaN(minute)) {
            console.error("The \"minute\" parameter is not a valid number");
            failed = true;
        }
        if (typeof second !== "number" || isNaN(second)) {
            console.error("The \"second\" parameter is not a valid number");
            failed = true;
        }
        if (failed) {
            return;
        }
        data.time.minute = minute;
        data.time.second = second;
        API.dom.updateTime(minute, second);
    }

    var attentionSeconds = -1;

    // Attention
    function attention(seconds) {
        if (seconds) {
            attentionSeconds = seconds;
        }
        API.storage.settings.get(["alwaysOnTop", "mini", "topOnTimeEnd"]).then(function(storage) {
            if (attentionSeconds > 0) {
                if (storage.topOnTimeEnd) {
                    API.window.get().setAlwaysOnTop(true);
                    API.window.get().drawAttention();
                    API.window.get().clearAttention();
                }
                attentionSeconds--;
                return;
            } else if (attentionSeconds === 0) {
                API.window.get().setAlwaysOnTop(storage.alwaysOnTop ? true : false);
                if (storage.mini && !API.window.mini.is()) {
                    API.window.mini.on();
                }
                attentionSeconds = false;
            }
        });
    }

    // Recurrent countdown
    function countdown(next) {
        // Parameter default value
        next = next || false;

        var attentionTime = false;

        // If second < 0, -1 minute
        if (data.time.second < 0) {
            data.time.second = 59;
            data.time.minute--;
        }

        // Update time element
        API.dom.updateTime(data.time.minute, data.time.second);

        if (data.time.minute === 0 && data.time.second === 3) {
            attentionTime = 8;
            API.storage.settings.get(["expandOnTimeEnd"]).then(function(storage) {
                if (storage.expandOnTimeEnd && API.window.mini.is()) {
                    API.window.resize("standard");
                    API.dom.getTimerContainer().classList.remove("mini");
                }
            });
        }

        // If countdown reaches the end
        if (data.time.minute === 0 && data.time.second === 0) {
            // If there's a next status parameter
            if (next) {
                setStatus(next);
                // Normal behavior
            } else {
                if (getStatus() === "work") {
                    setStatus("break");
                } else if (getStatus() === "break") {
                    setStatus("work");
                }
            }
            // If not
        } else {
            // -1 second
            data.time.second--;
            data.countdownTimeout = setTimeout(function() {
                countdown(next);
            }, 1000);
        }
        attention(attentionTime);
    }

    // Fast countdown (for skipping breaks, for example)
    function fastCountdown(next, startNow) {
        var minute = data.time.minute;
        var second = data.time.second;
        next = next || "work";

        if (startNow) {
            stop();
            data.time.break = data.time.break+(minute * 60) + second;
            if (data.time.break > (20 * 60)) {
                data.time.break = 20 * 60;
            }
            console.log(data.time.break);
        }
        if (minute > 10) {
            data.time.second = second - 41;
            setTimeout(function() {
                fastCountdown(next);
            }, 10);

        } else if (minute > 3) {
            data.time.second = second - 31;
            setTimeout(function() {
                fastCountdown(next);
            }, 20);

        } else if (minute > 0) {
            data.time.second = data.time.second - 13;
            setTimeout(function() {
                fastCountdown(next);
            }, 40);

        } else if (second > 20) {
            data.time.second = second - 6;
            setTimeout(function() {
                fastCountdown(next);
            }, 70);

        } else if (second > 8) {
            data.time.second = second - 3;
            setTimeout(function() {
                fastCountdown(next);
            }, 70);

        } else {
            data.time.second = second - 1;

            // End actions
            if (minute === 0 && second === 1) {
                countdown(next);
            } else {
                setTimeout(function() {
                    fastCountdown(next);
                }, 120);
            }
        }
        if (data.time.second < 0) {
            data.time.second = 60 + data.time.second;
            data.time.minute--;
        }

        console.log(data.time.second);

        // Update time element
        API.dom.updateTime(data.time.minute, data.time.second);
    }

    // Stops the timer
    function stop(callback, resetStats) {
        clearTimeout(data.countdownTimeout);
        attention(0);
        if (resetStats) {
            API.storage.cache.set("workTimeCount", 0);
            data.time.break = 0;
        }
        if (callback) {
            callback();
        }
    }

    // Pause the timer
    function pause() {
        if (getStatus() === "work" || getStatus() === "break") {
            var button = API.dom.getPauseButton();
            if (data.pause === true) {
                button.setAttribute("icon", "av:pause");
                data.time.second++;
                countdown();
                data.pause = false;
            } else {
                button.setAttribute("icon", "av:play-arrow");
                stop();
                data.pause = true;
            }
        }
    }

    return {
        setStatus: setStatus,
        getStatus: getStatus,
        changeStatus: statusChangeAnimation,
        init: init,
        data: data,
        setTime: setTime,
        countdown: countdown,
        stop: stop,
        pause: pause
    };
})();
API.tools = (function() {
    "use strict";
    // Gets a localized string
    function i18n(message) {
        return chrome.i18n.getMessage(message);
    }

    // Gets a localized message
    function i18nMsg(message) {
        return i18n("msg" + message);
    }

    // Localizes element and subelements
    function i18nElement(element) {
        var from = document;
        if (element && element.nodeType) {
            if (element.hasAttribute("msg") ||
                element.hasAttribute("i18nTitle") ||
                element.hasAttribute("i18n1") ||
                element.hasAttribute("i18n2")) {

                if (element.hasAttribute("msg")) {
                    element.innerText = i18nMsg(element.getAttribute("msg"));
                }

                if (element.hasAttribute("i18nTitle")) {
                    element.setAttribute("title", i18nMsg(element.getAttribute("i18nTitle")));
                }

                if (element.hasAttribute("i18n1")) {
                    element.setAttribute("i18n1", i18nMsg(element.getAttribute("i18n1")));
                }

                if (element.hasAttribute("i18n2")) {
                    element.setAttribute("i18n2", i18nMsg(element.getAttribute("i18n2")));
                }

                element.classList.add("i18nDone");
                return;
            } else {
                from = element;
            }
        }

        var elements = from.querySelectorAll("[msg]:not(.i18nDone),[i18nTitle]:not(.i18nDone),[i18n1]:not(.i18nDone),[i18n2]:not(.i18nDone)");
        for (var i = elements.length - 1; i >= 0; i--) {
            i18nElement(elements[i]);
        }
    }

    // Publish API
    return {
        i18n: i18n,
        i18nMsg: i18nMsg,
        i18nElement: i18nElement
    };
})();
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
API.window = (function() {
    "use strict";
    // Preset sizes
    var presets = {
        standard: {
            width: 224,
            height: 112
        },
        mini: {
            width: 100,
            height: 100
        },
        tour: {
            width: 352,
            height: 368
        },
        settings: {
            width: 224,
            height: 664
        }
    };

    // Resizes the window based on pixels
    function resizePx(width, height) {
        get().resizeTo(width, height);
    }

    // Resizes the window based on one of the presets
    function resize(preset) {
        if (!presets[preset]) {
            console.error("The resize preset \"" + preset + "\" does not exist");
            return;
        }
        resizePx(presets[preset].width, presets[preset].height);
    }

    // Toggles the window on top option
    function togglePin() {
        get().setAlwaysOnTop(!isPinned());
        get().setVisibleOnAllWorkspaces(!isPinned());
        API.storage.settings.set("alwaysOnTop", !isPinned());
        return !isPinned();
    }

    // Checks if the window on top option is enabled
    function isPinned() {
        return get().isAlwaysOnTop();
    }

    // Get window
    function get() {
        return chrome.app.window.current();
    }

    // Close
    function close() {
        get().close();
    }

    function miniOn() {
        resize("mini");
        API.dom.getTimerContainer().classList.add("mini");
        API.storage.settings.set("mini", true);
    }

    function miniOff() {
        resize("standard");
        API.dom.getTimerContainer().classList.remove("mini");
        API.storage.settings.set("mini", false);
    }

    function isMini() {
        return API.dom.getTimerContainer().classList.contains("mini");
    }

    // Publish the API
    return {
        get: get,
        resize: resize,
        close: close,
        isPinned: isPinned,
        togglePin: togglePin,
        mini: {
            on: miniOn,
            off: miniOff,
            is: isMini
        }
    };
})();
}());