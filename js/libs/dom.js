libs.dom = {
    set: function(e) {
        for (var i = e.length - 1; i >= 0; i--) {
            document.getElementById(e[i]).addEventListener("click", function() {
                if (this.id === "close-button") {
                    libs.window.data.this.close();
                } else if (this.id === "pin-button") {
                    if (libs.settings.data.alwaysOnTop) {
                        document.getElementById('pin-button').classList.remove("on");
                        libs.window.data.this.setAlwaysOnTop(false);
                        libs.settings.change("alwaysOnTop", false);
                    } else {
                        document.getElementById('pin-button').classList.add("on");
                        libs.window.data.this.setAlwaysOnTop(true);
                        libs.settings.change("alwaysOnTop", true);
                    }
                }
            });
        };
    },
    iC: {
        set: function(elements) {
            for (var i = elements.length - 1; i >= 0; i--) {
                document.getElementById(elements[i]).addEventListener("mouseover", function() {
                    libs.window.idleCollapse.stop();
                    libs.window.idleCollapse.start(5000);
                });
            };
        }
    },
    titleTag: function(e) {
        for (var i = e.length - 1; i >= 0; i--) {
            var parsedString = e[i].replace(/-/g,"_");
            document.getElementById(e[i]).title = chrome.i18n.getMessage("titletag_" + parsedString);
        };
    }
};