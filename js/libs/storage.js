libs.storage = {
    data: {},
    // Functions
    set: function(namespace, what) {
        var a = {};
        a[namespace] = what;
        if (!libs.storage.data[namespace]) {
            libs.storage.data[namespace] = {};
        }
        libs.storage.data[namespace] = what;
        chrome.storage.sync.set(a, function() {
            console.log("[storage]: [init] Initialized storage");
        });
    },
    setValue: function(namespace, key, value) {
        if (!libs.storage.data[namespace]) {
            libs.storage.data[namespace] = {};
        }
        libs.storage.data[namespace][key] = value;
        libs.storage.save(namespace);
        console.log("[storage]: [change] Changed " + key + " value to " + value);
    },
    save: function(namespace) {
        var a = {};
        a[namespace] = libs.storage.data[namespace];
        chrome.storage.sync.set(a, function() {
            console.log("[storage]: [save] Saved storage");
        });
    },
    get: function(namespace, callback) {
        chrome.storage.sync.get(namespace, function(a) {
          if (a[namespace]) {
            libs.storage.data = a[namespace];
            if(callback){
              callback(a[namespace]);
              console.log("[storage]: [load] Running callback");
            }
            console.log("[storage]: [load] Loaded storage");
          } else {
            console.log("[storage] ERROR: [load] storage not found");
          }
        });
    },
    clear: function() {
        chrome.storage.sync.clear();
        libs.storage.data = {};
        console.log("[storage]: [clear] Cleared storage (including storage)");
    }
};