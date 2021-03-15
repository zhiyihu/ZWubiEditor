var PhraseStorage = (function() {
	function PhraseStorage() {}
	PhraseStorage.phraseObj = {};
	PhraseStorage.loadText = function(text) {
		//var arr = text.match(/[\u4e00-\u9fa5]{1,10}\t[a-z]{1,4}/g);
		var arr = text.match(/\S{1,20}\t[a-z]{1,4}/g);
		if (!arr || arr.length == 0) {
			PhraseStorage.phraseObj = {};
			PhraseStorage.codes = [];
			return;
		}
		for (var p of arr) {
			var t = p.indexOf("\t");
			var code = p.substr(t + 1);
			var term = p.substr(0, t);
			PhraseStorage.addPhrase(code, term);
		}
		PhraseStorage.phraseObj["modf"] = [PhraseStorage.getDateVersionStr()];
	}

	PhraseStorage.getDateVersionStr = function() {
		var date = new Date();
		var res = "";
		res += PhraseStorage.getNumStr(date.getFullYear(), true) + "年";
		res += PhraseStorage.getNumStr(date.getMonth() + 1) + "月";
		res += PhraseStorage.getNumStr(date.getDate()) + "日";
		return res;
	}

	PhraseStorage.getNumStr = function(num, isStage) {
		var numStr = "零一二三四五六七八九";
		if (isStage) {
			var res = "";
			for (var c of num.toString()) {
				res += numStr.charAt(c);
			}
			return res;
		}
		if (num < 10) {
			return numStr.charAt(num);
		} else {
			var tenN = parseInt(num / 10);
			var oneN = num % 10;
			return (tenN == 1 ? "" : numStr.charAt(tenN)) + "十" + (oneN == 0 ? "" : numStr.charAt(oneN));
		}
	}

	PhraseStorage.addPhrase = function(code, term) {
		if (!PhraseStorage.phraseObj[code]) {
			PhraseStorage.phraseObj[code] = [term];
		} else if (PhraseStorage.phraseObj[code].indexOf(term) < 0) {
			PhraseStorage.phraseObj[code].push(term);
		}
	}

	PhraseStorage.deletePhrase = function(code, term) {
		var phrase = PhraseStorage.phraseObj[code];
		if (phrase) {
			var index = phrase.indexOf(term);
			if (index >= 0) {
				phrase.splice(index, 1);
				if (phrase.length > 0) {
					PhraseStorage.phraseObj[code] = phrase;
				} else {
					delete PhraseStorage.phraseObj[code];
				}
			}
		}
	}

	PhraseStorage.updatePhraseOrder = function(code, term, move) {
		if (move != 1 && move != -1) {
			return;
		}
		var phrase = PhraseStorage.phraseObj[code];
		if (phrase) {
			var index = phrase.indexOf(term);
			var len = phrase.length;
			if (index < 0 || (index == 0 && move == -1) || (index == len - 1 && move == 1)) {
				return;
			}
			var temp1 = phrase[index];
			var temp2 = phrase[index + move];
			PhraseStorage.phraseObj[code][index + move] = temp1;
			PhraseStorage.phraseObj[code][index] = temp2;
		}
	}

	PhraseStorage.getCodes = function() {
		var codes = [];
		for (var key in PhraseStorage.phraseObj) {
			codes.push(key);
		}
		codes.sort();
		return codes;
	}

	PhraseStorage.getTerms = function(code) {
		var phrase = PhraseStorage.phraseObj[code];
		var temp = [];
		if (!phrase) {
			return [];
		}
		for (var term of phrase) {
			temp.push(term);
		}
		return temp;
	}

	PhraseStorage.getPhraseArr = function() {
		var phraseArr = [];
		var codes = PhraseStorage.getCodes();
		for (var code of codes) {
			var phrase = [];
			Array.prototype.push.apply(phrase, [code]);
			Array.prototype.push.apply(phrase, PhraseStorage.getTerms(code));
			phraseArr.push(phrase);
		}
		return phraseArr;
	}

	PhraseStorage.isEmpty = function() {
		var str = JSON.stringify(PhraseStorage.phraseObj);
		return (str == "{}" || str == "null");
	}
	return PhraseStorage;
}());
