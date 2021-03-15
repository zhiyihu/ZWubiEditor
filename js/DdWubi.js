var DdWubi = function(phraseArr){
    this.phraseArr = phraseArr;
}

DdWubi.prototype.getMainPhraseBuff = function (){
    var pBody = [];
	var i = 0;
    for(var phrase of this.phraseArr){
		var code = phrase[0];
        for(i = 1; i < phrase.length; i++){
			var term = phrase[i];
			var sgArr = this.getSingleBuff(code, term);
            Array.prototype.push.apply(pBody, sgArr);
        }
    }
    var pHead = [0xff, 0xfe];
	pHead = pHead.concat(pBody);
    return pHead;
}

DdWubi.prototype.getSingleBuff = function (code, term){
    var arr = [];
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(term));
	Array.prototype.push.apply(arr, [0x09, 0x00]);
	Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(code));
    Array.prototype.push.apply(arr, [0x0d, 0x00, 0x0a, 0x00]);
    return arr;
}