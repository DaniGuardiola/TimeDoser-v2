libs.settings = {
    data: {
        alwaysOnTop: false,
        audio: true,
        notifications: true,
        skipBreak: true,
        speak: false,
        popups: false,
        workTime: 25,
        breakShortTime: 5,
        breakLongTime: 15
    },
    // Functions
    init: function() {
        chrome.storage.sync.set({
            "settings": {
                alwaysOnTop: false,
                audio: true,
                notifications: true,
                skipBreak: true,
                speak: false,
                popups: true,
                workTime: 25,
                breakShortTime: 5,
                breakLongTime: 15,
                initA0003: true
            }
        }, function() {
            libs.settings.data = {
                alwaysOnTop: false,
                audio: true,
                notifications: true,
                skipBreak: true,
                speak: false,
                popups: true,
                workTime: 25,
                breakShortTime: 5,
                breakLongTime: 15,
                initA0003: true
            };
            console.log("[settings]: [init] Initialized settings (First time!)");
        });
    },
    change: function(id, value) {
        libs.settings.data[id] = value;
        libs.settings.save();
        console.log("[settings]: [change] Changed " + id + " value to " + value);
    },
    save: function() {
        chrome.storage.sync.set({
            "settings": libs.settings.data
        }, function() {
            console.log("[settings]: [save] Saved settings");
        });
    },
    load: function(callback) {
        chrome.storage.sync.get(undefined, function(storage) {
          if (storage.settings) {
            libs.settings.data = storage.settings;
            if(callback){
              callback(storage.settings);
              console.log("[settings]: [load] Running callback");
            }
            console.log("[settings]: [load] Loaded settings");
          } else {
            console.log("[settings] ERROR: [load] Settings not found");
          }
        });
    },
    clear: function() {
        chrome.storage.sync.clear();
        console.log("[settings]: [clear] Cleared storage (including settings)");
    }
};
libs.settings.load();