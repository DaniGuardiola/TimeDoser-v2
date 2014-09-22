libs.popup_dom = {
    set: function(e) {
        for (var i = e.length - 1; i >= 0; i--) {
            document.getElementById(e[i]).addEventListener("click", function() {
                if (this.id === "close-button") {
                    libs.msg.send.libs.data("timer_window", "timer", "status", function(status) {
                        libs.msg.send.libs.call("timer_window", "window.popup.timerCollapse", [status]);
                        libs.window.data.this.close();
                    });
                }
            });
        };
    },
};