package com.jspjs.framework.util;

import com.jspjs.framework.jdbc.BaseAction;

public class AjaxAction extends BaseAction{
	public static final String JSON = "json";
	
	protected AjaxUtil ajaxUtil=new AjaxUtil();
	
	public AjaxUtil getAjaxUtil() {
		return ajaxUtil;
	}

	public void setAjaxUtil(AjaxUtil ajaxUtil) {
		this.ajaxUtil = ajaxUtil;
	}

}
