/**
 * 工具类组件
 * 曾小斌
 * 2013-12-31 15:39:15
 * 调用方式 var util=require("util");
 */

define(function(require,exports,module){
    
	/**
	 * 延时加载
	 * 调用方式 util.processor.process(function(){alert("init");});
	 */
	var Processor={
     	timeoutId:null,
     	perProcessing:function(){
     		
     	},
     	process:function(callback,timeout){
     		clearTimeout(this.timeoutId);
     		var that=this;
     		this.timeoutId=setTimeout(function(){
     			that.perProcessing();//执行真正的方法  这里为空方法
     			if(typeof callback=="function"){
     				callback();
     			}
     		},timeout||100);
     	}
     };
     
	 /**
	 * 消息提示组件
	 * 调用方式 var message=util.message;message.ok("ok");
	 */
     var Message=function(){
		 //创建消息提示框
		 function createMessage(text){
			 var target=$("#body_message_sql");
			 var message_model_html='<div id="body_message_sql" class="body_message_wrap"><div class="body_message_box"><div class="body_message_content"><i class="body_message_icon"></i><span class="body_message_text">'+text+'</span></div></div></div>';
			 if(target.size()>0){
				 target.remove();
			 }
			 target=$(message_model_html).appendTo("body");
			 var target_content=target.find(".body_message_content");
			 target_content.css("margin-left",target_content.width()/-2);
			 return target;
		 }
		 
		 var types=["ok","error","warn","info","stop"],that=this;
    	 for(var i=0,j=types.length;i<j;i++){
    		 (function(_i){
    			 var type=types[_i];
    			 that[type]=function(text,callback,callbacks){
    				 var timeout=1000;
    				 if(typeof callback=="number"){
    					 timeout=callback*1000;
    				 }
    				 createMessage(text).addClass("body_message_transparent").find(".body_message_content").addClass("body_message_"+type).find(".body_message_text");
    				 Processor.process(function(){
    					 $("#body_message_sql").remove();
    					 if(typeof callback=="function"){
    						 callback();
    					 }
    					 if(typeof callbacks=="function"){
    						 callbacks();
    					 }
    				 },timeout);
    			 };
    		 })(i);
    	 }
    	 
    	 //等待
    	 this.wait=function(text,callback){
    		 createMessage(text).addClass("body_message_transparent").find(".body_message_content").addClass("body_message_wait").find(".body_message_text");
    		 if(typeof callback=="function"){
    			 callback();
    		 }
    	 };
    	 
    	 //初始化
    	 this.init=function(text,callback){
    		 createMessage(text).find(".body_message_text");
    		 if(typeof callback=="function"){
    			 callback();
    		 }
    	 };
    	 //关闭消息框
    	 this.hide=function(callback){
    		 $("#body_message_sql").remove();
    		 if(typeof callback=="function"){
    			 callback();
    		 }
    	 };
	 };
     
     module.exports.processor=Processor;
     module.exports.message=new Message();
     
});

