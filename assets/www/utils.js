var utils={};
utils.getFileUrl = function(sServerPrifix,sId)
{
	return sServerPrifix+sId;
};

utils.getFilePath = function(sName,sType)
{
	return oDataDir.fullPath+"/"+sName+"/"+sName+"."+sType;
};

utils.getJson=function(oFileEntry){
	var oJson;
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		oJson=JSON.parse(evt.target.result);
    };
    reader.readAsText(oFileEntry);
    reader.abort();
    return oJson;
};

utils.playInterview=function(sInterviewName)
{
	player.setInterview(sInterviewName);
	player.playtMp3();
};

utils.removeFile=function(file){
	file.remove();
};