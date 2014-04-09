/**
 * 修改表、添加表操作
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var login=require("login"),util=require("util"),message=util.message;;
	var $document=$(document);
	module.exports.init=function(){
		
	};
	$document.on("click","#menu_down_connection",function(){
		login.open();
	});
	
	$document.on("click",".undefined",function(){
		message.error("暂未开发！");
	});
	
	//点击注销按钮
	$document.on("click","#menu_down_loginout",function(){
		window.location.reload();
	});
	
	//点击关于按钮
	$document.on("click","#menu_down_about",function(){
		alert("采用easyui框架开发，现在只支持mysql，里面还有一些BUG，作者正在处理中。。。");
	});
});