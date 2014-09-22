chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html', {
        'id': 'timer_window',
        'frame': 'none',
        'resizable': false,
        'alwaysOnTop': true,
        'bounds': {
            'width': 160,
            'height': 100,
            'left': 0,
            'top': 100
        }
    });
});
/*chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('apiconsole/apiDEVinput.html', {
        'id': 'apiDEVinput',
        'frame': 'none',
        'resizable': false,
        'bounds': {
            'width': 160,
            'height': 100,
            'left': 0,
            'top': 200
        }
    });
});*/