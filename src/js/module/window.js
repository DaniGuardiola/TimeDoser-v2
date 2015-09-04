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
            height: 294
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
