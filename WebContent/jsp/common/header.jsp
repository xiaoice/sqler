<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div class="row">
  	<div class="col-md-12">
		<nav class="navbar navbar-default" role="navigation">
		  <div class="navbar-header">
		    <a class="navbar-brand" href="${base}">JSPJS</a>
		  </div>
		
		  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		    <form class="navbar-form navbar-left" role="search">
		      <div class="form-group">
		        <input type="text" class="form-control" placeholder="搜索好友">
		      </div>
		      <button type="submit" class="btn btn-default">搜索</button>
		    </form>
		    <ul class="nav navbar-nav navbar-right">
		    <s:if test="#session.user!=null">
		      <li><a class="small" href="${base}user/index.action"><b>个人中心</b></a></li>
		      <li><a href="${base}user/user_userinfo.action"><b>${user.username}</b></a></li>
		      <li><a href="${base}logout.action">注销</a></li>
		    </s:if>
		    <s:else>
		      <li><a href="${base}reg.action"><button type="button" class="btn btn-default btn-sm">马上注册</button></a></li>
		      <li><a href="${base}login.action"><button type="button" class="btn btn-default btn-sm">立即登录</button></a></li>
		    </s:else>
		    </ul>
		  </div>
		</nav>
	</div>
</div>