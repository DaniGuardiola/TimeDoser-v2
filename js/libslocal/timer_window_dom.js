libs.timer_window_dom = {
    data: {
        settingsOpen: false,
        settingsSet: false
    },
    set: function(e) {
        for (var i = e.length - 1; i >= 0; i--) {
            document.getElementById(e[i]).addEventListener("click", function() {
                if (this.id === "collapse-button") {
                    if (libs.window.data.collapsed) {
                        libs.window.resize("large");
                        libs.window.idleCollapse.start(3000);
                    } else {
                        libs.window.resize("collapse");
                        libs.window.idleCollapse.stop();
                    }
                } else if (this.id === "standby-button") {
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
                    }, 300);
                } else if (this.id === "time-button") {
                    libs.timer.switchPause();
                } else if (this.id === "stop-button") {
                    libs.timer.stop();
                } else if (this.id === "done-button") {
                    //libs.timer_window_dom.actions.doneTimer(libs.timer.data.currentTask);
                } else if (this.id === "break-skip-button" || this.id === "skip-small-button") {
                    libs.timer.skipBreak();
                } else if (this.id === "config-button") {
                    libs.timer_window_dom.actions.switchSettings();
                    if (libs.timer_window_dom.data.settingsOpen) {
                        document.getElementById("config-button").classList.add("on");
                    } else {
                        document.getElementById("config-button").classList.remove("on");
                    }
                };
            });
        }
    },
    actions: {
        doneTimer: function(task) {
            if (task) {
                libs.tasks.removeByName(task);
                libs.tasks.setCurrent(false);
                libs.window.popup.open("work");
                console.log("[timer_window_dom]: [actions.doneTimer] Setting " + task + " as done and opening popup");
            } else {
                libs.window.popup.open("work");
                console.log('[timer_window_dom]: [actions.doneTimer] Input is false, opening popup');
            }
        },
        resize: function(to) {
            if (to === "collapse") {
                libs.window.resizePx(100);
                libs.window.data.collapsed = true;
            } else if (to === "large") {
                libs.window.resizePx(160);
                libs.window.data.collapsed = false;
            } else if (to === "settings") {
                libs.window.data.this.resizeTo(160, 300);
            } else {
                console.log('[timer_window_dom] ERROR: [actions.resize] Unknown argument "' + to + '"');
                return false;
            }
            console.log("[timer_window_dom]: [actions.resize] Window resized to: " + to);
            return true;
        },
        settings: function(open) {
            if (open) {
                libs.timer_window_dom.actions.resize("settings");
                document.getElementById("settings-box").classList.add("on");
            } else if (open === false) {
                libs.timer_window_dom.actions.resize("large");
                document.getElementById("settings-box").classList.remove("on");
            } else {
                console.log("[timer_window_dom] ERROR: [actions.settings] Open value not specified");
            }
        },
        switchSettings: function() {
            if (libs.timer_window_dom.data.settingsOpen) {
                libs.timer_window_dom.actions.settings(false);
                libs.timer_window_dom.data.settingsOpen = false;
            } else {
                libs.timer_window_dom.actions.settings(true);
                libs.timer_window_dom.data.settingsOpen = true;
            }
        },
        loadSettings: function() {
            libs.dom.titleTag([
                "setting-workTime",
                "setting-breakTime",
                "setting-notif",
                "setting-audio"
            ]);
            libs.settings.load(function(settings){
                document.getElementById("setting-workTime").innerText = settings.workTime;
                document.getElementById("setting-breakTime").innerText = settings.breakShortTime;
                if (settings.notifications) {
                    document.getElementById("setting-notif").classList.add("on");
                }
                if (settings.audio) {
                    document.getElementById("setting-audio").classList.add("on");
                }
            });
            if (libs.timer_window_dom.data.settingsSet) {} else {
                libs.timer_window_dom.data.settingsSet = true;
                document.getElementById("setting-workTime").addEventListener("click", function(){
                    if (libs.settings.data.workTime<20) {
                        libs.settings.change("workTime",20);
                        document.getElementById("setting-workTime").innerText = 20;
                    } else if (libs.settings.data.workTime<25) {
                        libs.settings.change("workTime",25);
                        document.getElementById("setting-workTime").innerText = 25;
                    } else if (libs.settings.data.workTime<30) {
                        libs.settings.change("workTime",30);
                        document.getElementById("setting-workTime").innerText = 30;
                    } else if (libs.settings.data.workTime<35) {
                        libs.settings.change("workTime",35);
                        document.getElementById("setting-workTime").innerText = 35;
                    } else if (libs.settings.data.workTime<40) {
                        libs.settings.change("workTime",40);
                        document.getElementById("setting-workTime").innerText = 40;
                    } else if (libs.settings.data.workTime<45) {
                        libs.settings.change("workTime",45);
                        document.getElementById("setting-workTime").innerText = 45;
                    } else if (libs.settings.data.workTime<50) {
                        libs.settings.change("workTime",50);
                        document.getElementById("setting-workTime").innerText = 50;
                    } else if (libs.settings.data.workTime<55) {
                        libs.settings.change("workTime",55);
                        document.getElementById("setting-workTime").innerText = 55;
                    } else if (libs.settings.data.workTime<60) {
                        libs.settings.change("workTime",60);
                        document.getElementById("setting-workTime").innerText = 60;
                    } else if (libs.settings.data.workTime>=60) {
                        libs.settings.change("workTime",15);
                        document.getElementById("setting-workTime").innerText = 15;
                    }
                });
                document.getElementById("setting-breakTime").addEventListener("click", function(){
                    if (libs.settings.data.breakShortTime<10) {
                        libs.settings.change("breakShortTime",10);
                        libs.settings.change("breakLongTime",20);
                        document.getElementById("setting-breakTime").innerText = 10;
                    } else if (libs.settings.data.breakShortTime<15) {
                        libs.settings.change("breakShortTime",15);
                        libs.settings.change("breakLongTime",25);
                        document.getElementById("setting-breakTime").innerText = 15;
                    } else if (libs.settings.data.breakShortTime>=15) {
                        libs.settings.change("breakShortTime",5);
                        libs.settings.change("breakLongTime",15);
                        document.getElementById("setting-breakTime").innerText = 5;
                    }
                });
                document.getElementById("setting-notif").addEventListener("click", function(){
                    if (libs.settings.data.notifications) {
                        libs.settings.change("notifications", false);
                        document.getElementById("setting-notif").classList.remove("on");
                    } else {
                        libs.settings.change("notifications", true);
                        document.getElementById("setting-notif").classList.add("on");
                    }
                });
                document.getElementById("setting-audio").addEventListener("click", function(){
                    if (libs.settings.data.audio) {
                        libs.settings.change("audio", false);
                        document.getElementById("setting-audio").classList.remove("on");
                    } else {
                        libs.settings.change("audio", true);
                        document.getElementById("setting-audio").classList.add("on");
                    }
                });
            }
        }
    }
};