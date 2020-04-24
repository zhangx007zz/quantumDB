$(function(){
	queryRateLLZ(this);
});


var Setkey='';
var SetId='';
function beforeSelectRow(){  
    $("#dateList").jqGrid('resetSelection');  
    return(true);  
} 


function hideSelectAll() {  
    $("#cb_dateList").hide();  
   // $("#pg_dateTab").hide(); 
    return(true);  
}


function updateKeyValue(id,pmvd,pmkc,pmpc){
	$("#pmkc_tr").hide();
	$("#pmpc_tr").hide();
	
	SetId=id;
	$('#mask').show();
	if(Setkey=='GGSPRate'){
		$('#pmvdLabel').html('杠杆水平');
	}else if(Setkey=='GGCBRate'){
		$('#pmvdLabel').html('杠杆成本');
	}else if(Setkey=='XYZLevel'){
		$('#pmvdLabel').html('等级');
	}else if(Setkey=='XYZYear'){
		$('#pmvdLabel').html('期限');
	}else if(Setkey=='XYZRate'){
		$('#pmvdLabel').html('到期收益率');
		
		$('#pmpc').val(pmpc);
		$('#pmkc').val(pmkc);
		
		$("#pmpc").attr("disabled","true");
		$("#pmkc").attr("disabled","true");
		
		$("#pmkc_tr").show();
		$("#pmpc_tr").show();
	}else if(Setkey=='LLZRate'){
		$('#pmvdLabel').html('到期收益率');
		$('#pmkc').val(pmkc);
		$("#pmkc").attr("disabled",null);
		$("#pmkc_tr").show();
	}
	$('#pmvd').val(pmvd);
	$('#updateFloatDiv').show();
}

function updateRateXYZTab(id,pmvd,key){
	Setkey=key;
	updateKeyValue(id,pmvd);
}



function creatKeyValue(tempKey){
	
	$("#pmkc_tr").hide();
	$("#pmpc_tr").hide();
	
	$('#pmvd').val('');
	$('#pmpc').val('');
	$('#pmkc').val('');
	if(!isBlank(tempKey)){
		Setkey=tempKey;
	}
	SetId='';
	$('#mask').show();
	if(Setkey=='GGSPRate'){
		$('#pmvdLabel').html('杠杆水平');
	}else if(Setkey=='GGCBRate'){
		$('#pmvdLabel').html('杠杆成本');
	}else if(Setkey=='XYZLevel'){
		$('#pmvdLabel').html('等级');
	}else if(Setkey=='XYZYear'){
		$('#pmvdLabel').html('期限');
	}else if(Setkey=='XYZRate'){
		$('#pmvdLabel').html('到期收益率');
		$("#pmpc").attr("disabled","false");
		$("#pmkc").attr("disabled","false");
		$("#pmkc_tr").show();
		$("#pmpc_tr").show();
	}else if(Setkey=='LLZRate'){
		$('#pmvdLabel').html('到期收益率');
		$("#pmkc").attr("disabled",null);
		$("#pmkc_tr").show();
	}
	$('#updateFloatDiv').show();
}

function saveUpdate(id){
	var pmvd =$('#pmvd').val()+'';
	var pmkc =$('#pmkc').val()+'';
	var pmpc =$('#pmpc').val()+'';
	
	var patrn = /^\d{0,3}(\.\d{0,6})?$/;
	var patrnInt = /^\d{0,3}$/;
	if(Setkey=='XYZRate'){
		if(isBlank(pmvd) ||isBlank(pmkc) ||isBlank(pmpc) ){
			swal("数据不能为空!", "", "error");
			return;
		}
	    if (!patrn.exec(pmvd)) {
	         swal("不为数字或长度过长！", "", "error");
	         return;
	    }
	    
	    if (!patrnInt.exec(pmkc)) {
	         swal("期限必须为整数，且长度不能超过3位", "", "error");
	         return;
	    }
		
	}else if(Setkey=='LLZRate'){
		if(isBlank(pmvd) ||isBlank(pmkc)  ){
			swal("数据不能为空!", "", "error");
			return;
		}
		if (!patrnInt.exec(pmkc)) {
	         swal("期限必须为整数，且长度不能超过3位", "", "error");
	         return;
	    }
		
		
		if (!patrn.exec(pmvd)) {
	         swal("不为数字或长度过长！", "", "error");
	         return;
	    }
	}else{
		if(isBlank(pmvd) ){
			swal("数据不能为空!", "", "error");
			return;
		}
	}
	
	if(Setkey=='XYZYear' || Setkey=='GGSPRate' ){
		if (!patrnInt.exec(pmvd)) {
			if(Setkey=='XYZYear'){
				swal("期限必须为整数，且长度不能超过3位", "", "error");
		         return;
			}else{
				swal("杠杆水平必须为整数，且长度不能超过3位", "", "error");
				 return;
			}
	         
	    }
	}else if( Setkey=='GGCBRate' ){
		if (!patrn.exec(pmvd)) {
	         swal("不为数字或长度过长！", "", "error");
	         return;
	    }
	}
	if(pmvd.length>10 ||pmkc.length >10 || pmpc.length >10){
		swal("字符长度过长！不能超过10", "", "error");
	    return;
	}
	
	
	var actionUrl = basePath + "rate/save";
	var params={
				'Setkey':Setkey,
				'id':SetId,
				'pmvd':pmvd,
				'pmkc':pmkc,
				'pmpc':pmpc
			};
	stdAjax( actionUrl,params,function(result) {
		   if(result.state=='success'){
				swal("保存成功!", "", "success");
				if(Setkey=='XYZYear' ||Setkey=='XYZLevel' ){
					queryRateXYZ();
				}else{
					$('#'+Setkey+'List').jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
				}
		    }
			},function(){
				swal("保存出错!", "", "error");
	});	
	
	$('#mask').hide();
	$('#updateFloatDiv').hide();
}

function cancelUpdate(){
	$('#mask').hide();
	$('#updateFloatDiv').hide();
}

function deleteKeyValue(id){
	
	ctools.confirm({title : "删除数据"},function(isConfirm){
		var actionUrl = basePath + "rate/delete";
		if(isConfirm){
			$.ajax({
				type: 'POST',
				url: actionUrl,
				data:{'id':id},
				async: false,
				success: function(data){
					if(data.state=='success'){
						swal("删除成功!", "", "success");
						if(Setkey=='XYZRate'||Setkey=='XYZYear' ||Setkey=='XYZLevel' ){
							queryRateXYZ();
						}else{
							$('#'+Setkey+'List').jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
						}
					   
					};
				},
				error:function(xhr){
					swal("删除出错!", "", "error");
				}
			});
		}
		
	});
}

function readGGCBRate(obj){
	var $accountMessageTab = $('#GGCBRateList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}

//获得杠杆成本
function queryRateGGCB(obj){
	Setkey="GGCBRate"
	$("#LLZRateTab").hide();
	$("#XYZRateTab").hide();
	$("#XYZYearTab").hide();
	$("#XYZLevelTab").hide();
	$("#GGSPRateTab").hide();
	$("#GGCBRateTab").show();
	
	
	
	$(obj).parent().children().removeClass("isActive");
	$(obj).addClass("isActive");
	$accountMessageTab = $('#GGCBRateList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	//注册清空事件
	$accountMessageTab.jqGrid({
        url: basePath+'rate/rateGGCB',
        caption: '信息维护 <span class="btn-warning btn-outline"  href="javascript:void(0);" onclick="creatKeyValue()"> <i class="fa fa-plus"></i></span>',
        datatype: "json",
        colNames: new Array("id","杠杆成本","操作"),
        colModel: new Array(
      		  { name: 'id', index: 'id', width: 10, align:'left', resizable:true, hidden: true, key: true, sortable: false },
              { name: 'pmvd', index: 'pmvd', width: 50, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'option', index: 'option', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false}
           ),
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumbers: true,
        rownumWidth: 50,
        loadonce:true,
        prmNames: {
        	        search: "search", // 表示是否是搜索请求的参数名称
        	        page: "pageNo",// 表示请求页码的参数名称
        	        rows: "limit"  // 表示请求行数的参数名称
        	       },
        height: 'auto',
        width: false,
        autowidth:true,
        shrinkToFit:true,
        editurl: '',
        viewrecords: true,
        cellEdit: false,
        shrinkToFit: true,
        grouping: false,
        jsonReader: {
            root: "data", //结果集
            records: "data.total", //总记录数 
            total: "data.pageCount", //总页数
            page: "data.pageNo", //当前页 
            repeatitems: false // (4) 
        },
        beforeSelectRow: beforeSelectRow,//js方法 
        pager: "#GGCBRatePage",
        viewrecords: true,
        hidegrid: false,
		subGrid: false,
		gridComplete: function() {
			hideSelectAll();
			var ids = $accountMessageTab.jqGrid('getDataIDs');//返回行数
			for(var i=0;i < ids.length;i++){
				var id = ids[i];	
				var rowData = $accountMessageTab.jqGrid('getRowData', id);	//按ID获取某行数据操作
				var roleId = rowData.id; 
            	$("#UpdateBtn a").removeAttr("disabled");
             	$("#UpdateBtn a#modify").attr("onClick", "updateKeyValue('"+roleId+"','"+rowData.pmvd+"');");
             	var se = $("#UpdateBtn").html();

             	$("#DropBtn a").removeAttr("disabled");
             	$("#DropBtn a#delete").attr("onClick", "deleteKeyValue('"+roleId+"');");
             	var op = $("#DropBtn").html();
            	$accountMessageTab.jqGrid('setRowData',ids[i],{option: se + op });
            	
			}
		}
    });//设置表格数据加载完毕后，所执行的操作
    $accountMessageTab.navGrid('#GGCBRatePage', { edit: false, add: false, del: false, search: false, refreshstate: 'current' });
    
    $(window).resize(function(){     
        $("#GGCBRateList").setGridWidth($(window).width());
    });
    
}


function readGGSPRate(obj){
	var $accountMessageTab = $('#GGSPRateList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}

//获得杠杆水平
function queryRateGGSP(obj){
	Setkey="GGSPRate"
	$("#LLZRateTab").hide();
	$("#XYZRateTab").hide();
	$("#XYZYearTab").hide();
	$("#XYZLevelTab").hide();
	$("#GGSPRateTab").show();
	$("#GGCBRateTab").hide();
	
	$(obj).parent().children().removeClass("isActive");
	$(obj).addClass("isActive");
	$accountMessageTab = $('#GGSPRateList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	//注册清空事件
	$accountMessageTab.jqGrid({
        url: basePath+'rate/rateGGSP',
        caption: '信息维护 <span class="btn-warning btn-outline"  href="javascript:void(0);" onclick="creatKeyValue()" > <i class="fa fa-plus"></i> </span>',
        datatype: "json",
        colNames: new Array("id","杠杆水平","操作"),
        colModel: new Array(
      		  { name: 'id', index: 'id', width: 10, align:'left', resizable:true, hidden: true, key: true, sortable: false },
              { name: 'pmvd', index: 'pmvd', width: 50, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'option', index: 'option', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false}
           ),
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumbers: true,
        rownumWidth: 50,
        loadonce:true,
        prmNames: {
        	        search: "search", // 表示是否是搜索请求的参数名称
        	        page: "pageNo",// 表示请求页码的参数名称
        	        rows: "limit"  // 表示请求行数的参数名称
        	       },
        height: 'auto',
        width: false,
        autowidth:true,
        shrinkToFit:true,
        editurl: '',
        viewrecords: true,
        cellEdit: false,
        shrinkToFit: true,
        grouping: false,
        jsonReader: {
            root: "data", //结果集
            records: "data.total", //总记录数 
            total: "data.pageCount", //总页数
            page: "data.pageNo", //当前页 
            repeatitems: false // (4) 
        },
        beforeSelectRow: beforeSelectRow,//js方法 
        pager: "#GGSPRatePage",
        viewrecords: true,
        hidegrid: false,
		subGrid: false,
		gridComplete: function() {
			hideSelectAll();
			var ids = $accountMessageTab.jqGrid('getDataIDs');//返回行数
			for(var i=0;i < ids.length;i++){
				var id = ids[i];	
				var rowData = $accountMessageTab.jqGrid('getRowData', id);	//按ID获取某行数据操作
				var roleId = rowData.id; 
            	$("#UpdateBtn a").removeAttr("disabled");
             	$("#UpdateBtn a#modify").attr("onClick", "updateKeyValue('"+roleId+"','"+rowData.pmvd+"');");
             	var se = $("#UpdateBtn").html();

             	$("#DropBtn a").removeAttr("disabled");
             	$("#DropBtn a#delete").attr("onClick", "deleteKeyValue('"+roleId+"');");
             	var op = $("#DropBtn").html();
            	$accountMessageTab.jqGrid('setRowData',ids[i],{option: se + op });
            	
			}
		}
    });//设置表格数据加载完毕后，所执行的操作
    $accountMessageTab.navGrid('#GGSPRatePage', { edit: false, add: false, del: false, search: false, refreshstate: 'current' });
    
    $(window).resize(function(){     
        $("#GGSPRateList").setGridWidth($(window).width());
    });
    
}


function readXYZLevel(obj){
	var $accountMessageTab = $('#XYZLevelList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}

//获得信用等级
function queryLevelZXYZ(obj){
	Setkey="XYZLevel"
	$("#LLZRateTab").hide();
	$("#XYZRateTab").hide();
	$("#XYZYearTab").hide();
	$("#XYZLevelTab").show();
	$("#GGSPRateTab").hide();
	$("#GGCBRateTab").hide();
	
	$(obj).parent().children().removeClass("isActive");
	$(obj).addClass("isActive");
	$accountMessageTab = $('#XYZLevelList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	//注册清空事件
	$accountMessageTab.jqGrid({
        url: basePath+'rate/levelXYZ',
        caption: '信息维护 <span class="btn-warning btn-outline"  href="javascript:void(0);" onclick="creatKeyValue()"> <i class="fa fa-plus"></i> </span>',
        datatype: "json",
        colNames: new Array("id","等级","操作"),
        colModel: new Array(
      		  { name: 'id', index: 'id', width: 10, align:'left', resizable:true, hidden: true, key: true, sortable: false },
              { name: 'pmvd', index: 'pmvd', width: 50, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'option', index: 'option', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false}
           ),
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumbers: true,
        rownumWidth: 50,
        loadonce:true,
        prmNames: {
        	        search: "search", // 表示是否是搜索请求的参数名称
        	        page: "pageNo",// 表示请求页码的参数名称
        	        rows: "limit"  // 表示请求行数的参数名称
        	       },
        height: 'auto',
        width: false,
        autowidth:true,
        shrinkToFit:true,
        editurl: '',
        viewrecords: true,
        cellEdit: false,
        shrinkToFit: true,
        grouping: false,
        jsonReader: {
            root: "data", //结果集
            records: "data.total", //总记录数 
            total: "data.pageCount", //总页数
            page: "data.pageNo", //当前页 
            repeatitems: false // (4) 
        },
        beforeSelectRow: beforeSelectRow,//js方法 
        pager: "#XYZLevelPage",
        viewrecords: true,
        hidegrid: false,
		subGrid: false,
		gridComplete: function() {
			hideSelectAll();
			var ids = $accountMessageTab.jqGrid('getDataIDs');//返回行数
			for(var i=0;i < ids.length;i++){
				var id = ids[i];	
				var rowData = $accountMessageTab.jqGrid('getRowData', id);	//按ID获取某行数据操作
				var roleId = rowData.id; 
            	$("#UpdateBtn a").removeAttr("disabled");
             	$("#UpdateBtn a#modify").attr("onClick", "updateKeyValue('"+roleId+"','"+rowData.pmvd+"');");
             	var se = $("#UpdateBtn").html();

             	$("#DropBtn a").removeAttr("disabled");
             	$("#DropBtn a#delete").attr("onClick", "deleteKeyValue('"+roleId+"');");
             	var op = $("#DropBtn").html();
            	$accountMessageTab.jqGrid('setRowData',ids[i],{option: se + op });
            	
			}
		}
    });//设置表格数据加载完毕后，所执行的操作
    $accountMessageTab.navGrid('#XYZLevelPage', { edit: false, add: false, del: false, search: false, refreshstate: 'current' });
    
    $(window).resize(function(){     
        $("#XYZLevelList").setGridWidth($(window).width());
    });
    
}


function readXYZyear(obj){
	var $accountMessageTab = $('#XYZYearList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}

//获得信用债年份
function queryYearXYZ(obj){
	Setkey="XYZYear"
	$("#LLZRateTab").hide();
	$("#XYZRateTab").hide();
	$("#XYZYearTab").show();
	$("#XYZLevelTab").hide();
	$("#GGSPRateTab").hide();
	$("#GGCBRateTab").hide();
	$(obj).parent().children().removeClass("isActive");
	$(obj).addClass("isActive");
	$accountMessageTab = $('#XYZYearList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	//注册清空事件
	$accountMessageTab.jqGrid({
        url: basePath+'rate/yearXYZ',
        caption: '信息维护 <span class="btn-warning btn-outline"  href="javascript:void(0);" onclick="creatKeyValue()"> <i class="fa fa-plus"></i> </span>',
        datatype: "json",
        colNames: new Array("id","期限","操作"),
        colModel: new Array(
      		  { name: 'id', index: 'id', width: 10, align:'left', resizable:true, hidden: true, key: true, sortable: false },
              { name: 'pmvd', index: 'pmvd', width: 50, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'option', index: 'option', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false}
           ),
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumbers: true,
        rownumWidth: 50,
        loadonce:true,
        prmNames: {
        	        search: "search", // 表示是否是搜索请求的参数名称
        	        page: "pageNo",// 表示请求页码的参数名称
        	        rows: "limit"  // 表示请求行数的参数名称
        	       },
        height: 'auto',
        width: false,
        autowidth:true,
        shrinkToFit:true,
        editurl: '',
        viewrecords: true,
        cellEdit: false,
        shrinkToFit: true,
        grouping: false,
        jsonReader: {
            root: "data", //结果集
            records: "data.total", //总记录数 
            total: "data.pageCount", //总页数
            page: "data.pageNo", //当前页 
            repeatitems: false // (4) 
        },
        beforeSelectRow: beforeSelectRow,//js方法 
        pager: "#XYZYearPage",
        viewrecords: true,
        hidegrid: false,
		subGrid: false,
		gridComplete: function() {
			hideSelectAll();
			var ids = $accountMessageTab.jqGrid('getDataIDs');//返回行数
			for(var i=0;i < ids.length;i++){
				var id = ids[i];	
				var rowData = $accountMessageTab.jqGrid('getRowData', id);	//按ID获取某行数据操作
				var roleId = rowData.id; 
            	$("#UpdateBtn a").removeAttr("disabled");
             	$("#UpdateBtn a#modify").attr("onClick", "updateKeyValue('"+roleId+"','"+rowData.pmvd+"');");
             	var se = $("#UpdateBtn").html();

             	$("#DropBtn a").removeAttr("disabled");
             	$("#DropBtn a#delete").attr("onClick", "deleteKeyValue('"+roleId+"');");
             	var op = $("#DropBtn").html();
            	$accountMessageTab.jqGrid('setRowData',ids[i],{option: se + op });
            	
			}
		}
    });//设置表格数据加载完毕后，所执行的操作
    $accountMessageTab.navGrid('#XYZYearPage', { edit: false, add: false, del: false, search: false, refreshstate: 'current' });
    
    $(window).resize(function(){     
        $("#XYZYearList").setGridWidth($(window).width());
    });
    
}


/**
 * 重新加载页面
 * @param obj
 * @returns
 */
function readXYZrate(obj){
	var $accountMessageTab = $('#XYZRateList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}
function loadXYZRate(obj){
		Setkey="XYZRate"
		$("#XYZYearTab").hide();
		$("#LLZRateTab").hide();
		$("#XYZRateTab").show();
		$("#XYZLevelTab").hide();
		$("#GGSPRateTab").hide();
		$("#GGCBRateTab").hide();
		$(obj).parent().children().removeClass("isActive");
		$(obj).addClass("isActive");
		queryRateXYZ(obj);
}

var XYZRateMap = new Map();
function realoadXYZRate(){
	ctools.confirm({title : "确定还原？收益率修改将不会保存"},function(isConfirm){
		if(isConfirm){
			queryRateXYZ();
			swal("数据初始化成功!", "", "success");
		}
	});
}

function saveXYZRate(){
	var actionUrl = basePath + "rate/saveXYZRate";
	
	var keys=XYZRateMap.keys;
	if(keys==null || keys.length<=0 ){
		swal("未做修改!", "", "error");
		return;
	}
	var flag=true;
	keys.forEach(function(key){
		
		var tdvalue= $("td[id='"+key+"']").text().trim();
		
		var patrn = /^\d{0,3}(\.\d{0,6})?$/;
		if(!patrn.exec(tdvalue)){
		    swal("格式错误！利率格式为 xx.xxx,x为数字", "", "error");
		    flag=false;
		    return;
		}else if(isBlank(tdvalue)){
			swal("数据不能为空!", "", "error");
			flag=false;
			return;
		}
		XYZRateMap.put(key, tdvalue);
	});
	
	if(!flag){
		return;
	}
	
	var map2json=JSON.stringify(XYZRateMap);
	var params={
				'map':map2json
			};
	stdAjax( actionUrl,params,function(result) {
		   if(result.state=='success'){
				swal("保存成功!", "", "success");
				queryRateXYZ();
		    }
			},function(){
				swal("保存出错!", "", "error");
	});	
}

function queryRateXYZ(obj){
	XYZRateMap=new Map();
	$accountMessageTab = $('#XYZRateList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	var html='';   
	
	var actionUrl = basePath + "rate/rateXYZ";
	
	var levelUrl=basePath + "rate/levelXYZ";
	var params={};
	stdAjax( levelUrl,params,function(result) {
		   var data=result.data;
		   if(result.state=='success'){
				html='<thead><tr> <td width="120px">期限\\信用等级</td> ';
				data.forEach(function(item,index){                             
					html+='<td id="'+item.id+'" style="position: relative;">'+item.pmvd+'<i class="fa  fa-trash-o"  onclick="deleteKeyValue('+item.id+');"></i>  <i class="fa fa-pencil-square-o"  onclick="updateRateXYZTab(\''+item.id+'\',\''+item.pmvd+'\',\'XYZLevel\');"></i> </td>'
				});
				
				stdAjax( actionUrl,params,function(resultV) {
					var dataV=resultV.data;
					if(resultV.state=='success'){
						html+=' <tbody> ';
						dataV.forEach(function(e){
							var year=e.name;
							var map=new Map();
							map=e.value;
							html+='<tr><td id="'+e.id+'" style="position: relative;" >'+year+'<i class="fa  fa-trash-o" onclick="deleteKeyValue('+e.id+');"></i> <i class="fa fa-pencil-square-o"  onclick="updateRateXYZTab(\''+e.id+'\',\''+year+'\',\'XYZYear\');"></i>   </td>'
							data.forEach(function(item,index){
								html+='<td id="Y'+year+'_'+item.pmvd+'"><div contenteditable="true"> '+map[item.pmvd]+'</div></td>' ;
							});
							
							html+='</tr>'
						
						});
						html+='</tbody> ';
					}
					
					html+='	</tr> </thead> ';
					
					$accountMessageTab.html(html);
					
					$('#XYZRateList tbody tr td').on('click',function(e){
						XYZRateMap.put($(this).attr("id"), $(this).text().trim());
					    //console.log(XYZRateMap);
				    });
				},function(){
					html+='	</tr> </thead> ';
					$accountMessageTab.html(html);
				});	
				
				
				
		    }
	});	
}


/**
 * 重新加载页面
 * @param obj
 * @returns
 */
function readLLZrate(obj){
	var $accountMessageTab = $('#LLZrateList'); 
    var postData = $accountMessageTab.jqGrid("getGridParam", "postData");//添加搜索条件
    $accountMessageTab.jqGrid("setGridParam",{"datatype": "json"}).trigger("reloadGrid",[{page:1}]);//重新载入Grid表格
}

function queryRateLLZ(obj){
	Setkey="LLZRate";
	$("#XYZYearTab").hide();
	$("#LLZRateTab").show();
	$("#XYZRateTab").hide();
	$("#XYZLevelTab").hide();
	$("#GGSPRateTab").hide();
	$("#GGCBRateTab").hide();
	$(obj).parent().children().removeClass("isActive");
	$(obj).addClass("isActive");
	$accountMessageTab = $('#LLZRateList'); //账户查询这一块现实之后 立刻加载第一部分账户信息部分
	//注册清空事件
	$accountMessageTab.jqGrid({
        url: basePath+'rate/rateLLZ',
        caption: '信息维护 <span class="btn-warning btn-outline"  href="javascript:void(0);" onclick="creatKeyValue()"> <i class="fa fa-plus"></i>  </span>',
        datatype: "json",
        colNames: new Array("id","期限","到期收益率","操作"),
        colModel: new Array(
      		  { name: 'id', index: 'id', width: 10, align:'left', resizable:true, hidden: true, key: true, sortable: false },
              { name: 'pmkc', index: 'pmkc', width:25, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'pmvd', index: 'pmvd', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false},
              { name: 'option', index: 'option', width: 70, align:'left', resizable:true, hidden: false, key: false, sortable: false}
           ),
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumbers: true,
        rownumWidth: 50,
        loadonce:true,
        prmNames: {
        	        search: "search", // 表示是否是搜索请求的参数名称
        	        page: "pageNo",// 表示请求页码的参数名称
        	        rows: "limit"  // 表示请求行数的参数名称
        	       },
        height: 'auto',
        width: false,
        autowidth:true,
        shrinkToFit:true,
        editurl: '',
        viewrecords: true,
        cellEdit: false,
        shrinkToFit: true,
        grouping: false,
        jsonReader: {
            root: "data", //结果集
            records: "data.total", //总记录数 
            total: "data.pageCount", //总页数
            page: "data.pageNo", //当前页 
            repeatitems: false // (4) 
        },
        beforeSelectRow: beforeSelectRow,//js方法 
        pager: "#LLZRatePage",
        viewrecords: true,
        hidegrid: false,
		subGrid: false,
		gridComplete: function() {
			hideSelectAll();
			var ids = $accountMessageTab.jqGrid('getDataIDs');//返回行数
			for(var i=0;i < ids.length;i++){
				var id = ids[i];	
				var rowData = $accountMessageTab.jqGrid('getRowData', id);	//按ID获取某行数据操作
				var roleId = rowData.id; 
            	$("#UpdateBtn a").removeAttr("disabled");
             	$("#UpdateBtn a#modify").attr("onClick", "updateKeyValue('"+roleId+"','"+rowData.pmvd+"','"+rowData.pmkc+"');");
             	var se = $("#UpdateBtn").html();
             	
             	$("#DropBtn a").removeAttr("disabled");
             	$("#DropBtn a#delete").attr("onClick", "deleteKeyValue('"+roleId+"');");
             	var op = $("#DropBtn").html();
            	$accountMessageTab.jqGrid('setRowData',ids[i],{option: se + op });
            	
			}
		}
    });//设置表格数据加载完毕后，所执行的操作
    $accountMessageTab.navGrid('#LLZRatePage', { edit: false, add: false, del: false, search: false, refreshstate: 'current' });
    
    $(window).resize(function(){     
        $("#LLZRateList").setGridWidth($(window).width());
    });
  }

//点击导入事件
$(document).on('click', '.creatImport-export', function(){
	$("#fileId").trigger("click");
});


//获得选择的文件做业务处理
function getFilePath(){
	//alert($("#file").attr("value"));
	//检验导入的文件是否为Excel文件
	var uploadFile = document.getElementById("fileId").value;
	if(uploadFile != ""){
		var fileExtend = uploadFile.substring(uploadFile.lastIndexOf('.')).toLowerCase();     
		if(fileExtend == '.xlsx' || fileExtend == '.xls'){
		}else{
			swal("文件格式需为'.xls或.xlsx'格式", "", "error");
			return false;    
		}
	}else{
		/*toastr.warning('', '请选择要导入的Excel文件');*/   //IE
		return false;
	}  
	var fileObj = document.getElementById("fileId").files[0]; // js 获取文件对象
	var formFile = new FormData();
	formFile.append("file", fileObj); //加入文件对象
	$.ajax({
		url: basePath+'rate/ImportFile',
		data: formFile,
		type: "Post",
		dataType: "json",
		cache: false,//上传文件无需缓存
		processData: false,//用于对data参数进行序列化处理 这里必须false
		contentType: false, //必须
		success: function (result) {
			var data = result.data;
			//console.log(data);
			if(result.state=='success'){
				swal("导入成功!", "", "success");
				queryRateXYZ();
			}else{
				if (result.state != 'error' ) {
					for(let index in data) {
						var List = data[index];
						if (List.errorTitle != undefined) {
							swal(''+List.errorTitle+''+"！标题前三列为AAA,AA+,AA", "", "error");
							$("#fileId").val('');
							return false;
						}else{
							if (List.errorYy != undefined) {
								swal(''+List.errorYy+''+"！年前五行首列顺序为1Y,2Y,3Y,4Y,5Y", "", "error");
								$("#fileId").val('');
								return false;
							}else{
								if (List.errorYear != undefined) {
									swal(''+List.errorYear+''+"！期限必须为整数，且长度不能超过3位 ", "", "error");
									$("#fileId").val('');
									return false;
								}else if(List.errorYear == undefined){
									if (List.errorReg != undefined) {
										swal(''+List.errorReg+''+"！利率格式为 xx.xxx,x为数字", "", "error");
										$("#fileId").val('');
										return false;
									}else{
										swal("导入失败!", "", "error");
										$("#fileId").val('');
										return false;
									}
								}
							}
						}
					}
				}else {
					swal("导入失败!", "", "error");
					$("#fileId").val('');
				}
			}
			$("#fileId").val('');
		},
		error:function(){
			swal("导入失败!", "", "error");
			$("#fileId").val('');
		}
	})

}