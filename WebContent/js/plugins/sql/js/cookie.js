/**
 * cookie操作
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var cookie={
		set:function(name,value,expires){
		    var Days = expires||365; 			//默认此 cookie 将被保存 365 天
		    var exp = new Date();    			//new Date("December 31, 9998");
		    exp.setTime(exp.getTime() + Days*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); //path=/;domain=.baidu.com
		},
		get:function(name){
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null){ 
				return unescape(arr[2]); 
			}
			return null;
		},
		remove:function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cookie_val=Cookie.set(name);
			if(cookie_val!=null) {
				document.cookie= name + "="+cookie_val+";expires="+exp.toGMTString();
			}
		}
	};
	
	exports.set=cookie.set;
	exports.get=cookie.get;
	exports.remove=cookie.remove;
});