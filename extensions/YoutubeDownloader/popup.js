function isYoutubeVideo(url) {
	return url.indexOf("https://www.youtube.com/watch?v=") >= 0;
}

function getId(url) {
		var ytid = url.split('v=')[1];
		var ampersandPosition = ytid.indexOf('&');
		if(ampersandPosition != -1) {
			ytid = ytid.substring(0, ampersandPosition);
		}
		return ytid;
}

function getVideoName(title) {
	return title.replace(" - YouTube", "");
}

var session = chrome.extension.getBackgroundPage().session;
var queue = chrome.extension.getBackgroundPage().queue;
var queueTableBody = $("#queue tbody");

function showQueue() {
	for (qid in queue) {
		var item = queue[qid];
		addToQueue(qid, item.artist, item.title, item.readyState);
	}
	if (queue.length > 0) {
		$("#queue").show();
	}
}

function hideQueue() {
	$("#queue").hide();
}

function addToQueue(qid, artist, title, readyState) {
	imgSrc = readyState ? "ready.png": "loading.gif";
	queueTableBody.prepend("<tr id='"+qid+"'><td>"+artist+"</td><td>"+title+"</td><td><img  width='16px' src='images/"+imgSrc+"'/></td>/tr>");
	$("#queue").show();
}

function updateQueueReadyState(qid) {
	queueTableBody.find("#"+qid+" img").attr("src", "images/ready.png");
}

function showMessage(string) {
	$("#message span").text(string);
	$("#message").show();
}

function hideMessage() {
	$("#message").hide();
}

function showDownload(videoName) {
	if (videoName.indexOf(" - ") > -1) {
		var artist = videoName.split(" - ")[0].replace(/[\\\/:*?"<>|]/g, "");
		var title = videoName.split(" - ")[1].replace(/[\\\/:*?"<>|]/g, "");
	}
	else {
		var artist = "";
		var title = videoName;
	}

	$("#artist").val(artist);
	$("#title").val(title);
	$("#download").show();
	$("#title").select();
}

function hideDownload() {
	$("#download").hide();
}

function showLogin(tab) {
	$("#submit").removeClass("disabled");
	$("#login").show();
}

function hideLogin() {
	$("#login").hide();
}

async function getStatus() {
    let data = await ajax_call({
        url: "https://dupbit.com/api/loginStatus",
        type: "get",
        data: {
            origin: chrome.runtime.id,
        },
        xhrFields : {
            withCredentials: true
        },
    });
    return data;
}

async function ajax_call(object) {
    return new Promise((resolve, reject) => {
        $.ajax(object).done((data) => {
            resolve(data);
        });
    });
}

class Client {
    constructor(tab) {
        this.tab = tab;
        this.update();
    }

    async update() {
        this.status = await getStatus();
        if (!this.status.isLoggedIn) {
            hideDownload();
            hideQueue();
            hideMessage();
            showLogin(tab);
        } else {
            this.updatePopup();
        }
    }

    updatePopup() {
        if (this.status.isLoggedIn) {
            if (this.status.level >= 2) {
                if (isYoutubeVideo(this.tab.url)) {
                    var videoName = getVideoName(this.tab.title);
                    hideMessage();
                    showDownload(videoName);
                } else {
                    hideDownload();
                    showMessage("Go to a YouTube video to download it.");
                }
                showQueue();
            } else {
                hideDownload();
                hideQueue();
                showMessage("You have no permission to use this app.");
            }
        } else {
            hideDownload();
            hideQueue();
            hideMessage();
            showLogin(tab);
        }
        var height = $("#banner").outerHeight() + $("#message:visible").outerHeight() + $("#download:visible").outerHeight() + $("#queue:visible").outerHeight();
        $("html, body").height(height);
    }

    async login(tab, username, password) {
        let data = await ajax_call({
            url: "https://dupbit.com/api/login",
            type: "post",
            data: {
                username,
                password,
                remote: true,
                origin: chrome.runtime.id,
            },
            xhrFields : {
                withCredentials: true
            },
        });
        if (data.success && data.login) {
            this.status = await getStatus();
            this.updatePopup(tab);
        } else {
            showMessage("Login credentials incorrect.");
            //reset
        }
    }
};

chrome.tabs.query({active: true, currentWindow: true}, async (tabList) => {
	const tab = tabList[0];
    const status = await getStatus();

    const client = new Client(tab);

	$("#login form").submit(() => {
		$("#submit").addClass("disabled");
		const username = $("#username").val();
		const password = $("#password").val();
		Client.login(tab, username, password);
		return false;
	});

	if (isYoutubeVideo(tab.url)) {
		var ytid = getId(tab.url);

		$("#download form").submit(function() {
			var artist = $("#artist").val().replace(/[\\\/:*?"<>|]/g, "");
			var title = $("#title").val().replace(/[\\\/:*?"<>|]/g, "");
			var qid = queue.length;
			queue.push({artist: artist, title: title, readyState: false});
			addToQueue(qid, artist, title, false);
			chrome.extension.getBackgroundPage().download(qid, tab.url, title, artist);
			return false;
		});
	}

});
