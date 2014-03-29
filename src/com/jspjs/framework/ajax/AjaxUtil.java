package com.jspjs.framework.ajax;

import net.sf.json.JSONObject;

//返回JSON格式的消息
public class AjaxUtil {
	String message;
	int recode;
	Object data;
	public AjaxUtil(){
		
	}
	
	public AjaxUtil(String message,int recode,Object data){
		this.message=message;
		this.recode=recode;
		this.data=data;
	}
	
	private static final class Recode{
		public static final int success = 1;
		public static final int fail = 0;
	}
	
	private static final class Message{
		public static final String success = "操作成功！";
		public static final String fail = "操作失败！";
	}
	
	private String setMsg(String message,int recode,Object data){
		this.message=message;
		this.recode=recode;
		this.data=data;
		return "json";
	}
	
	public String setSuccess(String message,Object data){
		return setMsg(message,Recode.success,data);
	}
	
	public String setSuccess(String message){
		return setSuccess(message, null);
	}
	
	public String setSuccess(Object data){
		return setSuccess(Message.success, data);
	}
	
	public String setSuccess(){
		return setSuccess(Message.success);
	}
	
	public String setFail(String message,Object data){
		return setMsg(message,Recode.fail,data);
	}
	
	public String setFail(String message){
		return setFail(message, null);
	}
	
	public String setFail(Object data){
		return setFail(Message.fail, data);
	}
	
	public String setFail(){
		return setFail(Message.fail);
	}
	
	/**
	 * 根据参数自动输出success或者fail
	 * @param result
	 * @return
	 */
	public String setResult(boolean result){
		return result?setSuccess(Message.success):setFail(Message.fail);
	}
	
	/**
	 * 根据参数自动输出success或者fail
	 * @param result
	 * @param data
	 * @return
	 */
	public String setResult(boolean result,Object data){
		return result?setSuccess(Message.success,data):setFail(Message.fail,data);
	}
	
	
	/**
	 * 构建一个操作成功的方法
	 * @param message
	 * @param data
	 * @return
	 */
	public static AjaxUtil SUCCESS(String message,Object data){
		return new AjaxUtil(message,Recode.success,data);
	}
	
	public static AjaxUtil SUCCESS(String message){
		return new AjaxUtil(message,Recode.success,null);
	}
	
	/**
	 * 构建一个操作失败的方法
	 * @param message
	 * @param data
	 * @return
	 */
	public static AjaxUtil FAIL(String message,Object data){
		return new AjaxUtil(message,Recode.fail,data);
	}
	public static AjaxUtil FAIL(String message){
		return new AjaxUtil(message,Recode.fail,null);
	}
	
	
	
	/**
	 * 返回json结构的信息 {msg:"message",recode:"1",data:"{}"}
	 * @param message 提示信息
	 * @param recode 状态码
	 * @param data 返回数据
	 * @return
	 */
	public static JSONObject message(String message,int recode,Object data){
		JSONObject jo = new JSONObject();
		jo.accumulate("recode", recode);
		jo.accumulate("msg", message);
		if(data != null){
			//jo.accumulate("data", JSONSerializer.toJSON(data));
			jo.accumulate("data", JSONObject.fromObject(data));
		}else{
			jo.accumulate("data", new JSONObject());
		}
		return jo;
	}
	
	public static JSONObject success(String message,Object data){
		return message(message,Recode.success,data);
	}
	public static JSONObject success(String message){
		return success(message,null);
	}
	public static JSONObject success(Object data){
		return success(Message.success,data);
	}
	
	public static JSONObject fail(String message,Object data){
		return message(message,Recode.fail,data);
	}
	
	public static JSONObject fail(String message){
		return fail(message,null);
	}
	public static JSONObject fail(Object data){
		return fail(Message.fail,data);
	}
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getRecode() {
		return recode;
	}

	public void setRecode(int recode) {
		this.recode = recode;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
