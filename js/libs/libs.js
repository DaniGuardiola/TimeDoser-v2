var libs = {
    vars: {
        root: "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/"
    },
    call: function(call, args) {
        var callOK = "libs." + call;
        return libs.tools.executeFunctionByName(callOK, window, args);
    },
    loadlib: function(what, dir) {
        var loaded = libs.check(what);
        if (loaded) {
            console.log("[libs] [loadlib]: libs." + what + " is already loaded")
        } else {
          var fileref = document.createElement('script');
            if (dir === "here") {
                fileref.src = what + ".js";
            } else {
                fileref.src = libs.vars.root + "js/libs/" + what + ".js";
            }
            if (typeof fileref != "undefined") {
                document.head.appendChild(fileref);
            }
        }

    },
    load: function(what, dir) {
        for (var i = what.length - 1; i >= 0; i--) {
            libs.loadlib(what[i], dir);
        };
    },
    check: function(what) {
        return libs[what] ? true : false;
    }
};