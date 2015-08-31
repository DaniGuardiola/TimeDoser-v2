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

(function transformOldSettingsAndInitNewSettings() {
    "use strict";
    API.storage.settings.getAll().then(function(storage) {

        if (!storage.hasOwnProperty("workTime")) {
            API.storage.settings.set("workTime", 25);
        }

        if (!storage.hasOwnProperty("notifications")) {
            API.storage.settings.set("notifications", true);
        }

        if (!storage.hasOwnProperty("audio")) {
            API.storage.settings.set("audio", true);
        }

        if (storage.hasOwnProperty("breakShortTime")) {
            if (!storage.hasOwnProperty("shortBreakTime")) {
                API.storage.settings.set("shortBreakTime", storage.breakShortTime);
            }
            API.storage.settings.remove("breakShortTime");

        } else if (!storage.hasOwnProperty("shortBreakTime")) {
            API.storage.settings.set("shortBreakTime", 5);
        }

        if (storage.hasOwnProperty("breakLongTime")) {
            if (!storage.hasOwnProperty("longBreakTime")) {
                API.storage.settings.set("longBreakTime", storage.breakLongTime);
            }
            API.storage.settings.remove("breakLongTime");

        } else if (!storage.hasOwnProperty("longBreakTime")) {
            API.storage.settings.set("longBreakTime", 15);
        }

    });
})();
