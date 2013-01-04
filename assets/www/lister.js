var lister={};

lister.showLocalIntervews=function(){
	oDataDir.getFile(S_REMOTE_INTERVIEW_LIST_NAME,{create: false, exclusive: false},
			function(oListFileEntry){
				var oInterviewList=utils.getJson(oListFileEntry);
				for(var i=0;i<oInterviewList.interviews.length;i++)
				{
					var sName=oInterviewList.interviews[i].name;
					lister.showInterviewByName(sName);
				}
			},
			function(){
				$("#noListFile").popup( "open" );
			});
};

lister.clean=function (){
	var oDataDirReader = oDataDir.createReader();
	oDataDirReader.readEntries(function(entries){
		for (var i=0; i<entries.length; i++) {
			if(entries[i].isDirectory){
				lister.cleanDir(entries[i]);
			}
		}
		
	});
};

lister.cleanDir=function (oDirectoryEntry){
	oDirectoryEntry.getFile(S_LOCK_FILE_NAME,{create: false, exclusive: false},
			function(){},
			function()
			{
				oDirectoryEntry.removeRecursively();
			});
};

lister.showInterviewByName=function(sName){
	oDataDir.getFile(sName+"/"+S_LOCK_FILE_NAME,{create: false, exclusive: false},
			function(){
				oDataDir.getFile(sName+"/"+sName+".inf",{create: false, exclusive: false},
						function(oInfoFileEntry){
							lister.showInterviewByFile(oInfoFileEntry);
						});
			});
};

lister.showInterviewByFile=function(oInfoFileEntry){
	var oInfo=utils.getJson(oInfoFileEntry);
	var sInterviewLi="<li data-theme=\"b\"><a href=\"#player\" onclick=\"utils.playInterview('"+ oInfo.name +"')\"><img src=\""+utils.getFilePath(oInfo.name,"jpg")+"\"></img><h3>" + oInfo.name + "</h3><p>"+oInfo.author+"</p><p>"+oInfo.time+"</p></a><a data-icon=\"page\" onclick=\"lister.showInfo('"+ oInfo.name+"')\"></a></li>";
	listview.prepend(sInterviewLi);
	listview.listview('refresh');
};


lister.showInfo=function(sInterviewName){
	oDataDir.getFile(sInterviewName+"/"+sInterviewName+".inf", 
			{create: false, exclusive: false}, 
			function(oInfoFileEntry)
			{
				var oInfo =utils.getJson(oInfoFileEntry);
				$("#interviewInfo").children( ":jqmData(role=header)" ).children("p").html(oInfo.fullName);
				$("#interviewInfo").children( ":jqmData(role=content)" ).children("p").html(oInfo.desc);
				$("#interviewInfo").popup( "open" );
			});
};