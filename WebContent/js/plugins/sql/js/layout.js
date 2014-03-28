/**
 * 页面布局组件
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(["easyui","util","menu","login","tree","sql"],function(require, exports, module){
	var login=require("login"),util=require("util"),message=util.message;menu=require("menu");
	var $document=$(document);
	module.exports.target=$(".body_layout").height($document.height()).show().layout();
	function fillValue2(){
		$("#input_con_ip").val("localhost");
		$("#input_con_port").val("3306");
		//$("#input_con_database").val("test");
		$("#input_con_user").val("root");
		$("#input_con_password").val("root");
	}
	
	function fillValue(){
		$("#input_con_ip").val("10.17.82.155");
		$("#input_con_port").val("3306");
		//$("#input_con_database").val("newest_edu3");
		$("#input_con_user").val("edu_jyg");
		$("#input_con_password").val("Zte@ict2012");
	}
	
	function fillValue1(){
		$("#input_con_ip").val("sqld.duapp.com");
		$("#input_con_port").val("4050");
		$("#input_con_database").val("TcVrkrgKvXRRlkwPOMbA");
		$("#input_con_user").val("fIVL41WtNGp0FMwy1xGAjvK2");
		$("#input_con_password").val("HbUN8irmsu1jox3Ga5GOhxEwulXGA1sg");
	}
	
	$("#body_message_wrap_init").fadeOut("slow",function(){
		login.init(fillValue);
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


