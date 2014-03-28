package com.jspjs.framework.util;

import java.util.Map;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.context.support.XmlWebApplicationContext;

public class SysConfigHelper implements ApplicationContextAware{
	private static XmlWebApplicationContext appContext;
	private static Map<String,String> attributes;
	private static Map<String,String> helps;
	
	private SysConfigHelper(){
	}
	
	public void setApplicationContext(ApplicationContext applicationContext)throws BeansException{
	    appContext = (XmlWebApplicationContext)applicationContext;	    
	    //attributes.put("contextName", appContext.getServletContext().getServletContextName());
	    //String webRoot = appContext.getServletContext().getRealPath("/") + "/";
	    //attributes.put("sysPath",webRoot);
	    //System.setProperty("logDir",webRoot + "WEB-INF/logs/");
	}
	
	public void setAttributes(Map<String,String> attributes){
		SysConfigHelper.attributes = attributes;
	}
		
	public static Object getBean(String name){
        return appContext.getBean(name);
	}	
	
	public static String getAttribute(String key){
		return attributes.get(key);
	}

	public static String getHelp(String helpID){
		return helps.get(helpID);
	}
	
	public static XmlWebApplicationContext getAppContext(){
        return appContext;
	}
}