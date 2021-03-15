var DownloadUtil = (function () {
    function DownloadUtil() {
    }
	
    DownloadUtil.downloadBuffFile = function (fileName, buffArr) {
		var bf = new Uint8Array(buffArr);
		var data = new Blob([bf],{type:"application/octet-stream"});
		var downloadUrl = window.URL.createObjectURL(data);
		var anchor = document.createElement("a");
		anchor.href = downloadUrl;
		anchor.download = fileName;
		anchor.click();
		window.URL.revokeObjectURL(data);
    };
	
	DownloadUtil.downloadTextFile = function (fileName, text) {
		var buffArr = [0xff, 0xfe];
		for(var ch of text){
			var ucode = ch.codePointAt(0);
			buffArr.push(ucode % 0x100);
			buffArr.push(Math.floor(ucode / 0x100) % 0x100);
		}
		DownloadUtil.downloadBuffFile(fileName, buffArr);
    };

    return DownloadUtil;
}());