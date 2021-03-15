var PhraseUtil = (function () {
	function PhraseUtil() {
	}

	PhraseUtil.getUnicodeBuff = function (num, bit) {
		var arr = [];
		for (var i = 0; i < bit; i++){
			arr.push(Math.floor(num % Math.pow(0x100, i + 1)) / Math.pow(0x100, i));
		}
		return arr;
	}
	PhraseUtil.getNumBuff = function (num) {
		return PhraseUtil.getUnicodeBuff(num , 4);
	};

	PhraseUtil.getChBuff = function (ch) {
		var charCode = ch.charCodeAt(0);
		return PhraseUtil.getUnicodeBuff(charCode , 2);
	};

	PhraseUtil.getStrBuff = function (str, len) {
		var arr = [];
		for (var ch of str) {
			Array.prototype.push.apply(arr, PhraseUtil.getChBuff(ch));
		}
		if(len && len > str.length){
			for(var i = 0; i < len - str.length; i++){
				arr.push(0);
				arr.push(0);
			}
		}
		return arr;
	}

	return PhraseUtil;
} ());

