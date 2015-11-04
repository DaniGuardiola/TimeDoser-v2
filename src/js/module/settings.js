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
