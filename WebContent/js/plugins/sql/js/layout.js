/**
 * 页面布局组件
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(["easyui","util","menu","login","tree","sql","cookie","my97","easyui-extend"],function(require, exports, module){
	var login=require("login"),util=require("util"),message=util.message;menu=require("menu"),cookie=require("cookie");
	var easyuiExtend=require("easyui-extend"),$document=$(document);
	//eayui扩展插件初始化
	easyuiExtend.init();
	module.exports.target=$(".body_layout").height($document.height()).show().layout();
	//从cookie获取数组信息
	function getCookies(){
		var jdbc=cookie.get("jdbc"),jdbcs=[];
		if(typeof jdbc!="undefined" &&jdbc!=null){
			jdbcs=JSON.parse(jdbc);
		}
		
		//遍历数组
		for(var i=0,j=jdbcs.length;i<j;i++){
			var item=jdbcs[i];
			for(var m in item){
				var key=m.replace("parameter.",""),value=item[m];
				$("#input_con_"+key).val(value);
			}
		}
	}
	
	//从cookie获取登录信息
	function getCookie(){
		var jdbc=cookie.get("jdbc");
		if(typeof jdbc!="undefined" &&jdbc!=null){
			jdbc=JSON.parse(jdbc);
		}
		
		for(var i in jdbc){
			var key=i.replace("parameter.",""),value=jdbc[i];
			$("#input_con_"+key).val(value);
		}
	}
	
	//填充数据
	function fillValue1(){
		$("#input_con_ip").val("localhost");
		$("#input_con_port").val("3306");
		//$("#input_con_database").val("test");
		$("#input_con_user").val("root");
		$("#input_con_password").val("root");
	}
	
	$("#body_message_wrap_init").fadeOut("slow",function(){
		login.init(getCookie);
	});
	
	//当window窗体大小改变时候，重置layout
	$(window).resize(function(){
		util.processor.process(function(){
			module.exports.target.height(0);
			module.exports.target.height($document.height());
			module.exports.target.layout("resize");
		},100);
	});
});


