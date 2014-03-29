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
});