(function(){
	var date = new Date();
	var v = date.getFullYear() + fill(date.getMonth() + 1) + fill(date.getDate());
	/**
	 * 公共js、css引用区
	 */
//	document.write("<script type='text/javascript' src='/web/js/common/axios/es6-promise.js'></script>");
	document.write("<script type='text/javascript' src='/web/js/common/vue/vue.js?v="+v+"'></script>");
	document.write("<script type='text/javascript' src='/web/js/common/axios/axios.min.js?v="+v+"'></script>");
	document.write("<script type='text/javascript' src='/web/js/common/layui/jquery-1.11.1.min.js?v="+v+"'></script>");
	document.write("<script type='text/javascript' src='/web/js/common/vue/expand/utils.js?v=1'></script>");
	document.write("<script type='text/javascript' src='/web/js/common/elementUI/2.12.0/element-ui.min.js?v="+v+"'></script>");
	document.write("<link rel='stylesheet' href='/web/css/common/elementUI/2.12.0/element-ui-chalk.min.css?v="+v+"'>");
	document.write("<link rel='stylesheet' href='/web/css/common/elementUI/global.css?v="+v+"'>");
	document.write("<link rel='stylesheet' href='/web/css/common/elementUI/my-fonts/iconfont.css?v="+v+"'>");

	/** 获取empid */
	window.empid = sessionStorage.getItem("empid");

	function fill(num) {
		return ([ '00', '01', '02', '03', '04', '05', '06', '07', '08',
				'09', '10', '11', '12' ][num] || num);
	}
})();
