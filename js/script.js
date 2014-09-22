// Lib loader
var libloader = document.createElement('script');
libloader.setAttribute("type", "text/javascript");
libloader.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/js/libs/libs.js");
if (typeof libloader != "undefined") {
    document.getElementsByTagName("head")[0].appendChild(libloader);
}
libloader.addEventListener("load", function() {
    libs.load([
        "dom",
        "settings",
        "window",
        "tasks",
        "notifications",
        "tools",
        "msg"
    ]);
    libs.load([
        "js/libslocal/timer_window_dom",
        "js/libslocal/timer"
    ], "here");
});

//INITIAL VARS
var movingTimeout;

// Commands
chrome.commands.onCommand.addListener(function(command) {
    console.log("CHROME.COMMANDS: Command detected: " + command);

    if (command === "pause-command") {
        libs.timer.switchPause();

    } else if (command === "done-command") {
        //libs.timer_window_dom.actions.doneTimer(libs.timer.data.currentTask);

    } else if (command === "start-stop-command") {
        //GARBAGE [implement start-stop function in api]
        if (libs.timer.data.status === "standby") {
            //GARBAGE [integrate standby-start on api]
            libs.window.resize("large");
            libs.timer.data.pause = false;
            if (libs.settings.data.popups) {
                document.getElementById('standby-button').classList.add("left-middle");
            } else {
                document.getElementById('standby-button').classList.add("left");
            }
            document.getElementById('option-buttons-box').classList.add("hide");
            setTimeout(function() {
                libs.timer.loadStatus("work");
                document.getElementById('option-buttons-box').classList.remove("hide");
            }, 300)
        } else if (libs.timer.data.status === "work" || libs.timer.data.status === "break") {
            libs.timer.stop();
        }

    } else if (command === "alwaysOnTop-command") {
        if (libs.settings.data.alwaysOnTop) {
            document.getElementById('pin-button').classList.remove("on");
            libs.window.data.this.setAlwaysOnTop(false);
            libs.settings.change("alwaysOnTop", false);
        } else {
            document.getElementById('pin-button').classList.add("on");
            libs.window.data.this.setAlwaysOnTop(true);
            libs.settings.change("alwaysOnTop", true);
        }
        libs.window.data.this.focus();
    }
});


//WINDOW ON LOAD
window.addEventListener("load", function() {
    // If first run, initialize settings
    chrome.storage.sync.get(undefined, function(storage) {
        if (storage.settings) {
            console.log(storage.settings);
            var initNow = storage.settings.initA0003;
            if (initNow) {
                libs.settings.data = storage.settings;
                libs.tasks.load();
            } else {
                libs.settings.init();
                libs.tasks.init();
            }
        } else {
            libs.settings.init();
            libs.tasks.init();
        }
        // Loading page
        libs.timer.loadStatus("standby");
    });
    libs.msg.listen.start(["timer_window"]);
    // Window always on left
    libs.window.data.this.onBoundsChanged.addListener(function() {
        if (libs.window.data.this.getBounds().left !== 0) {
            clearTimeout(movingTimeout);
            movingTimeout = setTimeout(function() {
                libs.window.sendToLeft();
            }, 150);
        }
    });
    libs.window.sendToLeft();
});

console.log("[timer_window] Javascript loaded");