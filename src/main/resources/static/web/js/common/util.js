/*
	need jQuery,jQuery.ui.core,jQuery.ui.dialog,jQuery.form.js,jQuery.blockUI.js
*/
(function($){
	var utils = window.utils || (window.utils = {});
	var g_var = window.g_var || {};
		g_var.logoutURL = g_var.logoutURL || 'login.jsp';
		g_var.resPath = ($('link:eq(0)').attr('href')||'${_skin_}').replace(/(.+)\/(css|js)\/.+/,'$1');
	utils.dtree = 
	{
		setIcon : function(dtree,bPath,icon)
		{
			bPath = bPath || '';
			icon = icon || {
				root		: g_var.resPath + '/imgs/dtree/fav_folder.gif',
				folder		: g_var.resPath + '/imgs/dtree/folder.gif',
				node		: g_var.resPath + '/imgs/dtree/node.gif',
				empty		: g_var.resPath + '/imgs/dtree/empty.gif',
				line		: g_var.resPath + '/imgs/dtree/line.gif',
				join		: g_var.resPath + '/imgs/dtree/join.gif',
				joinBottom	: g_var.resPath + '/imgs/dtree/joinbottom.gif',
				plus		: g_var.resPath + '/imgs/dtree/plus.gif',
				minus		: g_var.resPath + '/imgs/dtree/minus.gif',
				minusBottom	: g_var.resPath + '/imgs/dtree/minusbottom.gif',
				plusBottom	: g_var.resPath + '/imgs/dtree/plusbottom.gif',
				nlPlus		: g_var.resPath + '/imgs/dtree/nolines_plus.gif',
				nlMinus		: g_var.resPath + '/imgs/dtree/nolines_minus.gif',
				folderOpen	: g_var.resPath + '/imgs/dtree/folderopen.gif'
			};
			for(var a in icon)
			{
				dtree.icon[a] = bPath + icon[a];
			}
		}
	}
	
	function dp(s){
		return '"' + s + '"';
	}

	utils.isLoginPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is login page(flag for ajax)-->') != -1);
	}
	utils.isErrorPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is exception page(flag for ajax)-->') != -1);
	}
	utils.isTipsPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is message page(flag for ajax)-->') != -1);
	}
	utils.isStandardResult = function(result) {
		return result
			&& typeof result.state		!= 'undefined'
			&& typeof result.message	!= 'undefined'
			&& typeof result.data		!= 'undefined'
			&& typeof result.SUCCESS	!= 'undefined'
			&& typeof result.ERROR		!= 'undefined'
			&& typeof result.WARN		!= 'undefined';
	};
	utils.isExpectResult = function(responseText) {
		if(responseText == null || $.trim(responseText.toString()).length==0){
			return false;
		}
		else if(utils.isErrorPage(responseText)){
			utils.dialog({
				width : $('body').width()*.6,
				height : $('body').height()*.6,
				autoOpen : true
			},responseText,'出错啦...','UTILS_EXT_ERROR_MESSAGE');
		}
		else if(utils.isTipsPage(responseText)){
			utils.dialog({
				width : $('body').width()*.6,
				height : $('body').height()*.6,
				autoOpen : true
			},responseText,'提示','UTILS_EXT_TIPS_MESSAGE');
		}
		else if(utils.isLoginPage(responseText)){
			window.top.location.href = g_var.logoutURL;
		}
		else{
			return true;
		}
		return false;
	}
	utils.require = function(sector,el,container) {
		var $c = container ? $(container) : $('body');
		var $s = $(sector,$c)
		if(!$s.length){
			$s = $(el);
			$s.appendTo($c);
		}
		return $s;
	}
	utils.form = 
	{
		clear : function(f) {
			f = $(f);
			var a = ['checkbox','hidden','input','password','radio','text','textarea'];
			$.each(a,function(i,n){
				f.find(n).val('');
			});
			return f;
		},
		fill : function(f,o,prefix) {
			f = $(f);
			for(var name in o) {
				var val = o[name];
				f.find('[name="'+ (prefix ? (prefix + name) : name) +'"]').val(val);
			}
			return f;
		},
		json : function(f) {
			var o = $(f).serializeObject();
			var ret = {};
			for(var a in o) {
				if(o[a]) {
					ret[a] = o[a];
				}
			}
			return ret;
		},
		/*
		 * 用于struts2中，添加数组参数
		 * f	: form
		 * arr	: object array
		 * name	: parameter name
		 */
		addList	: function(f,arr,name) {
			f = $(f);
			var html = [];
			var flag = 'data-dynamicList=' + dp(name) + '';
			f.children('[' + flag + ']').remove();
			$.each(arr,function(i,n){
				if($.isPlainObject(n)){
					for(var attr in n){
						html.push('<input type="hidden" name=' + dp(name + '[' + i + '].' + attr) + ' value=' + dp(n[attr]) + ' ' + flag + ' />');
					}
				}
				else {
					html.push('<input type="hidden" name=' + dp(name + '[' + i + ']') + ' value=' + dp(n) + ' ' + flag + ' />');
				}
			});
			if(html.length){
				html = html.join('');
				f.append($(html));
			}
		},
		postIframe : function(f,func,isJsonResult) {
			f = $(f);
			var name = f.attr('target');
			if(!name){
				name = f.attr('name')||new String(Math.round((Math.random()+0.01)*10000));
				f.attr('target',name);
			}
			var iframe = $('iframe[name="'+name+'"]');
			if(!iframe.length){
				var s = '<iframe name="$name" style="display:none;width:0px;height:0px;" />';
				iframe = $(s.replace(/\$name/g,name));
				iframe.appendTo('body');
			}
			if(!iframe.data('data-onloadHook')){
				iframe.data('data-onloadHook',true);
				utils.iframe.onload(iframe,function(){
					var result = iframe.contents().find('body').html();
					if(isJsonResult){
						try{result = $.parseJSON(result);}catch(e){}
					}
					(func||$.noop).call(iframe,result);
				});
			}
		},
		stdPost : function(f,opts) {
			var opts = opts || {};
			opts._beforeSubmit = opts.beforeSubmit || $.noop;
			opts.beforeSubmit = function(formData, $form, options){
				var ret = opts._beforeSubmit(formData, $form, options);
				if(ret !== false){
					utils.block();
				}
				return ret;
			};
			opts._success = opts.success || $.noop;
			opts.success = function(responseText, statusText, xhr, $form){
				utils.unblock();
				//alert((new XMLSerializer()).serializeToString(responseText));
				if(utils.isExpectResult(responseText)){
					opts._success(responseText, statusText, xhr, $form);
				}
			}
			return $(f).ajaxForm(opts);
		}
	}
	
	utils.layout = 
	{
		//func	: window.resize
		//args	: [#id, $url]...
		//fix bug - resize invalidation caused by iframe loading page(ie6,7,8)
		resizeIframe : function(func, args) {
			$(window).resize(func).resize();
			for(var i=1; i<arguments.length; i++){
				var id = arguments[i][0], src = arguments[i][1];
				var iframe = $(id).attr('src',src);
				utils.iframe.onload(iframe,func);
			}
			window.setTimeout(func,1);
		}
	}
	utils.iframe = 
	{
		onload : function(/*iframe, func*/) {
			var src = null;
			var ifrm = null;
			var callback = null;
			if(arguments.length == 1) {
				src = arguments[0].src;
				ifrm = arguments[0].iframe;
				callback = arguments[0].callback || arguments[0].func;
			}
			if(arguments.length == 2) {
				var iframe = arguments[0]
					,func = arguments[1];

				ifrm = $(iframe).get(0);
				callback = function(){
					func.call(ifrm);
				}
			}
			else if(arguments.length >= 3) {
				var iframe = arguments[0]
					,func = arguments[2]
					,src = arguments[1];

				ifrm = $(iframe).attr('src',src).get(0);
				callback = function(){
					func.call(ifrm);
				}
			}
			ifrm.addEventListener
				? ifrm.addEventListener('load', callback, false)
				: (ifrm.attachEvent ? ifrm.attachEvent('onload', callback) : ifrm.onload = callback);
		}
	}
	/*
	 * @deprecated
	 */
	utils.getEl = function(id)
	{
		var el = null, win = window;
		do{
			if(el = win.document.getElementById(id))
				break;
		}while((win != window.top)&&(win = win.parent))
		return el;
	}
	utils.block = function(el,opts)
	{
		var options = { 
			theme	: true, 
			title	: '请稍候...', 
			message	: '<p><img src="resource/imgs/loading.gif" /></p>',
			themedCSS : {
				width : 'auto'
			}
		};
		if($.browser.msie && /^6/.test($.browser.version)){
			options.themedCSS.width = 72;
		}
		if(opts){
			options = $.extend(options,opts);
		}
		(el?$(el):$('body')).block(options);
	}
	utils.unblock = function(el,opts)
	{
		(el?$(el):$('body')).unblock(opts);
	}
	utils.loadMask = function(dlgArgs, id)
	{
		var opts = {
			modal		: true,
			width		: 'auto',
			height		: 100,
			bgiframe	: true,
			autoOpen	: false,
			buttons		: null,
			closeOnEscape : false
		};
		var title = '请稍候...';//标题：请稍候...
		var html = '<img src="resource/imgs/loading.gif" />';
		var $dlg = utils.dialog(opts,html,title,id||'UTILS_EXT_DIALOG_LOADING');
		return $dlg.dialog.apply($dlg,arguments);
	}
	utils.dialog = function(opts,html,title,id)
	{
		id = (id==null?'UTILS_EXT_DIALOG_MESSAGE':id);
		var dlg = $('#'+id);
		if(!dlg.length){
			var options = {
				modal		: true,
				bgiframe	: true,
				autoOpen	: false,
				maxWidth	: $('body').width(),
				maxHeight	: $('body').height(),
				buttons		: {
					'确定': function() {dlg.dialog('close');}
				}
			};
			if($.isPlainObject(opts)){
				options = $.extend(options,opts);
			}
			dlg = $('<div id="'+id+'" class="dialog-default" style="display:none;" />');
			dlg.appendTo($('body'));
			dlg.dialog(options).dialog('widget').find('.ui-dialog-titlebar-close').hide();
		}
		else{
			if($.isArray(opts)){
				dlg.dialog.apply(dlg,opts);
			}
			else if($.isPlainObject(opts)){
				dlg.dialog.call(dlg,'option',opts);
			}
		}
		if(title != undefined){
			dlg.dialog('option','title',title);
		}
		if(html != undefined && html != null){
			dlg.html($(html));
		}
		if(typeof opts == 'string' || $.isPlainObject(opts)){
			return dlg.dialog.call(dlg,opts);
		}
		else{
			return dlg.dialog.call(dlg,'open');
		}
	}
	/*
	utils.alert = function(msg, callback){
		alert(msg);
		(callback || $.noop)();
	}*/
	utils.alert = function(msg,callback){
		setTimeout(function(){
			alert(msg);
			(callback || $.noop)();
		},1);
	}
	utils.confirm = function(msg,cbSuccess,cbFailed,sORfWhenMsgIsNull){
		if(msg || sORfWhenMsgIsNull === undefined){
			window.confirm(msg) ? cbSuccess.call(this) : (cbFailed||$.noop).call(this);
		}
		else{
			sORfWhenMsgIsNull ? cbSuccess.call(this) : (cbFailed||$.noop).call(this);
		}
	}
	utils.stdPost = function(url,data,cbSuccess,cbFailed,dlgArgs) {
		dlgArgs = dlgArgs == undefined ? 'open' : (dlgArgs == false ? 'close' : dlgArgs);
		var $loading = utils.loadMask(dlgArgs, new Date().getTime() + Math.random());
		var onLoaded = (function($loading){
			return function(){
				setTimeout(function(){$loading.dialog('close');$loading.dialog('destroy');$loading.remove()},1);
			};
		})($loading);
		var ajaxOpts = {
			url			: url,
			data		: data,
			type		: 'post',
			dataType	: 'json',
			jsonp		: null,
			jsonpCallback	: null
		};
		ajaxOpts.error = function (XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.readyState == 4){
				onLoaded();
				if(utils.isExpectResult(XMLHttpRequest.responseText)){
					var message = null;
					switch (XMLHttpRequest.status){
						case 0:
						case 400:
							message = "XmlHttpRequest status: [400] Bad Request";
							break;
						case 404:
							message = "XmlHttpRequest status: [404] \nThe requested URL "+ url +" was not found on this server.";
							break;
						case 503:
							message = "XmlHttpRequest status: [503] Service Unavailable";
							break;
						default:
							message = textStatus == 'timeout'
								? 'ajax request timeout，please try again！' 
								: 'XmlHttpRequest unknow status: [' + XMLHttpRequest.status + '].errorThrown: [' + errorThrown + ']';
					}
					cbFailed = $.isFunction(cbFailed) ? cbFailed : $.noop;
					var result = {"ERROR":"error","SUCCESS":"success","WARN":"warn","data":null,"message":message,"state":"error"};
					if( cbFailed(result) !== false ) {
						utils.alert( message );
					}
				}
			}
		};
		ajaxOpts.success = function(result){
			onLoaded();
			if(utils.isExpectResult(result)){
				if(utils.isStandardResult(result) && result.state != result.SUCCESS){
					if( $.isFunction(cbFailed) ){
						cbFailed(result);
					}
					else{
						utils.alert(result.message);
					}
				}
				else if(result.state == result.SUCCESS){
					$.isFunction(cbSuccess) && cbSuccess(result);
				}
				else{
					$.isFunction(cbFailed) && cbFailed(result);
				}
			}
			else{
				utils.alert('un expect result:' + result);
			}
		}
		$loading.data('xhr',$.ajax(ajaxOpts));
	}
	utils.stdPost.cbBefore = function(){}
	utils.stdPost.cbFinish = function(){}
	utils.stdPost.cbQuiet = function(){return false;}
	

	utils.load = function(el, url, params, callback, dlgArgs) {
		
		dlgArgs = dlgArgs == undefined ? 'open' : (dlgArgs == false ? 'close' : dlgArgs);
		var $loading = utils.loadMask(dlgArgs, new Date().getTime() + Math.random());
		var onLoaded = (function($loading){
			return function(){
				setTimeout(function(){$loading.dialog('close');$loading.dialog('destroy');$loading.remove()},1);
			};
		})($loading);

		var $this = $(el);
			$this.load(url, params, function(jqXHR, status, responseText){
				onLoaded();
				if ( callback ) {
					$this.each( callback, [ responseText, status, jqXHR ] );
				}
			});
		return $this;
	}
	utils.formatDate = function(date,format){
		var fill = function(num){
			return (['00','01','02','03','04','05','06','07','08','09','10','11','12'][num]||num);
		}
		var isJavaDateObject = function(date){
			return date != null && 
				typeof(date) == 'object' 
				&& date.date != undefined
				&& date.day != undefined
				&& date.hours != undefined
				&& date.minutes != undefined
				&& date.month != undefined
				//&& date.nanos != undefined
				&& date.seconds != undefined
				&& date.time != undefined
				&& date.timezoneOffset != undefined
				&& date.year != undefined;
		}
		if( date == undefined ) {
			return date;
		}
		else if( date instanceof Date ){
			return format
				.replace(/yyyy/g, date.getFullYear())
				.replace(/MM/g, fill(date.getMonth()+1))
				.replace(/dd/g, fill(date.getDate()))
				.replace(/HH/, fill(date.getHours()))
				.replace(/mm/, fill(date.getMinutes()))
				.replace(/ss/, fill(date.getSeconds()));
		}
		else if( isJavaDateObject(date) ){
			return utils.formatDate(new Date(date.time), format);
		}
		else{
			throw 'arguments[0] must be a date object.';
		}
	};
	utils.parseDate = function(str,format){
		var date = new Date(0);
		var get = function(part){
			var idx = format.indexOf(part);
			return (idx == -1) ? null : parseInt(str.substr(idx, part.length).replace(/^0/,''));
		}
		var mapp = {
			 'yyyy'	: 'setFullYear'
			,'yy'	: 'setYear'
			,'MM'	: 'setMonth'
			,'M'	: 'setMonth'
			,'dd'	: 'setDate'
			,'HH'	: 'setHours'
			,'hh'	: 'setHours'
			,'mm'	: 'setMinutes'
			,'ss'	: 'setSeconds'
		};
		for(var attr in mapp){
			var n = get(attr);
			var f = mapp[attr];
			if( n != null ){
				if( attr == 'MM' ){
					n--;
				}
				date[f](n);
			}
		};
		return date;
	};
	utils.date = function(_date, _format) {
		var date = _format ? utils.parseDate(_date, _format) : (_date || new Date());
			date.add = function(_field, num){
				var field = _field.substr(0,1).toUpperCase() + _field.substr(1).toLowerCase();
				if( !this['get' + field] ) {
					throw '[utils.addDate]unexpect field:' + _field;
				}
				var date = this.clone();
					date['set'+field]( date['get'+field]() + num );
				return date;
			}
			date.trans = function(org, dst) {
				return utils.date( utils.parseDate( utils.formatDate(this, org), dst ) );
			}
			date.format = function(format) {
				return utils.formatDate(this, format);
			}
			date.isToday = function(){
				return this.getDate() == new Date().getDate();
			}
			date.clone = function(){
				return utils.date(new Date(this.getTime()));
			}
		return date;
	}
})(jQuery);

(function($) {
	//hack for $.trim(1234)
	$._trim = $.trim;
	$.trim = function(text) {
		return $._trim((text || '').toString());
	}

	$.fn.serializeObject = function(containsAll) {
		if(containsAll) {
			var tmp = '_disabled_' + parseInt(Math.random()*100);
			var all = this.add(this.find('checkbox,input,password,radio,textarea'));
			$.each(all,function(i,el){
				$(el).attr(tmp,$(el).attr('disabled')).attr('disabled',false);
			});
			var o = all.serializeObject(false);
			$.each(all,function(i,el){
				$(el).attr('disabled',$(el).attr(tmp)=='true').removeAttr(tmp);
			});
			return o;
		}
		else {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		}
	};
})(jQuery);


//==============================================
// beg.utils.validate
//==============================================
(function(exports){
	var validate = {};
		validate.isBlank = function(val) {
			return val == null || /^\s*$/.test(val);
		}
		validate.isChinese = function(val) {
			 return  /^[^u4e00-u9fa5]+$/.test(val);	
		}
		validate.isEmail = function(val) {
			 return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val);
		}
		validate.is26Letters = function(val) {
			return /^[a-zA-Z]+$/.test(val) ;
		}
		validate.isInteger = function(val) {
			return val == '0' || /^[1-9][0-9]*$/.test(val) ;
		}
		validate.isString = function(val) {
		   return /^\w+$/.test(val) ;
		}
		validate.isPhone = function(val) {
			return /^((\d{3}-)?(\d){11,12},)*(\d{3}-)?(\d){11,12}$/.test(val) ;
		}
		validate.isMobile = function(val) {
			return /^1\d{11}$/.test(val);
		}
		validate.isURL = function(val) {
			return /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/\?\%\&\=]*)?/.test(val);
			//return /^[a-zA-z]+:\/\/(\w+[\.:?\/?])*(\.(\w+(-\w+)*\/{0,1}))*(\?\S*)?$/.test(val) ;
		}
		validate.isIP = function(val) {
			return /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(val) ;
		}
	exports.validate = validate;
})(utils);
//==============================================
// end.utils.validate
//==============================================



//==============================================
// beg.utils.pagination
//==============================================
/*
	need jQuery,jQuery.cookie
*/
(function($){
	window.utils = window.utils || {};
	//url:null or (parameter name in document.location.href.[iStart,pSize]) or jQuery
	utils.pagination = function(url,PSize,PStart,PTotal,IStart,ITotal)
	{
		var resPath = g_var.resPath || ($('link:eq(0)').attr('href')||'${_skin_}').replace(/(.+)\/(css|js)\/.+/,'$1');
		var icon = {
			first	: resPath + '/icon/page/first.gif',
			dFirst	: resPath + '/icon/page/first_disabled.gif',
			prev	: resPath + '/icon/page/prev.gif',
			dPrev	: resPath + '/icon/page/prev_disabled.gif',
			next	: resPath + '/icon/page/next.gif',
			dNext	: resPath + '/icon/page/next_disabled.gif',
			last	: resPath + '/icon/page/last.gif',
			dLast	: resPath + '/icon/page/last_disabled.gif'
		};
		var html = '<span class="pagination">' +
						'<img class="btnFirst" title="首页"/><img class="btnPrev" title="上一页"/><img class="btnNext" title="下一页"/>&nbsp;<img class="btnLast" title="尾页"/>&nbsp;' +
						'显示第<select class="selPStart"></select>页，每页<select class="selPSize"></select>条记录，共<span style="color:#FF9900;" class="txtITotal"></span>条记录' +
					'</span>';
		if( $.isPlainObject(arguments[1]) ){
			var pagination = arguments[1];
			if( typeof(pagination.PSize) != 'undefined'
				&& typeof(pagination.PTotal) != 'undefined'
				&& typeof(pagination.PStart) != 'undefined'
				&& typeof(pagination.IStart) != 'undefined'
				&& typeof(pagination.ITotal) != 'undefined' ){
					PSize = pagination.PSize;
					PTotal = pagination.PTotal;
					PStart = pagination.PStart;
					IStart = pagination.IStart;
					ITotal = pagination.ITotal;
				}
		}
		var el = $(html);
		var btnFirst = el.find('.btnFirst');
		var btnPrev = el.find('.btnPrev');
		var btnNext = el.find('.btnNext');
		var btnLast = el.find('.btnLast');
		var txtITotal = el.find('.txtITotal').text(ITotal);
		var selPStart = el.find('.selPStart');
		var selPSize = el.find('.selPSize');
		html = '';
		for(var i=1; i<=(PTotal||1); i++){
			html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,i).replace(/\$selected/g,PStart==i ? 'selected="true"' : '');
			//selPStart.append($('<option />').val(i).text(i).attr('selected',PStart==i));//with ie,too slow when PTotal large than 5000
		}
		selPStart.html(html);

		html = '';
		$.each([10,20,50,100],function(n,i){
			html += '<option value="$value" $selected>$text</option>'
				.replace('$text', i)
				.replace('$value', i)
				.replace('$selected', PSize==i ? 'selected="true"' : '')
			;
		});
		selPSize.append( html );

		var jump = function(){
			var pSize = PSize;
			var pStart = PStart;
			el.attr('disabled',true);
			$.cookie && $.cookie('pageSize',pSize,{path: '/', expires: 365});
			
			if( $.isFunction(url) ){
				url.call(this,pStart,pSize);
			}
			else if( url == null || $.isArray(url)){
				var res = new RegExp(($.isArray(url) ? url[0] : 'pageNum') + '\s*=\s*[^&]*');
				var rep = new RegExp(($.isArray(url) ? url[1] : 'pageSize') + '\s*=\s*[^&]*');
				url = document.location.href;
				url = url.match(res) ? url.replace(res,'pageNum=$pStart') : url + (url.indexOf('?')==-1 ? '?' : '&') + 'pageNum=$pStart';
				url = url.match(rep) ? url.replace(rep,'pageSize=$pSize') : url + (url.indexOf('?')==-1 ? '?' : '&') + 'pageSize=$pSize';
				document.location.href = url.replace(/\$pStart/,pStart).replace(/\$pSize/,pSize);
			}
			else if( $(url).length && $(url).attr('tagName').toLowerCase() == 'form' ){
				var $frm = $(url);
				var $pStart = $frm.find('*[name=pageNum]');
				var $pSize = $frm.find('*[name=pageSize]');
				var $pStart = $pStart.length ? $pStart : $('<input type="hidden" name="pageNum" />').appendTo($frm);
				var $pSize = $pSize.length ? $pSize : $('<input type="hidden" name="pageSize" />').appendTo($frm);
				$pStart.val(pStart);
				$pSize.val(pSize);
				$frm.submit();
			}
			else{
				throw 'wrong parameter in utils.pagination';
			}
		}
		selPStart.change(function(){
			PStart = $(this).val();
			jump();
		});
		selPSize.change(function(){
			PSize = $(this).val();
			PStart = 1;
			jump();
		});
		if(PStart<=1)
		{
			btnFirst.attr('src', icon.dFirst);
			btnPrev.attr('src', icon.dPrev);
		}
		else
		{
			btnFirst.attr('src', icon.first).css('cursor','pointer').click(function(){
				PStart = 1;
				jump();
			});
			btnPrev.attr('src', icon.prev).css('cursor','pointer').click(function(){
				PStart--;
				jump();
			});
		}
		if(PStart>=PTotal)
		{
			btnNext.attr('src', icon.dNext);
			btnLast.attr('src', icon.dLast);
		}
		else
		{
			btnNext.attr('src', icon.next).css('cursor','pointer').click(function(){
				PStart++;
				jump();
			});
			btnLast.attr('src', icon.last).css('cursor','pointer').click(function(){
				PStart = PTotal;
				jump();
			});
		}
		return el;
	};
	utils.pagination.reload = function(el)
	{
		$(el).find('select.selPStart').change();
	}
})(jQuery);
//==============================================
// end.utils.pagination
//==============================================



//==============================================
// beg.utils.page && utils.section
//==============================================
(function(exports){
	if( !exports.console ) {
		exports.console = {};
		exports.console.info = exports.console.debug = exports.console.error = function(){};
	}
	var console = exports.console;

	var utils = exports.utils || (exports.utils = {});
	utils.page = {};
	utils.page.create = function(name, object) {
		var page = object || {};
			page.init = function(){
				if( !this.isInited ) {
					for(var attr in this.init){
						var fn = this.init[attr];
						if( typeof(fn) == 'function' ) {
							console.info('[utils.section:' + (name||'-') + ']call init.' + attr);
							fn.call(this);
						}
					}
				}
				this.isInited = true;
			}
			page._boolean = function(str) {
				return !/^\s*$|0|false|null|undefined/ig.test(str);
			}
			page._name = function(name, $parent) {
				return $('[name="' + name + '"]', $parent || this.$wrap);
			}
			page._bind = function($el, event, callback) {
				return $el.unbind(event, callback).bind(event, callback);
			}
			page._delegate = function(selector, type, callback, el){
				return $(el || page.$wrap).undelegate(selector, type).delegate(selector, type, callback);
			}
			page._exports = function(exportsObjects){
				for( var attr in exportsObjects) {
					if( page[attr] == undefined ) {
						(function(){
							var value = exportsObjects[attr];
							if( $.isFunction(value) ) {
								page[attr] = function(){
									return value.apply(page, arguments);
								}
							}
							else {
								page[attr] = value;
							}
							console.info('[utils.section:' + (name||'-') + ']export:' + attr);
						})();
					}//fi
				}//end of for
			}
			/*
			page.event = $({});
			page.event.regester = function(events){
				page.event.data('events', (page.event.data('events') || []).concat(events));
			}
			page.event.check = function(key, src){
				var exists = page.event.data('events') || [];
				if( $.inArray(key.split('.')[0], exists) == -1 ) {
					throw (src ? '[' + src + ']' : '')+ 'unexpect event:' + key + '.[' + exists.join(',') + ']';
				}
			}
			page.event.on = function(key, fn) {
				page.event.check(key, 'event.on');
				return page.event.bind(key, function(){
					fn.call(page);
				});
			}
			page.event.off = function(key) {
				return page.event.unbind(key);
			}
			page.event.fire = function(key){
				page.event.check(key, 'event.fire');
				return page.event.trigger(key);
			}
			*/
			page.$wrap = $(document);
			page.$wrap.data('oWidget', page);
		return page;
	}
	utils.section = {};
	utils.section.getElement = function(name, $parent){
		//var $el = $("#user_tree");
		var sel = '[name="section-' + name + '-wrap"]';
		var $el = $(sel, $parent);
		if( !$el.length ) {
			throw "can't get section:" + sel;
		}
		return $el;
	}
	utils.section.getWidget = function(name, $parent){
		var oWidget = utils.section.getElement(name, $parent).data('oWidget');
		if( !oWidget ) {
			throw "can't get section.widget:" + name;
		}
		return oWidget;
	}
	utils.section.create = function(name, object) {
		var section = utils.page.create(name, object);
		if( !section.init._id ) {
			var id = section.init._id = new Date().getTime() + parseInt((Math.random()+0.1)*1000);
			var $script = $('script[name="section-' + name + '-script"]')
				.not('[section-id]')
				.first()
				.attr('section-id', id);

			var wrap = '[name="section-' + name + '-wrap"]';
			
			section.$wrap = $script.closest(wrap);
			
			if( !section.$wrap.length ) {
				section.$wrap = $script.prev(wrap);
			}
			if( !section.$wrap.length ) {
				section.$wrap = $(wrap);
			}
			section.$wrap.each(function(){
				var $this = $(this);
				if( !$this.data('oWidget') ) {
					section.$wrap = $this;
					return false;
				}
			});
			if( !section.$wrap.length ) {
				throw '[utils.section]can not find wrap:' + wrap;
			}
			
			section.$wrap.data('oWidget', section);
		}
		return section;
	}
})(window);
//==============================================
// end.utils.page && utils.section
//==============================================




//==============================================
//		beg.bmstable
//==============================================
(function(exports, name){
	"use strict";
	function bmstable(opts) {
		var self = {};

			self.params = {};
			self.params.wrap = 'body';
			self.params.showFooter = true;
			self.params.showPagination = true;
			self.params.showCheckbox = 'checkbox';
			self.params.column = [/*{name : 'name', label:'名称', width: 80}*/];
			self.params.button = [/*{name : '', label : '', img : '', disabled : false}*/];
			self.params.idName = 'taskName';
			self.params.loadWhenInit = true;
			self.params.url = function(){return 'task/task!ajaxFindTaskList.action';}
			self.params.params = function(pageNum, pageSize){return {};}
			self.params.getNoneData = function(){return '<tr><td><div class="cell" style="text-align:center;">暂无数据.</div></td></tr>';}
			self.params.uuid = new Date().getTime() + parseInt(Math.random() * 1000);

			self.params.on = {};
			self.params.on.result = function(result){};//结果集拦截
			self.params.on.transform = function(row, data){};//行拦截
			self.params.on.pagination = function(pageNum, pageSize){
				var params = $.extend({
					 pageSize	: pageSize
					,pageNum	: pageNum
				}, self.util.getRequestParams(pageNum, pageSize));
				self.util.request( self.util.getRequestURL(), params );
			};
			self.params.on.checkAll = function(){}
			self.params.on.afterLoad = function(){}


			self.data = {};
			self.data.widget = {};
			self.data.result = [];
			self.data.cache = {};


			self.util = {};
			self.util.request = function(url, params){
				var $wrap = $(self.params.wrap).empty();
				utils.stdPost(url, params, function(result) {
					var $body = $(self.util.build(result));
						$body.appendTo($wrap);
					self.util.bedeckFooter($body, result);
					self.util.bedeck();
					self.params.on.afterLoad.call( self, self.data.widget );
				});
			}
			self.util.build = function(result){
				var data = self.params.on.result(result);
				if( data ) {
					result = data;
				}
				return [
					 '<div class="bmstable">'
					,'<div class="headerWrap">' + self.util.buildHeader() + '</div>'
					,'<div class="contentWrap">' + self.util.buildContent(result) + '</div>'
					,'<div class="footerWrap">' + self.util.buildFooter(result) + '</div>'
					,'</div>'
				].join('');
			}
			self.util.buildHeader = function(){
				var html = '<table class="header"><thead><tr>' + self.util.buildCheckbox();
				$.each(self.params.column, function(i, item){
					html += '<th ' + self.util.getColumnAttribute(item) + '><div ' + self.util.getColumnAttribute(item) + '>' + item.label + '</div></th>';
				});
				html += '<th class="fixScroll" style="display:none;"></th></tr></thead></table>';
				return html;
			}
			self.util.buildContent = function(result){
				
				self.data.cache = {};

				var items = utils.isStandardResult(result) ? result.data.items || result.data : result;
				
				var cls = ['content', items.length ? '' : 'none'];
				var html = '<table class="' + cls.join(' ') + '"><tbody>';
				if( !items.length ) {
					html += self.params.getNoneData();
				}
				else {
					$.each(items, function(i, item) {
						if( self.params.on.transform(item, items) !== false ){

							var key = self.util.getRandom();
							self.data.cache[key] = item;
							
							if( item[self.params.idName] ) {
								self.data.cache[item[self.params.idName]] = item;
							}
							
							html += '<tr class="row ' + ['odd', 'even'][i%2] + '" data-bmstable-key="' + key + '">' + self.util.buildCheckbox(item);
							$.each(self.params.column, function(i, column){
								html += 
									'<td ' + self.util.getColumnAttribute(column) + '>' +
										'<div ' + self.util.getColumnAttribute(column) + '>' + (item[column.name] || '') + '</div>' +
									'</td>'
								;
							});
							html += '</tr>';
						}
					});
				}
				html += '</tbody></table>';
				return html;
			}
			self.util.buildFooter = function(result){
				return '<table class="footer"><tbody><tr><td><div class="lWrap"></div><div class="rWrap"></div></td></tr></tbody></table>';
			}
			self.util.buildCheckbox = function(data){
				var type = '';
				if( self.params.showCheckbox == 'checkbox' ) {
					type = 'checkbox';
				}
				else if( self.params.showCheckbox == 'radio' ) {
					type = "radio";
				}
				if( type ) {
					if( data ) {
						return '<td class="selectBox" style="display:none;"><input type="' + type + '" name="' + self.params.idName + '" value="' + data[self.params.idName] + '" /></td>';
					}
					else {
						return type == 'checkbox' 
							? '<th class="selectBox" style="display:none;"><input type="' + type + '" name="' + self.params.idName + '" /></th>'
							: '<th class="selectBox" style="display:none;"></th>'
						;
					}
				}
				return '';
			}
			self.util.getColumnAttribute = function(column){
				var w = self.util.getWidthParam(column);
				var s = !w ? '' : 'style="$style"'.replace('$style', ['width:'+w].join(';'));
				var c = 'class="$class"'.replace('$class', ['cell', column.cls, (w ? 'cell-w' : '')].join(' '));
				return [s,c].join(' ');
			}
			self.util.getWidthParam = function(column){
				if( column.width ) {
					return self.util.isNumber(column.width) ? (column.width + 'px') : column.width;
				}
				return '';
			}
			self.util.getRequestURL = function(){
				return $.isFunction(self.params.url) ? self.params.url.call(self) : self.params.url;
			}
			self.util.getRequestParams = function(pStart, pSize){
				return $.isFunction(self.params.params) ? self.params.params.call(self, pStart, pSize) : self.params.params;
			}
			self.util.isNumber = function(str) {
				return parseFloat(str) == str;
			}
			self.util.isDisabled = function($el) {
				return $el.attr('disabled');
			}
			self.util.getRandom = function(){
				return [new Date().getTime(),parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100)].join('');
			}
			self.util.bedeckFooter = function($body, result){

				var $wrap = $(self.params.wrap);
				var $foot = $('.footer', $wrap);

				if( !self.params.showFooter || (!self.params.showPagination && !self.params.button.length) ) {
					$foot.parent().hide();
				}

				//添加分页
				if( self.params.showPagination ) {
					$('.rWrap', $body).append( utils.pagination(self.params.on.pagination, result.data) );
				}
				//添加按钮
				if( self.params.button.length ) {
					var html = '';
					var fnClick = {};
					$.each( self.params.button, function(i, item){
						fnClick[item.name] = item.click || self.params.on[item.name] || $.noop;
						html += '<a href="javascript:void(0)" class="bmstable-btn" name="' + item.name + '" ' + (item.disabled ? 'disabled="true"' : '') + '>' + (item.img ? '<img src="' + item.img + '" />' : '') + item.label + '</a>';
					});
					$('.lWrap', $body).append( html ).delegate('a.bmstable-btn', 'click', function(event){
						var $target = $(event.currentTarget);
						var name = $target.attr('name');
						if( !self.util.isDisabled($target) && fnClick[name] ) {
							fnClick[name].call( $target, self.data.widget );
						}
					});
				}
				return $body;
			}
			self.util.bedeck = function(){
				var $wrap = $(self.params.wrap);
				var $head = $('.header', $wrap);
				var $body = $('.content', $wrap);
				var $foot = $('.footer', $wrap);
				var $bodyWrap = $body.parent();
				var $fixScroll = $('.fixScroll', $head);

				var resizeEventName = 'resize.bmstable-' + self.params.uuid;
				$(window).unbind(resizeEventName).bind(resizeEventName, function(){
					window.setTimeout(function(){
						var h = $head.is(':visible') ? $head.height() : 0;
						var f = $foot.is(':visible') ? $foot.height() : 0;
						$bodyWrap.height( $wrap.height() - h - f - 2 );
						$fixScroll[$bodyWrap.height() < $body.height() ? 'show' : 'hide']();
					}, 500);
				}).trigger(resizeEventName);

				$('.row', $body).hover(
					function(){$(this).addClass('hover');}, 
					function(){$(this).removeClass('hover');}
				);

				$('.selectBox')[ self.params.showCheckbox == 'checkbox' || self.params.showCheckbox == 'radio' ? 'show' : 'hide' ]();
				utils.checkbox.relating($('.selectBox input', $head), $('.selectBox input', $body));

				$('.selectBox input', $body).change(function(){
					self.params.on.checkAll.call( this, self.data.widget );
				});

				$wrap.parent().css({overflow:'hidden'});
			}
			self.util.debug = function(object, prefix){
				prefix = prefix || '';
				if( typeof(object) == 'object' ) {
					for(var attr in object) {
						console.debug( attr );
						self.util.debug( object[attr], '\t' );
					}
				}
				else if( typeof(object) == 'array' ) {
					$.each(object, function(i, item) {
						self.util.debug(item, '\t');
					});
				}
				else {
					console.debug(prefix + object);
				}
			};
			self.util.getWidget = function(){
				var oSelf = {};
					oSelf.$wrap	 = $(self.params.wrap);

				$.each( self.params.button, function(i, item){
					oSelf['$' + item.name] = $('[name="' + item.name + '"]', $('.lWrap', oSelf.$wrap));
				});
				oSelf.getObjectFromInnerElement = function(el) {
					return self.data.cache[ $(el).closest('[data-bmstable-key]').attr('data-bmstable-key') ];
				}
				oSelf.getObject = function(key){
					return self.data.cache[key];
				}
				oSelf.getCheckedObject = function(){
					var rets = {
						ids		: [],
						objects	: []
					};
					$('.selectBox input', $('.content', oSelf.$wrap)).filter(':checked').each(function(){
						var $this = $(this);
						var $data = $this.closest('[data-bmstable-key]');
						var name = $data.attr('data-bmstable-key');
						var data = self.data.cache[name];
						rets.ids.push( data[self.params.idName] );
						rets.objects.push( data );
					});
					return rets;
				}
				oSelf.reload = function(){
					self.util.request( self.util.getRequestURL(), self.util.getRequestParams() );
				}
				return oSelf;
			}
		
		$.extend( true, self.params, opts || {} );
		
		if( self.params.loadWhenInit ) {
			self.util.request( self.util.getRequestURL(), self.util.getRequestParams() );
		}
		return $.extend( self.data.widget, self.util.getWidget() );
	}
	exports[name] = function(opts){
		return new bmstable(opts);
	}
})(utils, 'bmstable');
//==============================================
//		end.bmstable
//==============================================

//==============================================
//begin.dropdown Tree v1.0
//==============================================
(function($){
	/**
	 * 注：当obj是input的时候获取值就是obj.val()，当obj是div的时候值是保存在obj.html()。
	 * name不能为重复
	 * @param obj 该参数支持input/div标签
	 * @param data_ 用于候选的值列表 data like=[{"id":"1","isFolder":1,"levels":"0层","name":"所有团队"}]
	 * @param type 默认是radio（要是多选就!=radio）
	 * @param store 将下列div存放到store里面（为了避免嵌套的css样式影响下拉列表样式）
	 * @param selectedItems 要选中的集合列表
	 */
	utils.dropdown = function(obj, data_, type, store, selectedItems, setItemsFlag, separator)
	{
		var params = {
			type :	type || 'radio'//单选or多选
			,data_	: data_
			,store	: store || null
			,selectedItems	:	selectedItems == null ? [] : selectedItems
			,setItemsFlag	:	setItemsFlag == true ? true : false
			,separator		:	separator || ';'
			,obj	: obj		
		};
		var isRadio = params.type == 'radio';
		var random = 'c'+Math.floor(Math.random()*1000000);
		var data = {
			treeData : {},
			selData	 : {},
			target	 : null,
			treeObj : null,
			dhxt  :	{
					skin		: g_var.dhtmlxTree.config.skin
					,imgs		: g_var.dhtmlxTree.config.imagePath
					,img_user	: g_var.image.dhtmlxTreeNode.user
					,img_role	: g_var.image.dhtmlxTreeNode.role
					,img_group	: g_var.image.dhtmlxTreeNode.group
			},
			dataForKeyName	: {},
			dropDiv	:	null
		};
		
		var main = function(obj, data_){
			_setStype(obj);
			var dropDiv = data.dropDiv = _biludDrop();
			if( params.store != null  ){
				params.store.append(dropDiv);
			}else{
				obj.after(dropDiv);
			}
			var tree  = _initTree(obj, data_ );
			var i = 0;
			obj.click(function(){
				var offset = _offset(obj);
				dropDiv.css('left', offset.left);
				dropDiv.css('top', offset.top+20);
				dropDiv.show();
				if( i == 0 ){
					data.selectedItem = params.setItemsFlag ? _getData() : params.selectedItems;
					_setData(data.selectedItem.join(params.separator));
					_setSelectedItem();
					i++;
				}
			});
			_events();
		}
		
		var _events = function(){
			$('[name="_clearupParams_'+random+'"]').click(function(){
				data.treeObj.unCheckAll();
				_setData('');
			});
			$(document).click(function(e){
				var target = e.target||e.srcElement;
				//点击已经输入框事件无效，交给obj.click();
				if( $(target).attr('random') == $(obj).attr('random') )
					return false;
			//	var drop = $(target).closest('#_dropDwomDiv_'+utils.currentSeleted);
				var drop = $(target).closest('div[id*=_dropDwomDiv_]');
				//鼠标点击的位置在下拉列表的div里面
				if( drop.length == 1 )
					return false;
				data.dropDiv.hide();
			});
		}
		
		var _setData = function(data){
			var fun = obj.get(0).tagName == 'INPUT' ? 'val': 'html';
			obj[fun](data);
			obj.attr('data-value', data);
		}
		
		var _getData = function(){
			var fun = params.obj.get(0).tagName == 'INPUT' ? 'val' : 'html';
			var value = params.obj[fun]();
			return value ? obj[fun]().split(params.separator) : [];
		}
		
		var _setSelectedItem = function(){
			$.each(data.selectedItem, function(i, d_){
				var itemObj = data.dataForKeyName[d_];
				if( isRadio ){
				//	data.treeObj.selectItem(itemObj.id, true, true);
					data.treeObj.openItem(itemObj.id);
				}else{
					data.treeObj.setCheck(itemObj.id, 1);
					data.treeObj.openItem(itemObj.id);
				}
			})
		}
		
		var _initTree = function(obj, aData)
		{
			data.treeObj = new dhtmlXTreeObject('_dropdownTree_'+random,'100%', '100%', '0');
			var initree = function (tree)
			{
				var dhxt = data.dhxt;
				var icon = [dhxt.img_group[0],dhxt.img_group[1]];
				tree.setSkin(dhxt.skin);
				tree.setImagePath(dhxt.imgs);
				tree.enableCheckBoxes(isRadio ? 0: 1);
		//		tree.loadJSONObject({id:-1,item:[{id:0,text:'任务',im0:icon[0],im1:icon[1]}]});
				tree.enableThreeStateCheckboxes(true);
				tree.addNode = function(d){
					var node = tree.insertNewItem((d.pid != null && d.pid.length  ? d.pid : 0) , d.id, d.name, null);
				//	tree.setUserData(node.id, 'data', d);
					data.treeData[node.id] = d;
					data.dataForKeyName[d.name] = d
					return node;
				}
				return tree;
			}
			tree = initree(data.treeObj);
			$.each(aData,function(i,data){for(var a in data)data[a.toLowerCase()] = data[a];});
			
			$.each(aData,function(i,d){tree.addNode(d);});
			tree.closeAllItems();
			if( isRadio ){
				data.treeObj.setOnSelectStateChange(function(itemId){
					if(data.treeObj.getOpenState(itemId) == 0){
						data.selData = data.treeData[itemId];
						_setData(data.selData.name);
						data.dropDiv.hide();
					}
				});
			}else{
				//注意：不能使用上面的变量tree，会导致获取到的是最后一个对象。要使用data.treeObj
				data.treeObj.setOnCheckHandler(function(itemId){
					var items = data.treeObj.getAllChecked();
					var allChildless = data.treeObj.getAllChildless();
					var itemsArr = items.length ? items.split(',') : [];
					var allChildlessArr = allChildless.length ? allChildless.split(',') : [];
					//获取最底层的勾选
					var checkedChildlessArr = $.map(itemsArr, function(d_){
						var index = $.inArray(d_, allChildlessArr);
						if( index != -1 )
							return d_
						return null;
					});
					var value = [];
					$.each(checkedChildlessArr, function(i, d_){
						value.push(data.treeData[d_].name);
					});
					_setData(value.join(params.separator));
				});
			}
			
			return tree;
		}
		var _biludDrop = function(){
			var $iDiv = $("<div id='_dropDwomDiv_"+random+"'></div>");
			$iDiv.css('display', 'none').css('height', '240px').css('width', '180px').css('position', 'absolute')
				.css('background-color', '#f7f7f7').css('overflow', 'auto').css('border', '1px solid silver');
		//	$iDiv.css('cursor', 'move');
			$iDiv.html('<div id="_dropdownTree_'+random+'" style="width: 180px; height: 240px;"/>');
			return $iDiv;
		}
		var _offset = function(obj){
			//取标签的绝对位置 
			var offset = obj.position();
			var t = offset.top, l = offset.left, h = obj.height(), w = obj.width();
			return { top : t, left : l, height: h, width: w };
		}
		var _setStype = function(obj){
			obj.css('width', '160px').css('height', '18px').css('z-index', '2').css('background-color', 'white').css('border', '1px solid #7C9BCF').css('cursor', 'pointer');
			if( obj.get(0).tagName == 'INPUT'){
				obj.attr('readonly', 'readonly');
			}
			obj.attr('random', random);
			var a = $('<a name="_clearupParams_'+random+'" href="javascript:void(0)" style="margin-left:-6px;" title="清空输入框"><img src="resource/icon/del_input.gif"/></a>')
			obj.after(a);
		}
		main(obj, data_);
		return _biludDrop();
	}
})(jQuery);
//==============================================
//end.dropdown Tree
//==============================================

//==============================================
//start.dropdown table--(radio/checkbox)
//==============================================
(function($){
	var utils = window.utils || (window.utils = {});
	/**
	 * 注：当obj是input的时候获取值就是obj.val()，当obj是div的时候值是保存在obj.html()。
	 * @param obj 该参数支持input/div标签
	 * @param data_ 用于候选的值列表 data like=[1,2,3,4,5,6,7,8]
	 * @param type 默认是radio（要是多选就!=radio）
	 * @param store 将下列div存放到store里面（为了避免嵌套的css样式影响下拉列表样式）
	 * @param selectedItems 要选中的集合列表
	 * @param setItemsFlag 获取用户设置在value的值
	 * @param separator 包括值的分割、保存、显示的分隔符
	 */
	utils.dropdownTable = function(obj, data_, type, store, selectedItems, setItemsFlag, separator)
	{
		var random = 'c'+Math.floor(Math.random()*1000000);
		var params = {
			type	: type || 'radio' //单选/多选
			,data	: data_ || []
			,obj	: obj
			,store	: store || null
			,selectedItems	:	selectedItems == null ? [] : selectedItems
			,setItemsFlag	:	setItemsFlag == true ? true : false
			,separator		:	separator || ';'		
		}
		var data = {
			 csTab	: null //current selected tab
			,cscTabC : null //current selected tab content 未使用
			,dropDiv : null
			,selectedItem	: []
			,removeHistory	: []//未使用
		};
		
		var main = function(obj, data_){
			_setStype(obj);//设置页面显示的div样式
			var dropDiv = data.dropDiv = _biludDrop();
			if( params.store != null  ){
				params.store.append(dropDiv);
			}else{
				obj.after(dropDiv);
			}
			var i = 0;
			obj.click(function(){
				//设置位置
				var offset = _offset(obj);
				dropDiv.css('left', offset.left);
				dropDiv.css('top', offset.top+20);
				dropDiv.show();
				if( i == 0 ){
					data.selectedItem = params.setItemsFlag ? _getData() : params.selectedItems;
					_setData();
					var cListObj = data.csTab.find('[name=_dropdownContent_]');
					cListObj.find('td').removeClass('selectedItem');
					_setSelectedItem(cListObj);
					i++;
				}
			});
//			$(document).click(function(e){
//				var target = e.target||e.srcElement;
//				if($(target).attr('name') == $(obj).attr('name')){
//					return false;
//				}
//				var drop = $(target).closest('div[id*=_dropDwomTableDiv_]');
//				var div = drop.css('display');
//				if( div == 'block' ){
//					return false;
//				}
//				dropDiv[div != undefined ? 'show' : 'hide']();
//			});
			
			_biludTable(dropDiv.find('[name=_dropdownContent_]'), data_);
			_events();
			_initVariable();
		}
		
		var _setData = function(selectedItem){
			var fun = obj.get(0).tagName == 'INPUT' ? 'val' : 'html';
			obj[fun]((selectedItem || data.selectedItem.join(params.separator)))
			obj.attr('data-value', (selectedItem || data.selectedItem.join(params.separator)))
		}
		var _getData = function(){
			var fun = params.obj.get(0).tagName == 'INPUT' ? 'val' : 'html';
			var value = params.obj[fun]();
			return value ? obj[fun]().split(params.separator) : [];
		}

		var _initVariable = function(){
			data.csTab = data.dropDiv.find('[name=_allItems_]');
		}
		
		var _events = function(){
			
			$(document).click(function(e){
				var target = e.target||e.srcElement;
				//点击已经输入框事件无效，交给obj.click();
				if( $(target).attr('random') == $(obj).attr('random') )
					return false;
			//	var drop = $(target).closest('#_dropDwomTableDiv_'+utils.currentSeleted);
				var drop = $(target).closest('div[id*=_dropDwomTableDiv_]');
				//鼠标点击的位置在下拉列表的div里面
				if( drop.length == 1 )
					return false;
				data.dropDiv.hide();
			});
			
			$('#_dropDwomTableDiv_'+random+' [name="_dropdownContent_"] a').live('click', function(){
				var $s = $(this);
				var value = $s.attr('data-value');
				var index = $.inArray(value, data.selectedItem);
				if( params.type == 'radio' ){
					$s.closest('div').find('td').removeClass('selectedItem');
					data.selectedItem = data.selectedItem.length ? [] : data.selectedItem;
				}
				$s.closest('td')[index == -1 ? 'addClass' : 'removeClass']('selectedItem');
				if( index == -1 ){
					data.selectedItem.push(value);
				}else{
					data.selectedItem.splice(index, 1);						
				}
				_setData()
			});

			$('#_dropDwomTableDiv_'+random+' [name="_dropdownSearchList_"] a').live('click', function(){
				var $s = $(this);
				var value = $s.attr('data-value');
				var index = $.inArray(value, data.selectedItem);
				if( params.type == 'radio' ){
					$s.closest('div').find('td').removeClass('selectedItem');
					data.selectedItem = data.selectedItem.length ? [] : data.selectedItem;
				}
				$s.closest('td')[index == -1 ? 'addClass' : 'removeClass']('selectedItem');
				if( index == -1 ){
					data.selectedItem.push(value);
				}else{
					data.selectedItem.splice(index, 1);						
				}
				_setData()
			});

			//不知道为什么live不能使用对象过滤（$('[name=xx]', xxObj).live('click', function(){})）
			$('#_dropDwomTableDiv_'+random+' [name="_dropdownContentSelected_"] a').live('click', function(){
				var $s = $(this);
				var value = $s.attr('data-value');
				var index = $.inArray(value, data.selectedItem);
				if( index != -1 ){
					data.selectedItem.splice(index, 1);
				}
				var cListObj = data.csTab.find('[name=_dropdownContentSelected_]');
				_biludTable(cListObj, data.selectedItem);
				cListObj.find('td').addClass('selectedItem');
				_setData();
			});

			$('a[name="checkAll"]', data.dropDiv).click(function(){
				var $s = $(this);
				if( data.csTab.attr('name') == '_selectedItems_' ){
					return false;
				}else{
					var sListObj = data.csTab.find('[name=_dropdownSearchList_]');
					var cListObj = data.csTab.find('[name=_dropdownContent_]');
					if( cListObj.css('display') == 'block' ){
						data.selectedItem = $.map(params.data, function(d_){
							return d_+"";
						});
						cListObj.find('td').addClass('selectedItem');
					}else{
						//优化速度
						var checkedItems = $('a', sListObj);
						$.each(checkedItems, function(i, d_){
							var value = $(d_).attr('data-value');
							var index = $.inArray(value, data.selectedItem);
							if( index == -1 ){
								data.selectedItem.push(value);
							}
						});
						sListObj.find('td').addClass('selectedItem');
					}
				}
				_setData();
			});

			$('a[name="uncheckAll"]', data.dropDiv).click(function(){
				var $s = $(this);
				data.csTab.find('td').removeClass('selectedItem');

				if( data.csTab.attr('name') == '_selectedItems_' ){
					_biludTable(data.csTab.find('[name=_dropdownContentSelected_]'), []);
					data.selectedItem = [];
				}else{
					var sListObj = data.csTab.find('[name=_dropdownSearchList_]');
					var cListObj = data.csTab.find('[name=_dropdownContent_]');
					if( cListObj.css('display') == 'block' ){
						data.selectedItem = [];
					}else{
						//优化速度
						var checkedItems = $('a', sListObj);
						$.each(checkedItems, function(i, d_){
							var index = $.inArray($(d_).attr('data-value'), data.selectedItem);
							if( index != -1 ){
								data.selectedItem.splice(index, 1);
							}
						});
					}
				}
				_setData()
			});
			
			$('a[name="cancel"]',  data.dropDiv).click(function(){
				data.dropDiv.hide();
			});
			
			$('input[name=_searchTxt_]', data.dropDiv).keyup(function(){
				var $s = $(this);
				var sListObj = data.csTab.find('[name=_dropdownSearchList_]');
				var cListObj = data.csTab.find('[name=_dropdownContent_]');

				var isNullVal = ($s.val() == '');
				sListObj[isNullVal ? 'hide': 'show']();
				cListObj[isNullVal ? 'show': 'hide']();
				var list = []
				if( !isNullVal ){
					list = $.map( cListObj.find('a[data-value*='+$s.val()+']'), function(d_){
						return $(d_).attr('data-value');
					})
				}
				_biludTable(sListObj, list)
				
				if( isNullVal ){
					cListObj.find('td').removeClass('selectedItem');
				}
				_setSelectedItem(isNullVal ? cListObj : sListObj);
			});
			
			$('[name=_clearupSearch_]', data.dropDiv).click(function(){
				var $s = $(this);
				var $searchTxt = $('input[name=_searchTxt_]', data.dropDiv);
				$searchTxt.val('');
				$searchTxt.focus();
				$searchTxt.keyup();
			});
			
			$('[name=_clearupParams_'+random+']').click(function(){
				$('a[name="uncheckAll"]',  data.dropDiv).click();
			});
		}
		
		var _setSelectedItem = function(itemsBox){
			$.each(data.selectedItem, function(i, d_){
				var item = itemsBox.find('a[data-value='+d_+']');
				item.closest('td').addClass('selectedItem');
			});
		}

		var _biludTab = function(clickAllCallback, clickSeleCallback){
			var tabHtml =  '<div class="tabnav">';
				tabHtml +=	'<ul>';
				tabHtml +=		'<li><a sign="all" href="javascript:void(0)" class="here">全部</a></li>';
				tabHtml +=		'<li><a sign="selected" href="javascript:void(0)">已选中</a></li>';
				tabHtml +=		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a name="checkAll" '+(params.type == 'radio' ? 'style="display:none;"' : '' )+' href="javascript:void(0)" title="全选当前面板所有值">√</a>';
				tabHtml +=		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a name="uncheckAll" href="javascript:void(0)" title="取消当前面板所有值">×</a>';
				tabHtml +=		'<div style="float: right; padding-right: 10px;"><a name="cancel" href="javascript:void(0)" title="关闭"><img src="resource/icon/cancel.png"/></a><div>';
				tabHtml +=	'</ul>';
				tabHtml += '</div>';
			var $tabObj = $(tabHtml);
			$('li a', $tabObj).click(function(){
				var $s = $(this);
				$tabObj.find('li a').removeClass('here');
				$s.addClass('here');
				if( $s.attr('sign') == 'all' ){
					clickAllCallback.call($s);
				}else{
					clickSeleCallback.call($s);
				}
			});
			return $tabObj;
		}

		var _biludTable = function(supportingObj_, data_){
			var table = '<table>';
			table += '<tr>';
			$.each(data_, function(i, d_){
				table += ( i % 5 == 0 && i != 0 ) ? '</tr><tr>' : ''; 
				var td =  '<td width="69px;" height="22px;">';
					td += '<a href="javascript:void(0)" data-value="$name" selected="false" style="font-size: 12px; text-decoration: none;">$name</a>';
					td += '</td>';
				table += td;
				table = table.replace(/\$name/g, d_);
			});
			table += '</tr>';
			table += '</table>';
			supportingObj_.empty();
			supportingObj_.append($(table));
		}
		
		var _biludDrop = function(){
			var $iDiv = $("<div id='_dropDwomTableDiv_"+random+"' class='dropdownTable'></div>");
			$iDiv.css('display', 'none').css('height', '240px').css('width', '370px').css('position', 'absolute')
				.css('background-color', '#f7f7f7').css('border', '1px solid silver').css('z-index', 10);
		//	$iDiv.css('overflow', 'auto');
			var _inner = '';	
				_inner += '<div name="_allItems_" style="height: 98%;">';
				_inner +=		'<div name="_dropdownSearch_" >';
				_inner +=				'<a>&nbsp;搜索：</a><input type="text" name="_searchTxt_" style="color: gray;" title="如果需要显示全部，请清空输入框" value="请输入查找字符" onFocus="if(value==\'请输入查找字符\') {value=\'\'}" onBlur="if(value==\'\') {value=\'请输入查找字符\'}"/>';
				_inner +=				'<a name="_clearupSearch_" href="javascript:void(0)" title="清空搜索框" style="margin-left:-22px;"><img src="resource/icon/deltask.gif"/></a></div>';
				_inner +=		'<div name="_dropdownContent_" style="overflow:auto; height: 80%;">_dropdownContent_</div>';
				_inner +=		'<div name="_dropdownSearchList_" style="overflow:auto; height: 80%; display:none;">_dropdownContent_</div>';
				_inner += '</div>';
				_inner += '<div name="_selectedItems_" style="height: 98%;">';
				_inner +=		'<div name="_dropdownContentSelected_" style="overflow:auto; height: 89%;"></div>';
				_inner += '</div>';
			var innerObj = $(_inner);
			$iDiv.append(_biludTab(function(){

				var allItemsObj = $iDiv.find('[name=_allItems_]');
				$iDiv.find('[name=_selectedItems_]').hide();
				allItemsObj.show();
				allItemsObj.find('td').removeClass('selectedItem');
				_setSelectedItem(allItemsObj);
				data.removeHistory = [];
				data.csTab = allItemsObj;
			},function(){

				var selectedItemsObj = $iDiv.find('[name=_selectedItems_]');
				selectedItemsObj.show();
				$iDiv.find('[name=_allItems_]').hide();
				//显示选中的值
				_biludTable(selectedItemsObj.find('[name=_dropdownContentSelected_]'), data.selectedItem);
				selectedItemsObj.find('td').addClass('selectedItem');
				data.csTab = selectedItemsObj;
			}));
			$iDiv.append(innerObj);
			return $iDiv;
		}
		var _offset = function(obj){
			//取标签的绝对位置 
			var offset = obj.position();
			var t = offset.top, l = offset.left, h = obj.height(), w = obj.width();
			return { top : t, left : l, height: h, width: w };
		}
		var _setStype = function(obj){
			obj.css('width' , '160px').css('height' , '18px').css('z-index' , '2').css('background-color' , 'white')
				.css('border' , '1px solid #7C9BCF').css('overflow' , 'hidden').css('text-overflow' , 'ellipsis').css('cursor', 'pointer');
			if( obj.get(0).tagName == 'INPUT'){
				obj.attr('readonly', 'readonly');
			}
			obj.attr('random', random);
			var a = $('<a name="_clearupParams_'+random+'" href="javascript:void(0)" style="margin-left:-6px;" title="清空输入框"><img src="resource/icon/del_input.gif"/></a>')
			obj.after(a);
		}
		main(obj, data_);
	}
})(jQuery);
//==============================================
//end.dropdown table--(radio/checkbox)
//==============================================