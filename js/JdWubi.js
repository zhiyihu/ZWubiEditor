var JdWubi = function(phraseArr){
    this.phraseArr = phraseArr;
}

JdWubi.prototype.getMainPhraseBuff = function (){
    var pBody = [];
	var order = 0;
	var i = 0;
    for(var phrase of this.phraseArr){
		var sgArr = this.getSingleBuff(phrase[0], phrase.slice(1));
        Array.prototype.push.apply(pBody, sgArr);
    }
    var pHead = [0xff, 0xfe];
	pHead = pHead.concat(pBody);
    return pHead;
}

JdWubi.prototype.getSingleBuff = function (code, terms){
    var arr = [];
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(code));
	Array.prototype.push.apply(arr, [0x20, 0x00]);
	Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(terms.join(" ")));
    Array.prototype.push.apply(arr, [0x0d, 0x00, 0x0a, 0x00]);
    return arr;
}