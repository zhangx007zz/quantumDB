jQuery.extend({//所有的json格式调用request、非json格式调用postData
	request:function(url, parameters, feedback){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: url,
			data: parameters,
			success: feedback,
			error:function(xhr){
				switch(xhr.status){
					case 403:layer.msg("对不起，您无此权限！", 2, 1);break;
					case 404:layer.msg("对不起，无此页面！", 2, 1);break;
					case 500:layer.msg("内部错误，请联系管理员！", 2, 1);break;  
					case 504:layer.msg("超时，请联系管理员！", 2, 1);break;  
			    }
			}
		});
	},
	postData:function(url, parameters, feedback){
		$.ajax({
			type: 'POST',
			url: url,
			data: parameters,
			success: feedback,
			error:function(xhr){
				switch(xhr.status){
					case 403:layer.msg("对不起，您无此权限！", 2, 1);break;
					case 404:layer.msg("对不起，无此页面！", 2, 1);break;
					case 500:layer.msg("内部错误，请联系管理员！", 2, 1);break;  
					case 504:layer.msg("超时，请联系管理员！", 2, 1);break;  
				}
			}
		});
	}
});
Date.prototype.format = function(format) {
	var o = {
		"m+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"M+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
						- RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1
							? o[k]
							: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

var Utils = {
	/**
	 * 获取默认的的时间查询间隔
	 * startInterval今天的前startInterval天
	 * endInterval今天的前endInterval天
	 * @return
	 */
	 getDateInterval:function(startInterval,endInterval){
		if(!$.isNumeric(startInterval))startInterval=1;
		if(!$.isNumeric(endInterval))endInterval=7;
		var today = new Date();
		var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-endInterval);
		var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-startInterval);
		return {'startDate':startDate.format('yyyy-mm-dd'), 'endDate':endDate.format('yyyy-mm-dd')};
	}
	/***
	 * 今天的前interval天
	 */
   ,getDate:function(interval){
	   if(!$.isNumeric(interval))interval=0;
	   var today = new Date();
	   return new Date(today.getFullYear(), today.getMonth(), today.getDate()-interval).format('yyyy-mm-dd');
   }
   /**
    * 数字格式化
    */
   ,numberFormat:function(num,fractionDigits){
	   if(!$.isNumeric(num))return (new Number(0)).toFixed(fractionDigits);
	   return num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(fractionDigits) + "";
   }
   /**
    * 数字格式化
    */
   ,amountFormat:function(num,fractionDigits){
	   if($.isNumeric(num)){
			if(fractionDigits>0){
				   fractionDigits = fractionDigits > 0 && fractionDigits <= 20 ? fractionDigits : 2;  
				   num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(fractionDigits) + "";  
				   var l = num.split(".")[0].split("").reverse(),  
				   r = num.split(".")[1];  
				   t = "";  
				   for(i = 0; i < l.length; i ++ )  
				   {  
				      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
				   }  
				   return t.split("").reverse().join("") + "." + r;  
				
			}else if(fractionDigits==0){
				   fractionDigits = 2;  
				   num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(fractionDigits) + "";  
				   var l = num.split(".")[0].split("").reverse(),  
				   r = num.split(".")[1];  
				   t = "";  
				   for(i = 0; i < l.length; i ++ )  
				   {  
				      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
				   }  
				   return t.split("").reverse().join("");
			}
	   }else{
		   return (new Number(0)).toFixed(fractionDigits);
	   }
   },dateIntervalFormat:function(startTime,endTime){
	   //求时间差：
	   var dateStart=new Date(Date.parse(startTime.replace(/-/g,"/")));//开始时间  
	   var dateEnd=new Date(Date.parse(endTime.replace(/-/g,"/")));//结束时间  
	   var dateInterval=dateEnd.getTime()-dateStart.getTime();  //时间差的毫秒数
	   //计算出相差天数
	   var days=Math.floor(dateInterval/(24*3600*1000));
	   //计算出小时数
	   var leaveDays=dateInterval%(24*3600*1000);    //计算天数后剩余的毫秒数
	   var hours=Math.floor(leaveDays/(3600*1000));
	   //计算相差分钟数
	   var leaveHours=leaveDays%(3600*1000);      //计算小时数后剩余的毫秒数
	   var minutes=Math.floor(leaveHours/(60*1000));
	   //计算相差秒数
	   var leaveSeconds=leaveHours%(60*1000);      //计算分钟数后剩余的毫秒数
	   var seconds=Math.round(leaveSeconds/1000);
	   return days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒";
   }
}

var histroyUrls = new Array();

/**
 * 返回上一页
 */
function doGoback(){
	//var $pageContent = $('#page-content');
	//var prevUrl = $pageContent.data('prevUrl');
	histroyUrls.pop();
	var prevUrl= histroyUrls.pop();
	histroyUrls.push(prevUrl);
	var find = false;
	$('#sidebar').find('a').each(function(){
		var url = $(this).attr('data-url');
		if(!url){
			return;
		}
		var contextPath = getContextPath();
		if((contextPath+url)==prevUrl){
			//$(this).click();
			$(this).closest('ul').find('li.active').removeClass('active');
			$(this).closest('li').addClass('active');
			return;
		}
	});
	//if(!find)
	{
		_loadPage(prevUrl);
	}
}
/**
 * 刷新当前页
 */
function doGoRefresh(){
	//var $pageContent = $('#page-content');
	//var currentUrl = $pageContent.data('currentUrl');
	var currentUrl = histroyUrls.pop();
	histroyUrls.push(currentUrl);
	_loadPage(currentUrl);
}

function loadContentPage(url,data, callback) {
/*	var $pageContent = $('#page-content');
	var prevUrl = $pageContent.data('prevUrl');
	var currentUrl = $pageContent.data('currentUrl');
	if(url!=currentUrl){
		if(currentUrl){
			 $pageContent.data('prevUrl',currentUrl);
		}
		$pageContent.data('currentUrl',url);
	}*/
	histroyUrls.push(url);
	
	_loadPage(url,data, callback);
}

function _loadPage(url,data,callback){
	if(histroyUrls.length>1){
		$('#page-content-back').show();
	}else{
		$('#page-content-back').hide();
	}
	$('#breadcrumb').empty();
	$('#page-content').load(url,data,function(response, status, xhr){
		if(status=='success'){
			if(jQuery.isFunction(callback)){
				callback.call(this);
			}
		}else {
			switch(xhr.status){
				case 403:layer.msg("对不起，您无此访问权限！", 2, 1);break;
				case 404:layer.msg("对不起，无此页面！", 2, 1);break;
				case 500:layer.msg("内部错误，请联系管理员！", 2, 1);break; 
				case 504:layer.msg("超时，请联系管理员！", 2, 1);break;  
			}
		}
	});
}
/**
 * ['home','tree']
 * @param nvsArr
 */
function renderNavTooltip(navArr){
	var $nav = $('#breadcrumb').empty();
	if($.isArray(navArr)){
		for(var index in navArr){
			var clazz = '';
			if(index==0){
				clazz = 'icon-home home-icon';
			}else if(index==navArr.length-1){
				clazz = 'active';
			}
			var html = '<li class="'+clazz+'">'
				+ ('<i></i>')
				+ ('<a href="#">' + navArr[index] + '</a>')
				+ '</li>';
			$nav.append(html);
			
		}
	}
}
function getContextPath() { 
    var pathName = document.location.pathname; 
    var index = pathName.substr(1).indexOf("/"); 
    var result = pathName.substr(0,index+1); 
    return result; 
}
//注册AJAX远程访问控制
$(function(){
	function isLoginPage(html){
		return (html && html.indexOf("html") >= 0 && html.indexOf("j_spring_security_check") >= 0 
				&& html.indexOf("j_username") >= 0 && html.indexOf("j_password") >= 0);
	}
	$(document).ajaxComplete(function(event,request, settings){
		if(isLoginPage(request.responseText)){
			window.location = getContextPath();
		}
	});
});


//手机号码验证       
jQuery.validator.addMethod("isMobile", function(value, element) {       
    var length = value.length;  
   var mobile = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/;   
  return this.optional(element) || (length == 11 && mobile.test(value));       
}, "请正确填写手机号码");    
    
 // 电话号码验证       
jQuery.validator.addMethod("isTel", function(value, element) {       
     var tel = /^\d{3,4}-?\d{7,9}$/;    //电话号码格式010-12345678   
    return this.optional(element) || (tel.test(value));       
}, "请正确填写电话号码");   
 
// 联系电话(手机/电话皆可)验证   
jQuery.validator.addMethod("isPhone", function(value,element) {   
    var length = value.length;   
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;   
     var tel = /^\d{3,4}-?\d{7,9}$/;   
    return this.optional(element) || (tel.test(value) || mobile.test(value));   
 
}, "请正确填写联系电话");   
      
 // 邮政编码验证       
 jQuery.validator.addMethod("isZipCode", function(value, element) {       

     var tel = /^[0-9]{6}$/;       
    return this.optional(element) || (tel.test(value));       
 }, "请正确填写邮政编码");
 
 
 
function getCommJosnParams(divId){
	var p = {};
	var $focusDiv;
	if(divId!=undefined && divId!=null){
		$focusDiv = $("#"+divId);
	}else{
		$focusDiv = $("#search");
	}
	
	if($focusDiv!=undefined){
		var $inp = $(':input',$focusDiv);
		 $.each($inp, function (i,n) {
			 if($(n).attr("type")!="button"){
				 var spname =$(n).attr("name")==undefined?"sp["+$(n).attr("id")+"]":"sp["+$(n).attr("name")+"]";
				 var sp = eval("({'"+spname+"':'"+$(n).val()+"'})");
				 p = $.extend(p,sp);
			 }
			 
		 });
		 var $sel = $('select',$focusDiv);
		 $.each($sel, function (i,n) {
				 var spname =$(n).attr("name")==undefined?"sp["+$(n).attr("id")+"]":"sp["+$(n).attr("name")+"]";
				 var sp = eval("({'"+spname+"':'"+$('option:selected',$(n)).attr("value")+"'})");
				 p = $.extend(p,sp);
		 });
	}else{
		var $inp = $(':input');
		 $.each($inp, function (i,n) {
			 if($(n).attr("type")!="button"){
				 var spname =$(n).attr("name")==undefined?"sp["+$(n).attr("id")+"]":"sp["+$(n).attr("name")+"]";
				 var sp = eval("({'"+spname+"':'"+$(n).val()+"'})");
				 p = $.extend(p,sp);
			 }
		 });
		 var $sel = $('select');
		 $.each($sel, function (i,n) {
			 var spname =$(n).attr("name")==undefined?"sp["+$(n).attr("id")+"]":"sp["+$(n).attr("name")+"]";
			 var sp = eval("({'"+spname+"':'"+$('option:selected',$(n)).attr("value")+"'})");
			 p = $.extend(p,sp);
		 });
	}
	 return p;
} ;

function getCommGetParams(pJosn,divId){
	var pStr="";
	var p = pJosn==undefined||pJosn==null?getCommJosnParams(divId):pJosn;
	for(var key in p){
		  pStr = pStr+"&"+key.substring(key.indexOf("[")+1,key.indexOf("]"))+"="+p[key];
	}
	return pStr.substring(1);
} ;



/**
 * 判断非负数
 */
function checkIsNoNegaNum(id, promptInfo){
	var reg = /^(\d+)(\.\d+)?/;
	if(reg.exec($("#"+id).val()) == null){
	    alert(promptInfo);
	    $("#"+id).focus();
	    return true;
	}
	return false;
}
/**
 * 判断正整数
 */
function checkIsInt(id, promptInfo){
	var reg = /0|(^[1-9]\d*$)/;
	var value = $.trim($("#"+id).val());
	if(reg.exec(value) == null){
	    alert(promptInfo);
	    $("#"+id).focus();
	    return true;
	}
	return false;
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
}

