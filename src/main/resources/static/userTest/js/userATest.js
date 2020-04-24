var newbondHead = '/newbond';
(function(){
	var _this = new Vue({
	  el: '#app',
	  data: {
		innerHeight: "",
		tableHeight: "",
		dialogFormVisible:false,
    type:'add',
		val:{
			id:'',
			name:'',
			age:'',
			sex:'',
			height:'',
		},
		tableData: [],
		tableChecked:[]
	  },
	  methods: {
		init: function() {
			_this.queryData();
		},
		openMsg: function(title,msg,type) {
			  if(type==null){
				  type='success';
			  }
			  this.$notify[type]({
		          title: title,
		          message: msg,
		          position:"top-center",
		          customClass: "tip_center",
		          duration: 1500,
		          offset: 0
		     })
		  },
		saveData:function(){
      var param = _this.val;
      var url = '/test/insertUser';
      if(_this.type=='update'){
        url = '/test/updateUser';
      }
			Vue.$http.post(url,param,function(result) {
					_this.closeDilog();
					_this.openMsg('提示','保存成功！');
					_this.queryData();
		  });
		},
		addData:function(){
      _this.type = 'add';
			_this.dialogFormVisible = true;
		},
		handleClick:function(row){
      _this.type = 'update';
			_this.val = row;
			_this.dialogFormVisible = true;
		},
		closeDilog:function(){
		    this.dialogFormVisible = false;
				_this.imageUrl = '';
        var val={
    			id:'',
    			name:'',
    			age:'',
    			sex:'',
    			height:'',
    		};
				_this.val = val;
		},
		deleteData:function(){
			if(_this.tableChecked==null||_this.tableChecked.length==0){
				_this.openMsg('提示','请选择需要剔除的数据','warning');
				return;
			}
			var ids = '';
			for(var i=0;i<_this.tableChecked.length;i++){
				   ids += _this.tableChecked[i].id +',';
			 }
		      this.$confirm('确认删除操作?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          Vue.$http.get('/test/delUser?id='+ids,function(result) {
		        	  _this.openMsg('提示','删除成功！');
		        	  _this.queryData();
				  });
		        }).catch(() => {
		        });

		},
		queryData: function() {
			Vue.$http.post("/test/getUsers", null, function(result) {
				var data = result.data;
				_this.tableData = data;
			});
		},
		handleSelectionChange:function(val){
			_this.tableChecked = val;
		},	  }
	});

	_this.init();
})();
