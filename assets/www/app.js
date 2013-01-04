var S_APP_NAME="InfoQInterview";
var S_REMOTE_INTERVIEW_LIST_URL="http://www.jpcxc.com/test/list.en.txt";
var S_REMOTE_INTERVIEW_LIST_NAME="list.en.txt";
var S_LOCK_FILE_NAME="lock.txt";
var oDataDir;

var listview;
var listFooter;

function onConfirm(button) {
	if(button===1){
		navigator.app.exitApp(); 
	}
}

function onBackKeyDown() {
	if($.mobile.activePage.is('#list')){
		navigator.notification.confirm('Are You Sure?',onConfirm,'Log Out!','');
		}
		else {
			navigator.app.backHistory();
		}
}

function onFileSystemSuccess(fileSystem) {
	fileSystem.root.getDirectory(S_APP_NAME, {create: true, exclusive: false},
			function(parent){
				oDataDir=parent;
				lister.showLocalIntervews();
				lister.clean();
			});
}

function onDeviceReady() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess);
	document.addEventListener("backbutton", onBackKeyDown, false);
}

document.addEventListener("deviceready", onDeviceReady);

$("#list").live( "pageinit", function(event)
		{
			listview=  $("#list").children(":jqmData(role=content)").children( ":jqmData(role=listview)" );
			listFooter =  $("#list").children( ":jqmData(role=footer)" );			
		}
	);
$( document ).on( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

	$.mobile.allowCrossDomainPages = true;
    $.mobile.buttonMarkup.hoverDelay(0);
    $.mobile.pushStateEnabled(false);
});
//window.webkitRequestFileSystem(window.TEMPORARY , 50*1024*1024, onFileSystemSuccess, fail);