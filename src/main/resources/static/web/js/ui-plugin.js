/**
 * ui组件的一些扩展
 */
/**
 * 扩展tabs,可以加载关闭按钮、url
 * $('#id').tabs().tabs('cache')
 */
$.extend( $.ui.tabs.prototype, {
	//options:{},
	closeTabTemplate:"<li><a href='{href}'>#{label} <span style='cursor:pointer' class='ui-icon-close icon-remove red  bigger-110' role='presentation' title='关闭'></span></a></li>",
	/**
	 * 新增一个可关闭的tab页
	 * @param options
	 * {
	 * 	url:.....
	 * 	title:...
	 *  removeCallback:null
	 * }
	 */
	addCloseTab:function(opts){
		var $tab = this.element;//.tabs;//$(this);
		var  tabTemplate = this.closeTabTemplate;
		var url = opts.url;
		var title = opts.title;
		var size = $tab.find('a.ui-tabs-anchor').size();
    	var li =$( tabTemplate.replace( /\{href\}/g, url ).replace( /#\{label\}/g, title ) );
    	$tab.find( ".ui-tabs-nav" ).append( li );
      
    	$tab.tabs( "refresh" );
    	$tab.tabs({ active: size});
    	$tab.delegate( "span.ui-icon-close", "click", function() {
    		if(opts.removeCallback){
    			opts.removeCallback($( this ).closest( "li" ));
    		}
          var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
          $( "#" + panelId ).remove();
          $tab.tabs( "refresh" );
        });
	},
	cache:function(){
		var $tab = this.element;
		var tabArr = {};
		$tab.tabs().on( "tabsbeforeload", function( event, ui ) {  
			 var key = ui.tab[0].innerHTML;   
	          if(tabArr[key+"_loaded"] != undefined){  
	            ui.jqXHR.abort();  
	          }  
		});
		$tab.tabs().on("tabsload", function (event, ui) {  
		    var key = ui.tab[0].innerHTML;  
		    tabArr[key+"_loaded"] = 1;  
		}); 
	}
});
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
	_title: function(title) {
		var $title = this.options.title || '&nbsp;'
		if( ("title_html" in this.options) && this.options.title_html == true )
			title.html($title);
		else title.text($title);
	}
}));


/**
 * 关闭Dialog
 */
$.CloseDialog = function($dialog){
	$dialog.dialog( "destroy" ); 
}
/**
 * 表单对话框，扩展jquery-ui-dialog 
 */
$.FormDialog = function(opts){
	var doOk = function($container){
		if($.isFunction(opts.doOk)){
			opts.doOk.call(this,$container);
		}else{
			$container.dialog( "destroy" ); 
		}
	};
	var doCancel = function($container){
		if($.isFunction(opts.doCancel)){
			opts.doCancel.call(this,$container);
		}else{
			$container.dialog( "destroy" ); 
		}
	}
	opts.title = "<div class='widget-header widget-header-small'><h5 class='smaller'>"
				+ (opts.title?opts.title:'')
				+ "</h5></dv>";
	var tempOpen = opts.open;
	var doOpen=function(event, ui ){
		var $dialog = $('div.ui-dialog');
		var windowHeight = $(window).height();
		var dialogHeight = $dialog.height();
		$('div.ui-dialog').css('top',(windowHeight-dialogHeight)/2+'px');
		if(jQuery.isFunction(tempOpen)){
			tempOpen(event,ui);
		}
	}
	opts.open=undefined;
	opts = $.extend({
		modal: true,
        title: '',
		title_html: true,
		buttons: [
			{
				text: "保存",
				"class" : "btn btn-primary btn-xs",
				click: function() {
					doOk($( this ));//.dialog( "destroy" ); 
				} 
			},
			{
				text: "取消",
				"class" : "btn btn-xs",
				click: function() {
					doCancel($( this ));//.dialog( "destroy" ); 
				} 
			}
			
		],
		open:function(event, ui ){
			doOpen(event,ui);
		},
		close: function( event, ui ) {$( this ).dialog( "destroy" ); }
	},opts)
	//
	if(opts.url){
		$('<div></div>').load(opts.url,function(response, status, xhr){
			switch(xhr.status){
				case 403:layer.msg("对不起，您无此访问权限！", 2, 1);break;
				case 404:layer.msg("对不起，无此页面！", 2, 1);break;
				case 500:layer.msg("内部错误，请联系管理员！", 2, 1);break;  
			}
		}).dialog(opts).dialog('open');
	}else if(opts.content){
		$(opts.content).dialog(opts);
	}
};
/**
 * 消息对话框
 */
MessageDialog = {
	'ERROR' : 1,
	'CONFIRM' : 2,
	'INFO' : 3
};
$.MessageDialog = function(type,opts){
	if(!opts.title){
		switch(type){
		case MessageDialog.ERROR:
			opts.title = '出错啦！';
			break;
		case MessageDialog.CONFIRM:
			opts.title = '确认信息';
			break;
		case MessageDialog.INFO:
			opts.title = '提示信息';
			break;
		default:
			opts.title = '消息对话框';
		}
	}
	opts.title = "<div class='widget-header widget-header-small'><h4 class='smaller'>"
		+ (opts.title?opts.title:'')
		+ "</h4></div>";
	var buttons = [];

	buttons.push({
		text: "确定",
		"class" : "btn btn-primary btn-xs",
		click: function() {
			if($.isFunction(opts.doOk)){
				doOk = opts.doOk($(this));
			}else{
				$(this).dialog( "destroy" ); 
			}
		} 
	});
	if(MessageDialog.CONFIRM == type){
		buttons.push({
			text: "取消",
			"class" : "btn btn-xs",
			click: function() {
				$(this).dialog( "destroy" ); 
			} 
		});
	}
	opts = $.extend({
		modal: true,
        title: "",
		title_html: true,
		dialogClass: 'no-close',
		buttons: buttons,
		open:function(event,ui){
			 $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
			 var $dialog = $('div.ui-dialog');
				var windowHeight = $(window).height();
				var dialogHeight = $dialog.height();
				$('div.ui-dialog').css('top',(windowHeight-dialogHeight)/2+'px');
		}
	},opts)

	var content = '<div>'
				+ '<i></i>'
				+	opts.message
				+ '</div>';
	$('<div></div>').append(content).dialog(opts).dialog('open');
};

$.validator.setDefaults({
   /* highlight: function(element) {
       $(element).closest('.form-group').addClass('has-error');
       layer.tips(element.text(), element , {guide: 0, time: 2});
    },*/
    /*unhighlight: function(element) {
       $(element).closest('.form-group').removeClass('has-error');
    },*/
    errorElement: 'div',
    //errorClass: 'help-block col-sm-2 col-sm-reset inline',
    errorPlacement: function(error, element) {
        /*if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }*/
    	layer.tips(error.text(), element.parent() , {guide: 0, time: 2});
    }
}); 
jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
	remote: "请修正该字段",
	email: "请输入正确格式的电子邮件",
	url: "请输入合法的网址",
	date: "请输入合法的日期",
	dateISO: "请输入合法的日期 (ISO).",
	number: "请输入合法的数字",
	digits: "只能输入整数",
	creditcard: "请输入合法的信用卡号",
	equalTo: "请再次输入相同的值",
	accept: "请输入拥有合法后缀名的字符串",
	maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
	minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
	rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
	range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
	max: jQuery.validator.format("请输入一个最大为{0} 的值"),
	min: jQuery.validator.format("请输入一个最小为{0} 的值")
});

jQuery.extend(jQuery.validator.prototype, {
	 defaultShowErrors: function() {
		 var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
				break;
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();

     }
});