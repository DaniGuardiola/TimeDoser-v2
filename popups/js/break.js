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
        "msg"
    ]);
    libs.load([
        "js/libslocal/popup_dom",
        "js/libslocal/popup_window"
    ], "here");
});

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

//INITIAL VARS
var pageIs = "break";
window.addEventListener("load", function() {
    libs.popup_window.resize.full();
    libs.msg.listen.start(["break_popup"]);
    libs.window.data.this.focus();
    document.onkeydown = checkKeyEscClose;
    // GARBAGE - Popup window api
    //INITIAL POSITION
    topWin = chrome.app.window.get('timer_window').getBounds().top;
    libs.window.data.this.moveTo(160, topWin);
    //POSITION RELATIVE TO TIMER WINDOW
    chrome.app.window.get('timer_window').onBoundsChanged.addListener(function() {
        libs.window.data.this.moveTo(160, chrome.app.window.get('timer_window').getBounds().top);
    });
    document.getElementById("text").innerText = chrome.i18n.getMessage("breakPopupText");
    chrome.storage.sync.get(undefined, function(stor) {
        if (stor) {
            libs.settings.data = stor.settings;
            if (libs.settings.data.skipBreak) {
                setTimeout(function() {
                    libs.popup_dom.set(["close-button"]);
                }, 500); // BUG make special close function for popups (action timer, popupOpen = false)
                setTimeout(function() {
                    // GARBAGE apinet
                    libs.msg.send.libs.call("timer_window", "window.popup.timerCollapse", ["break"]);
                    libs.window.data.this.close();
                }, 10000);
            } else {
                removeElementById("close-button");
                setTimeout(function() {
                    libs.msg.send.libs.call("timer_window", "window.popup.timerCollapse", ["break"]);
                    libs.window.data.this.close();
                }, 3000);
            }
        }
    });
});