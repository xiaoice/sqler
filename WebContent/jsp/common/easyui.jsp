<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%
	String rootPath = request.getContextPath() + "/";
	request.setAttribute("base",rootPath);
	request.setAttribute("image",rootPath+"image/");
	request.setAttribute("css",rootPath+"css/");
	request.setAttribute("js",rootPath+"js/");
%>
<base href="${pageContext.request.scheme}${'://'}${pageContext.request.serverName}${':'}${pageContext.request.serverPort}${pageContext.request.contextPath}${'/'}" />
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="${base}js/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="${base}js/plugins/jquery-easyui/themes/black/easyui.css" rel="stylesheet" type="text/css">
<link href="${base}js/plugins/bootstrap/css/font-awesome.css" rel="stylesheet">
<link href="${base}css/jspjs.css" rel="stylesheet" media="screen">
<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->
<!--[if lt IE 9]>
	<script type="text/javascript" src="js/json2.js"></script>
<![endif]-->
<script type="text/javascript" src="${base}js/jquery.min.js?ver=1.10.2"></script>
<script src="${base}js/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="${base}js/plugins/jquery-easyui/jquery.easyui.min.js"></script>
<script>
var isLogin="${tip}";
if(isLogin!=""){
	//console.log(isLogin);
	alert(isLogin);
}
</script>

