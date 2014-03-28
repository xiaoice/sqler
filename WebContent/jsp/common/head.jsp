<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%--<%@ taglib prefix="s" uri="/struts-tags"%>--%>
<%
	String rootPath = request.getContextPath() + "/";
	request.setAttribute("base",rootPath);
	request.setAttribute("image",rootPath+"image/");
	request.setAttribute("css",rootPath+"css/");
	request.setAttribute("js",rootPath+"js/");
%>

<base href="${pageContext.request.scheme}${'://'}${pageContext.request.serverName}${':'}${pageContext.request.serverPort}${pageContext.request.contextPath}${'/'}" />
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<link rel="shortcut icon" href="jsp/logo.ico" type="image/x-icon" />
<link rel="stylesheet" type="text/css" href="js/plugins/jquery-easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="js/plugins/jquery-easyui/themes/icon.css">
<link type="text/css" href="css/main.css" rel="stylesheet" />
<script type="text/javascript" src="js/jquery.min.js?ver=1.10.2"></script>
<script type="text/javascript" src="js/plugins/jquery-easyui/jquery.easyui.min.js"></script>

<!--[if lt IE 9]>
	<script type="text/javascript" src="js/json2.js"></script>
<![endif]-->


