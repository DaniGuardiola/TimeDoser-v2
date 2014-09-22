// Dependencies
libs.load([
    //"window"
    //,"settings"
    //,"notifications"
]);

libs.timer = {
    //DATA
    data: {
        status: "standby",
        time: {
            minute: 0,
            second: 0
        },
        skipTime: {
            minute: 0,
            second: 0
        },
        pause: true,
        shortBreaksN: 0,
        currentTask: false,
        statusHTML: {
            "standby": '<div id="close-button" title="Close"></div><button id="standby-button" title="Start" class="circle-button"><paper-ripple class="recenteringTouch" fit=""></paper-ripple></button><div id="option-buttons-box" class="left"><button id="pin-button" title="Switch always on top" class="option-button"></button><button id="config-button" class="option-button"></button></div>',
            "work": '<button id="time-button" title="Pause" class="circle-button"><span id="minutes">25</span>:<span id="seconds">00</span></button><button id="collapse-button" title="Show / Hide buttons"></button><div id="option-buttons-box"><button id="pin-button" title="Switch always on top" class="option-button"></button><button id="done-button" class="option-button"></button><button id="stop-button" title="Stop" class="option-button"></button></div>',
            "break": '<div id="close-button" title="Close"></div><button id="time-button" title="Pause" class="circle-button"><span id="minutes">5</span>:<span id="seconds">00</span></button><button id="collapse-button" title="Show / Hide buttons"></button><div id="option-buttons-box"><button id="pin-button" title="Switch always on top" class="option-button"></button><button id="skip-small-button" title="Skip this break" class="option-button"></button><button id="stop-button" title="Stop" class="option-button"></button></div><button id="break-skip-button" title="Skip this break"></button>'
        }
    },
    //FUNCTIONS
    setTime: function(minute, second) {
        libs.timer.data.time.minute = minute;
        libs.timer.data.time.second = second;
        console.log("[timer]: [setTime] Time set to: " + minute + ":" + second);
        return true;
    },
    start: function() {
        if (libs.timer.data.status === "work") {
            libs.timer.data.pause = false;
            libs.timer.countdown();
            console.log("[timer]: [start] Timer started at work status");
            return true;
        } else if (libs.timer.data.status === "break") {
            libs.timer.data.pause = false;
            libs.timer.countdown();
            console.log("[timer]: [start] Timer started at break status");
            return true;
        } else {
            console.log("[timer] ERROR: [start] Unknown status, won't start timer");
            return false;
        }
    },
    stop: function() {
        if (libs.timer.data.status === "work" || libs.timer.data.status === "break") {
            if (libs.timer.data.status === "work" && libs.window.data.popupOpen) {
                chrome.app.window.get('work').close();
                libs.window.data.popupOpen = false;
            } else if (libs.timer.data.status === "break" && libs.window.data.popupOpen) {
                chrome.app.window.get('break').close();
                libs.window.data.popupOpen = false;
            }
            clearTimeout(countDownTimeout);
            libs.window.idleCollapse.stop();
            libs.timer.data.pause = true;
            libs.window.data.collapsed = true;
            // GARBAGE [DOM api]
            document.getElementById('collapse-button').classList.add("hide");
            document.getElementById('option-buttons-box').classList.add("hide");
            libs.window.resize("large");
            document.getElementById('time-button').classList.add("right");
            document.getElementById('time-button').classList.remove("notify-action");
            setTimeout(function() {
                libs.timer.loadStatus("standby");
            }, 500);
            console.log("[timer]: [stop] Timer stopped");
            return true;
        } else {
            console.log("[timer] ERROR: [stop] Unknown status, won't stop timer");
            return false;
        }
    },
    switchPause: function() {
        if (libs.timer.data.status === "work" || libs.timer.data.status === "break") {
            if (libs.timer.data.pause) {
                // Pause OFF
                libs.timer.data.pause = false;
                libs.timer.data.time.second++;
                libs.timer.start();
                // GARBAGE [DOM api]
                document.getElementById("time-button").classList.remove("pause");
                // GARBAGE [speak API]
                if (libs.settings.data.speak) {
                    var locale = chrome.i18n.getMessage("tts_locale");
                    var msg = chrome.i18n.getMessage("tts_pause_off");
                    chrome.tts.speak(
                        msg, {
                            'lang': locale,
                            'rate': 1.0
                        }
                    );
                }
                console.log("[timer]: [switchPause] Timer pause OFF");
                return true;
            } else {
                // Pause ON
                clearTimeout(countDownTimeout);
                libs.timer.data.pause = true;
                // GARBAGE [DOM api]
                document.getElementById("time-button").classList.add("pause");
                // GARBAGE [speak API]
                if (libs.settings.data.speak) {
                    var locale = chrome.i18n.getMessage("tts_locale");
                    var msg = chrome.i18n.getMessage("tts_pause_on");
                    chrome.tts.speak(
                        msg, {
                            'lang': locale,
                            'rate': 1.0
                        }
                    );
                }
                // Passing time to string and two digits format
                var DOMsecond = libs.timer.data.time.second.toString();
                if (DOMsecond.length == 1) {
                    DOMsecond = "0" + DOMsecond;
                }
                var DOMminute = libs.timer.data.time.minute.toString();
                if (DOMminute.length == 1) {
                    DOMminute = "0" + DOMminute;
                }
                // Printing "|| time" to title
                document.title = "|| " + DOMminute + ":" + DOMsecond;
                console.log("[timer]: [switchPause] Timer pause ON");
                return true;
            }
        } else {
            console.log("[timer] ERROR: [switchPause] Unknown status, won't pause timer");
            return false;
        }
    },
    skipBreak: function() {
        // Saving skip time
        libs.timer.data.skipTime.minute = libs.timer.data.skipTime.minute + libs.timer.data.time.minute;
        libs.timer.data.skipTime.second = libs.timer.data.time.second;
        clearTimeout(countDownTimeout);
        libs.timer.fastCountdown();
        if (libs.window.data.popupOpen) {
            chrome.app.window.get('break').close();
            libs.window.data.popupOpen = false;
            libs.tools.removeElementById("break-skip-button");
            // GARBAGE [DOM api]
            document.getElementById("time-button").classList.remove("notify-action-break");
            if (libs.settings.data.popups) {
                document.getElementById("time-button").classList.add("notify-action");
            } else {
                setTimeout(function() {
                    libs.window.resize("collapse");
                }, 300);
            }
        } else {
          libs.tools.removeElementById("collapse-button");
          libs.window.resize("collapse");
          libs.tools.removeElementById("option-buttons-box");
        }
        console.log("[timer]: [skipBreak] Break skipped");
        return true;
    },
    loadStatus: function(status) {
        libs.timer.data.currentTask = false;
        console.log("[timer]: [loadStatus] Loading status: " + status);
        libs.window.idleCollapse.stop();
        // GARBAGE [DOM api]
        var content = document.getElementById('content');
        content.innerHTML = libs.timer.data.statusHTML[status];
        content.className = status;
        // Status
        if (status === 'work') {
            libs.timer.data.status = "work";

            if (libs.settings.data.audio) {
                // GARBAGE [DOM api]
                document.getElementById("audio-work").play();
            }
            if (libs.settings.data.notifications) {
                libs.notifications.create("work");
            }
            if (libs.settings.data.popups) {
                libs.window.popup.open("work");
            } else {
                libs.window.resize("collapse");
            }
            //Setting buttons
            libs.dom.set(["pin-button"]);
            chrome.storage.sync.get(undefined, function(stor) {
                libs.window.data.this.setAlwaysOnTop(stor.settings.alwaysOnTop ? true : false);
                if (stor.settings.alwaysOnTop) {
                    document.getElementById('pin-button').classList.add("on");
                }
            });
            libs.timer_window_dom.set([
                "collapse-button",
                "time-button",
                "stop-button",
                "done-button"
            ]);
            libs.dom.iC.set([
                "collapse-button",
                "time-button",
                "stop-button",
                "done-button",
                "pin-button"
            ]);
            libs.dom.titleTag([
                "pin-button",
                "collapse-button",
                "time-button",
                "stop-button",
                "done-button",
                "pin-button"
            ]);
            // Garbage
            libs.tools.removeElementById("done-button");
            document.getElementById("option-buttons-box").classList.add("two-items");

            //Countdown stuff
            var workTime = libs.settings.data.workTime;
            libs.timer.setTime(workTime, 0);
            libs.timer.start();
            libs.timer_window_dom.data.settingsOpen = false;
            console.log("[timer]: [loadStatus] Loaded work status");
            return true;
        } else if (status === 'break') {
            libs.timer.data.status = "break";
            if (libs.settings.data.audio) {
                document.getElementById("audio-break").play();
            }
            if (libs.settings.data.notifications) {
                libs.notifications.create("break");
            }
            libs.timer.data.status = "break";
            if (libs.settings.data.popups) {
                libs.window.popup.open("break");
            }
            //Setting buttons
            libs.dom.set([
                "close-button",
                "pin-button"
            ]);
            // GARBAGE - loadButtonState([button: setting, b2: s2, etc])
            chrome.storage.sync.get(undefined, function(stor) {
                libs.window.data.this.setAlwaysOnTop(stor.settings.alwaysOnTop ? true : false);
                if (stor.settings.alwaysOnTop) {
                    document.getElementById('pin-button').classList.add("on");
                }
                if (stor.settings.skipBreak) {
                    libs.timer_window_dom.set.skipButton();
                    libs.timer_window_dom.set.skipButtonSmall();
                    libs.dom.iC.set(["skip-small-button"]);
                } else {
                    libs.tools.removeElementById("skip-small-button");
                    document.getElementById("option-buttons-box").classList.add("two-items");
                }
            });
            libs.timer_window_dom.set([
                "collapse-button",
                "time-button",
                "stop-button",
                "break-skip-button",
                "skip-small-button"
            ]);
            libs.dom.iC.set([
                "collapse-button",
                "time-button",
                "stop-button",
                "pin-button"
            ]);
            libs.dom.titleTag([
                "close-button",
                "pin-button",
                "collapse-button",
                "time-button",
                "stop-button",
                "pin-button",
                "break-skip-button",
                "skip-small-button"
            ]);
            //Skip configuration
            if (libs.timer.data.skipTime.minute >= 20) {
                libs.timer.data.skipTime.minute = 20;
                libs.timer.data.skipTime.second = 0;
            }
            //Countdown stuff
            if (libs.timer.data.shortBreaksN < 3) {
                libs.timer.setTime(libs.settings.data.breakShortTime, 0);
                var minute = libs.settings.data.breakShortTime + libs.timer.data.skipTime.minute;
                var second = libs.timer.data.skipTime.second;
                libs.timer.setTime(minute, second);
                libs.timer.data.skipTime.minute = 0;
                libs.timer.data.skipTime.second = 0;
                libs.window.collapsed = true;
                libs.timer.data.shortBreaksN++;
            } else {
                libs.timer.setTime(libs.settings.data.breakLongTime, 0);
                var minute = libs.settings.data.breakLongTime + libs.timer.data.skipTime.minute;
                var second = libs.timer.data.skipTime.second;
                if (minute >= 25) {
                    libs.timer.data.skipTime.minute = minute - 25;
                    libs.timer.setTime(25, 0);
                    minute = 25;
                    second = 0;
                    libs.timer.data.skipTime.second = 0;
                } else {
                    libs.timer.setTime(minute, second);
                    libs.timer.data.skipTime.minute = 0;
                    libs.timer.data.skipTime.second = 0;
                }
                libs.timer.data.shortBreaksN = 0;
            }
            libs.timer.start();
            libs.timer_window_dom.data.settingsOpen = false;
            console.log("[timer]: [loadStatus] Loaded break status");
            return true;
        } else {
            libs.timer_window_dom.actions.loadSettings();
            libs.window.resize("large");
            libs.timer.data.status = "standby";
            document.title = "TimeDoser";
            libs.window.idleCollapse.stop();
            //Setting buttons
            libs.dom.set([
                "close-button",
                "pin-button"
            ]);
            chrome.storage.sync.get(undefined, function(stor) {
                libs.window.data.this.setAlwaysOnTop(stor.settings.alwaysOnTop ? true : false);
                if (stor.settings.alwaysOnTop) {
                    document.getElementById('pin-button').classList.add("on");
                }
            });
            libs.timer_window_dom.set([
                "standby-button",
                "config-button"
            ]);
            libs.dom.titleTag([
                "close-button",
                "pin-button",
                "standby-button",
                "config-button"
            ]);
            console.log("[timer]: [loadStatus] Loaded standby status");
            return true;
        }
    },
    countdown: function(next) {
        // -1 second
        libs.timer.data.time.second--;
        // if second < 0, -1 minute
        if (libs.timer.data.time.second < 0) {
            libs.timer.data.time.second = 59;
            libs.timer.data.time.minute--;
        }
        // Vars to DOM
        //- Passing to string and two digits format
        var DOMsecond = libs.timer.data.time.second.toString();
        if (DOMsecond.length == 1) {
            DOMsecond = "0" + DOMsecond;
        }
        var DOMminute = libs.timer.data.time.minute.toString();
        if (DOMminute.length == 1) {
            DOMminute = "0" + DOMminute;
        }
        //- Printing to DOM elements
        document.getElementById("seconds").innerText = DOMsecond;
        document.getElementById("minutes").innerText = DOMminute;
        // Focus the window  and always on top from 5s to 2s
        if (libs.timer.data.time.minute === 0 && libs.timer.data.time.second <= 5 && libs.timer.data.time.second > 1) {
            libs.window.data.this.setAlwaysOnTop(true);
            libs.window.data.this.focus();
            console.log("[timer]: [countdown] Focus the window  and always on top from 5s to 2s");
        }
        // Resetting always on top and focusing the last 1 second
        if (libs.timer.data.time.minute === 0 && libs.timer.data.time.second <= 1) {
            libs.window.data.this.setAlwaysOnTop(libs.settings.data.alwaysOnTop ? true : false);
            libs.window.data.this.focus();
            console.log("[timer]: [countdown] Resetting always on top and focusing the last 1 second");
        }
        // End actions
        if (libs.timer.data.time.minute === 0 && libs.timer.data.time.second === 0) {
            console.log("[timer]: [countdown] Countdown ended");
            // If next status passed
            if (next) {
                libs.timer.loadStatus(next);
                //Normal behavior
            } else {
                if (libs.timer.data.status === "work") {
                    libs.timer.loadStatus("break");
                } else if (libs.timer.data.status === "break") {
                    libs.timer.loadStatus("work");
                }
            }
        } else {
            countDownTimeout = setTimeout(function() {
                libs.timer.countdown(next);
            }, 1000);
            if (libs.timer.data.status === "work") {
                var i18nMSG = "titleWork";
            } else if (libs.timer.data.status === "break") {
                var i18nMSG = "titleBreak";
            }
            document.title = DOMminute + ":" + DOMsecond + " (" + chrome.i18n.getMessage(i18nMSG) + ")";
        }
    },
    fastCountdown: function() {
      var tm = libs.timer.data.time.minute;
      if(tm > 10) {
        libs.timer.data.time.second= libs.timer.data.time.second - 39;
        setTimeout(function() {
            libs.timer.fastCountdown();
        }, 10);
      } else if(tm > 3) {
        libs.timer.data.time.second= libs.timer.data.time.second - 29;
        setTimeout(function() {
            libs.timer.fastCountdown();
        }, 20);
      } else if(tm > 0) {
        libs.timer.data.time.second= libs.timer.data.time.second - 13;
        setTimeout(function() {
            libs.timer.fastCountdown();
        }, 40);
      } else if (libs.timer.data.time.second > 8){
        libs.timer.data.time.second= libs.timer.data.time.second - 6;
        setTimeout(function() {
            libs.timer.fastCountdown();
        }, 70);
      } else {
        libs.timer.data.time.second= libs.timer.data.time.second - 1;
        // End actions
        if (libs.timer.data.time.minute === 0 && libs.timer.data.time.second === 2) {
            libs.timer.start();
        } else {
          setTimeout(function() {
              libs.timer.fastCountdown();
          }, 120);
        }
      }
      if (libs.timer.data.time.second < 0) {
            libs.timer.data.time.second = 60 + libs.timer.data.time.second;
            libs.timer.data.time.minute--;
        }
        // Vars to DOM
        //- Passing to string and two digits format
        var DOMsecond = libs.timer.data.time.second.toString();
        if (DOMsecond.length == 1) {
            DOMsecond = "0" + DOMsecond;
        }
        var DOMminute = libs.timer.data.time.minute.toString();
        if (DOMminute.length == 1) {
            DOMminute = "0" + DOMminute;
        }
        //- Printing to DOM elements
        document.getElementById("seconds").innerText = DOMsecond;
        document.getElementById("minutes").innerText = DOMminute;
        var i18nMSG = "titleBreak";
            document.title = DOMminute + ":" + DOMsecond + " (" + chrome.i18n.getMessage(i18nMSG) + ")";
    }
};