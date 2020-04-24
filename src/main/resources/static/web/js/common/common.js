(function() {
	var lastTime = 0;
	var vendors = [ 'webkit', 'moz' ];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
		window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

$(function() {
	searchGroupResize($('.clearfix.form-multi-col-panel'));
});

/*
 * String (yyyyMMdd 或 yyyy-MM-dd)转换为Date对象
 */
String.prototype.toDate = function() {
	if (Object.prototype.toString.call(this) == "[object String]") { // 判断是否为String对象
		if (this == null)
			return new Date();

		// yyyyMMdd格式输入
		if (this.length == 8) {
			return new Date(Date.parse(this.substring(4, 6) + "/" + this.substring(6, 8) + "/" + this.substring(0, 4)));
		} else if (this.length == 10) { // yyyy-MM-dd格式输入
			return new Date(Date.parse(this.substring(5, 7) + "/" + this.substring(8, 10) + "/" + this.substring(0, 4)));
		} else {
			return new Date();
		}
	} else {
		return new Date();
	}
};

/**
 * 字符串格式化 例：{0}的姓名.formatValue("张三") == 张三的姓名
 */
String.prototype.formatValue = function() {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function(m, i, o, n) {
		return args[i];
	});
};

/**
 * 弹出新窗口
 * 
 * @author fangdb
 * @param actionUrl
 * @return
 */
var openDialog = function(actionUrl) {
	window.open(actionUrl, "", "height=550, width=950, top=50, left=250, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
};

/**
 * 
 */
var openDialogNew = function(actionUrl) {
	var ww = window.screen.width;
    var hh = window.screen.height - 20;
	//window.open(actionUrl, "", "height=780, width=1200, top=50, left=250, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
    window.open(actionUrl, "", "height="+0.8*hh+", width="+0.7*ww+", top=50, left=250, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
};

/**
 * 日志页
 */
var openDialogVisit = function(actionUrl) {
	window.open(actionUrl, "", "height=550, width=1090, top=50, left=250, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
};

/**
 * 弹出新模式窗口
 * 
 * @author zhangxy
 * @param actionUrl
 * @return
 */
var showDialog = function(actionUrl, windowName) {

	window.open(actionUrl, windowName, "height=550, width=950, top=50, left=250, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
};



/**
 * 检测按钮权限
 */
function checkUserButton(code,node){
	var params={
			'code':code
		};
	stdAjax( basePath+"widget/checkUserButton",params,function(result) {
		if(result.data=='1'){
			node.show();
		}else{
			node.hide();
		}
		
	},function(){
		node.hide();
	});
	
}


/**
 * 返回当前页面URL地址的参数值
 * 
 * @param parName
 * @return
 */
function getPar(parName) {
	return getUrlPar(window.location.href, parName);
}

/**
 * 获取指定URL的特定参数值
 * 
 * @param url
 * @param parName
 * @return
 */
function getUrlPar(url, parName) {
	var urlPars = parseUrlPar(url);
	if (urlPars[parName] == null) {
		return "";
	}
	return urlPars[parName];
}

/**
 * 解析URL的参数
 * 
 * @author fangdb
 * @param paramStr
 * @return Array
 */
function parseUrlPar(url) {
	var aQuery = url.split("?"); // 取得Get参数
	var params = new Array();
	if (aQuery.length > 1) {
		var aBuf = aQuery[1].split("&");
		for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
			var aTmp = aBuf[i].split("="); // 分离key与Value
			params[aTmp[0]] = aTmp[1];
		}
	}
	return params;
}
/**
 * 获取url参数
 */
function GetRequest() {
	var url = location.search; // 获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
};

function displayQuery() {
	if ($("#search-area").is(":visible")) {
		$("#search-area").hide();
		$("#queryBtn").val("搜索 > >");
	} else {
		$("#search-area").show();
		$("#queryBtn").val("搜索 < <");
	}
}

/**
 * Jqgrid生成链接URL
 * 
 * @param text
 *            显示内容
 * @param method
 *            调用方法
 * @return
 */
function getHref(text, method) {
	return "<a href=javascript:" + method + " class='showunderline'>" + text + "</a>";
}

function checkIsNull(id, promptInfo) {
	var value = $("#" + id).val();
	if (null == value || $.trim(value) == "") {
		ctools.alert(promptInfo, "", "warning");
		$("#" + id).focus();
		return true;
	}

	return false;
}
/**
 * 判断是否为空，不提示信息
 * 
 * @param id
 * @return 空返回true
 */
function checkIsEmpty(id) {
	var value = $("#" + id).val();
	if (null == value || $.trim(value) == "") {
		return true;
	}

	return false;
}

/**
 * 检查是否为数字
 * 
 * @param value
 *            出入的数字
 * @return 为数字返回true,否则为false
 */
function isNumerical(value) {
	if (isNaN(value)) {
		return false;
	} else {
		return true;
	}
}

/**
 * 检查是否为数字
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @return 为数字返回true,否则为false
 */
function checkIsNumerical(id, promptInf) {
	if (!isNumerical($.trim($("#" + id).val()))) {
		alert(promptInf);
		$("#" + id).focus();
		return false;
	}
	return true;
}

/**
 * 格式化数字number(13,8)形式的校验
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNumerical138(id, promptInf) {
	if ($("#" + id).val() == "") {
		return false;
	}
	if ($("#" + id).val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + id).val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + id).val("");
		alert("请填写数字");
		$("#" + id).focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,7}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert(promptInf);
			$("#" + id).val("");
			$("#" + id).focus();
			return false;
		} else {
			$("#" + id).val(addFormatNumber(preRaseAmtNum));
		}
	}
}

/**
 * 5位整数 2位小数 格式化数字number(7,2)形式的校验
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNumerical72(id, promptInf) {
	if ($("#" + id).val() == "") {
		return false;
	}
	if ($("#" + id).val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + id).val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + id).val("");
		alert("请填写数字");
		$("#" + id).focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,5}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert(promptInf);
			$("#" + id).val("");
			$("#" + id).focus();
			return false;
		} else {
			$("#" + id).val(addFormatNumber(preRaseAmtNum));
		}
	}
}

function checkIsNum(id, promptInfo) {
	// var reg = /^\d+$/;
	var reg = /^(-?\d+)(\.\d+)?/;
	var value = $.trim($("#" + id).val());
	if (reg.exec(value) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		return false;
	}
	return true;
}

/**
 * 判断字符串是否为数字
 */
function checkStrIsNum(str) {

	// var reg = /^\d+$/;
	var reg = /^(-?\d+)(\.\d+)?/;

	if (reg.exec(str) == null) {
		return false;
	}
	return true;
}

/**
 * 判断是否为正数
 * 
 * @param id
 *            要判断的元素ID
 * @param promptInfo
 *            是否为数字的提示信息
 * @param promptInfo1
 *            是否大于0的提示信息
 * @returns {Boolean} 是正数返回true
 */
function checkIsPositiveNumber(id, promptInfo, promptInfo1) {
	if (!checkIsNum(id, promptInfo)) {
		return false;
	} else if ($("#" + id).val() > 0) {
		return true;
	} else {
		alert(promptInfo1);
		$("#" + id).focus();
		return false;
	}
}

/**
 * 判断是否为非负数
 * 
 * @param id
 *            要判断的元素ID
 * @param promptInfo
 *            是否为数字的提示信息
 * @param promptInfo1
 *            是否大于0的提示信息
 * @returns {Boolean} 是正数返回true
 */
function checkIsNonnegativeNumber(id, promptInfo, promptInfo1) {
	if (!checkIsNum(id, promptInfo)) {
		return false;
	} else if ($("#" + id).val() >= 0) {
		return true;
	} else {
		alert(promptInfo1);
		$("#" + id).focus();
		return false;
	}
}

/**
 * 
 * 判断正数，并弹出相应的提示信息
 * 
 * @param id
 *            要判断的元素ID
 * @param promptInfo
 *            是否为数字的提示信息
 * @param promptInfo1
 *            是否大于0的提示信息
 * @returns {Boolean} 是正数返回true
 */
function checkIsPositiveNumerical(id, promptInfo, promptInfo1) {
	var val = $.trim($("#" + id).val());
	if (("" == val) || (null == val)) {
		return false;
	}
	if (!isNumerical(val)) { // 判断是否为数字
		alert(promptInfo);
		return false;
	} else if ((val < 0) || (0 == val)) { // 判断不能为小于或者等于0
		alert(promptInfo1);
		return false;
	}
	return true;
}
/**
 * 判断非负数
 */
function checkIsNoNegaNum(id, promptInfo) {
	var reg = /^(\d+)(\.\d+)?/;
	if (reg.exec($("#" + id).val()) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		$("#" + id).val("");
		return true;
	}
	return false;
}
/**
 * 判断正整数
 */
function checkIsInt(id, promptInfo) {
	var reg = /0|(^[1-9]\d*$)/;
	var value = $.trim($("#" + id).val());
	if (reg.exec(value) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		return true;
	}
	return false;
}

/**
 * 验证是否全部为空格
 * @returns
 */
function  isEmptyStr(str){
	//为空或全部为空格
	if (str.match(/^[ ]*$/)) {
	       return true;
	}
	return false
}

function checkIsEmail(id, promptInfo) {
	var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	if (reg.exec($("#" + id).val()) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		return false;
	}
	return true;
}
/**
 * 判断手机号码
 * 
 * @param id
 * @param promptInfo
 * @return
 */
function checkIsMobilePhone(id, promptInfo) {
	var reg = /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/;
	if (reg.exec($("#" + id).val()) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		return false;
	}
	return true;
}

/**
 * 判断固定电话
 * 
 * @param id
 * @param promptInfo
 * @return
 */
function checkIsPhone(id, promptInfo) {
	var reg = /^\d{3,4}?-\d{7,8}?$/;
	if (reg.exec($("#" + id).val()) == null) {
		alert(promptInfo);
		$("#" + id).focus();
		return false;
	}
	return true;
}

function getCurDate() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}

	return year + "" + month + "" + day;
}
// 列表打开文件
function makeClickHtml(value, options, rData) {
	var prdCode = rData["PRDCODE"];
	var prjCode = rData["PRJCODE"];
	return prdHref(value, "viewForm('" + prdCode + "', '" + prjCode + "')");
}

function prdHref(value, method, style) {
	return "<a href=\"javascript:" + method + "\" class='showunderline'>" + value + "&nbsp;</a>";
}

function viewForm(prdCode, prjCode) {
	var vaH = screen.availHeight;
	var vaW = screen.availWidth;

	var actionUrl = "/CMFKMProject/WA_SpecialServer/Wasp/Product/ProductViewAction.jsp?method=view&prjCode=" + prjCode + "&prdCode=" + prdCode;
	openDialog(actionUrl);
}

function getCurTime() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}

	var hour = myDate.getHours();
	var minutes = myDate.getMinutes();
	var seconds = myDate.getSeconds();
	if (hour < 10) {
		hour = "0" + hour;
	}

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}
/**
 * 验证是否有复核权限(考虑数据状态)
 * 
 * @param createId
 *            创建人ID
 * @param modifyId
 *            修改人ID
 * @param currentId
 *            当前操作ID
 * @param status
 *            状态
 */
function validateCheckWithStatus(createId, modifyId, currentId, status) {
	var flag = validateCheck(createId, modifyId, currentId);
	if (status != null && (status.toString() == "S" || status.toString() == "s") && flag) {
		return true;
	} else {
		return false;
	}
}
/**
 * 验证是否有复核权限
 * 
 * @param createId
 *            创建人ID
 * @param modifyId
 *            修改人ID
 * @param currentId
 *            当前操作ID
 */
function validateCheck(createId, modifyId, currentId) {
	if (modifyId != null && modifyId.toString().length > 0) { // 当修改人不为空
		if (modifyId.toString() == currentId.toString()) { // 修改人与当期操作人一致时,返回false;不一致时,返回true
			return false;
		} else {
			return true;
		}
	} else { // 当修改人为空,则和创建人比较
		if (createId.toString() == currentId.toString()) { // 当创建人与当前操作人一致时,返回false,不一致时,返回true
			return false;
		} else {
			return true;
		}
	}
}

/**
 * 验证是否有二次复核权限(考虑数据状态)
 * 
 * @param createId
 *            创建人ID
 * @param modifyId
 *            修改人ID
 * @param checkId
 *            复核人ID
 * @param currentId
 *            当前操作ID
 */
function validateSecondWithStatus(createId, modifyId, checkId, currentId, status) {
	var flag = validateSecondCheck(createId, modifyId, checkId, currentId);
	if (status != null && (status.toString() == "E" || status.toString() == "e") && flag) {
		return true;
	} else {
		return false;
	}
}

/**
 * 验证是否有二次复核权限
 * 
 * @param createId
 *            创建人ID
 * @param modifyId
 *            修改人ID
 * @param checkId
 *            复核人ID
 * @param currentId
 *            当前操作ID
 */
function validateSecondCheck(createId, modifyId, checkId, currentId) {
	if (modifyId != null && modifyId.toString().length > 0) { // 当修改人不为空
		if (modifyId.toString() == currentId.toString()) { // 修改人与当期操作人一致时,返回false;不一致时,返回true
			return false;
		} else if (checkId.toString() == currentId.toString()) {
			return false;
		} else {
			return true;
		}
	} else { // 当修改人为空,则和创建人比较
		if (createId.toString() == currentId.toString()) { // 当创建人与当前操作人一致时,返回false,不一致时,返回true
			return false;
		} else if (checkId.toString() == currentId.toString()) { // 当复核人与当前操作人一致时,返回false,不一致时,返回true
			return false;
		} else {
			return true;
		}
	}
}

/**
 * 判断一个复选框是否被选中
 * 
 * @return 如果被选中 返回true
 */
function chkIsSelected(name) {
	var chkInvesttarType = document.getElementsByName(name);

	var itTypeFlag = false;
	for (var i = 0; i < chkInvesttarType.length; i++) {
		if (chkInvesttarType[i].checked) {
			itTypeFlag = chkInvesttarType[i].checked;
		}
	}
	return itTypeFlag;
}

/**
 * 格式化银行账号
 * 
 * @param value
 * @return
 */
function fmtBankNum(value) {
	if (value) {
		value = value.replace(/(\d{4}\s*)/g, function($0, $1) {
			return $1.replace(/\s+$/g, "") + ' ';
		});
		value = value.replace(/\s+$/, "");
	}
	return value;
}

function setValue(fmEl, valEl, value, allowLength) {

	var bankNum = value.replace(/[^\d]/g, "");
	if (bankNum && bankNum.length > allowLength) {
		// ctools.alert("字符长度超出限制！","","warn");
		return;
	}
	// 设置隐藏域
	// fmEl.val(bankNum.replace(/\s+/g,""));
	// 设置显示域
	valEl.html(fmtBankNum(bankNum));

};

function bindBankNumFormat(fmId, valId, allowLength) {
	var bankEl = $("#" + fmId);
	if (!bankEl.size()) {
		return;
	}
	bankEl.each(function() {
		var fmEl = $("#" + fmId);
		var valEl = $("#" + valId);

		if ("onpropertychange" in this) {
			fmEl.bind("propertychange input", function() {
				setValue(fmEl, valEl, this.value, allowLength);
			});
		} else if ("oninput" in this) {
			fmEl.bind("input", function(e) {
				setValue(fmEl, valEl, this.value, allowLength);
			});
		}
		fmEl.bind("keydown", function(e) {
			document.getElementById(valId).style.display = "block";
			if ((e.keyCode >= 48 && e.keyCode <= 57) || //  
			(e.keyCode >= 96 && e.keyCode <= 105) || // 小键盘数字
			e.which === 37 || e.which === 39 // 左右键
					|| e.which === 46) { // 删除键
				setValue(fmEl, valEl, this.value, allowLength);
			} else {
				return;
			}
		});

		// 初始化
		setValue(fmEl, valEl, fmEl.val(), allowLength);

	});
};

// 去掉前后空格
String.prototype.Trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

function fmtNum(lowerAmtId, upperAmtId) {
	if ($("#" + lowerAmtId).val() == "") {
		$("#" + upperAmtId).html("大写：");
		return false;
	}
	var preRaseAmt = $("#" + lowerAmtId).val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + lowerAmtId).val("");
		$("#" + upperAmtId).html("大写：");
		return false;
	} else {
		$("#" + lowerAmtId).val(preRaseAmtNum.toLocaleString());
		$("#" + upperAmtId).html("大写：" + caseChina(preRaseAmt));
	}
}
/**
 * 13位整数 2位小数 投资指令通用使用
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNum_invest(lowerAmtId, upperAmtId) {
	if ($("#" + lowerAmtId + "").val() == "") {
		return false;
	}
	if ($("#" + lowerAmtId + "").val() == 0 || $("#" + lowerAmtId + "").val().substring(0, 1) == '-') {
		$("#" + lowerAmtId + "").val("");
		ctools.alert("请填写数字并大于零", "", "warning");
		$("#" + lowerAmtId + "").focus();
		return false;
	}
	var preRaseAmt = $("#" + lowerAmtId + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + lowerAmtId + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + lowerAmtId + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + lowerAmtId + "").val("");
			$("#" + lowerAmtId + "").focus();
			return false;
		} else {
			//
			if ($("#" + lowerAmtId).val() == "") {
				$("#" + upperAmtId).html("大写：");
				return false;
			}
			var preRaseAmt = $("#" + lowerAmtId).val().replace(/,/g, "");
			var preRaseAmtNum = new Number(preRaseAmt);
			if (!checkStrIsNum(preRaseAmtNum)) {
				$("#" + lowerAmtId).val("");
				$("#" + upperAmtId).html("大写：");
				return false;
			} else {
				$("#" + lowerAmtId).val(preRaseAmtNum.toLocaleString());
				$("#" + upperAmtId).html("大写：" + caseChina(preRaseAmt));
			}//

			$("#" + lowerAmtId + "").val(addFormatNumber(preRaseAmtNum));

		}
	}
}
// 强制赎回使用
function constraintRed(lowerAmtId, upperAmtId) {
	if ($("#" + lowerAmtId + "").val() == "") {
		return false;
	}
	var preRaseAmt = $("#" + lowerAmtId + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + lowerAmtId + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + lowerAmtId + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + lowerAmtId + "").val("");
			$("#" + lowerAmtId + "").focus();
			return false;
		} else {
			//
			if ($("#" + lowerAmtId).val() == "") {
				$("#" + upperAmtId).html("大写：");
				return false;
			}
			var preRaseAmt = $("#" + lowerAmtId).val().replace(/,/g, "");
			var preRaseAmtNum = new Number(preRaseAmt);
			if (!checkStrIsNum(preRaseAmtNum)) {
				$("#" + lowerAmtId).val("");
				$("#" + upperAmtId).html("大写：");
				return false;
			} else {
				$("#" + lowerAmtId).val(preRaseAmtNum.toLocaleString());
				$("#" + upperAmtId).html("大写：" + caseChina(preRaseAmt));
			}//

			$("#" + lowerAmtId + "").val(addFormatNumber(preRaseAmtNum));

		}
	}
}

function fmtNumFocus(lowerAmtId) {
	if ($("#" + lowerAmtId).val() == "") {
		return false;
	}
	var preRaseAmt = $("#" + lowerAmtId).val().replace(/,/g, "");
	$("#" + lowerAmtId).val(preRaseAmt);

	var e = event.srcElement;
	var r = e.createTextRange();
	r.moveStart("character", e.value.length);
	r.collapse(true);
	r.select();
}

/**
 * 格式化浮点小数(以前的数字格式化有bug,例如0.55格式化后只有.55)
 * 
 * @param id
 * @returns {Boolean}
 */
function fomatFloatNumber(id) {
	var value = $.trim($("#" + id + "").val());
	if (value == "") {
		return false;
	}
	if (value == 0) {
		return false;
	}
	var preRaseAmt = value.replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!isNumerical(preRaseAmtNum)) {
		$("#" + id).val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + id).focus();
		return false;
	} else {
		$("#" + id).val(addFormatNumber(preRaseAmtNum));
		return true;
	}
}

/**
 * 格式化数字number(27,14)形式的校验
 * 
 * @param value
 */
function fmtNum2714(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		alert("请填写数字");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,14})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert("格式错误(最多13位整数，14位小数)");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(15,2)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum152(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(15,2)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum152_r(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		alert("请填写数字");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert("格式错误(最多13位整数，2位小数)");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}
	return true;

}

/**
 * 格式化数字number(15,2)形式的校验 包括负数,0和正数
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNumAll152(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^([-]?)[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(15,2)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum152_t(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[-+]?[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(13,8)形式的校验(非标基本信息使用)
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum138_nsc(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,7}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多7位整数，6位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 13位整数 2位小数
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNum132(value, dontFormat) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,13}$");
		var regDec = new RegExp("^([0-9]{0,2})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多13位整数，2位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			if (dontFormat) {
				return true;
			}
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 7位整数 6位小数
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNum76(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,7}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多7位整数，6位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 9位整数 6位小数
 * 
 * @param id
 *            文本框的id promptInf 提示信息
 * @returns {Boolean}
 */
function fmtNum96(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,9}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多9位整数，6位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(13,8)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum138(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		ctools.alert("请填写数字", "", "warning");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,7}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			ctools.alert("格式错误(最多7位整数，6位小数)", "", "warning");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化数字number(13,8)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum138_r(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		alert("请填写数字");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,7}$");
		var regDec = new RegExp("^([0-9]{0,6})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert("格式错误(最多7位整数，6位小数)");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}
	return true;

}

/**
 * 格式化数字number(15,4)形式的校验
 * 
 * @param value
 * @returns {Boolean}
 */
function fmtNum154(value) {
	if ($("#" + value + "").val() == "") {
		return false;
	}
	if ($("#" + value + "").val() == 0) {
		return false;
	}
	var preRaseAmt = $("#" + value + "").val().replace(/,/g, "");
	var preRaseAmtNum = new Number(preRaseAmt);
	if (!checkStrIsNum(preRaseAmtNum)) {
		$("#" + value + "").val("");
		alert("请填写数字");
		$("#" + value + "").focus();
		return false;
	} else {
		var amtArrs = preRaseAmt.split(".");
		var regInt = new RegExp("^[0-9]{0,11}$");
		var regDec = new RegExp("^([0-9]{0,4})?$");
		if (!amtArrs[0].match(regInt) || (amtArrs[1] != null && !amtArrs[1].match(regDec))) {
			alert("格式错误(最多11位整数，4位小数)");
			$("#" + value + "").val("");
			$("#" + value + "").focus();
			return false;
		} else {
			$("#" + value + "").val(addFormatNumber(preRaseAmtNum));
		}
	}

}

/**
 * 格式化金额
 * 
 * @param number
 * @returns
 */
function addFormatNumber(number) {
	var num = number + "";
	num = num.replace(new RegExp(",", "g"), "");
	// 正负号处理
	var symble = "";
	if (/^([-+]).*$/.test(num)) {
		symble = num.replace(/^([-+]).*$/, "$1");
		num = num.replace(/^([-+])(.*)$/, "$2");
	}

	if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
		var num = num.replace(new RegExp("^[0]+", "g"), "");
		if (/^\./.test(num)) {
			num = "0" + num;
		}

		var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
		if ("" == decimal) {
			decimal = ".00";
		} else if (decimal.length == 2) { // 如果只有一个小数位，末尾补零。
			decimal = decimal + "0";
		}
		var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");
		if ("" == integer) {
			integer = 0;
		}

		var re = /(\d+)(\d{3})/;

		while (re.test(integer)) {
			integer = integer.replace(re, "$1,$2");
		}
		return symble + integer + decimal;

	} else {
		if (number.indexOf(".") == 0) { // .xx的形式，开头补零
			return "0" + number;
		} else {
			return number;
		}
	}
}

/**
 * 取得文本框的字符长度，汉字是两个字符，英文一个字符
 * 
 * @param val
 * @returns {Number}
 */
function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		var a = val.charAt(i);
		if (a.match(/[^\x00-\xff]/ig) != null) {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len;
}

/**
 * 两个浮点数相乘的计算方法
 */
function accMul(arg1, arg2) {
	var m = 0, s1 = arg1 ? arg1.toString() : "", s2 = arg2 ? arg2.toString() : "";
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg) {
	return Number(accMul(arg, this));
};

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果

function accDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {
	}
	with (Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * pow(10, t2 - t1);
	}
}
// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function(arg) {
	return Number(accDiv(this, arg));
};

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}
// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg) {
	return Number(accAdd(arg, this));
};

// 减法函数，用来得到精确的减法结果
// 说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
// 调用：accSubtr(arg1,arg2)
// 返回值：arg1减去arg2的精确结果
function accSubtr(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	// 动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 给Number类型增加一个subtr 方法，调用起来更加方便。
Number.prototype.subtr = function(arg) {
	return Number(accSubtr(this, arg));
};

/**
 * 当窗口大小变化是，自动处理jqgrid的宽度
 * 
 * @param {Object}
 *            $dom 使用了jqgrid的对象
 */
function jqGridResize($dom, $parents, timeout) {
	var $jqGridWrapper = $parents || $dom.parents('.jqGrid_wrapper');
	var width = $jqGridWrapper.width() - 2;
	$dom.jqGrid("setGridWidth", width);
	var timer = null;
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	if (!isAndroid && !isiOS) {
		$(window).on('resize', function() {
			cancelAnimationFrame(timer);
			timer = requestAnimationFrame(function() {
				if (width != $jqGridWrapper.width()) {
					width = $jqGridWrapper.width() - 2;
					$dom.jqGrid("setGridWidth", width);
				}
			});
		})
	}
}

function searchGroupResize($dom) {
	var width = $dom.width();
	var timer = null;
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	if (isAndroid || isiOS) {
		$dom.width(width);
	} else {
		$(window).on('resize', function() {
			cancelAnimationFrame(timer);
			timer = requestAnimationFrame(function() {
				if (width != $dom.width()) {
					width = $dom - 2;
					$dom.width(width);
				}
			});
		})
	}
}
var staFlag=true;//ie全屏状态控制
// 全屏切换
function toggleFullScreen(de, cb) {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msRequestFullscreen) {
		if (de.requestFullscreen) {
			de.requestFullscreen();
		} else if (de.mozRequestFullScreen) {
			de.mozRequestFullScreen();
		} else if (de.msRequestFullScreen) {
			de.msRequestFullScreen();
		} else if (de.webkitRequestFullscreen) {
			de.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (!staFlag) {
			document.msExitFullscreen();//ie退出全屏
			staFlag=true;
		}else if(staFlag){
			de.msRequestFullscreen();//ie全屏
			staFlag=false;
		}
		
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msCancelFullScreen) {
			document.msCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
	cb && cb;
}
// 这里对select2进行全局设置
if ($.fn.select2) {
	$.fn.select2.defaults.set("allow-clear", true);
	$.fn.select2.defaults.set("width", '100%');
	$.fn.select2.defaults.set("placeholder", '请选择');
	$.fn.select2.defaults.set("language", "zh-CN");
}

// 这里是对validate插件的全局设置

if ($.validator) {
	$.validator.setDefaults({
		ignore : [],
		focusInvalid : true,
		errorPlacement : function(error, element) {
			var $element = $(element);
			var $parent = $(element).parents('.form-inner');
			if ($parent.length) {
				error.appendTo($parent);
				console.info(error);
			} else {
				error.insertAfter($element);
				console.error(error);
			}
		}
	});
}

// 通知的配置

if (typeof toastr !== 'undefined') {
	toastr.options = {
		"closeButton" : true,
		"debug" : false,
		"progressBar" : true,
		"preventDuplicates" : false,
		"positionClass" : "toast-top-right",
		"showDuration" : "400",
		"hideDuration" : "1000",
		"timeOut" : "7000",
		"extendedTimeOut" : "1000",
		"showEasing" : "swing",
		"hideEasing" : "linear",
		"showMethod" : "fadeIn",
		"hideMethod" : "fadeOut"
	}
}

// 日期格式转换
function dateFormat(format, date) {
	date = date ? new Date(date) : new Date;
	format = format || 'yyyy/MM/dd hh:mm:ss';
	var map = {
		"M" : date.getMonth() + 1, // 月份
		"d" : date.getDate(), // 日
		"h" : date.getHours(), // 小时
		"m" : date.getMinutes(), // 分
		"s" : date.getSeconds(), // 秒
		"q" : Math.floor((date.getMonth() + 3) / 3), // 季度
		"S" : date.getMilliseconds()
	// 毫秒
	};
	format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
		var v = map[t];
		if (v !== undefined) {
			if (all.length > 1) {
				v = '0' + v;
				v = v.substr(v.length - 2);
			}
			return v;
		} else if (t === 'y') {
			return (date.getFullYear() + '').substr(4 - all.length);
		}
		return all;
	});
	return format;
};

/**
 * 根据外部容器的大小重置jqGrid控件的宽度 需引入jqGrid和jquery包
 * 
 * @author fangdb
 * @param id
 *            jqgird控件的ID
 * @return
 */
function doResize(id, obj) {
	var ss = getPageSize();
	if (obj != null && obj.width) {
		ss = {
			Winw : obj.width
		}
	}
	$("#" + id).jqGrid("setGridWidth", ss.WinW - 8);
}
/**
 * 获取当前窗口的大小
 * 
 * @author fangdb
 * @return
 */
function getPageSize() {
	var winW, winH;

	if (window.innerHeight) {
		winH = window.innerHeight;
		winW = window.innerWidth;

	} else if (document.documentElement && document.documentElement.clientHeight) {
		winW = document.documentElement.clientWidth;
		winH = document.documentElement.clientHeight;
	} else if (document.body) {
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	}

	return {
		WinW : winW,
		WinH : winH
	};
}
/**
 * 上传附件IDs
 */
function serialAttId(containerId) {
	var attIds = "";
	$("#" + containerId).find(".uploaded").each(function() {
		var attId = $(this).attr("attId");
		if (attId != undefined && attId != '') {
			attIds += attId + ",";
		}
	});
	return attIds;
}
/**
 * 弹出ajax的错误信息
 */
function sweetAlertAjaxError(xhr) {
	try {
		switch (xhr.status) {
		case 403:
			sweetAlert("对不起，您无此权限！", xhr.responseText, "error");
			break;
		case 404:
			sweetAlert("对不起，无此页面！", xhr.responseText, "error");
			break;
		case 417:
			sweetAlert("内部错误，请联系管理员！", xhr.responseText, "error");
			break;
		case 500:
			sweetAlert("内部错误，请联系管理员！", xhr.responseText, "error");
			break;
		case 504:
			sweetAlert("超时，请联系管理员！", xhr.responseText, "error");
			break;
		}
	} catch (e) {
	}
}

/**
 * 弹出modal窗
 */
function showModalDialog() {
	var id = arguments[0]; // ID
	var title = arguments[1]; // 标题
	var content = arguments[2];// 内容
	var type = arguments[3]; // 0:alert窗，1：confirm窗
	if (id == undefined || id == "") {
		id = 1;
	}
	var s = '<div class="modal inmodal in modal-tip" id="' + id + '" role="dialog" data-backdrop="static" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal">' + '<span aria-hidden="true">×</span>' + '<span class="sr-only">Close</span>' + '</button>'
			+ '<h4 class="modal-title">' + title + '</h4>' + '</div>' + '<div class="modal-body">' + '<span class="fa fa-exclamation-circle text-info f-30"></span>' + content + '</div>' + '<div class="modal-footer">';
	if (type == 0) {
		s += '<button type="button" class="btn btn-primary " id="' + id + '-close" data-dismiss="modal">关闭</button>'
	} else if (type == 1) {
		s += '<button type="button" class="btn btn-primary " id="' + id + '-confirm" data-dismiss="modal">确定</button>' + '<button type="button" class="btn btn-link" id="' + id + '-cencel" data-dismiss="modal">取消</button>'
	}
	s += '</div>' + '</div>' + '</div>' + '</div>';

	$("body").append(s);
	$('#' + id).modal('show');
}

/**
 * 增加出modal窗
 */
function appendModalDialog() {
	var id = arguments[0]; // ID
	var title = arguments[1]; // 标题
	var content = arguments[2];// 内容
	var type = arguments[3]; // 0:alert窗，1：confirm窗
	if (id == undefined || id == "") {
		id = 1;
	}
	var s = '<div class="modal inmodal in modal-tip" id="' + id + '" role="dialog" data-backdrop="static" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal">' + '<span aria-hidden="true">×</span>' + '<span class="sr-only">Close</span>' + '</button>'
			+ '<h4 class="modal-title">' + title + '</h4>' + '</div>' + '<div class="modal-body">' + '<span class="fa fa-exclamation-circle text-info f-30"></span>' + content + '</div>' + '<div class="modal-footer">';
	if (type == 0) {
		s += '<button type="button" class="btn btn-primary " id="' + id + '-close" data-dismiss="modal">关闭</button>'
	} else if (type == 1) {
		s += '<button type="button" class="btn btn-primary " id="' + id + '-confirm" data-dismiss="modal">确定</button>' + '<button type="button" class="btn btn-link" id="' + id + '-cencel" data-dismiss="modal">取消</button>'
	}
	s += '</div>' + '</div>' + '</div>' + '</div>';

	$("body").append(s);
}

/**
 * 按钮点击锁定按钮
 * 
 * @param buttonId
 */
function loadButton(buttonId) {
	var targetx;
	if (buttonId && typeof buttonId === "string") {
		targetx = $("#" + buttonId);
	} else {
		var target = event.target || event.srcElement;
		targetx = $(target);
	}
	targetx.prop("disabled", true);
	targetx.button('loading');
}
/**
 * 解开按钮
 * 
 * @param buttonId
 */
function cancelButton(buttonId) {
	var targetx;
	if (buttonId && typeof buttonId === "string") {
		targetx = $("#" + buttonId);
	}
	setTimeout(function() {
		targetx.button('reset');
	}, 300);
	return;
}

/**
 * 提交，而且通过按钮loading防止二次提交 modify by weicb 对于confirm提示框的提交，buttonId：提交按钮的id
 * formId：需提交表单的ID  func：提交时需要做的一些操作，将其封装成func，作为参数传入 
 * prevent：如果需要根据func的返回结果来决定是否提交，则设置为true 
 * buttonId：如果提交过程需要confirm，那么请传入提交按钮的ID
 * 
 */
function SubmitAndPreventSecond(formId, func, prevent, buttonId) {
	var targetx;
	if (buttonId && typeof buttonId === "string") {
		targetx = $("#" + buttonId);
	} else {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		targetx = $(target);
	}
	targetx.prop("disabled", true);
	var form = $('#' + formId);
	targetx.button('loading');
	var result = true;
	// 留一个钩子函数，可以在loading和submit之间添加一些自定义函数
	if (func && ('function' == typeof func)) {
		result = func();
	}
	if (prevent && prevent === true && !result) {
		setTimeout(function() {
			$(targetx).button('reset');
		}, 1000);
		return;
	}
	if (false === form.valid()) {
		toastr.warning('', '请完善信息');
		setTimeout(function() {
			$(targetx).button('reset');
		}, 1000);
		return;
	}
	form.submit();
	//alert("updateGroupCustEx调用了...");
}
/**
 * 会对validate 对select，radio等控件不灵做手动较验
 * 
 * @param id
 */
function triggerValidOnSelectChange() {
	var ids = '';
	for (var i = 0; i < arguments.length; i++) {
		ids += '#' + arguments[i];
		if (i != (arguments.length - 1)) {
			ids += ',';
		}
	}
	;
	if (arguments.length > 0) {
		$(ids).change(function() {
			var $this = $(this);
			$this.valid && $this.valid();
		});
	}
}

var numbtemp = 1;
function caseChina(num) {
	var numberValue = new String(Math.round(num * 100)); // 数字金额

	var chineseValue = ""; // 转换后的汉字金额
	var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
	var len = numberValue.length; // numberValue 的字符串长度
	var Ch1; // 数字的汉语读法
	var Ch2; // 数字位的汉字读法
	var nZero = 0; // 用来计算连续的零值的个数
	var String3; // 指定位置的数值
	if (len > 15) {
		numbtemp = numbtemp + 1;
		if (numbtemp < 3) {
			ctools.alert("超出计算范围", "", "warn");
		}
		return "超出计算范围";
	}
	if (numberValue == 0) {
		chineseValue = "零元整";
		return chineseValue;
	}
	String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
	for (var i = 0; i < numberValue.length; i++) {
		String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
		// //alert(String3);
		if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
			if (String3 == 0) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		} else { // 该位是万亿，亿，万，元位等关键位
			if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 != 0 && nZero == 0) {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 == 0 && nZero >= 3) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else {
				Ch1 = "";
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
				Ch2 = String2.substr(i, 1);
			}
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	}
	if (String3 == 0) { // 最后一位（分）为0时，加上“整”
		chineseValue = chineseValue + "整";
	}
	numbtemp = 1;
	return chineseValue;
}

// 数字千分位格式化
function formatNum(num, n) {
	// 参数说明：num 要格式化的数字 n 保留小数位
	num = String(num.toFixed(n));
	var re = /(-?\d+)(\d{3})/;
	while (re.test(num)) {
		num = num.replace(re, "$1,$2")
	}
	return num;
}

// 验证文本框输入的是不是数字
function checkAmountNumber(inputName) {

	var value = $("#" + inputName).val();
	if (value == "" || value == null) {
		$("#" + inputName).val("0.00");
		return;
	}
	var reg = new RegExp("[^0-9^.^-]", "g"); // 创建正则RegExp对象
	value = value.replace(reg, "");
	if (!isNaN(value) && value != "") {
		$("#" + inputName).val(formatNum(Number(value), 2));
	} else {
		$("#" + inputName).val("0.00");
	}
}

// 将所有的','字符替换掉
function replaceAmountAll(inputName) {
	var value = $("#" + inputName).val();
	if (value == "" || value == null) {
		// document.all(inputName).value=".00";
		return;
	}
	var reg = new RegExp(",", "g"); // 创建正则RegExp对象
	value = value.replace(reg, "");
	if (Number(value) == 0) {
		value = "";
	}
	$("#" + inputName).val(value);
}

// 输入光标代替'0'
function replaceZero(inputName) {
	var value = $("#" + inputName).val();
	if (Number(value) == 0) {
		value = "";
	}
	$("#" + inputName).val(value);
}

// '0'代替''
function replaceSpace(inputName) {
	var value = $("#" + inputName).val();
	if (value == "" || value == null) {
		$("#" + inputName).val("0");
		return;
	} else {
		$("#" + inputName).val(value);
		return;
	}
}

// 获取文本框中真实数字 不包含千分位分隔符
function getInputValue(value) {
	if (value == "" || value == null) {
		return "0.00";
	}
	var reg = new RegExp(",", "g"); // 创建正则RegExp对象
	var value = value.replace(reg, "");
	return value;
}

// 只能输入数字
function WriteOnlyNumber(inputName) {
	var inputObj = document.getElementById(inputName);
	var reg = new RegExp("[^0-9]", "g"); // 创建正则RegExp对象
	var values = inputObj.value.replace(reg, "");
	/*
	 * if(values.trim()=="" || values.trim()=="0"){ values="1"; }
	 */
	inputObj.value = values;
}

function checkDate(id) {
	var flag = true;
	var dateStr = $("#" + id).val();
	var dateArr = dateStr.split(",");
	if (dateArr != null && dateArr != "") {
		for (var m = 0; m < dateArr.length; m++) {
			var temp = dateArr[m];
			if (!temp.match(/^((?:19|20)\d\d)(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)) {
				flag = false;
			}
		}
		if (!flag) {

			ctools.alert("日期格式错误,格式为YYYYMMDD，多个日期以‘,’分隔", "日期格式错误信息", "warning");
			// $("#modal-show").modal("show");
			// alert("日期格式错误,格式为YYYYMMDD，多个日期以‘,’分隔");
			// $("#"+id).focus();
		}
	}
}

var ctools = {
	/**
	 * 生成uuid的方法
	 * 
	 * @author ex-weicb
	 * @param len
	 *            长度，不传默认36位uuid
	 * @param radix
	 *            源字符基数
	 * @returns 生成的uuid
	 */
	uuid : function(len, radix) {
		// alert(0);
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [], i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) {
				uuid[i] = chars[0 | Manth.random() * radix];
			}
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	},

	/**
	 * alert提示框-toastr风格，用于提示消息：如提示“请选择一条数据”
	 * 
	 * @author ex-weicb modify by wangys
	 * @param msg
	 *            提示消息 首行加粗字体
	 * @param title
	 *            提示框标题 第二行小字体，一般不需要自定义
	 * @param type
	 *            类型 success:成功[绿色]，warn:警告[橙色]（默认），error：错误[红色]
	 * 
	 */
	alert : function(msg, title, type) {
		if (!type) {
			console.error("请依照类型赋予参数，有warning，success，error");
			return;
		}
		type = type || "warning";
		title = title || "";// msg:首行加粗字体 ,title:第二行小字体
		if (type == "success")
			toastr.success(title, msg);
		else if (type == "error")
			toastr.error(title, msg);
		else
			toastr.warning(title, msg);
	},
	/**
	 * confirm提示框封装-sweetalert风格，支持通用confirm和自定义confirm
	 * 针对这种情况，严禁直接在代码中直接使用swal(),方便后续模态框统一维护
	 * 
	 * @author ex-weicb
	 * @param option
	 *            若此参为字符串，则代表confirm的提示消息<br>
	 *            若为对象则一般用于个性化confirm的情况：如确定和取消按钮都有事件;确定、取消按钮的文本需要个性化等情况
	 * @param fn
	 *            若第一个参数为字符串，则此函数代表确定按钮的回调函数<br>
	 *            若第一个参数为对象则此函数为两个按钮的回调函数，传回一个布尔类型参数，true代表用户点击的是确定按钮，false代表用户点击的是取消按钮<br>
	 * @param fn2
	 *            选否时触发的函数
	 * @description 总而言之，当第一个参数是字符串的时候，代表通用用法，参数依次为提示消息、确定按钮回调函数、提示消息说明（灰色小字体）<br>
	 *              当第一个参数是对象的时候，代表自定义用法，参数依次为自定义参数对象、按钮点击的回调函数
	 */
	confirm : function(option, fn, fn2) {
		var _confirm_option = function(option, callback) {// 用于自定义参数配置的confirm封装：sweetAlert风格
			var default_option = {
				title : "提示消息",
				text : "",
				type : "warning",
				html : false,
				showCancelButton : true,// 显示关闭按钮
				confirmButtonColor : "#fc6821",// 确定按钮的颜色
				confirmButtonText : "确定",// 确定按钮的文本
				cancelButtonText : "取消",// 取消按钮的文本
				closeOnConfirm : true,// 确定按钮是否关闭模态框
				closeOnCancel : true
			// 取消按钮式否关闭模态框
			};
			$.extend(default_option, option);
			swal(default_option, function(isConfirm) {// 回调函数
				if (callback && typeof callback === 'function') {
					setTimeout(function() {// 解决弹出框无法关闭的问题
						callback(isConfirm);
					}, 350);
				}
			});
		};
		if (option && 'string' === typeof option) {
			var text2 = (arguments[2] && (typeof arguments[2] !== 'function')) ? arguments[2] : '';
			_confirm_option({
				title : option,
				text : text2 || ""
			}, function(isConfirm) {
				if (isConfirm && fn && typeof fn === 'function') {
					fn(isConfirm);
				} else if (!isConfirm && fn2 && typeof fn2 === 'function') {
					fn2(isConfirm);
				}
			});
		} else if (option && 'object' === typeof option) {
			_confirm_option(option, function(isConfirm) {
				if (isConfirm && fn && typeof fn === 'function') {
					fn(isConfirm);
				} else if (!isConfirm && fn2 && typeof fn2 === 'function') {
					fn2(isConfirm);
				}
			});
		} else {
			console.error("unsupported...");
		}
	},
	/**
	 * sweet风格的alert弹出框：当嵌套在ctools.confirm的时候用
	 * 
	 * @author ex-weicb
	 * @param msg
	 *            提示消息：加粗大字体
	 * @param type
	 *            类型 success:成功 ,warning:警告（默认），error：错误
	 * @param title
	 *            灰色小字体
	 * @param fn
	 *            关闭按钮回调函数
	 */
	alert_sweet : function(msg, type, title, fn) {
		type = type || "warning";
		if (type != "success" && type != "warning" && type != "error")
			type = "warning";
		swal({
			title : msg,
			text : title || "",
			type : type,
			confirmButtonText : "关闭"
		}, function() {
			if (fn && typeof fn === 'function')
				fn();
		});
	},
	/**
	 * 提交动态表单
	 * 
	 * @param action
	 *            表单路径
	 * @param obj
	 *            接收对象数组，key和value是必须具备的，例如 var array=[];
	 *            array.push({"key":"sp[basicDate]","value":basicDate});
	 *            array.push({"key":"sp[strMonth]","value":strMonth});
	 *            array.push({"key":"sp[prjserialId]","value":prjserialId});
	 *            array.push({"key":"sp[status]","value":status});
	 *            array.push({"key":"sp[courseStatus]",value:courseStatus});
	 *            传入array
	 * @param target
	 *            表单提交目标 blank,self
	 */
	submitDynForm : function(action, obj, target) {
		var str = [];
		var id = 'dy' + new Date().getTime();
		str.push('<form id="' + id + '" method="post" target="' + target + '" action="' + action + '">');

		$(obj).each(function(key, obj) {
			var name = obj["key"];
			var value = obj["value"];
			str.push('<input type="hidden" name="' + name + '" id="' + name + '" value="' + value + '">');
		});
		str.push('</form>');
		$(document.body).append(str.join(''));
		$("#" + id).submit();
		$("#" + id).remove();
	}

};

var tagTools = {
	uri : "/cbp/pubdata/masterdata/taginfo",
	/**
	 * 展示标签窗口
	 * 
	 * @param id
	 * @param moduleType
	 */
	openTagModel : function(id, moduleType) {
		// 弹窗主要内容
		var htmlContext = new Array();
		htmlContext.push('<table id="tag_content"><tr>');
		htmlContext.push('<td><span>标签：</span></td>');
		htmlContext.push('<td style="width:375px;">');
		htmlContext.push('<input type="hidden" name="id" />');
		htmlContext.push('<select id="tag_select" class="form-control use-select2" placeholder="标签" multiple >');
		htmlContext.push('</select>');
		htmlContext.push('</td></tr></table>');
		// 弹窗
		ctools.confirm({
			title : '',
			text : htmlContext.join(""),
			html : true,
			type : ''
		}, function(isConfirm) {
			if (!isConfirm)
				return;
			tagTools.saveTagInfo(moduleType, id); // 保存标签信息
		});

		// 加载selected
		tagTools.loadTagDefaultValue(moduleType, id); // 绑定默认值
		WASP_WIDGET.triggerSelectOnTagInfo("tag_select", {
			"moduleType" : moduleType
		});
	},

	/**
	 * 加载标签默认值
	 */
	loadTagDefaultValue : function(moduleType, id) {
		// 绑定默认值
		$.ajax({
			url : tagTools.uri + '/queryTagRelationList.do',
			async : false,
			data : {
				'moduleType' : moduleType,
				'relationId' : id
			},
			dataType : 'json',
			success : function(data) {
				var valArray = new Array();
				var textArray = new Array();
				for (var i = 0; i < data.length; i++) {
					valArray.push(data[i].id);
					textArray.push(data[i].name);
				}
				WASP_WIDGET.initializeSelectVal("tag_select", valArray.join(","), textArray.join(","));
			}
		});
	},

	/**
	 * 保存标签默认数据
	 * 
	 * @param moduleType
	 * @param id
	 */
	saveTagInfo : function(moduleType, id) {
		// 获取select2选中的数据
		// 处理数据封装成自己想要的格式
		var tagList = new Array();
		var tag;
		var datas = $("#tag_select").select2("data");
		if (datas.length == 0) {
			tag = {};
			tag.status = 2;
			tag.moduleType = moduleType; // 模块类型
			tag.relationId = id; // 关联id

			tagList.push(tag);
		} else {
			for (var i = 0; i < datas.length; i++) {
				tag = {};
				if (datas[i].status && datas[i].status == 1) {
					tag.name = datas[i].text; // 新建标签名
					tag.status = datas[i].status; // 是否新增
				}
				tag.tagId = datas[i].id; // 关联标签id
				tag.moduleType = moduleType; // 模块类型
				tag.relationId = id; // 关联id

				tagList.push(tag);
			}
		}
		// 保存到标签信息中
		$.ajax({
			url : tagTools.uri + '/updateTagRelation.do',
			type : 'post',
			data : {
				"tags" : JSON.stringify(tagList)
			},
			dataType : 'json',
			success : function() {
				ctools.alert_sweet("保存成功", "success");
				queryByCondtion(false);
			}
		});
	},

	/**
	 * 将标签信息格式化展示
	 * 
	 * @param tagList
	 * @returns {String}
	 */
	formatTagInfo : function(tagList) {
		var result = "";
		for (var i = 0; i < tagList.length; i++) {
			if (tagList[i].type == "1") {
				// result += '<span class="label label-info">' + tagList[i].name
				// + '</span>';
				result += '<span class="badge badge-info">' + tagList[i].name + '</span> ';
			} else if (tagList[i].type == "2") {
				// result += '<span class="label label-warning">' +
				// tagList[i].name + '</span>';
				result += '<span class="badge badge-warning">' + tagList[i].name + '</span> ';
			} else if (tagList[i].type == "3") {
				// result += '<span class="label label-primary">' +
				// tagList[i].name + '</span>';
				result += '<span class="badge badge-important">' + tagList[i].name + '</span> ';
			} else if (tagList[i].type == "4") {
				// result += '<span class="label label-success">' +
				// tagList[i].name + '</span>';
				result += '<span class="badge badge-inverse">' + tagList[i].name + '</span> ';
			}
		}
		return result;
	}
};

/**
 * 判断非负数(新UI提示框)
 */
function checkIsNoNegaNum_r(id, promptInfo) {
	if ($("#" + id + "").val() == "") {
		return false;
	}
	if ($("#" + id + "").val() == 0) {
		return false;
	}
	var reg = /^(\d+)(\.\d+)?/;
	if (reg.exec($("#" + id).val()) == null) {
		ctools.alert(promptInfo, "", "warning");
		$("#" + id).focus();
		$("#" + id).val("");
		return false;
	}
	return true;
}

function Map() {
	 
	/** 存放键的数组(遍历用到) */
    this.keys = new Array();
    /** 存放数据 */
    this.data = new Object();
    
    /**
     * 放入一个键值对
     * @param {String} key
     * @param {Object} value
     */
    this.put = function(key, value) {
        if(this.data[key] == null){
            this.keys.push(key);
        }
        this.data[key] = value;
    };
    
    /**
     * 获取某键对应的值
     * @param {String} key
     * @return {Object} value
     */
    this.get = function(key) {
        return this.data[key];
    };
    
    /**
     * 删除一个键值对
     * @param {String} key
     */
    this.remove = function(key) {
        this.keys.remove(key);
        this.data[key] = null;
    };
    
    /**
     * 遍历Map,执行处理函数
     * 
     * @param {Function} 回调函数 function(key,value,index){..}
     */
    this.each = function(fn){
        if(typeof fn != 'function'){
            return;
        }
        var len = this.keys.length;
        for(var i=0;i<len;i++){
            var k = this.keys[i];
            fn(k,this.data[k],i);
        }
    };
    
    /**
     * 获取键值数组(类似Java的entrySet())
     * @return 键值对象{key,value}的数组
     */
    this.entrys = function() {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            entrys[i] = {
                key : this.keys[i],
                value : this.data[i]
            };
        }
        return entrys;
    };
    
    /**
     * 判断Map是否为空
     */
    this.isEmpty = function() {
        return this.keys.length == 0;
    };
    
    /**
     * 获取键值对数量
     */
    this.size = function(){
        return this.keys.length;
    };
    
    /**
     * 重写toString 
     */
    this.toString = function(){
        var s = "{";
        for(var i=0;i<this.keys.length;i++,s+=','){
            var k = this.keys[i];
            s += k+"="+this.data[k];
        }
        s+="}";
        return s;
    };
    
    
 
}