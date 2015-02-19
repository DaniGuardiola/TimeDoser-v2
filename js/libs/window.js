// Dependencies
libs.load([
    //"settings"
]);

var idleCollapseTimeout;
libs.window = {
    data: {
        this: chrome.app.window.current(),
        collapsed: false,
        popupOpen: false
    },
    resizePx: function(px) {
        libs.window.data.this.resizeTo(px, 100);
        console.log("[window]: [resizePx] Window width resized: " + px + "px");
        return true;
    },
    resize: function(to) {
        if (to === "collapse") {
            var px = 100;
            libs.window.data.collapsed = true;
        } else if (to === "large") {
            var px = 160;
            libs.window.data.collapsed = false;
        } else {
            console.log('[window] ERROR: [resize] Unknown argument "' + to + '"');
            return false;
        }
        libs.window.resizePx(px);
        console.log("[window]: [resize] Window resized to: " + to);
        return true;
    },
    sendToLeft: function() {

        dibd = window.screen;
 
        //Snap to edge: shift left if distance to left < 100px, etc.
        dL = window.screenX - dibd.availLeft;
        dT = window.screenY - dibd.availTop;

        //This works on my setup with monitors using multiple DPIs, but it may not work everywhere. 
        availHeight = (dibd.availHeight + dibd.height) / 2;
        //availHeight = dibd.availHeight;
        
        dR = (dibd.availLeft + dibd.availWidth) - (window.screenX + window.outerWidth);
        dB = (dibd.availTop + availHeight) - (window.screenY + window.outerHeight);
        targetL = window.screenX;
        targetT = window.screenY;


        CLOSE = 50; 
        if (dL < CLOSE)
            targetL = targetL - dL; 
        if (dR < CLOSE)
            targetL = targetL + dR;
        if (dT < CLOSE)
            targetT = targetT - dT;
        if (dB < CLOSE)
            targetT = targetT + dB;


        console.log("[window]: [sendToLeft] Moving " + window.outerWidth + "x" + window.outerHeight + " window from X=" + window.screenX + " T=" + window.screenY + 
                    " to L=" + targetL + " T=" + targetT + "; dL=" + dL + " dR=" + dR + " dT=" + dT + " dB=" + dB);
        libs.window.data.this.outerBounds.setPosition(Math.round(targetL), Math.round(targetT))
        return true;
    },
    idleCollapse: {
        start: function(time) {
            libs.window.idleCollapse.stop();
            if (libs.window.data.collapsed && libs.window.data.popupOpen) {
                //console.log("[window]: [idleCollapse.start] Window is collapsed, or a popup is open, idle collapse is not on");
                return false;
            } else {
                libs.window.idleCollapse.action(time);
                //console.log("[window]: [idleCollapse.start] Starting idle collapse");
                return true;
            }
        },
        stop: function(restart, time) {
            clearTimeout(idleCollapseTimeout);
            if (restart) {
                libs.window.idleCollapse.start(time);
            }
            //console.log("[window]: [idleCollapse.stop] Stopping idle collapse");
            return true;
        },
        action: function(time) {
            if (libs.window.data.collapsed || libs.window.data.popupOpen) {
                //console.log("[window]: [idleCollapse.action] Window is collapsed, or a popup is open, window will not collapse");
                return false;
            } else {
                window.idleCollapseTimeout = setTimeout(function() {
                    libs.window.resize("collapse");
                    console.log("[window]: [idleCollapse.action] Collapsing window automatically");
                    return true;
                }, time);
                //console.log("[window]: [idleCollapse.action] Will collapse in " + time + " miliseconds...");
                return true;
            }
        }
    },
    popup: {
        open: function(what) {
            if (what === "break") {
                libs.window.idleCollapse.stop();
                libs.window.data.popupOpen = true;
                // GARBAGE [Speak API]
                if (libs.settings.data.speak) {
                    var locale = chrome.i18n.getMessage("tts_locale");
                    var msg = chrome.i18n.getMessage("tts_break");
                    chrome.tts.speak(
                        msg, {
                            'lang': locale,
                            'rate': 1.0
                        }
                    );
                }
                libs.window.data.this.setAlwaysOnTop(true);
                collapsed = true;
                libs.window.resize("large");
                if (libs.settings.data.skipBreak) {
                    document.getElementById("break-skip-button").classList.add("on");
                    document.getElementById("time-button").classList.add("notify-action-break");
                } else {
                    document.getElementById("time-button").classList.add("notify-action");
                }
                document.getElementById("collapse-button").classList.add("notify-action");
                document.getElementById("option-buttons-box").classList.add("notify-action");
                libs.window.popup.windowOpen(what);
                console.log("[window]: [popup.open] Opening break popup");
            } else if (what === "work") {
                libs.window.idleCollapse.stop();
                libs.window.data.popupOpen = true;
                // GARBAGE [Speak API]
                if (libs.settings.data.speak) {
                    var locale = chrome.i18n.getMessage("tts_locale");
                    var msg = chrome.i18n.getMessage("tts_work");
                    chrome.tts.speak(
                        msg, {
                            'lang': locale,
                            'rate': 1.0,
                            'enqueue': true
                        }
                    );
                }
                libs.window.data.this.setAlwaysOnTop(true);
                libs.window.resize("large");
                document.getElementById("time-button").classList.add("notify-action");
                document.getElementById("collapse-button").classList.add("notify-action");
                document.getElementById("option-buttons-box").classList.add("notify-action");
                libs.window.popup.windowOpen(what);
                console.log("[window]: [popup.open] Opening break popup");
            } else {
                console.log('[window] ERROR: [popup.open] Unknown popup name "' + what + '"');
            }
        },
        windowOpen: function(what) {
            var topWin = libs.window.data.this.getBounds().top;
            var leftWin = libs.window.data.this.getBounds().left + 160;
            chrome.app.window.create('/popups/' + what + '.html', {
                'id': what,
                'frame': 'none',
                'resizable': false,
                'alwaysOnTop': true,
                'bounds': {
                    'width': 400,
                    'height': 100,
                    'left': leftWin,
                    'top': topWin
                }
            });
            console.log("[window]: [popup.windowOpen] Opening popup window: /popups/" + what + '.html');
        },
        timerCollapse: function(what) {
            libs.window.data.popupOpen = false;
            chrome.notifications.clear(what, function() {});
            if (what === "break") {
                if (libs.settings.data.skipBreak) {
                    document.getElementById("break-skip-button").classList.remove("on");
                    document.getElementById("time-button").classList.remove("notify-action-break");
                } else {
                    document.getElementById("time-button").classList.remove("notify-action");
                }
                setTimeout(function() {
                    libs.window.resize("collapse");
                    document.getElementById("collapse-button").classList.remove("notify-action");
                    document.getElementById("option-buttons-box").classList.remove("notify-action");
                }, 500);
                libs.window.data.this.setAlwaysOnTop(libs.settings.data.alwaysOnTop ? true : false);
                console.log("[window]: [popup.timerCollapse] The break popup was closed. Collapsing and reconfiguring page");
            } else if (what === "work") {
                document.getElementById("time-button").classList.remove("notify-action");
                setTimeout(function() {
                    libs.window.resize("collapse");
                    document.getElementById("collapse-button").classList.remove("notify-action");
                    document.getElementById("option-buttons-box").classList.remove("notify-action");
                }, 500);
                libs.window.data.this.setAlwaysOnTop(libs.settings.data.alwaysOnTop ? true : false);
                console.log("[window]: [popup.timerCollapse] The work popup was closed. Collapsing and reconfiguring page");
            } else {
                console.log('[window] ERROR: [popup.timerCollapse] Unknown popup name "' + what + '"');
            }
        }
    }
};
