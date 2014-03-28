/**
 * 消息弹出框组件
 * 曾小斌
 * 2014-01-01 00:54:31
 */
define(["messageCss"],function(require,exports,module){
	var util=require("util");
	var message={
		self:null,
		color:"green",	//字体颜色
		small:true,	//是否为小图标模式
		//创建消息框
		create:function(){
			if(message.self==null){
				var msg='<div class="message_box">';
				msg+='<div class="message_content"><span class="message_icon"></span><span class="message_text"></span></div></div>';
				message.self=$(msg).appendTo("body");
			}
			return message.self;
		},
		setOffset:function(){
			var documentWidth = $(document).width();
			var documentHeight = $(document).height();
			var width=message.self.outerWidth();
			var height=message.self.outerHeight();
			var left=(documentWidth-width)/2;
			var top=(documentHeight-height)/2;
			message.self.css({"top":top,"left":left});
			return message.self;
		},
		setContent:function(text,icon){
			message.create();
			if($(".message_content").hasClass("message_content_wait")){
				$(".message_content_wait").removeClass("message_content_wait");
			}
			$(".message_icon").removeAttr("class").addClass("message_icon icon_message_"+icon);
			$(".message_text").text(text).css("color",message.color);
			//message.setOffset();
			if(message.small==true){
				message.self.removeAttr("class").addClass("message_box_small");
			}else{
				message.self.removeAttr("class").addClass("message_box");
			}
			return message;
		},
		show:function(text,icon,timeout){
			message.setContent(text,icon).setOffset().show();
			util.processor.process(function(){
				message.hide();
			},timeout||2000);
		},
		hide:function(){
			message.self.fadeOut("slow");
		},
		ok:function(text,timeout){
			message.color="green";
			message.show(text,"ok",timeout);
		},
		error:function(text,timeout){
			message.color="red";
			message.show(text,"error",timeout);
		},
		warn:function(text,timeout){
			message.color="#9E9E29";
			message.show(text,"warn",timeout);
		},
		stop:function(text,timeout){
			message.color="#8f0000";
			message.show(text,"stop",timeout);
		},
		info:function(text,timeout){
			message.color="#3250D3";
			message.show(text,"info",timeout);
		},
		wait:function(text,timeout){
			message.color="#D86F29";
			message.show(text,"wait",timeout||30000);
			$(".message_content").addClass("message_content_wait");
		}
	};
	module.exports={
		show:message.show,
		hide:message.hide,
		ok:message.ok,
		error:message.error,
		warn:message.warn,
		stop:message.stop,
		info:message.info,
		wait:message.wait
	};
})

