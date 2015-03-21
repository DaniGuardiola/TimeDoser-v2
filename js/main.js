// Window ONLOAD
window.addEventListener('load', function(){
	md = new Materializer();
	md.init();
	state.now.index();
	md.ajaxInsert('page/now.html',getEl('md-content'),function(){
		console.log('Loading Now page on app start');
	});


//	chrome.app.window.current().fullscreen();
});

function openSidemenu(){
	document.querySelector('md-sidemenu').open();
}

function closeSidemenu(){
	document.querySelector('md-sidemenu').close();
}

function hiCarlos(){
	console.log("Hi Carlos what's up :D");
}

function loadPage(page){
	if (page === "now") {
		closeSidemenu();
	}
	console.log("This has to load " + page);
}

function closeApp(){
	chrome.app.window.current().close();
}

function menuHandler(el){
	var page = el.getAttribute('data-page');
	loadPage(page);
}

// Lib loader
var libloader = document.createElement('script');
libloader.setAttribute("type", "text/javascript");
libloader.setAttribute("src", "/js/libs/libs.js");
if (typeof libloader != "undefined") {
    document.querySelector('head').appendChild(libloader);
}
libloader.addEventListener("load", function() {
    libs.load([
        "notifications",
        "tools"
    ]);
});


