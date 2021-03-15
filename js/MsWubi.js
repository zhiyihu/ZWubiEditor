var MsWubi = function(phraseArr){
    this.phraseArr = phraseArr;
    this.alphArr = new Array(25).fill(0);
}

MsWubi.prototype.getMainPhraseBuff = function (){
    var pBody = [];
	var order = 0;
	var i = 0;
    for(var phrase of this.phraseArr){
		var code = phrase[0];
		var alphaIndex = code.charCodeAt(0) - 97;
		if(alphaIndex > 24){break;}
        for(i = 1, order = 1; i < phrase.length; i++){
			var term = phrase[i];
			if(term.length == 1 && !ChStr.isGb(term)){continue;}
			var sgArr = this.getSingleBuff(code, term, order);
            Array.prototype.push.apply(pBody, sgArr);
            this.alphArr[alphaIndex] += sgArr.length;
			order++;
        }
    }
    var pHead = [0x69, 0x6D, 0x73, 0x63, 0x77, 0x75, 0x62, 0x69, 0x01, 0x00, 0x01, 0x00, 0x40, 0x00, 0x00, 0x00, 0xA8, 0x00, 0x00, 0x00];
    var totalSize = this.sum(this.alphArr) + 168;
    Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(totalSize));
    Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(0x5ced4870));
    Array.prototype.push.apply(pHead, new Array(40).fill(0));
    var s = 0;
    for(var n of this.alphArr){
        s += n;
        Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(s));
    }
	pHead = pHead.concat(pBody);
    return pHead;
}

MsWubi.prototype.getCustomPhraseBuff = function (){
    var pBody = [];
    var order = 0;
    var i = 0;
	var lenArr = [];
    for(var phrase of this.phraseArr){
    	var code = phrase[0];
    	if(code.charAt(0) != 'z'){continue;}
        for(i = 1, order = 1; i < phrase.length; i++){
    		var term = phrase[i];
    		var sgArr = this.getSingleCustomBuff(code, term, order);
            Array.prototype.push.apply(pBody, sgArr);
            lenArr.push(sgArr.length);
    		order++;
        }
    }

    var pHead = [0x6d, 0x73, 0x63, 0x68, 0x78, 0x75, 0x64, 0x70, 0x02, 0x00, 0x60, 0x00, 0x01, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00];
    var totalSize = this.sum(lenArr) + 0x40 + 4 * lenArr.length;
    Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(0x40 + 4 * lenArr.length));
	Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(totalSize));
	Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(lenArr.length));
	Array.prototype.push.apply(pHead, [0xD2, 0x0B, 0x33, 0x5C]);
    Array.prototype.push.apply(pHead, new Array(28).fill(0));
    var s = 0;
    for(var n of lenArr){
        s += n;
        Array.prototype.push.apply(pHead, PhraseUtil.getNumBuff(s));
    }
	
    pHead = pHead.concat(pBody);
    return pHead;
}

MsWubi.prototype.sum = function (arr){
    var sum = 0;
    for(var a of arr){
        sum += a;
    }
    return sum;
}

MsWubi.prototype.getSingleBuff = function (code, term, order){
    var arr = [];
    Array.prototype.push.apply(arr, [0x10 + term.length * 2, 0x00]);
    Array.prototype.push.apply(arr, [order, 0x00]);
    Array.prototype.push.apply(arr, [code.length, 0x00]);
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(code, 4));
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(term));
    Array.prototype.push.apply(arr, [0x00, 0x00]);
    return arr;
}


MsWubi.prototype.getSingleCustomBuff = function (code, term, order){
    var arr = [0x10, 0x00, 0x10, 0x00];
    Array.prototype.push.apply(arr, [0x12 + code.length * 2 , 0x00]);
    Array.prototype.push.apply(arr, [order, 0x06, 0x00, 0x00, 0x00, 0x00]);
    Array.prototype.push.apply(arr, [0x4D, 0xC8, 0xC5, 0x23]);
	Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(code));
	Array.prototype.push.apply(arr, [0x00, 0x00]);
    Array.prototype.push.apply(arr, PhraseUtil.getStrBuff(term));
    Array.prototype.push.apply(arr, [0x00, 0x00]);
    return arr;
}
