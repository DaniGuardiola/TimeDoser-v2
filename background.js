/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html

REMEMBER! normal height 336px


 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create(
    'index.html',
    {
      id: "app",
      frame: {
        type: "none"/*,
      	color: "#0097a7",
      	activeColor: "#0097a7",
      	inactiveColor: "#00acc1"*/
      },
      innerBounds: {
        width: 320,
        height: 533,
        minWidth: 300,
        minHeight: 104
      },
      resizable: false
    }
  );
});
