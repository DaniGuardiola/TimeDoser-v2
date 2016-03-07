API.blocker = (function() {
    "use strict";
    var pinned = false;
    var heyyou = false;

    function block() {
        document.body.classList.add("blocked");
        chrome.app.window.current().fullscreen();
        if (!API.window.isPinned()) {
            API.window.togglePin();
        } else {
            pinned = true;
        }
        window.onkeyup = function(e) {
            if (e.keyCode === 27 /* ESC */ ) {
                e.preventDefault();
            }
        };
        window.onkeydown = function(e) {
            if (e.keyCode === 27 /* ESC */ ) {
                e.preventDefault();
                //unblock();
            }
        };
        hey();
    }

    function hey() {
        console.log("heyyyy");
        API.window.get().focus();
        heyyou = setTimeout(hey, 50);
    }

    function heystop() {
        clearTimeout(heyyou);
        heyyou = false;
    }

    function unblock() {
        document.body.classList.remove("blocked");
        chrome.app.window.current().restore();
        if (!pinned) {
            API.window.togglePin();
        }
        pinned = false;
        heystop();
    }

    function isBlocked() {
        return document.body.classList.contains("blocked");
    }

    return {
        block: block,
        unblock: unblock,
        isBlocked: isBlocked
    };
})();
