/**
 * 连接数据库组件
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define("login",[],function(require,exports,module){
	var tree=require("tree"),util=require("util"),message=util.message,cookie=require("cookie");
	var dialog=$('#window_create_connection');
	var $document=$(document);
	module.exports.init=function(callback){
		$("#input_con_database").val("");
		//初始化登录弹出框
		dialog.window({
	        iconCls:'icon-retweet',
	        closed:false,
	        collapsible:false,
	        maximizable:false,
	        minimizable:false,
	        resizable:false,
	        modal:true,
	        onOpen:function(){
	        	callback&&callback();
	        }
	    });
	};
	
	//测试连接
	$document.on("click","#bt_login_test",function(e){
		//$("#input_con_database").val("");
		message.wait("正在测试连接");
		loginDatabase(function(result){
			if(result.recode==1){
				message.ok("连接成功！",0.5);
			}else{
				message.error("连接失败！",0.5);
			}
		});
	});
	
	//点击登录
	$document.on("click","#bt_login_in",function(e){
		//$("#input_con_database").val("");
		message.wait("正在登录");
		loginDatabase(function(result){
			if(result.recode==1){
				tree.init();
				dialog.window('close');
			}else{
				message.error("连接失败！原因："+result.message,2);
			}
		});
	});
	
	//获取登录信息
	function getLoginInfo(){
		var loginInfo={
			"parameter.driver":"com.mysql.jdbc.Driver",
			"parameter.ip":$("#input_con_ip").val(),
			"parameter.port":$("#input_con_port").val(),
			"parameter.charset":$("#input_con_charset").val(),
			"parameter.user":$("#input_con_user").val(),
			"parameter.password":$("#input_con_password").val(),
			"parameter.database":$("#input_con_database").val()
		};
		return loginInfo;
	}
	
	//登录系统
	function loginDatabase(callback){
		var info=getLoginInfo();
		$.ajax({
			url:"sql/testCon.action"
			,data:info
			,timeout:15000
			,success: function(result){
				if(typeof result=="object"&&result.recode==1){
					message.hide();
					cookie.set("jdbc",JSON.stringify(info));
					callback&&callback(result);
				}else{
					message.error("连接失败！");
				}
			}
			,error: function(result){
				message.error("连接失败！");
				console&&console.log(result);
			}
		});
	}
	
	//将登录信息放入cookie中
	function setCookies(info){
		var jdbc=cookie.get("jdbc"),jdbcs=[];
		if(typeof jdbc!="undefined" &&jdbc!=null){
			jdbcs=JSON.parse(jdbc);
			//检测数组是否存在指定元素，若存在则替换，若不存在则追加
			jdbcs=setArray(jdbcs,info);
		}else{
			//追加信息
			jdbcs.push(info);
		}
		
		//将连接数组信息放入cookie中
		cookie.set("jdbc",JSON.stringify(jdbcs));
	}
	
	//检测数组是否存在指定元素，若存在则替换，若不存在则追加
	function setArray(array,target){
		var exist=false;//是否存在控制器
		for(var i=0,j=array.length;i<j;i++){
			var item=array[i];
			if(item["parameter.ip"]===target["parameter.ip"]){
				array.splice(i,1,target);
				exist=true;
				break;
			}
		}
		
		//若不存在则追加
		if(!exist){
			array.push(target);
		}
		return array;
	}
	
	//点击取消按钮
	$document.on("click","#bt_login_cancel",function(e){
		dialog.window('close');
	});
	
	//打开登录提示框
	module.exports.open=function(){
		dialog.window('open');
	};
	//对外接口
	module.exports.target=dialog;
	module.exports.getLoginInfo=getLoginInfo;
	module.exports.loginDatabase=loginDatabase;
});