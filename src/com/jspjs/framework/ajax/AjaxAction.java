package com.jspjs.framework.ajax;

import java.util.Map;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class AjaxAction extends ActionSupport{
	public static final String JSON = "json";
	
	protected AjaxUtil ajaxUtil=new AjaxUtil();
	protected Map<String,String> parameter;
	
	public AjaxUtil getAjaxUtil() {
		return ajaxUtil;
	}

	public void setAjaxUtil(AjaxUtil ajaxUtil) {
		this.ajaxUtil = ajaxUtil;
	}

	public Map<String, String> getParameter() {
		return parameter;
	}

	public void setParameter(Map<String, String> parameter) {
		this.parameter = parameter;
	}
	
	/**
	 * 获取session的值
	 * @param key
	 * @return
	 */
	public Object getSessionProperty(String key) {
		return ActionContext.getContext().getSession().get(key);
	}
	
	/**
	 * 设置session的值
	 * @param key
	 * @return
	 */
	public void setSessionProperty(String key, Object value) {
		ActionContext.getContext().getSession().put(key, value);
	}
	
	/**
	 * 移除指定的session
	 * @param key
	 * @return
	 */
	public void removeSessionProperty(String key) {
		ActionContext.getContext().getSession().remove(key);
	}

}
