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
      	color: "#7b1fa2",
      	activeColor: "#7b1fa2",
      	inactiveColor: "#8e24aa"
      },
      innerBounds: {width: 320, height: 533}
    }
  );
});
