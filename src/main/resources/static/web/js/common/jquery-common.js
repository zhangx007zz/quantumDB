
/**
 * 封装下ajax
 * @param {Object} url
 * @param {Object} param
 * @param {Object} fnOk
 * @param {Object} fnError
 */
function stdAjax(url,param,fnOk,fnError){
	var _url = arguments[0] ? arguments[0] : "";
	var _param = arguments[1] ? arguments[1] : {};
	var _fnOk = arguments[2] ? arguments[2] : function() {};
	var _fnError = arguments[3] ? arguments[3] : null;
	if(isBlank(_url)){
		showMsg("请输入url");
		return;
	}
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: _url,
		data:_param,
		success: function(result) {
			if(result.state != result.success){
				showMsg("出错啦！"+result.message);
			}else{
				_fnOk(result);
			}
			
		},
		complete:function(xhr, ts){
			//console.log('xhr:' + xhr.responseText);
		}/*,
		error: function(xhr, status, err) {
			_fnError(result);
		}*/
	});
}


/**
 * @description 获取状态图标
 * @param {String} basePath 基础路径
 * @param {String} stattype 状态类型，au审核状态，doc文档状态
 * @param {String} statval 状态值，审核状态值 0无审批 1已提交 2已初审 3已批准 4已驳回，文档状态值：HOLD暂存  PUBLISH已发布  BACKEDIT取消发布
 */
function getStatFlag(basePath,stattype,statval){
	var title="";
	if(stattype=='au'){
		switch (statval)
		{
			case "0":
			  title="无审批";
			  break;
			case "1":
			 title="已提交";
			  break;
			case "2":
			 title="已初审";
			  break;
			case "3":
			 title="已批准";
			  break;
			case "4":
			 title="已驳回";
			  break;
			default:
			  title="无";
		}
	}else if(stattype=='doc'){
		if(statval=='HOLD'){
			title="暂存";
		}else if(statval=='PUBLISH'){
			title="已发布";
		}else if(statval=='BACKEDIT'){
			title="取消发布";
		}
	}
	var templ='<img style="width:20px;height:20px;" src="'+basePath+'/mobile/resource/img/'+stattype+'stat_'+statval+'.png" title="'+title+'"/>';
	
	return templ;
}


/**
 * @description 加载移动版导航页
 * @param {String} basePath 基础路径
 * @param {String} opType 类型，1论坛、2活动、3投票、4知识库
 * @param {Object} callback 回调函数
 */
function loadSection(basePath,opType,callback){
	$("#nav_item_sec_id").css("display","none");
	$("#nav_item_sec_id").html('');
	var _defaulturl="<li><a href='"+basePath+"/mobile/index.jsp'>首页</a></li>";
	var _clickliurl="<li><a href='"+basePath+"/mobile/index.jsp'>首页</a></li>";
	if(opType=='1'){
		_defaulturl="<li><a href='"+basePath+"/mobile/forum/forum_index.jsp'>论坛</a></li>";
		_clickliurl="<li><a href='"+basePath+"/mobile/forum/forum_list.jsp?sectionid=_SECTION_ID&sectionname=_SECTION_NAME' title='_SECTION_NAME'>_SHORT_NAME</a></li>";
	}else if(opType=='2'){
		_defaulturl="<li><a href='"+basePath+"/mobile/activity/activity_index.jsp'>活动</a></li>";
		_clickliurl="<li><a href='"+basePath+"/mobile/activity/activity_list.jsp?sectionid=_SECTION_ID&sectionname=_SECTION_NAME'  title='_SECTION_NAME'>_SHORT_NAME</a></li>";
	}else if(opType=='3'){
		_defaulturl="<li><a href='"+basePath+"/mobile/vote/vote_index.jsp'>投票</a></li>";
		_clickliurl="<li><a href='"+basePath+"/mobile/vote/vote_list.jsp?sectionid=_SECTION_ID&sectionname=_SECTION_NAME'  title='_SECTION_NAME'>_SHORT_NAME</a></li>";
	}
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "ips-info/fileMana!ajaxGetForumSectionList.action",
		data:{opType:opType},
		success: function(result) {
			if(result.state!='success'){
				return;
			}
			var data = result.data;
			if(data == null || data == '' || data == undefined) return '';
			var data = result.data;
			if(data.section == null || data.section == '' || data.section == undefined) return '';
			var _li="";
			$.each(data.section, function(i,d) {
				_li+=_clickliurl.replaceAll("_SECTION_ID",d.dirDetailId)
								.replaceAll("_SHORT_NAME",limitWordsCnt(d.dirname,4))
								.replaceAll("_SECTION_NAME",d.dirname);
			});
			$("#nav_item_sec_id").html(_defaulturl+_li);
			$("#nav_item_sec_id").css("display","block");
			callback();
		},
		error: function(xhr, status, err) {
			console.log('xhr:' + xhr + '    \r\nstatus:' + status + '   \r\nerr:' + err);
		}
	});
	
}

/**
 * @description 判断浏览器是否是移动浏览器，true是，false否
 */
function isMobile(){
	try{
		var sUserAgent = navigator.userAgent.toLowerCase();
		var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
		var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
		var bIsMidp = sUserAgent.match(/midp/i) == "midp";
		var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
		var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
		var bIsAndroid = sUserAgent.match(/android/i) == "android";
		var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
		var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
		if(!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
			return false;
		}else{
			return true;		
		}
	}catch(e){
		return false;
	}
}

/**
 * @description 捕获式弹出窗
 * @param {Object} pObj 需要捕获的div内容
 * @param {Object} fnCancel 回调函数
 */
function catchDiv(pObj, fnCancel) {
	if(isBlank(pObj)) {
		return;
	}
	var _pObj = arguments[0] ? arguments[0] : "您是否确定？";
	var _fnCancel = arguments[1] ? arguments[1] : function() {};
	layui.use('layer', function() {
		layer.open({
		  type: 1,
		  shade: false,
		  title: false, //不显示标题
		  content: _pObj, //捕获的元素
		  cancel: function(){
			    if(typeof _fnCancel == 'function') {
					_fnCancel();
				}
		  }
		});
	});
}
/**
 * @description 消息确认弹出框，非阻塞式
 * @param {Object} msg 消息内容
 * @param {Object} fnOk 确定回调函数
 * @param {Object} fnCancel 取消回调函数
 */
function comfirmMsg(msg, fnOk, fnCancel) {
	if(isBlank(msg)) {
		return;
	}
	var _msg = arguments[0] ? arguments[0] : "您是否确定？";
	var _fnOk = arguments[1] ? arguments[1] : function() {};
	var _fnCancel = arguments[2] ? arguments[2] : function() {};
	var windowH=document.body.offsetHeight;
	var windowW=document.body.offsetWidth;
	layui.use('layer', function() {
		layer.confirm(_msg, {
			title: '提示信息',
			btn: ['确定', '取消'] //按钮
		}, function(index, layero) {
			if(typeof _fnOk == 'function') {
				_fnOk();
				layer.close(index);
			}
		}, function(index, layero) {
			if(typeof _fnCancel == 'function') {
				_fnCancel();
				layer.close(index);
			}
		});
		var lw=parseInt($('.layui-layer').css('width'));
		$('.layui-layer').css('left',((windowW*0.5)-lw/2)+'px');
		var lh = parseInt($('.layui-layer').css('height'));
		$('.layui-layer').css('top',((windowH*0.5)-lh/2)+'px');
	});
}
/**
 * @description  消息确认弹出框，非阻塞式
 * @param {Object} msg 消息内容
 * @param {Object} fnOk 确认回调函数
 */
function warnMsg(msg, fnOk) {
	if(isBlank(msg)) {
		return;
	}
	var _msg = arguments[0] ? arguments[0] : "";
	var _fnOk = arguments[1] ? arguments[1] : function() {};
	var windowH=document.body.offsetHeight;
	var windowW=document.body.offsetWidth;
	
	layui.use('layer', function() {
		layer.confirm(_msg, {
			title: '提示信息',
			btn: ['确定'] //按钮
		}, function() {
			if(typeof _fnOk == 'function') {
				_fnOk();
			}
		});
		var lw=parseInt($('.layui-layer').css('width'));
		$('.layui-layer').css('left',((windowW*0.5)-lw/2)+'px');
	});
}
/**
 * @description  弹出消息提示，类似安卓toast
 * @param {Object} msg 消息内容
 * @param {Object} callback 回调函数
 */
function showMsg(msg, callback) {
	if(isBlank(msg)) {
		return;
	}
	var _msg = arguments[0] ? arguments[0] : "";
	var _callback = arguments[1] ? arguments[1] : function() {};
	//document.write("<script src='mobile/resource/layui/layui.js'></script>");
	layer.msg(_msg,{
		time:1500
	});
	if(typeof _callback == 'function') {
		_callback();
	}
}
/**
 * @description  判断是否为空,true为空，false不为空
 * @param {Object} param 待判断参数
 */
function isBlank(param) {
	if(param == undefined || param == null || param == '' || param == 'null') {
		return true;
	}
	return false;
}
/**
 * 是字母或数字，true是，false否
 * @param {Object} val
 */
function isStrNum(val) {
	return /^[a-zA-Z0-9]+$/.test(val);
}
/**
 * 是数字，true是，false否
 * @param {Object} val
 */
function isNumber(val) {
	return /^[0-9]+$/.test(val);
}
/**
 * @description 限制string的长度，超出部分用省略号代替
 * @param {Object} strWords 待处理的字符串
 * @param {Object} limitCnt 最大允许长度
 */
function limitWordsCnt(strWords, limitCnt) {
	if(strWords == undefined || strWords == null){
		return "";
	}
	var strWord = strWords.replaceAll("&nbsp;"," ");
	if(strWord.length > limitCnt) {
		return strWord.substring(0, limitCnt) + "...";
	}
	return strWord;
}
/**
 * @description  替换String对象的所有的指定数据,s1待替换字符，s2新字符
 * @example 用法：var str="abcdefgcdedg"; 
 * 		 var a=str.replaceAll('cd','haha');
 *       a的值为abhahaefghahaedg
 * @param {Object} s1 待替换字符
 * @param {Object} s2 新字符
 */
String.prototype.replaceAll = function(s1,s2){
　　return this.replace(new RegExp(s1,"gm"),s2);
}
/**
 * @description  名称：格式化日期
 * 介绍：(new Date()).format('yyyy-MM-dd') 2016-10-11
 * @param {Object} format 格式
 */
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

/**
*@description 名称:图片上传本地预览插件 v1.1
*作者:周祥
*时间:2013年11月26日
*介绍:基于JQUERY扩展,图片上传预览插件 目前兼容浏览器(IE 谷歌 火狐) 不支持safari
*插件网站:http://keleyi.com/keleyi/phtml/image/16.htm
*参数说明: Img:图片ID;Width:预览宽度;Height:预览高度;ImgType:支持文件类型;Callback:选择文件显示图片后回调方法;
*使用方法: 
*<div>
*<img id="ImgPr" width="120" height="120" /></div>
*<input type="file" id="up" />
*把需要进行预览的IMG标签外 套一个DIV 然后给上传控件ID给予uploadPreview事件
*$("#up").uploadPreview({ Img: "ImgPr", Width: 120, Height: 120, ImgType: ["gif", "jpeg", "jpg", "bmp", "png"], Callback: function () { }});
*/
jQuery.fn.extend({
	uploadPreview: function(opts) {
		var _self = this,
			_this = $(this);
		opts = jQuery.extend({
			Img: "ImgPr",
			Width: 100,
			Height: 100,
			ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
			Callback: function() {}
		}, opts || {});
		_self.getObjectURL = function(file) {
			var url = null;
			if(window.createObjectURL != undefined) {
				url = window.createObjectURL(file)
			} else if(window.URL != undefined) {
				url = window.URL.createObjectURL(file)
			} else if(window.webkitURL != undefined) {
				url = window.webkitURL.createObjectURL(file)
			}
			return url
		};
		_this.change(function() {
			if(this.value) {
				if(!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
					alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
					this.value = "";
					return false
				}
				var msie = false;
				try {
					if($.browser.msie) msie = true;
				} catch(e) {
					msie = /msie/.test(navigator.userAgent.toLowerCase());
				}
				if(!msie) {
					try {
						$("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
					} catch(e) {
						var src = "";
						var obj = $("#" + opts.Img);
						var div = obj.parent("div")[0];
						_self.select();
						if(top != self) {
							window.parent.document.body.focus()
						} else {
							_self.blur()
						}
						src = document.selection.createRange().text;
						document.selection.empty();
						obj.hide();
						obj.parent("div").css({
							'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
							'width': opts.Width + 'px',
							'height': opts.Height + 'px'
						});
						div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src
					}
				} else {
					$("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
				}
				opts.Callback()
			}
		})
	}
});

function uploadPreviews(obj, opts) {
	var _self = this,
		_this = $(this);
	opts = jQuery.extend({
		Img: "ImgPr",
		Width: 100,
		Height: 100,
		ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
		Callback: function() {}
	}, opts || {});
	_self.getObjectURL = function(file) {
		var url = null;
		if(window.createObjectURL != undefined) {
			url = window.createObjectURL(file)
		} else if(window.URL != undefined) {
			url = window.URL.createObjectURL(file)
		} else if(window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file)
		}
		return url
	};
	if(this.value) {
		if(!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
			alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
			this.value = "";
			return false
		}
		var msie = false;
		try {
			if($.browser.msie) msie = true;
		} catch(e) {
			msie = /msie/.test(navigator.userAgent.toLowerCase());
		}
		if(!msie) {
			try {
				$("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
			} catch(e) {
				var src = "";
				var obj = $("#" + opts.Img);
				var div = obj.parent("div")[0];
				_self.select();
				if(top != self) {
					window.parent.document.body.focus()
				} else {
					_self.blur()
				}
				src = document.selection.createRange().text;
				document.selection.empty();
				obj.hide();
				obj.parent("div").css({
					'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
					'width': opts.Width + 'px',
					'height': opts.Height + 'px'
				});
				div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src
			}
		} else {
			$("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
		}
		opts.Callback()
	} else {
		$("#" + opts.Img).attr('src', "mobile/resource/img/pic/153346zb1cbwc7miw8gipi.jpg");
	}

}
/**
 *@description  Simple Map
 * 
 * 
 * var m = new Map();
 * m.put('key','value');
 * ...
 * var s = "";
 * m.each(function(key,value,index){
 *         s += index+":"+ key+"="+value+"\n";
 * });
 * alert(s);
 * 
 * @author dewitt
 * @date 2008-05-24
 */
function Map() {
	/**
	 *@description  存放键的数组(遍历用到) 
	 */
	this.keys = new Array();
	/** 存放数据 */
	this.data = new Object();

	/**
	 *@description 放入一个键值对
	 * @param {String} key
	 * @param {Object} value
	 */
	this.put = function(key, value) {
		if(this.data[key] == null) {
			this.keys.push(key);
		}
		this.data[key] = value;
	};

	/**
	 *@description 获取某键对应的值
	 * @param {String} key
	 * @return {Object} value
	 */
	this.get = function(key) {
		return this.data[key];
	};

	/**
	 *@description 删除一个键值对
	 * @param {String} key
	 */
	this.remove = function(key) {
		this.keys.remove(key);
		this.data[key] = null;
	};

	/**
	 *@description 遍历Map,执行处理函数
	 * 
	 * @param {Function} 回调函数 function(key,value,index){..}
	 */
	this.each = function(fn) {
		if(typeof fn != 'function') {
			return;
		}
		var len = this.keys.length;
		for(var i = 0; i < len; i++) {
			var k = this.keys[i];
			fn(k, this.data[k], i);
		}
	};

	/**
	 *@description 获取键值数组(类似Java的entrySet())
	 * @return 键值对象{key,value}的数组
	 */
	this.entrySet = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for(var i = 0; i < len; i++) {
			entrys[i] = {
				key: this.keys[i],
				value: this.data[i]
			};
		}
		return entrys;
	};

	/**
	 *@description 判断Map是否为空
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
	};

	/**
	 *@description 获取键值对数量
	 */
	this.size = function() {
		return this.keys.length;
	};

	/**
	 *@description 重写toString 
	 */
	this.toString = function() {
		var s = "{";
		for(var i = 0; i < this.keys.length; i++, s += ',') {
			var k = this.keys[i];
			s += k + "=" + this.data[k];
		}
		s += "}";
		return s;
	};
}
/**
 *@description 获取UUID
 */
function getUUID() {
	return new Date().getTime() +
		('000' + parseInt(Math.random() * 1000)).substr(-3) +
		('000' + parseInt(Math.random() * 1000)).substr(-3);
}
/**
 *@description  JS 分页函数
 *           pStart: 1, 当前页
 *           pTotal: 1,总页数
 *           ulClass:"pull-right pagination",分页的ul样式
 *           btnNameEx:getUUID(),分页a标签的name的后缀
 *           appendAreaId:"forum_list_page_area",待将页码附加区域
 *           loadDoc:function (c) { },单击分页时的动作函数,参数c表示当前页
 *           loadDocParam:[],单击分页时调用函数需要传入的参数，这些参数将从附加数据data-*中读取，此处只有键名
 *           aData:{},附加到分页的数据
 *           callback: function () { } 回调函数
 */
function loadPagenation(opts) {
	opts = jQuery.extend({
		pStart: 1,
		pTotal: 1,
		ulClass: "pull-right pagination",
		btnNameEx: getUUID(),
		btnNextId: getUUID(),
		appendAreaId: "forum_list_page_area",
		loadDoc: function(c) {},
		loadDocParam: [],
		aData: {},
		callback: function() {}
	}, opts || {});
	var _ul = $('<ul class=""></ul>');
	_ul.attr("class", opts.ulClass);
	$("#" + opts.appendAreaId).html('');
	var baseCurr = parseInt(opts.pStart / 5);
	var mod5Curr = opts.pStart % 5;
	var floor5Curr = parseInt(opts.pTotal / 5); /*Math.floor(opts.pTotal / 5);*/
	var mod5Total = opts.pTotal % 5;
	var countShow = 5;
	var _html;
	var nextPage;
	var currPage;

	if(baseCurr >= 1) {
		var _firstPage = $('<a href="javascript:void(0)">首页</a>');
		_firstPage.attr("name", "pageChange_" + opts.btnNameEx);
		_firstPage.attr("data-pagenum", 1);
		$.each(opts.aData, function(k, v) {
			_firstPage.attr(k, v);
		});
		/*_ul.append($("<li></li>").append(_firstPage));*/
	}
	if(opts.pStart <= 1) {
		var _pPage = $('<a href="javascript:void(0)">&laquo;</a>');
		_pPage.attr("name", "pageChange_" + opts.btnNameEx);
		_pPage.attr("data-pagenum", 1);
		$.each(opts.aData, function(k, v) {
			_pPage.attr(k, v);
		});
		var liEle=$("<li></li>");
		liEle.attr("disabled",true);
		liEle.addClass("disabled");
		_pPage.attr("disabled",true);
		_pPage.addClass("disabled");
		_ul.append(liEle.append(_pPage));
	} else {
		var _pPage = $('<a href="javascript:void(0)">&laquo;</a>');
		_pPage.attr("name", "pageChange_" + opts.btnNameEx);
		_pPage.attr("data-pagenum", opts.pStart - 1);
		$.each(opts.aData, function(k, v) {
			_pPage.attr(k, v);
		});
		_ul.append($("<li></li>").append(_pPage));
	}
	if(opts.pStart >= opts.pTotal) {
		var _nPage = $('<a href="javascript:void(0)">&raquo;</a>');
		_nPage.attr("name", "pageChange_" + opts.btnNameEx);
		_nPage.attr("id", "" + opts.btnNextId);
		_nPage.attr("data-pagenum", opts.pTotal);
		$.each(opts.aData, function(k, v) {
			_nPage.attr(k, v);
		});
		var liEle=$("<li></li>");
		liEle.attr("disabled",true);
		liEle.addClass("disabled");
		_nPage.attr("disabled",true);
		_nPage.addClass("disabled");
		nextPage = liEle.append(_nPage);
	} else {
		var _nPage = $('<a href="javascript:void(0)">&raquo;</a>');
		_nPage.attr("name", "pageChange_" + opts.btnNameEx);
		_nPage.attr("id", "" + opts.btnNextId);
		_nPage.attr("data-pagenum", opts.pStart + 1);
		$.each(opts.aData, function(k, v) {
			_nPage.attr(k, v);
		});
		nextPage = $("<li></li>").append(_nPage);
	}
	//每5页显示一组，判断当前页是不是第N*5页
	//如果是则显示5*N-4,5*N-3,5*N-2,5*N-1,5*N
	//不是则显示
	if(mod5Curr == 0) {
		for(var i = 1; i <= 5; i++) {
			//var r = (floor5Curr - 1) * 5 + i;
			var r = baseCurr * 5 + i;
			if(r <= opts.pTotal) {
				var _cPage = $('<a href="javascript:void(0)">' + r + '</a>');
				_cPage.attr("name", "pageChange_" + opts.btnNameEx);
				_cPage.attr("data-pagenum", r + "");
				$.each(opts.aData, function(k, v) {
					_cPage.attr(k, v);
				});
				if(r==opts.pStart){
					_cPage.addClass("activitylia");
				}
				_ul.append($("<li></li>").append(_cPage));
			}
		}
	} else {
		for(var i = 1; i <= 5; i++) {
			//var r = floor5Curr * 5 + i;
			var r = baseCurr * 5 + i;
			if(r <= opts.pTotal) {
				var _cPage = $('<a href="javascript:void(0)">' + r + '</a>');
				_cPage.attr("name", "pageChange_" + opts.btnNameEx);
				_cPage.attr("data-pagenum", r + "");
				$.each(opts.aData, function(k, v) {
					_cPage.attr(k, v);
				});
				if(r==opts.pStart){
					_cPage.addClass("activitylia");
				}
				_ul.append($("<li></li>").append(_cPage));
			}
		}
	}
	_ul.append(nextPage);
	if(baseCurr >= 1) {
		var _lastPage = $('<a href="javascript:void(0)">尾页</a>');
		_lastPage.attr("name", "pageChange_" + opts.btnNameEx);
		_lastPage.attr("data-pagenum", opts.pTotal);
		$.each(opts.aData, function(k, v) {
			_pPage.attr(k, v);
		});
		/*_ul.append($("<li></li>").append(_lastPage));*/
	}
	$("#" + opts.appendAreaId).append(_ul);
	if(opts.pTotal==1){
		$("#" + opts.appendAreaId).css("display","none");
	}else{
		$("#" + opts.appendAreaId).css("display","");
	}
	
	$("[name=pageChange_" + opts.btnNameEx + "]").on("click", function() {
		$("[name=pageChange_" + opts.btnNameEx + "]").removeClass("activitylia");
		var _pageNum = $(this).attr("data-pagenum");
		var _pObj = $(this);
		$(this).addClass("activitylia");
		var c = {
			pageNum: _pageNum,
			btnNameEx: opts.btnNameEx
		};
		$.each(opts.loadDocParam, function(i, k) {
			c[k] = _pObj.attr("data-" + k);
			//c = jQuery.extend({},c,{_key:_pObj.attr("data-"+k)});
		});
		opts.loadDoc(c);
	});
	opts.callback();
}
// ==============================================
// beg.utils.date
// ==============================================
(function($) {
	var utils = window.utils || (window.utils = {});
	/**
     *@description  格式化日期
	 * @param {Object} date 日期
	 * @param {Object} format 格式化标准
	 */
	utils.formatDate = function(date, format) {
		var fill = function(num) {
			return ([ '00', '01', '02', '03', '04', '05', '06', '07', '08',
					'09', '10', '11', '12' ][num] || num);
		}
		var isJavaDateObject = function(date) {
			return date != null && typeof (date) == 'object'
					&& date.date != undefined && date.day != undefined
					&& date.hours != undefined && date.minutes != undefined
					&& date.month != undefined
					// && date.nanos != undefined
					&& date.seconds != undefined && date.time != undefined
					&& date.timezoneOffset != undefined
					&& date.year != undefined;
		}
		if (date == undefined) {
			return date;
		} else if (date instanceof Date) {
			return format.replace(/yyyy/g, date.getFullYear()).replace(/MM/g,
					fill(date.getMonth() + 1)).replace(/dd/g,
					fill(date.getDate())).replace(/HH/, fill(date.getHours()))
					.replace(/mm/, fill(date.getMinutes())).replace(/ss/,
							fill(date.getSeconds()));
		} else if (isJavaDateObject(date)) {
			return utils.formatDate(new Date(date.time), format);
		} else {
			throw 'arguments[0] must be a date object.';
		}
	};
	utils.parseDate = function(str, format) {
		str = str.toString();
		var date = new Date(0);
		var get = function(part) {
			var idx = format.indexOf(part);
			return (idx == -1) ? null : parseInt(str.substr(idx, part.length)
					.replace(/^0/, ''));
		}
		var mapp = {
			'yyyy' : 'setFullYear'
			// ,'yy' : 'setYear'
			,
			'MM' : 'setMonth'
			// ,'M' : 'setMonth'
			,
			'dd' : 'setDate',
			'HH' : 'setHours',
			'hh' : 'setHours',
			'mm' : 'setMinutes',
			'ss' : 'setSeconds'
		};
		for ( var attr in mapp) {
			var n = get(attr);
			var f = mapp[attr];
			if (n != null) {
				if (attr == 'MM') {
					n--;
				}
				date[f](n);
			}
		}
		;
		return date;
	};
	utils.date = function(_date, _format) {
		var date = _format ? utils.parseDate(_date, _format)
				: (_date || new Date());
		date.add = function(_field, num) {
			var field = _field.substr(0, 1).toUpperCase()
					+ _field.substr(1).toLowerCase();
			if (!this['get' + field]) {
				throw '[utils.addDate]unexpect field:' + _field;
			}
			var date = this.clone();
			date['set' + field](date['get' + field]() + num);
			return date;
		}
		date.trans = function(org, dst) {
			return utils
					.date(utils.parseDate(utils.formatDate(this, org), dst));
		}
		date.format = function(format) {
			return utils.formatDate(this, format);
		}
		date.isToday = function() {
			return this.getDate() == new Date().getDate();
		}
		date.clone = function() {
			return utils.date(new Date(this.getTime()));
		}
		return date;
	}
	utils.isNotEntity = function(value){
		if ( undefined != value && null != value && value.length > 0 && value.replace(/\ /g, "").length > 0 ) {
			return true
		}
		return false;
	}
})(jQuery);
// ==============================================
// beg.utils.date
// ==============================================

// ==============================================
// beg.utils.formatNumber
// ==============================================
(function($) {
	var utils = window.utils || (window.utils = {});
	/****
	 * 是否是数字
	 * @param {Object} str 待判断字符串
	 * @param {Object} isPure 
	 */
	utils.isNumber = function(str, isPure) {
		return isPure ? parseFloat(str) == str : !isNaN(parseInt(str));
	}
	// utils.formatNumber('12345.6789', '#,##0.00') = 12,345.68
	utils.formatNumber = function(str, format) {
		var na = (str == undefined ? '' : str).toString().split(/\./);
		var fa = format.split(/\./);
		var sp = format.indexOf(',') > 0;
		var sd = format.indexOf('.') != -1;
		var ph = '`';
		var ra = [];
		var _rep = function(str, num) {
			return new Array(num + 1).join(str);
		}
		var ms = Math.max(na[0].length, fa[0].length);
		na[0] = _rep(ph, ms - na[0].length) + na[0];
		fa[0] = _rep(ph, ms - fa[0].length) + fa[0];
		for (var i = 0; i < ms; i++) {
			var n = na[0].charAt(i);
			var f = fa[0].charAt(i);
			if (sp && ra.length && (ms - i) % 3 == 0) {
				ra.push(',');
			}
			if (n != ph) {
				ra.push(n);
			} else if (f == '0') {
				ra.push(0);
			}
		}
		if (sd) {
			var _toFixed = function(num, fractionDigits) {
				if (fractionDigits <= 0) {
					return parseInt(num).toString();
				} else if (num == 0) {
					return '0.' + new Array(fractionDigits + 1).join('0');
				} else {
					var ret = parseInt(num * Math.pow(10, fractionDigits + 1)
							+ 5)
							/ Math.pow(10, fractionDigits + 1);
					ret = ret + '.' + new Array(fractionDigits + 1).join('0');
					ret = ret.substr(0, ret.indexOf('.') + fractionDigits + 1);
					return ret;
				}
			}
			ra.push('.');
			// na[1] = _toFixed(parseFloat('0.' + na[1]), parseInt('1' +
			// fa[1]).toString().length-1).substr(2);
			na[1] = parseFloat(_toFixed(parseFloat('0.' + na[1]), fa[1].length))
					.toString().substr(2);

			var ms = Math.max(na[1].length, fa[1].length);
			na[1] = na[1] + _rep(ph, ms - na[1].length);
			fa[1] = fa[1] + _rep(ph, ms - fa[1].length);
			for (var i = 0; i < ms; i++) {
				var n = na[1].charAt(i);
				var f = fa[1].charAt(i);
				if (n != ph && f != ph && (f == '#' || (f >= 0 && f <= 9))) {
					ra.push(n);
				} else if (f != ph && f != '#') {
					ra.push(f);
				}
			}
		}

		return ra.join('').replace(/-,/g, '-').replace(/\.$/, '').replace(
				/\.%$/, '%');
	}
})($);
function getQueryStringByName(name) {
	var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if(result == null || result.length < 1) {
		return "";
	}
	return decodeURI(result[1]);
}
// ==============================================
// end.utils.formatNumber
// ==============================================

/**
 * 樊文辉 20170908 将移动端键盘的小表情转换成utf-8格式
 */
function utf16TransformEntity(str) {
	// 1.检测表情字符
	var patten = /[\ud800-\udbff][\udc00-\udfff]/g;
	// 2.将表情字符(utf-16)转换成10进制获得实体编码
	str = str.replace(patten, function(char) {
		var H, L, code;
		if( char.length === 2 ){
			H = char.charCodeAt(0);// 取出高位
			L = char.charCodeAt(1);// 取出低位
			code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
			return "&#" + code + ";";
		} else {
			return char;
		}
	});
	return str;
}
