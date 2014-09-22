function APItimedoser(call,args){
  console.log("APItimedoser");
  chrome.runtime.sendMessage({
    "type": "api",
    "api": "timedoser",
    "api_subtype": "call",
    "call": call,
    "args": args
  }, function(response){
    if (response.allCorrect) {
      console.log("APItimedoser: All correct");
    }
  });
}
window.addEventListener("load", function(){
  console.log("loaded");
  document.getElementById('inputCode').onkeydown = checkKey; 
  document.getElementById('inputArgs').onkeydown = checkKey; 
});
function checkKey(e) {
  e = e || window.event;
  console.log("key detected!");
  // checkKey - call APItimedoser from inputs
  if (e.keyCode === 13) {
    console.log("Enter!");
    var call = document.getElementById("inputCode").value;
    if(call != ""){
      var argsString = "[" + document.getElementById("inputArgs").value + "]";
      if (argsString != "") {
        var args = JSON.parse(argsString);
      } else {
        var args = false;
      }
    }
    APItimedoser(call,args);
  }
}