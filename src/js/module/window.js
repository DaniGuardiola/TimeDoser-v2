API.window = (function() {
    "use strict";
    // Preset sizes
    var presets = {
        standard: {
            width: 224,
            height: 112
        },
        tour: {
            width: 352,
            height: 368
        },
        settings: {
            width: 224,
            height: 196
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

    // Get window
    function get() {
        return chrome.app.window.current();
    }

    // Close
    function close() {
        get().close();
    }

    // Publish the API
    return {
        resize: resize,
        close: close
    };
})();
