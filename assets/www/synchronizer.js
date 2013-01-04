var synchronizer ={};
synchronizer.sServerPrifix="";

synchronizer.sync=function(){
	synchronizer.showSyncStart();
	this.updateList(this.downloadInterviews);
};


synchronizer.updateList=function(fUpdated){
	function getNewInterviewList(oListFileEntry)  
	{
		var oInterviewList=utils.getJson(oListFileEntry);
		synchronizer.sServerPrifix=oInterviewList.prefix;
		var aNewInterviews=synchronizer.signOldAndGetNew(oInterviewList);
		fUpdated(aNewInterviews);
	}
	
	function checkListFile(bakFileEntry){
		bakFileEntry.file(function(file){
			if(file.size>0){
				getNewInterviewList(bakFileEntry);
				//rename bak file.
				bakFileEntry.getParent(function(parent){
					bakFileEntry.moveTo(parent,S_REMOTE_INTERVIEW_LIST_NAME,function(){
						bakFileEntry.remove();
					});
				});
			}
			else{
				synchronizer.showNetworkError();
				bakFileEntry.remove();
			}
		});
	}
	
	var oFileTransfer = new FileTransfer();
	oFileTransfer.download(S_REMOTE_INTERVIEW_LIST_URL,oDataDir.fullPath+"/"+S_REMOTE_INTERVIEW_LIST_NAME+".bak",checkListFile,synchronizer.downloadError);
};

synchronizer.signOldAndGetNew=function(oInterviewList){
	var aNames=[];
	listview.find("h3").each(function(index, e)
		{
			aNames.push( $(this).text());
		});
	var aNewInterviews=[];
	var aToKeepedNames=[];
	for(var i=0; i<oInterviewList.interviews.length;i++)
	{
		var sName=oInterviewList.interviews[i].name;
		if(jQuery.inArray(sName, aNames)<0)
		{
			aNewInterviews.unshift(oInterviewList.interviews[i]);
		}
		else
		{
			aToKeepedNames.push(sName);
		}
			
	}
	//sign the interview that out of date.
	for(var j =0; j<aNames.length; j++)
	{
		if(jQuery.inArray(aNames[j], aToKeepedNames)<0)
		{
			oDataDir.getFile(aNames[j]+"/"+S_LOCK_FILE_NAME, {create: false, exclusive: false},utils.removeFile);
		}
	}
	return aNewInterviews;
	
};


synchronizer.downloadInterviews=function(aInterviews)
{
	var oInterview;
	var oFileTransfer = new FileTransfer();
	oFileTransfer.onprogress = function(oProgressEvent) {
		if (oProgressEvent.lengthComputable) {
           synchronizer.showStatus(oInterview.name,oProgressEvent.total,oProgressEvent.loaded);
		} 
	};
	
	function downloadInterview()
	{
		function downloadFile(sId,sType,fScceeded)
		{
			function doDownloadFile()
			{
				oFileTransfer.download(utils.getFileUrl(synchronizer.sServerPrifix,sId),utils.getFilePath(oInterview.name,sType),fScceeded,synchronizer.downloadError);
			}
			return doDownloadFile;
		}
		
		function interviewDownloaded(oInfoFile)  
		{
			oDataDir.getFile(oInterview.name+"/"+S_LOCK_FILE_NAME, {create: true, exclusive: false});
			lister.showInterviewByFile(oInfoFile);
			downloadInterview();
		}
		
		oInterview=aInterviews.pop();
		if(oInterview!==undefined)
		{
			var fDownloadInfo= downloadFile(oInterview.info,"inf",interviewDownloaded);
			var fDownloadLine= downloadFile(oInterview.line,"txt",fDownloadInfo);
			var fDownloadPic= downloadFile(oInterview.pic,"jpg",fDownloadLine);
			var fDownloadMp3= downloadFile(oInterview.mp3,"mp3",fDownloadPic);
			fDownloadMp3();
		}
		else{
			synchronizer.showSyncSuccess();
		}
	}
	downloadInterview();
};

synchronizer.showStatus=function(interviewName,total,loaded)
{
	listFooter.html(interviewName  +": "+ (loaded >> 10) +"K of "+(total >> 10)+"K");
};

synchronizer.showSyncStart=function()
{
	$("#syncButton").button('disable');
	listFooter.html("Start to Synchronize...");
};

synchronizer.showSyncSuccess=function()
{
	$("#syncButton").button('enable');
	listFooter.html("Congratulations: All is up to date!");
};



synchronizer.enableSyncButton=function()
{
	$("#syncButton").button('enable');
};

synchronizer.showNetworkError=function(){
	listFooter.html("<div style=\"color:yellow;\">Internet is not connected!</div>");
};

synchronizer.showServerError=function()
{
	listFooter.html("<div style=\"color:yellow;\">Server is too busy. Please try again 3 minutes later</div>");
};

synchronizer.clearNetworkError=function(){
	$("#networkError").popup( "close" );
	listFooter.html("");
};

synchronizer.downloadError=function(oError)
{
	
	if(FileTransferError.CONNECTION_ERR===oError.code)
	{
		synchronizer.showNetworkError();
	}
	else{
		synchronizer.showServerError();
	}
	synchronizer.enableSyncButton();
};
