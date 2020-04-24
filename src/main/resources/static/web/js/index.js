(function(){
	var tableData = [];
	var _this = new Vue({
	  el: '#app',
	  data: {
      stock:'xxxzzz',
			num:{
				tableNum:'',
				rowsNum:'',
				columnNum:'',
				read:'',
				write:'',
				totalRead:'',
				totalWrite:'',
				cpuUsage:'',
				memoryUsage:'',
				readRta:'',
				writeRta:'',
			},
			val:{
				name:'',
				age:'',
				sex:'',
				addr:'',
				imgurl:''
			},
      $chart: "",
		},
	  methods: {
      init: function() {
				_this.queryData();
  		},
			errorHandler() {
		     return true;
		  },
			queryData: function() {
				Vue.$http.post("/dataBase/getDataBase",null, function(result) {
					  console.log(result.data);
						_this.num = result.data;
						_this.echartInit();
						_this.mechartInit();
						_this.xechartInit();
				});
				Vue.$http.post("/user/topUser",null, function(result) {
					  console.log(result.data);
						_this.val = result.data;
						_this.val.imgurl = '/user/getImg?id='+result.data.id;
				});
			},
      echartInit: function() {
          var myCharts = echarts.init(document.getElementById("myCharts"));
          myCharts.clear();
          _this.$chart = myCharts;
					var cpu = _this.num.cpuUsage;
					var free = 100 - _this.num.cpuUsage;
          option = {
                title: {
                    text: 'CPU使用效率图',
                    left: 'center',
                    textStyle: {
                          fontSize: 26,
                          fontWeight: 'bolder',
                          color: 'white'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    data: ['空闲','已使用'],
                    textStyle: {
                      color: 'white'  // 图例文字颜色
                    },
                },
                color : [ 'orange','green' ],
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data: [
                            {value: cpu, name: '已使用'},
                            {value: free, name: '空闲'},
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
          myCharts.setOption(option);
      },

			mechartInit: function() {
          var meCharts = echarts.init(document.getElementById("meCharts"));
          meCharts.clear();
					var memory = _this.num.memoryUsage;
					var free = 100 - _this.num.cpuUsage;
          option = {
                title: {
                    text: '内存使用效率图',
                    left: 'center',
                    textStyle: {
                          fontSize: 26,
                          fontWeight: 'bolder',
                          color: 'white'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    data: ['空闲','已使用'],
                    textStyle: {
                      color: 'white'  // 图例文字颜色
                    },
                },
                color : [ 'orange','green' ],
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data: [
                            {value: memory, name: '已使用'},
                            {value: free, name: '空闲'},
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
          meCharts.setOption(option);
      },
      xechartInit: function() {
          var xeCharts = echarts.init(document.getElementById("xeCharts"));
          xeCharts.clear();
          _this.$chart = xeCharts;
          var colors = ['#5793f3', '#d14a61', '#675bba'];
					var readRta = _this.num.readRta.split(',');
					var writeRta = _this.num.writeRta.split(',');
          xoption = {
              color: colors,
              tooltip: {
                  trigger: 'none',
                  axisPointer: {
                      type: 'cross'
                  }
              },
              legend: {
                  data:['读取速度', '写入速度'],
									textStyle:{
										 fontSize: 14,//字体大小
										 color: 'white'//字体颜色
									 },
              },
              grid: {
                  top: 70,
                  bottom: 50
              },
              xAxis: [
                  {
                      type: 'category',
                      axisTick: {
                          alignWithLabel: true
                      },
                      axisLine: {
                          onZero: false,
                          lineStyle: {
                              color: colors[1]
                          }
                      },
                      axisPointer: {
                          label: {
                              formatter: function (params) {
                                  return '读取速度  ' + 'rta(ms)'
                                      + ('rta(ms)' ? '：' + params.seriesData[0].data : '');
                              }
                          }
                      },
                      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                  },
                  {
                      type: 'category',
                      axisTick: {
                          alignWithLabel: true
                      },
                      axisLine: {
                          onZero: false,
                          lineStyle: {
                              color: colors[0]
                          }
                      },
                      axisPointer: {
                          label: {
                              formatter: function (params) {
                                  return '写入速度  ' + 'rta(ms)'
                                      + ('rta(ms)' ? '：' + params.seriesData[0].data : '');
                              }
                          }
                      },
                      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                  }
              ],
              yAxis: [
                  {
                      type: 'value',
											axisLabel : {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                  }
              ],
              series: [
                  {
                      name: '读取速度',
                      type: 'line',
                      xAxisIndex: 1,
                      smooth: true,
                      data: readRta
                  },
                  {
                      name: '写入速度',
                      type: 'line',
                      smooth: true,
                      data: writeRta
                  }
              ]
						};
          xeCharts.setOption(xoption);
      }
		}
  });
  _this.init();
	setInterval (_this.init(), 30000);
})();
