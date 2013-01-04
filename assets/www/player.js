var player={};
player.qaIndex=0;
player.interviewName=undefined;
player.line=undefined;
player.mp3=undefined;
player.interval=undefined;
	
player.setInterview=function(sInterviewName)
{
	if (this.mp3!==undefined)
	{
		this.pauseMp3();
		this.mp3.stop();
		this.mp3.release();
	}
	player.interviewName=sInterviewName;
    player.showTitle(player.interviewName);
    player.initMp3(player.interviewName);
	oDataDir.getFile(player.interviewName+"/"+player.interviewName+".txt", 
			{create: false, exclusive: false}, 
			function(oLineFileEntry)
			{
				player.line = utils.getJson(oLineFileEntry);
				player.qaIndex=0;
				player.showLine();
			});
};
	
player.initMp3=function(sInterviewName)
{
	this.mp3 = new Media(oDataDir.fullPath+"/"+sInterviewName+"/"+sInterviewName+".mp3");
};
	
player.nextQa=function()
{
	if(this.qaIndex<this.line.qas.length-1)
	{
		this.qaIndex++;
	}
	this.showLine();
	this.mp3.seekTo(1000*this.line.qas[this.qaIndex].t-500);
};

player.preQa=function ()
{
	if(this.qaIndex>0)
	{
		this.qaIndex--;
	}
	this.showLine();
	this.mp3.seekTo(1000*this.line.qas[this.qaIndex].t-500);
};
	
player.preTime=function ()
{
	this.mp3.getCurrentPosition(
			function(position) {
				if(position>5+player.line.qas[0].t){
					player.mp3.seekTo((position-5)*1000);
				}
			});
};
	
	player.nextTime=function ()
	{
		this.mp3.getCurrentPosition(
				function(position) {
					player.mp3.seekTo((position+5)*1000);
				});
	};

	player.showLine=function ()
	{
		var markup = "<b><i>("+(this.qaIndex+1)+"/"+this.line.qas.length+")</i>"+this.line.qas[this.qaIndex].q +"</b><p>"+this.line.qas[this.qaIndex].a +"</p>";
		$("#player").children( ":jqmData(role=content)" ).html( markup );
		$.mobile.silentScroll(0);
	};


	player.showTitle=function(sInterviewName)
	{
		$("#player").children( ":jqmData(role=header)" ).children("h6").html(sInterviewName);
	};
	
	player.pauseMp3=function()
	{
		this.mp3.pause();
		$('#playPauseButton').buttonMarkup({ icon: "play" });
		$('#playPauseButton').find('.ui-btn-text').text("Play");
		$('#playPauseButton').attr("ontouchstart", "player.playtMp3();");
		this.intervalCheckPause();
	};
	
	player.playtMp3=function()
	{
		this.mp3.play();
		$('#playPauseButton').buttonMarkup({ icon: "pause" });
		$('#playPauseButton').find('.ui-btn-text').text("Pause");		
		$('#playPauseButton').attr("ontouchstart", "player.pauseMp3();");		
		this.intervalCheckStart();
	};
	
	player.intervalCheckStart=function()
	{
		this.interval = setInterval(function() {
			player.mp3.getCurrentPosition(
					function(position) {
						//at the end of interview
						if(player.qaIndex===(player.line.qas.length-1) &&position<=0){
							player.setInterview(player.interviewName);
						}
						else if(position > player.line.qas[player.qaIndex+1].t-1) {
							player.qaIndex++;
							player.showLine();
						}
						else if(position < player.line.qas[player.qaIndex].t && player.qaIndex>0) {
							player.qaIndex--;
							player.showLine();
						}
					});
        }, 1000);
		
	};
	
	player.intervalCheckPause=function()
	{
		clearInterval(this.interval);
	};