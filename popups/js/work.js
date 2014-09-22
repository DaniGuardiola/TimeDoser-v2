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
        "window",
        "msg"
    ]);
    libs.load([
        "js/libslocal/popup_dom",
        "js/libslocal/popup_window"
    ], "here");
});

console.log('Alive!');

//INITIAL VARS
var pageIs = "work";
var lastI = false;
//var inTheMiddle = false;

// GARBAGE escClose
function checkKeyEscClose(e) {
    e = e || window.event;
    if (e.keyCode === 27) {
        libs.msg.send.libs.data("timer_window", "timer", "status", function(status) {
            libs.msg.send.libs.call("timer_window", "window.popup.timerCollapse", [status]);
            libs.window.data.this.close();
        });
    }
}

//WINDOW ON LOAD
window.addEventListener("load", function() {
    libs.popup_window.resize.full()
    document.getElementById("text").innerText = chrome.i18n.getMessage("workPopupText");
    libs.msg.listen.start(["work_popup"]);
    libs.window.data.this.focus();
    document.onkeydown = checkKeyEscClose;
    setTimeout(function() {
        //libs.popup_dom.set(["close-button"]);
    }, 500);
    popup.window.followTimer();
    //INITIAL POSITION
    topWin = chrome.app.window.get('timer_window').getBounds().top;
    libs.window.data.this.moveTo(160, topWin);
    //POSITION RELATIVE TO TIMER WINDOW
    chrome.app.window.get('timer_window').onBoundsChanged.addListener(function() {
        libs.window.data.this.moveTo(160, chrome.app.window.get('timer_window').getBounds().top);
    });
    setTimeout(function() {
        libs.msg.send.libs.data("timer_window", "timer", "status", function(status) {
            libs.msg.send.libs.call("timer_window", "window.popup.timerCollapse", [status]);
            libs.window.data.this.close();
        });
    }, 3000);
    
    /*
    loadTasks();

    //I18N
    chrome.storage.sync.get(undefined, function(storage) {
        console.log("Obtaining donePopup");
        if (storage) {
            if (storage.donePopup) {
                document.getElementById("text").innerText = chrome.i18n.getMessage("donePopupText");
            } else {
                document.getElementById("text").innerText = chrome.i18n.getMessage("workPopupText");
            }
        }
    });
    popup.window.followTimer();
    chrome.storage.sync.set({
        "donePopup": false
    });
    document.getElementById('input-task').placeholder = chrome.i18n.getMessage("inputPopupText");
    //RESIZING AND CLOSE BUTTON
    popup.window.resize(0, "tasks");
    setTimeout(setCloseButton, 500);
    //INPUT KEYDOWN
    document.getElementById('input-task').onkeydown = popup.window.checkKey.enterTaskInput;
    document.onkeydown = popup.window.checkKey.escClose;
    //LOAD TASKS TIMEOUT
    setTimeout(function() {
        loadTasksDOM(pageIs);
    }, 1500);
    //GARBAGE START
    chrome.storage.sync.get(["inTheMiddle"], function(storage) {
        inTheMiddle = storage.inTheMiddle;
        chrome.storage.sync.set({
            "inTheMiddle": false
        });
    });
    //GARBAGE END
    */
});

//CLOSE TIMEOUT
setTimeout(function() {
    APItimedoser("window.popup.timerCollapse", [pageIs]);
    appWindow.close();
}, 180000);