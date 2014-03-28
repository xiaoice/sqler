package com.jspjs.framework.jdbc;

import java.util.Map;

import org.springframework.context.ApplicationContext;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.zte.framework.util.SysConfigHelper;
import com.zte.user.domain.User;

public class BaseAction extends ActionSupport {
	protected Map<String,String> parameter;
	
	/**
	 * 获取服务器目录
	 * @return
	 */
	public String getAppPath() {
		//return ServletActionContext.getServletContext().getRealPath("/");
		return null;
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
	
	/**
	 * 获取context的值
	 * @param key
	 * @return
	 */
	public Object getContextProperty(String key) {
		return ActionContext.getContext().get(key);
	}
	
	/**
	 * 设置context的值
	 * @param key
	 * @return
	 */
	public void setContextProperty(String key, Object value) {
		ActionContext.getContext().put(key, value);
	}
	
	/**
	 * 获取User
	 * @param key
	 * @return
	 */
	public User getUser() {
		User user =(User)getSessionProperty("user");
		return user;
	}
	
	/**
	 * 获取UserId
	 * @param key
	 * @return
	 */
	public Integer getUserId() {
		User user = (User)getSessionProperty("user");
		if(user!=null){
			return user.getId();
		}else{
			return null;
		}
	}
	
	/**
	 * 获取spring容器
	 * @return
	 */
	public ApplicationContext getApplicationContext(){
		return SysConfigHelper.getAppContext();
	}

	public Map<String, String> getParameter() {
		return parameter;
	}

	public void setParameter(Map<String, String> parameter) {
		this.parameter = parameter;
	}
	
}
