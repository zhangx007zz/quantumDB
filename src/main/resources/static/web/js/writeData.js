var newbondHead = '/newbond';
(function(){
	var _this = new Vue({
	  el: '#app',
	  data: {
		innerHeight: "",
		tableHeight: "",
		dialogFormVisible:false,
		columns: [],
		fileList:[],
		imageUrl:"",
		flag:true,
		val:{
			id:'',
			name:'',
			age:'',
			sex:'',
			addr:'',
			imgurl:''
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
			handleSuccess:function(response, file, fileList){
				_this.val.id = response;
				_this.submitData();
			},
			handlePictureCardPreview (file) {
	      _this.imageUrl = file.url;
      },
			handleError:function(err, file, fileList){
				_this.openMsg('错误','上传失败！','error');
			},
			uploadUrl(key){
					url ="/user/upload?id="+key;
				return url;
			},
			handleChange(file, fileList) {
				_this.flag = false;
	      _this.$refs.upload.clearFiles();
	      _this.$refs.upload.uploadFiles.push(file);
	      _this.imageUrl = URL.createObjectURL(file.raw);
	    },
			beforeAvatarUpload:function(file) {
				var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
				const isJPG = file.type === 'image/jpeg';
				const isJPG2 = file.type === 'image/png';
				const isJPG3 = file.type === 'image/jpg';
				const isJPG4 = file.type === 'image/gif';
				const isJPG5 = file.type === 'image/bmp';
				if(!isJPG&&!isJPG2&&!isJPG3&&!isJPG4&&!isJPG5) {
					_this.openMsg('警告','请上传头像图片格式：jpeg,png,jpg,gif,bmp','warning');
				}
				return isJPG||isJPG2||isJPG3||isJPG4||isJPG5;
			},
		saveData:function(){
			if(_this.flag){
				_this.submitData();
			}else{
				 _this.$refs.upload.submit();
			}

		},
		submitData:function(){
			var param = _this.val;
			 _this.flag = true;
			Vue.$http.post('/user/addUser',param,function(result) {
					_this.closeDilog();
					_this.openMsg('提示','保存成功！');
					_this.queryData();
		 });
	 },
		addData:function(){
			_this.dialogFormVisible = true;
		},
		handleClick:function(row){
			_this.val = row;
			_this.imageUrl = row.imgurl;
			_this.dialogFormVisible = true;
		},
		closeDilog:function(){
			_this.flag = true;
		    this.dialogFormVisible = false;
				_this.imageUrl = '';
				var val = {
					id:'',
					name:'',
					age:'',
					sex:'',
					addr:'',
					imgurl:''
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
		          Vue.$http.get('/user/delUser?id='+ids,function(result) {
		        	  _this.openMsg('提示','删除成功！');
		        	  _this.queryData();
				  });
		        }).catch(() => {
		        });

		},
		queryData: function() {
			Vue.$http.post("/user/getAllUser", null, function(result) {
				var data = result.data;
				for(var i=0;i<data.length;i++){
					 data[i].imgurl = "/user/getImg?id="+data[i].id;
				 }
				_this.tableData = data;
			});
		},
		handleSelectionChange:function(val){
			_this.tableChecked = val;
		},	  }
	});

	_this.init();
})();
