queue = [];
session = "";

function download(qid, url, title, artist) {
	$.ajax({
		url: "https://dupbit.com/api/music/convert",
		type: "post",
		data: {
            remote: true,
            url,
            title,
            artist,
        },
		xhrFields : {
			withCredentials: true
		}
	}).done(function(response){
		if (title != "" && artist != "") {
			var name = artist + " - " + title;
		}
		else if (title == "" && artist != "") {
			var name = artist;
		}
		else if (title != "" && artist == "") {
			var name = title;
		}
		else if (title == "" && artist == "") {
			var name = ytid;
		}

		chrome.downloads.download({url: "https://dupbit.com/api/music/downloadSong?id="+response.id, filename: "youtubedownloader/"+name+".mp3"});
		queue[qid].readyState = true;
		var views = chrome.extension.getViews({
			type: "popup"
		});
		for (var i = 0; i < views.length; i++) {
			views[i].updateQueueReadyState(qid);
		}
	});
}
