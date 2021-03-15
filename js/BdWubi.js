var BdWubi = function(phraseArr){
    this.phraseArr = phraseArr;
    this.alphArr = new Array(26).fill(0);
}

BdWubi.prototype.getMainPhraseBuff = function (){
    var pBody = [];
	var order = 0;
	var i = 0;
    for(var phrase of this.phraseArr){
		var code = phrase[0];
		var alphaIndex = code.charCodeAt(0) - 97;
        for(i = 1, order = 1; i < phrase.length; i++){
			var term = phrase[i];
			var sgArr = this.getSingleBuff(code, term, order);
            Array.prototype.push.apply(pBody, sgArr);
            this.alphArr[alphaIndex] += sgArr.length;
			order++;
        }
    }
    var pHead = [0x04, 0x00, 0x00, 0x00, 0x00];
    var s = 0;
    for(var n of this.alphArr){
        s += n;
        Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(s));
    }
	pHead = pHead.concat(pBody);
    return pHead;
}

BdWubi.prototype.sum = function (arr){
    var sum = 0;
    for(var a of arr){
        sum += a;
    }
    return sum;
}


BdWubi.prototype.getSingleBuff = function (code, term, order){
    var arr = [];
    Array.prototype.push.apply(arr, [code.length + (order > 1 ? 2 : 0)]);
    Array.prototype.push.apply(arr, [0x02 + term.length * 2]);
    for(var c of code){
    	Array.prototype.push.apply(arr, [c.charCodeAt(0)]);	
    }
	Array.prototype.push.apply(arr, (order > 1 ? [0x3d, 0x30 + order] : []));
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(term));
    Array.prototype.push.apply(arr, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    return arr;
}