API.timer = (function() {
    "use strict";
    // Data
    var data = {
        status: "none",
        changingStatus: false,
        countdownTimeout: false,
        time: {
            minute: 0,
            second: 0
        }
    };

    // Temporal stuff
    var tmp = {};

    // Animates a status change
    // TODO: refactor to make more generic
    function statusChangeAnimation(opt, target) {
        // Default values
        opt.color = opt.color || "#9c27b0";
        opt.cover = opt.cover || false;
        opt.time = opt.time !== null ? opt.time : false;
        opt.close = opt.close !== null ? opt.close : true;
        opt.settings = opt.settings !== null ? opt.settings : true;
        opt.fab = opt.fab || {};
        opt.fab.fadein = opt.fab.fadein || false;
        opt.fab.position = opt.fab.position || "left";
        opt.fab.icon = opt.fab.icon || "av:play-arrow";
        opt.fab.hide = opt.fab.hide || false;
        opt.callback = opt.callback || function() {
            data.changingStatus = false;
        };

        // Save opt in tmp
        tmp.opt = opt;

        // Get the fab, the helper and the time
        var fab = API.dom.getFAB();
        var helper = API.dom.getAnimationHelper();
        var time = API.dom.getTime();
        var close = API.dom.getClose();
        var pin = API.dom.getPin();
        var mini = API.dom.getMini();
        var settings = API.dom.getSettingsButton();

        // Set target
        target = target || fab;

        // Set expansion size
        var expand = opt.expand || 360;

        // Calculate FAB position
        var position = {
            height: target.getBoundingClientRect().height,
            width: target.getBoundingClientRect().width,
            top: target.getBoundingClientRect().top,
            left: target.getBoundingClientRect().left
        };
        console.log(position);
        position = {
            top: position.top + (position.height / 2),
            left: position.left + (position.width / 2)
        };
        console.log(position);

        // Set helper color and initial position and size
        helper.style.top = position.top + "px";
        helper.style.left = position.left + "px";
        helper.style.height = helper.style.width = "0";
        helper.style.backgroundColor = opt.color;

        // Enable transition again
        helper.style.transition = "";

        // Set FAB .cover
        if (opt.cover) {
            helper.classList.add("cover");
        } else {
            helper.classList.remove("cover");
        }

        // Prepare fab fadein
        if (opt.fab.fadein) {
            fab.style.transition = "none";
        }

        // Activate helper
        helper.classList.add("on");

        // Hide time, close, pin and mini button
        time.classList.remove("on");
        close.classList.remove("on");
        pin.classList.remove("on");
        mini.classList.remove("on");
        settings.classList.remove("on");

        // Set FAB icon
        fab.setAttribute("icon", opt.fab.icon);

        // Use timeout to force transition
        setTimeout(function() {
            // Listen to transitionend
            helper.addEventListener("transitionend", animationHelperTransitionend);

            // Set final position and size
            helper.style.top = (position.top - (expand / 2)) + "px";
            helper.style.left = (position.left - (expand / 2)) + "px";
            helper.style.height = helper.style.width = expand + "px";
        }, 20);
    }

    // Animator helper transitionend listener
    function animationHelperTransitionend() {
        // Get helper, FAB and time
        var helper = API.dom.getAnimationHelper();
        var fab = API.dom.getFAB();
        var time = API.dom.getTime();
        var close = API.dom.getClose();
        var pin = API.dom.getPin();
        var mini = API.dom.getMini();
        var settings = API.dom.getSettingsButton();

        // Get opt from tmp
        var opt = tmp.opt;

        // Set fab fadein
        if (opt.fab.fadein) {
            console.log("IM HAPPENING");
            fab.classList.remove("on");
            setTimeout(function() {
                fab.style.transition = "";
                fab.classList.add("on");
            }, 200);
        }

        // Remove this event listener
        helper.removeEventListener("transitionend", animationHelperTransitionend);

        // Set the status attribute on body
        document.body.setAttribute("status", getStatus());

        // Reset helper
        helper.classList.remove("on");
        helper.style.transition = "none";
        helper.style.top = helper.style.left = helper.style.height = helper.style.width = "";

        // Set FAB position
        fab.setAttribute("position", opt.fab.position);

        // Show time (baby)
        if (opt.time) {
            time.classList.add("on");
        }

        // Show close button
        if (opt.close) {
            close.classList.add("on");
        }
        pin.classList.add("on");
        mini.classList.add("on");

        // Show settings button
        console.log("SETTINGS: " + opt.settings);
        if (opt.settings) {
            console.log(settings);
            settings.classList.add("on");
        }

        // Remove opt from tmp
        delete tmp.opt;

        // Execute the callback
        opt.callback();
    }

    // Sets the standby status
    function setStandbyStatus() {
        stop();
        document.title = API.tools.i18n("appname");
        data.changingStatus = true;
        data.status = "standby";
        API.storage.settings.get(["mini"]).then(function(storage) {
            statusChangeAnimation({
                color: "#9c27b0",
                time: false,
                close: true,
                settings: true,
                callback: function() {
                    document.body.removeAttribute("loading");
                    data.changingStatus = false;
                },
                fab: {
                    position: "right",
                    icon: "av:play-arrow"
                }
            }, storage.mini ? document.getElementById("timer-text") : null);
        });
    }

    // Sets the work status
    function setWorkStatus() {
        data.changingStatus = true;
        data.status = "work";
        API.storage.settings.get(["notifications"]).then(function(storage) {
            if (storage.notifications) {
                API.notifications.work();
            }
        });
        API.storage.settings.get(["audio"]).then(function(storage) {
            if (storage.audio) {
                document.getElementById("audio-work").play();
            }
        });
        statusChangeAnimation({
            color: "#3f51b5",
            time: true,
            close: false,
            settings: false,
            fab: {
                position: "left",
                icon: "av:stop"
            },
            callback: function() {
                API.storage.settings.get(["workTime"]).then(function(storage) {
                    if (window.MUSIC_PLEASE) {
                        setTime(0, 1);
                    } else {
                        setTime(storage.workTime, 0);
                    }
                    data.changingStatus = false;
                    countdown();
                });
            }
        }, document.getElementById("timer-container").classList.contains("mini") ? document.getElementById("timer-text") : null);
    }

    // Sets the break status
    function setBreakStatus() {
        data.changingStatus = true;
        data.status = "break";
        API.storage.settings.get(["notifications"]).then(function(storage) {
            if (storage.notifications) {
                API.notifications.break();
            }
        });
        API.storage.settings.get(["audio"]).then(function(storage) {
            if (storage.audio) {
                document.getElementById("audio-break").play();
            }
        });
        statusChangeAnimation({
            color: "#009688",
            time: true,
            close: true,
            settings: false,
            fab: {
                position: "left",
                icon: "av:skip-next"
            },
            callback: function() {
                API.storage.settings.get(["shortBreakTime", "longBreakTime"]).then(function(storage) {
                    if (window.MUSIC_PLEASE) {
                        setTime(0, 1);
                        data.changingStatus = false;
                        countdown();
                    } else {
                        API.storage.cache.get(["workTimeCount"]).then(function(cache) {
                            if (+cache.workTimeCount < 4) {
                                setTime(storage.shortBreakTime, 0);
                                API.storage.cache.set("workTimeCount", +cache.workTimeCount + 1);
                            } else {
                                setTime(storage.longBreakTime, 0);
                                API.storage.cache.set("workTimeCount", 0);
                            }
                            countdown();
                            data.changingStatus = false;
                        });
                    }
                });
            }
        }, document.getElementById("timer-container").classList.contains("mini") ? document.getElementById("timer-text") : null);
    }

    // Routes the status input to the appropiate function
    function setStatus(status) {
        if (data.changingStatus) {
            console.error("Status change in progress");
            return;
        }
        if (getStatus() === status) {
            console.error("\"" + status + "\" is the current status");
            return;
        }
        if (status === "standby") {
            setStandbyStatus();
        } else if (status === "work") {
            setWorkStatus();
        } else if (status === "break") {
            setBreakStatus();
        } else {
            console.error("Unknown status \"" + status + "\"");
        }
    }

    // Gets the status
    function getStatus() {
        return data.status;
    }

    // FAB click listener
    function FABClickListener() {
        if (getStatus() === "standby") {
            setStatus("work");
        } else if (getStatus() === "work") {
            setStatus("standby");
        } else if (getStatus() === "break") {
            stop();
            setStatus("work");
        }
    }

    // Initializes the timer
    function init() {
        // Initial status
        setStatus("standby");

        // Attach click listener to FAB
        API.dom.getFAB().addEventListener("click", FABClickListener);

        // Temporal debug fix
        var helper = API.dom.getAnimationHelper();
        helper.style.height = helper.style.width = "0";
    }

    // Sets the time
    function setTime(minute, second) {
        var failed = false;
        if (typeof minute !== "number" || isNaN(minute)) {
            console.error("The \"minute\" parameter is not a valid number");
            failed = true;
        }
        if (typeof second !== "number" || isNaN(second)) {
            console.error("The \"second\" parameter is not a valid number");
            failed = true;
        }
        if (failed) {
            return;
        }
        data.time.minute = minute;
        data.time.second = second;
        API.dom.updateTime(minute, second);
    }

    var attentionSeconds = -1;

    // Attention

    function attention(seconds) {
        if (seconds) {
            attentionSeconds = seconds;
        }
        if (attentionSeconds > 0) {
            API.window.get().setAlwaysOnTop(true);
            API.window.get().drawAttention();
            API.window.get().clearAttention();
            attentionSeconds--;
            return;
        } else if (attentionSeconds === 0) {
            API.storage.settings.get(["alwaysOnTop"]).then(function(storage) {
                API.window.get().setAlwaysOnTop(storage.alwaysOnTop ? true : false);
            });
            attentionSeconds = -1;
        }
    }

    // Recurrent countdown
    function countdown(next) {
        // Parameter default value
        next = next || false;

        var attentionTime = false;

        // If second < 0, -1 minute
        if (data.time.second < 0) {
            data.time.second = 59;
            data.time.minute--;
        }

        // Update time element
        API.dom.updateTime(data.time.minute, data.time.second);

        if (data.time.minute === 0 && data.time.second === 3) {
            attentionTime = 6;
        }

        // If countdown reaches the end
        if (data.time.minute === 0 && data.time.second === 0) {
            // If there's a next status parameter
            if (next) {
                setStatus(next);
                // Normal behavior
            } else {
                if (getStatus() === "work") {
                    setStatus("break");
                } else if (getStatus() === "break") {
                    setStatus("work");
                }
            }
            // If not
        } else {
            // -1 second
            data.time.second--;
            data.countdownTimeout = setTimeout(function() {
                countdown(next);
            }, 1000);
        }
        attention(attentionTime);
    }

    // Stops the timer
    function stop(callback) {
        clearTimeout(data.countdownTimeout);
        attention(0);
        API.storage.cache.set("workTimeCount", 0);
        if (callback) {
            callback();
        }
    }

    return {
        setStatus: setStatus,
        getStatus: getStatus,
        changeStatus: statusChangeAnimation,
        init: init,
        data: data,
        setTime: setTime,
        countdown: countdown,
        stop: stop
    };
})();
