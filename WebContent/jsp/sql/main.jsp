<%@page language="java" contentType="text/html; charset=UTF-8"%>

<!DOCTYPE html>
<html>
<head>
	<title>连接中心</title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/bootstrap/css/bootstrap.min.css" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/bootstrap/css/font-awesome.css" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/jquery-easyui/themes/black/easyui.css" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/sql/css/sql.css" />
</head>
<body>
	<div id="body_message_wrap_init" class="body_message_wrap"><div class="body_message_box"><div class="body_message_content"><i class="body_message_icon"></i><span class="body_message_text">正在初始化，请稍后。。。</span></div></div></div>
	<div class="body_layout">
	<div region="south" class="body_layout_south">
		<div>当前数据库:<span id="database_select" class="database_select">未选中数据库</span></div>
	</div>
	<div region="west" split="true" style="width:260px;border-top-width:0;"><ul class="easyui-tree dataBaseTree" ></ul></div>
	<div region="north" class="menu_tool">
	    <a id="menu_top_file" class="easyui-menubutton" data-options="menu:'#menu_down_file'">文件</a>
	    <a id="menu_top_tool" class="easyui-menubutton">工具</a>
	    <a id="menu_top_help" class="easyui-menubutton">帮助</a>
	</div>
	
	<!-- <div region="east" title="数据库" split="true" style="width:180px;"></div> -->
	<div region="center" style="overflow:hidden;border-top-width:0;">
		<div id="sql_tabs" class="easyui-tabs" border="false" fit="true">  
		    <div class="sql_table_data" title="列表展示" style="padding:5px;">
		    	<div class="msg_tip"></div>
				<div class="result_table"></div>
		    </div>  
		    <div title="命令提示行" style="overflow:auto;">  
        		<div class="easyui-layout" fit="true" >
			    	<div region="north" split="true" class="sql_tabs_cmd">
						<div class="cmd_toolBar">
							<a class="easyui-linkbutton" plain="true" iconCls="icon-play" id="btn_run">&nbsp;运行</a>
							<select id="selectTableType" class="easyui-combobox" data-options="panelHeight:'auto'">
								<option value="executeSql">自动判断</option>
								<option value="executeSqlQuery">查询executeQuery</option>
								<option value="executeSqlUpdate">更新executeUpdate</option>
							</select>
						</div>
			    		<textarea id="sql_text" class="sql_text" rows="0" cols="0">select * from um_usercourse</textarea>
			    	</div>
					<div region="center" border="false" class="exe_result_list">
						<div class="msg_tip"></div>
						<div class="result_table"></div>
					</div>
				</div>
		    </div>  
		</div>
	</div>
	</div>
	
	<div id="base_data" class="hidden">
		<!-- 菜单-文件 -->
		<div id="menu_down_file">
		    <div data-options="iconCls:'icon-plus'" id="menu_down_connection">新建连接</div>
		    <div class="menu-sep"></div>
		    <div>导入SQL文件</div>
		    <div>导出Excel</div>
		    <div class="menu-sep"></div>
		    <div>注销</div>
	    </div>
	    
		<!-- 菜单-文件 -创建新连接按钮 -->
		<div id="window_create_connection" class="window_create_connection" title="创建新连接" 
			 data-options="iconCls:'icon-retweet',closed:true,collapsible:false,maximizable:false,minimizable:false,resizable:false" >
			<table class="edit_table">
				<tr>
					<td class="tdLabel">数据库类型:</td>
					<td>MYSQL</td>
				</tr>
				<tr>
					<td class="tdLabel">IP:</td>
					<td><input id="input_con_ip" class="easyui-validatebox" type="text"></input></td>
				</tr>
				<tr>
					<td class="tdLabel">端口:</td>
					<td><input id="input_con_port" class="easyui-validatebox" type="text"></input></td>
				</tr>
				<tr>
					<td class="tdLabel">数据库名:</td>
					<td><input id="input_con_database" class="easyui-validatebox" type="text"></input></td>
				</tr>
				<tr>
					<td class="tdLabel">字符编码:</td>
					<td>
						<select id="input_con_charset" class="easyui-combobox" data-options="panelHeight:'auto',editable:false">
							<option value="GBK">GBK</option>
							<option value="UTF-8">UTF-8</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class="tdLabel">登录名:</td>
					<td><input id="input_con_user" class="easyui-validatebox" type="text"></input></td>
				</tr>
				<tr>
					<td class="tdLabel">口令:</td>
					<td><input id="input_con_password" class="easyui-validatebox" type="password"></input></td>
				</tr>
				<tr>
					<td colspan="2" class="text-center">
						<a id="bt_login_in" class="easyui-linkbutton">连接</a>
						<a id="bt_login_cancel" class="easyui-linkbutton">取消</a>
						<a id="bt_login_test" class="easyui-linkbutton">测试连接</a>
					</td>
				</tr>
			</table>
		</div>
		
		<!-- 树节点-数据库-点击右键菜单 -->
		<div id="context_database" class="easyui-menu">
		<div iconCls="icon-plus-sign" class="context_table_create">创建表</div>
	        <div iconCls="icon-repeat" id="context_database_reload">刷新</div>
	    </div>
	    
		<!-- 树节点-数据表-点击右键菜单 -->
		<div id="context_table" class="easyui-menu">
	        <div iconCls="icon-plus-sign" class="context_table_create">创建表</div>
	        <div iconCls="icon-search" id="context_table_open">打开表</div>
	        <div iconCls="icon-edit" id="context_table_edit">修改表</div>
	        <div iconCls="icon-list-alt" id="context_table_select">查看表结构</div>
	        <div iconCls="icon-trash" id="context_table_delete">删除表</div>
	        <div iconCls="icon-exchange" id="context_table_rename">重命名</div>
	        <div class="menu-sep"></div>
	        <div iconCls="icon-repeat" id="context_table_reload">刷新</div>
	    </div>
	</div>
</body>
</html>
<script charset="utf-8" src="../js/sea-debug.js"></script>
<script charset="utf-8" src="../js/plugins/sql/js/config.js"></script>
