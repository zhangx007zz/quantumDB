(function(){
	// jquery
	Vue.$ = $;

	/**
	 * 公共方法、参数区
	 */
	// warn  mergeOptions  extend  defineReactive 原生方法   勿修改
	var util = Vue.util;

	// 数字格式化方法  三位加, places 保留位数  默认与数字位数一致   symbol 格式化前缀
	util.numberFormat = function(number, places, symbol) {
		if (number == null || number == "undefined" || number === "" || isNaN(number)) {
			return "-";
		}

		if (typeof places != "number") {
			if ((number + "").indexOf(".") > -1) {
				places = (number+"").split(".")[1].length;
			} else {
				places = 0;
			}
		}

		symbol = symbol || "";

		var negative = number < 0 ? "-" : "",
			i = parseInt(number = Math.abs( + number || 0).toFixed(places), 10) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;

		return symbol + negative + (j ? i.substr(0, j) + "," : "")
			+ i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",")
			+ (places ? "." + Math.abs(number - i).toFixed(places).slice(2) : "");
	}

	function isNumber(a) {
		if (a === "" || a === null) {
			return false;
		}
		return !isNaN(Number(a));
	}

	util.isNumber = isNumber;

	// ==============================================
	// beg.util.date
	// ==============================================
	util.formatDate = function(date, format) {
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
			return util.formatDate(new Date(date.time), format);
		} else {
			throw 'arguments[0] must be a date object.';
		}
	};

	util.parseDate = function(str, format) {
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
		return date;
	};

	util.date = function(_date, _format) {
		var date = _format ? util.parseDate(_date, _format)
				: (_date || new Date());
		date.add = function(_field, num) {
			var field = _field.substr(0, 1).toUpperCase()
					+ _field.substr(1).toLowerCase();
			if (!this['get' + field]) {
				throw '[util.addDate]unexpect field:' + _field;
			}
			var date = this.clone();
			date['set' + field](date['get' + field]() + num);
			return date;
		}
		date.trans = function(org, dst) {
			return util.date(util.parseDate(util.formatDate(this, org), dst));
		}
		date.format = function(format) {
			return util.formatDate(this, format);
		}
		date.isToday = function() {
			return this.getDate() == new Date().getDate();
		}
		date.clone = function() {
			return util.date(new Date(this.getTime()));
		}
		return date;
	}
	// ==============================================
	// end.util.date
	// ==============================================

	// ==============================================
	// beg.request
	// ==============================================
	//js获取url参数值
    util.request = function(paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = { };
        var j;
        for (var i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return decodeURI(returnValue);
        }
    }
    // ==============================================
	// end.request
	// ==============================================

	// ==============================================
	// start 复制入粘贴板
	// ==============================================

	util.copyValue = function(val){
        //如果这里换为 input 则不支持换行
        var temp = document.createElement('textarea');
        temp.value = val;
        document.body.appendChild(temp);
        temp.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        temp.style.display='none';
		temp.remove();
        console.log('复制成功');
    }

	// ==============================================
	// end 复制入粘贴板
	// ==============================================

	// ==============================================
	// beg.$http
	// ==============================================

	Vue.$http = {
		get: function(url, callback, async) {
			if (async) {
				getData();
				return;
			}

			axios.get(url).then(function(result) {
				axiosCallback(result, callback);
				Vue.prototype.$loading().close();
			});

			async function getData() {
				await axios.get(url).then(function(result) {
					axiosCallback(result, callback);
					Vue.prototype.$loading().close();
				});
			}
		},
		post: function(url, param, callback, async) {
			if (async) {
				postData();
				return;
			}

			axios.post(url, param).then(function(result) {
				axiosCallback(result, callback);
			});

			async function postData() {
				await axios.post(url, param).then(function(result) {
					axiosCallback(result, callback);
				});
			}
		},
		// 无loading框
		getUnload: function(url, callback, errorback,async) {
			if (async) {
				getData();
				return;
			}

			axios.get(url).then(function(result) {
				axiosCallback(result, callback);
			});

			async function getData() {
				await axios.get(url).then(function(result) {
					axiosCallback(result, callback,errorback);
				});
			}
		},
		// 无loading框
		postUnload: function(url, param, callback, errorback, async) {
			if (async) {
				postData();
				return;
			}

			axios.post(url, param).then(function(result) {
				axiosCallback(result, callback,errorback);
			});

			async function postData() {
				await axios.post(url, param).then(function(result) {
					axiosCallback(result, callback,errorback)
				});
			}
		}
	}


	function axiosCallback(result, callback,errorback) {
		callback(result);
	
	}
	// ==============================================
	// end.$http
	// ==============================================

	// ==============================================
	// start list排序
	// ==============================================

	util.sortByName = function(list, sortName, desc) {
		list.sort(function(a, b) {
			if (desc) {
				return compare(b[sortName], a[sortName]);
			}

			return compare(a[sortName], b[sortName]);
		});
	}

	function compare(a, b) {
		if (a == null) {
			a = "";
		}

		if (b == null) {
			b = "";
		}

		if (isNumber(a) || isNumber(b)) {
			return a - b;
		}

		return a.localeCompare(b);
	}

	// ==============================================
	// end list排序
	// ==============================================

	// ==============================================
	// start 获取数据字典
	// ==============================================

	util.getDictionary = function(key, type){
        var dictionary = JSON.parse(localStorage.getItem("DICTIONARY"));

        if (type == "map") {
        	var list = dictionary[key];
        	if (!list) {
        		return {};
        	}
        	var result = {};
        	list.forEach(function(item) {
        		result[item.code] = item.value;
        	});

        	return result;
        }

        return dictionary[key];
    }

	// ==============================================
	// end 获取数据字典
	// ==============================================
})();
