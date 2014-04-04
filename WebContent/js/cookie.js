/**
 * Cookie操作
 * auth：曾小斌
 * createDate:2013年11月5日
 */
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
	
	//unjson:默认格式化成JSON 【true：不格式化成JSON，false:格式化成JSON】  
	getJson:function(unjson){
		var cookie_array={};
		var cookies=document.cookie.split(";");
		for(var i=0,j=cookies.length;i<j;i++){
			var keys=cookies[i].split("="),
				key=$.trim(keys[0]),
				value=unescape(keys[1]);
			if(value!="undefined"){
				if(!unjson){
					try{
						value=JSON.parse(value);
					}catch(ex){
						//console.log("[success] :"+ex)
					}
				}
				cookie_array[key]=value;
			}
		}
		return cookie_array;
	},
	remove:function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cookie_val=Cookie.set(name);
		if(cookie_val!=null) {
			document.cookie= name + "="+cookie_val+";expires="+exp.toGMTString();
		}
	}
}
var COOKIE=CooKie=cooKie=Cookie=cookie;