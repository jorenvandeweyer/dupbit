const fs = require("fs")

function pack(bytes) {
    var chars = [];
    for(var i = 0, n = bytes.length; i < n;) {
        chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
}

function unpack(str) {
    var bytes = [];
    for(var i = 0, n = str.length; i < n; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
}

function packString (string) {
	let hexstring = "";
	for (let i = 0; i < string.lenght; i++) {
		const char = string.charCodeAt(i);
        const hexchar = pack(char, "hex");
		hexstring += hexchar;
	}
	return hexstring;
}

// Size of the given string in hex
function byteSizeString(string) {
    // return Buffer.from((string.length+1).toString(), "hex");
	return pack((string.length+1).toString());
}

// Convert the given bytestring to an integer
function getSize(byteString) {
	return unpack(byteString)[1];
}

function flag() {
    // return Buffer.from([0, 0, 0], "hex");
	return pack([0, 0, 0]);
}

function version() {
    // return Buffer.from([3, 0, 0], "hex");
	return pack([3, 0, 0]);
}

function createTitleTag(title) {
    return "TIT2" + byteSizeString(title) + flag() + packString(title);
}

function createArtistTag(artist) {
    return "TPE1" + byteSizeString(artist) + flag() + packString(artist);
}

function createID3Tag(title, artist) {
    let titletag = "";
    let artisttag = "";

	if (title) {
		titletag = createTitleTag(title);
	}

	if (artist) {
		artisttag = createArtistTag(artist);
	}

	const size = byteSizeString(titletag + artisttag);

	return "ID3" + version() + size + titletag + artisttag;
}

function removeID3(filename) {
    let data = fs.readFileSync(filename, "utf8");

	if (data.substring(0, 3) === "ID3") {
		const n = getSize(data[6] + data[7] + data[8] + data[9]);
        data = data.substring(6 + n);
        fs.writeFileSync(filename, data);
	}
}

module.exports = {
    createID3Tag,
    removeID3,
};
