window.timerWindow = chrome.app.window.get('timer_window');
window.appWindow = chrome.app.window.current();
//WINDOW VARS
popup = {
    window: {
        resize: function(n, type) {
            if (type === "tasks") {
                if (n < 0) {
                    n = 0;
                }
                height = n * 44 + 100;
                appWindow.resizeTo(400, height);
                lastResized = n;
                console.log('POPUP: [window.resize] Resizing window relative to tasks');
            } else {
                appWindow.resizeTo(400, n);
                console.log('POPUP: [window.resize] Resizing window to 400x' + n + 'px');
            }
        },
        followTimer: function() {
            appWindow.moveTo(160, timerWindow.getBounds().top);
            console.log('POPUP: [window.followTimer] Following timer window');
        },
        loadTasks: function() {
            chrome.storage.sync.get(["tasks"], function(storage) {
                document.getElementById('tasks-list').innerHTML = "";
                if (storage.tasks) {
                    if (storage.tasks[0]) {
                        console.log("Loading tasks on page");
                        for (var i = storage.tasks.length - 1; i >= 0; i--) {
                            console.log("Loading task number " + i + ":");
                            loadTaskDOM(storage.tasks[i], i);
                        }
                    }
                    //COLLAPSE TEXT-BOX
                    document.getElementById('text-box').classList.add('collapse');
                    //RESIZING, FOCUSING WINDOW AND INPUT
                    setTimeout(function() {
                        popup.window.resize(storage.tasks.length, "tasks");
                    }, 500);
                    appWindow.focus();
                    document.getElementById('input-task').focus();
                } else {
                    //COLLAPSE TEXT-BOX
                    document.getElementById('text-box').classList.add('collapse');
                    console.log("No tasks to load");
                    //RESIZING, FOCUSING WINDOW AND INPUT
                    setTimeout(function() {
                        popup.window.resize(0, "tasks");
                        appWindow.focus();
                        document.getElementById('input-task').focus();
                    }, 500);
                }
            });
        },
        checkKey: {
            escClose: function(e) {
                e = e || window.event;
                if (e.keyCode === 27) {
                    APItimedoser("window.popup.timerCollapse", [pageIs]);
                    appWindow.close();
                    console.log("POPUP: [window.checkKey.escClose] Escape detected, closing")
                }
            },
            enterTaskInput: function(e) {
                e = e || window.event;
                if (e.keyCode === 13) {
                    var value = document.getElementById('input-task').value;
                    if (value !== "" && value !== " " && value != "  ") {
                        for (var i = 0; i < tasks.length; i++) {
                            if (tasks[i].name === value) {
                                console.log("It exists");
                                var exists = true;
                            }
                        }
                        saveTask(value);
                        popup.window.resize(tasks.length, "tasks");
                        if (exists === true) {
                            document.getElementById('input-task').classList.add('collapse');
                            //CLOSE
                            setTimeout(function() {
                                APItimedoser("window.popup.timerCollapse", [pageIs]);
                                appWindow.close();
                            }, 800);
                        } else {
                            popup.window.resize(tasks.length + 1, "tasks");
                            document.getElementById('input-task').classList.add('listed');
                            //CLOSE
                            setTimeout(function() {
                                APItimedoser("window.popup.timerCollapse", [pageIs]);
                                appWindow.close();
                            }, 2000);
                        }
                        document.getElementById('text-box').classList.remove('collapse');
                        var disabledInput = document.createAttribute("disabled");
                        disabledInput.value = "true";
                        document.getElementById("input-task").setAttributeNode(disabledInput);
                        if (value.length <= 8) {
                            console.log(value.length);
                            document.getElementById('text').innerText = chrome.i18n.getMessage("firstEnterPopupText") + value + chrome.i18n.getMessage("lastEnterPopupText");
                        } else if (value.length > 8 && value.length < 15) {
                            console.log(value.length);
                            document.getElementById('text').innerText = chrome.i18n.getMessage("firstEnterPopupText") + value + chrome.i18n.getMessage("lastEnterPopupText");
                            //STYLE SMALLER
                            document.getElementById('text').style.fontSize = "42px";
                            document.getElementById('text').style.lineHeight = "39px";
                        } else if (value.length >= 15) {
                            console.log(value.length);
                            document.getElementById('text').innerText = chrome.i18n.getMessage("largeEnterPopupText");
                        }
                        //SAVE TASKS ON STORAGE
                        saveTasks();
                    }
                    console.log("POPUP: [window.checkKey.enterTaskInput] Enter detected, processing task")
                }
            }
        }
    },
    settings: {
        data: {},
        // Functions
        init: function() {
            chrome.storage.sync.set({
                "settings": {
                    alwaysOnTop: true,
                    audio: true,
                    notifications: true,
                    skipBreak: false,
                    speak: true,
                    popups: false,
                    workTime: 25,
                    breakShortTime: 5,
                    breakLongTime: 15,
                    initialized2: "ok"
                }
            }, function() {
                timedoser.tasks.init();
                console.log("API: [settings.init] Initialized settings (First time!)");
            });
        },
        change: function(id, value) {
            timedoser.settings.data[id] = value;
            timedoser.settings.save();
            console.log("API: [settings.change] Changed " + id + " value to " + value);
        },
        save: function() {
            chrome.storage.sync.set({
                "settings": timedoser.settings.data
            }, function() {
                console.log("API: [settings.save] Saved settings");
            });
        },
        load: function() {
            chrome.storage.sync.get(undefined, function(storage) {
                if (storage.settings) {
                    timedoser.settings.data = storage.settings;
                    console.log("API: [settings.load] Loaded settings");
                } else {
                    console.log("API ERROR: [settings.load] Settings not found");
                }
            });
        },
        get: function(setting) {
            chrome.storage.sync.get(undefined, function() {
                timedoser.settings.data = storage.settings;
                console.log('API: [timedoser.settings.get] Getting setting "' + setting + '"');
                return timedoser.settings.data[setting];
            });
        },
        clear: function() {
            chrome.storage.sync.clear();
            console.log("API: [settings.clear] Cleared storage (including settings)");
        }
    },
    tasks: {
        data: [],
        // Functions
        init: function() {
            chrome.storage.sync.set({
                "tasks": []
            }, function() {
                console.log("API: [tasks.init] Initialized tasks");
            });
        },
        load: function() {
            chrome.storage.sync.get(["tasks"], function(storage) {
                if (storage.tasks) {
                    timedoser.tasks.data = storage.tasks;
                }
            });
            console.log("API: [tasks.load] Loading tasks");
        },
        save: function() {
            chrome.storage.sync.set({
                "tasks": timedoser.tasks.data
            });
            console.log("API: [tasks.save] Saving tasks");
        },
        add: function(task) {
            timedoser.tasks.data.push({
                "name": task,
                "content": {}
            });
            timedoser.tasks.save();
        },
        remove: function(n) {
            chrome.storage.sync.get(["tasks"], function(storage) {
                if (storage.tasks) {
                    timedoser.tasks.data = storage.tasks;
                    timedoser.tasks.data.remove(n);
                    timedoser.tasks.save();
                    console.log("API: [tasks.remove] Removed and saved: " + timedoser.tasks.data[n].name);
                }
            });
        },
        removeByName: function(task) {
            chrome.storage.sync.get(undefined, function(storage) {
                timedoser.tasks.data = storage.tasks;
                for (var i = 0; i < timedoser.tasks.data.length; i++) {
                    if (timedoser.tasks.data[i].name === task) {
                        timedoser.tasks.remove(i);
                        console.log("API: [tasks.removeByName] task removed by name: " + task + " (tasks[" + i + "])");
                        return true;
                    }
                }
                timedoser.tasks.save();
            });
        },
        check: function(task) {
            for (var i = 0; i < timedoser.tasks.data.length; i++) {
                if (timedoser.tasks.data[i].name === task) {
                    console.log('API: [tasks.check] "' + task + '" (tasks[' + i + "]) exists");
                    return true;
                }
            }
            console.log("API: [tasks.check] " + task + " does not exist");
            return false;
        },
        setCurrent: function(task) {
            timedoser.timer.data.currentTask = task;
            console.log("API: [tasks.setCurrent] Setting currentTask value to: " + task);
        },
        doneTimer: function(task) {
            if (task) {
                timedoser.tasks.removeByName(task);
                timedoser.tasks.setCurrent(false);
                timedoser.window.popup.open("work");
                console.log("API: [tasks.doneTimer] Setting " + task + " as done and opening popup");
            } else {
                timedoser.window.popup.open("work");
                console.log('API: [tasks.doneTimer] Input is false, opening popup');
            }
        }
    }
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    console.log("HEY");
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// EXTERNAL APIs
function APItimedoser(call, args, callback) {
    console.log("APItimedoser called");
    chrome.runtime.sendMessage({
        "type": "api",
        "api": "timedoser",
        "api_subtype": "call",
        "call": call,
        "args": args
    }, function(response) {
        if (response.allCorrect) {
            console.log("APItimedoser: All correct");
            if (callback) {
                callback(response.returned);
            }
        }
    });
}

function APItimedoserData(type, data, callback) {
    console.log("APItimedoserData called");
    chrome.runtime.sendMessage({
        "type": "api",
        "api": "timedoser",
        "api_subtype": "data",
        "call": type,
        "data": data
    }, function(response) {
        if (response.allCorrect) {
            console.log("APItimedoser: All correct, data is " + response.data);
            if (callback) {
                callback(response.data);
            }
        }
    });
}

// FUNCTIONS - BUTTONS
function setCloseButton() {
    console.log('Setting close button');
    document.getElementById("close-button").addEventListener("click", function() {
        APItimedoser("window.popup.timerCollapse", [pageIs]);
        appWindow.close();
    });
}

// GARBAGE
var tasks = [],
    lastResized = 0;

// GARBAGE
function getSettings() {
    chrome.storage.sync.get(undefined, function(storage) {
        console.log("Obtaining settings");
        if (storage) {
            settings = storage.settings;
        }
    });
}

// GARBAGE - TASKS
function loadTasksDOM() {
    loadTasks();

}

function loadTaskDOM(task, i) {
    console.log(task.name);
    //DOM STUFF I NEED COFFEE
    var tasksDiv = document.getElementById('tasks-list');
    var newTaskDiv = document.createElement("div");
    var newButton = document.createElement("button");
    var newDoneButton = document.createElement("button");
    newButton.setAttribute("class", "action");
    newDoneButton.setAttribute("class", "done-button");
    newTaskDiv.setAttribute("class", "task-div");
    newTaskDiv.setAttribute("id", task.name);
    newButton.addEventListener("click", function() {
        saveTask(task.name);
        //GARBAGE START
        if (task.content.urls) {
            openWindows(task.content.urls);
        }
        //GARBAGE END
        document.getElementById('text').innerText = chrome.i18n.getMessage("largeEnterPopupText");
        document.getElementById('text-box').classList.remove('collapse');
        document.getElementById('input-task').classList.add('collapse');
        setTimeout(function() {
            APItimedoser("window.popup.timerCollapse", [pageIs]);
            appWindow.close();
        }, 800);
    });
    newDoneButton.addEventListener("click", function() {
        removeElementById(task.name);
        popup.window.followTimer();
        APItimedoser("tasks.done", task.name);
        popup.window.resize(lastResized - 1, "tasks");
        loadTasksDOM();
    });
    var newTitle = document.createElement("span");
    newTitle.setAttribute("class", "name");
    newTitle.innerText = task.name;
    newButton.appendChild(newTitle);
    newTaskDiv.appendChild(newButton);
    newTaskDiv.appendChild(newDoneButton);
    tasksDiv.appendChild(newTaskDiv);
}

function removeTask(n) {
    tasks.remove(n);
    saveTasks();
}

function removeTaskByName(name) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].name === name) {
            console.log("Deleting: " + i);
            removeTask(i);
        }
    }
}

function loadTasks() {
    console.log("Loading tasks");
    chrome.storage.sync.get(["tasks"], function(storage) {
        tasks = storage.tasks;
    });
}

function saveTasks() {
    console.log("Saving tasks to storage");
    chrome.storage.sync.set({
        "tasks": tasks
    });
}

function saveTask(what) {
    APItimedoser("tasks.setCurrent", [what]);
    APItimedoser("tasks.check", [what], function(bool) {
        if (bool) {} else {
            APItimedoser("tasks.add", [what]);
        }
    });
}

//GARBAGE
function removeElementById(id) {
    console.log("Removing " + id);
    return (elem = document.getElementById(id)).parentNode.removeChild(elem);
}
console.log('functions.js loaded');