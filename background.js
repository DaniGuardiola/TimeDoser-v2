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
      frame: {
      	color: "#0097a7",
      	activeColor: "#0097a7",
      	inactiveColor: "#00acc1"
      },
      innerBounds: {width: 320, height: 533}
    }
  );
});
