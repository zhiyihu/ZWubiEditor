function MainUI() {
	this.realFileBtn = document.getElementById("real-file-btn");
	this.selFileBtn = document.getElementById("sel-file-btn");
	this.codeIpt = document.getElementById("code-ipt");
	this.tranCodeBtn = document.getElementById("tran-code-btn");
	this.saveCodeBtn = document.getElementById("save-code-btn");
	this.clearCodeBtn = document.getElementById("clear-code-btn");
	this.msWbBtn = document.getElementById("ms-wb-btn");
	this.baiduWbBtn = document.getElementById("baidu-wb-btn");
	this.jidianWbBtn = document.getElementById("jidian-wb-btn");
	this.duoduoWbBtn = document.getElementById("duoduo-wb-btn");
	this.downloadAllBtn = document.getElementById("download-all-btn");
	this.msDatBtn = document.getElementById("ms-wb-dat-btn");
	this.fileNameLabel = document.getElementById("zfile-name-label");
	this.tipLabel = document.getElementById("oper-tip-label");
	this.addPhraseArea = document.getElementById("add-phrase-area");
	this.codePhraseArea = document.getElementById("code-phrase-area");
	this.phraseUl = document.getElementById("phrase-ul");
	this.tipLabel.style.visibility = "hidden";
	this.phraseUl.style.visibility = "hidden";
	this.selectIndex = 0;
	this.iptVal = "";
}
MainUI.prototype.showTip = function(tip){
	if(!tip){
		return;
	}
	this.tipLabel.innerText = tip;
	this.tipLabel.style.visibility = "visible";
	setTimeout(()=>{
		this.tipLabel.style.visibility = "hidden";
	}, 2100);
	
}

MainUI.prototype.refreshPhraseUl = function(index){
	if(this.iptVal != this.codeIpt.value){
		this.iptVal = this.codeIpt.value;
	}else if(index != 1 && index != -1 && index != 0){
		return;
	}
	if(index != null){
		this.selectIndex += index;
		this.selectIndex = (this.selectIndex < 0 ? 0 : this.selectIndex);
	}else{
		this.selectIndex = 0;
	}
	var value = this.codeIpt.value;
	if(value.match(/[a-z]{1,4}/g)){
		var terms = PhraseStorage.getTerms(value);
		if(!terms || terms.length == 0){
			this.phraseUl.style.visibility = "hidden";
			return;
		}
		this.phraseUl.style.visibility = "visible";
		var lis = "";
		this.selectIndex = (this.selectIndex > terms.length - 1 ? terms.length - 1 : this.selectIndex);
		for(var i in terms){
			var term = terms[i];
			lis += `<li class="${i == this.selectIndex ? "ph-sel":""}"><i>${i-0+1}</i><span>${term}</span></li>`;
		}
		this.phraseUl.innerHTML = lis;
	}else{
		this.phraseUl.style.visibility = "hidden";
	}
}


window.onload = function() {
	var ui = new MainUI();
	ui.selFileBtn.onclick = function() {
		ui.realFileBtn.click();
	}
	//选择文件事件
	ui.realFileBtn.onchange = function() {
		if (!this.files || this.files.length == 0) {
			return;
		}
		var file = this.files[0];
		if (file.size > 5 * 1024 * 1024) {
			ui.showTip("File more than 3MB!");
			this.value = null;
			return;
		}
		if(file.type != "text/plain" || file.name.indexOf(".txt") < 0){
			ui.showTip("This is not text file!");
			this.value = null;
			return;
		}
		var reader = new FileReader();
		reader.onload = function() {
			PhraseStorage.loadText(this.result);
			var codes = PhraseStorage.getCodes();
			ui.fileNameLabel.innerHTML = file.name + "&nbsp;&nbsp;&nbsp;&nbsp;词条数:&nbsp;" + codes.length;
		}
		reader.readAsText(file);
	}
	
	ui.codeIpt.onkeydown = function(e){
		if(e.keyCode == 13){
			ui.codeIpt.value = "";
			ui.refreshPhraseUl();
			return;
		}
		if(e.keyCode !=8 && (e.keyCode < 65 || e.keyCode > 90)){
			e.returnValue = false;
			return;
		}
		
	}
	ui.codeIpt.onkeyup = function(e){
		ui.codeIpt.value = ui.codeIpt.value.replace(/[^a-z]/g, "");
		if(e.keyCode == 37){
			if(e.ctrlKey){
				var code = ui.codeIpt.value;
				var terms = PhraseStorage.getTerms(code);
				if(terms && terms.length >0 && ui.selectIndex >= 0 && ui.selectIndex <= terms.length -1){
					PhraseStorage.updatePhraseOrder(code,terms[ui.selectIndex], -1);
					ui.refreshPhraseUl(-1);
				}
				return;
			}else{
				ui.refreshPhraseUl(-1);
				return;
			}
		}
		
		if(e.keyCode == 39){
			if(e.ctrlKey){
				var code = ui.codeIpt.value;
				var terms = PhraseStorage.getTerms(code);
				if(terms && terms.length >0 && ui.selectIndex >= 0 && ui.selectIndex <= terms.length -1){
					PhraseStorage.updatePhraseOrder(code,terms[ui.selectIndex], 1);
					ui.refreshPhraseUl(1);
				}
				return;
			}else{
				ui.refreshPhraseUl(1);
				return;
			}
		}
		if(e.keyCode == 46 && e.ctrlKey){
			var code = ui.codeIpt.value;
			var terms = PhraseStorage.getTerms(code);
			if(terms && terms.length >0 && ui.selectIndex >= 0 && ui.selectIndex <= terms.length -1){
				PhraseStorage.deletePhrase(code,terms[ui.selectIndex]);
				ui.refreshPhraseUl(0);
			}
			return;
		}
		if(e.keyCode !=8 && (e.keyCode < 65 || e.keyCode > 90)){
			e.returnValue = false;
			return;
		}
		ui.refreshPhraseUl();
	}
	ui.codeIpt.onblur = function(){
		ui.codeIpt.value = "";
		ui.refreshPhraseUl();
	}
	
	
	ui.tranCodeBtn.onclick = function(){
		var text = document.getElementById("add-phrase-area").value;
		if(!text)return;
		var codeTerm = ChStr.getMuchCodes(text);
		document.getElementById("code-phrase-area").value = codeTerm;
	}
	
	ui.clearCodeBtn.onclick = function(){
		document.getElementById("code-phrase-area").value = "";
		document.getElementById("add-phrase-area").value = "";
	}
	
	ui.saveCodeBtn.onclick = function(){
		var text = document.getElementById("code-phrase-area").value;
		var arr = text.match(/\S{1,20}\t[a-z]{1,4}/g);
		if (!arr || arr.length == 0) {
			return;
		}
		for (var p of arr) {
			var t = p.indexOf("\t");
			var code = p.substr(t + 1);
			var term = p.substr(0, t);
			PhraseStorage.addPhrase(code, term);
		}
		ui.showTip("add success");
	}
	
	ui.msWbBtn.onclick = function(){
		var phrasArr = PhraseStorage.getPhraseArr();
		var msWb = new MsWubi(phrasArr);
		DownloadUtil.downloadBuffFile("ChsWubiNew.lex", msWb.getMainPhraseBuff());
	}
	
	ui.msDatBtn.onclick = function(){
		var phrasArr = PhraseStorage.getPhraseArr();
		var msWb = new MsWubi(phrasArr);
		DownloadUtil.downloadBuffFile("UserDefinedPhrase.dat", msWb.getCustomPhraseBuff());
	}

	ui.baiduWbBtn.onclick = function(){
		var phrasArr = PhraseStorage.getPhraseArr();
		var bdWb = new BdWubi(phrasArr);
		var date = new Date();
		var dtStr = (date.getFullYear() % 100) + "." + (date.getMonth() + 1) + "." + (date.getDate());
		DownloadUtil.downloadBuffFile("ZYH_Baidu_" + dtStr + ".bin", bdWb.getMainPhraseBuff());
	}
	
	ui.duoduoWbBtn.onclick = function(){
		var phrasArr = PhraseStorage.getPhraseArr();
		var ddWb = new DdWubi(phrasArr);
		var date = new Date();
		var dtStr = (date.getFullYear() % 100) + "." + (date.getMonth() + 1) + "." + (date.getDate())
		DownloadUtil.downloadBuffFile("ZYH_Duoduo_" + dtStr + ".txt", ddWb.getMainPhraseBuff());
	}

	ui.jidianWbBtn.onclick = function(){
		var phrasArr = PhraseStorage.getPhraseArr();
		var jdWb = new JdWubi(phrasArr);
		var date = new Date();
		var dtStr = (date.getFullYear() % 100) + "." + (date.getMonth() + 1) + "." + (date.getDate())
		DownloadUtil.downloadBuffFile("ZYH_Jidian_" + dtStr + ".txt", jdWb.getMainPhraseBuff());	
	}
	
}

document.onkeydown = function(e) {
	if (e.ctrlKey && e.keyCode == 83) {
		e.returnValue = false;
		return;
	}
}
