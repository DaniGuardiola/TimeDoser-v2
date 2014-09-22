libs.msg = {
    listen: {
        start: function(ch) {
            for (var i = ch.length - 1; i >= 0; i--) {
                if (ch[i] === "timer_window") {
                    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                        if (request.type === "libs") {
                            if (request.subtype === "call") {
                                libs.call(request.call, request.args);
                                sendResponse({
                                    ok: true
                                });
                            } else if (request.subtype === "data") {
                                sendResponse({
                                    ok: true,
                                    data: libs[request.call].data[request.data]
                                });
                            }
                        }
                    });
                }
            }
        }
    },
    send: {
        libs: {
            call: function(ch, call, args) {
                chrome.runtime.sendMessage({
                    "ch": ch,
                    "type": "libs",
                    "subtype": "call",
                    "call": call,
                    "args": args
                }, function(response) {
                    if (response.ok) {
                        console.log("[libs] [msg.libs.call] OK");
                    }
                });
                console.log("SHOULD WORK");
            },
            data: function(ch, call, data, callback) {
                chrome.runtime.sendMessage({
                    "ch": ch,
                    "type": "libs",
                    "subtype": "data",
                    "call": call,
                    "data": data
                }, function(response) {
                    if (response.ok) {
                        console.log(response.data);
                        console.log("[libs] [msg.libs.data] OK");
                        callback(response.data);
                    }
                });
            }
        }
    }
};