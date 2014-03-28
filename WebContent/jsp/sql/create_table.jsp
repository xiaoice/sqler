<%@page language="java" contentType="text/html; charset=UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>连接中心</title>
	<%@include file="/jsp/common/head.jsp"%>
	<link rel="stylesheet" href="js/plugins/message/message.css" type="text/css"></link>
	<link type="text/css" href="js/plugins/conn/css/conn.css" rel="stylesheet" />
	<script type="text/javascript" src="js/plugins/message/message.js"></script>
	<script type='text/javascript' src='${base}dwr/engine.js'></script>
	<script type='text/javascript' src='${base}dwr/util.js'></script>
	<script type='text/javascript' src='${base}dwr/interface/Conn.js'></script>
</head>
<body>
	<div class="create_table">
		<div class="create_table_name">当前表名：<input id="table_name" type="text"/></div>
	    <table class="edit_table" cellpadding="1" cellspacing="1">
		    <thead>
		    	<tr>
		    		<th width="28">序号</th>
		    		<th width="120">名称</th>
		    		<th width="130" align="left">类型</th>
		    		<th width="50">大小</th>
		    		<th width="70">默认值</th>
		    		<th width="40">可为空</th>
		    		<th width="32">操作</th>
		    	</tr>
		    </thead>
		    <tbody id="create_tbody"></tbody>
	    </table>
    	<div class="tool_warp" style="position:absolute; position: fixed;bottom: 5px;right: 5px;">
			<a class="easyui-linkbutton" plain="true" iconCls="icon-add" id="input_add">增加</a>
			<a class="easyui-linkbutton" plain="true" iconCls="icon-tip" id="input_sql">预览</a>
			<a class="easyui-linkbutton" plain="true" iconCls="icon-save" id="input_save">保存</a>
			<a class="easyui-linkbutton" plain="true" iconCls="icon-cancel" id="input_cancel">关闭</a>
			<%--<a href="${base}/bzg/it.do?action=index" plain="true" class="easyui-linkbutton" iconCls="icon-back" >返回</a>--%>
		</div>
	</div>
	
	<div class="sql_preview">
		<span class="close" onclick='$(".sql_preview").hide()'>关闭</span>
		<textarea id="sql_text" rows="0" cols="0"></textarea>
	</div>
 	
</body>
</html>

<script type="text/javascript">
	//数据类型
	var fieldType = [
	   {productid:'VARCHAR',name:'VARCHAR'},
	   {productid:'CHAR',name:'CHAR'},
	   {productid:'BIT',name:'BIT'},
	   {productid:'INTEGER',name:'INTEGER'},
	   {productid:'DOUBLE',name:'DOUBLE'},
	   {productid:'FLOAT',name:'FLOAT'},
	   {productid:'DECIMAL',name:'DECIMAL'},
	   {productid:'DATA',name:'DATA'},
	   {productid:'TIME',name:'TIME'},
	   {productid:'TIMESTAMP',name:'TIMESTAMP'},
	   {productid:'BLOB',name:'BLOB'},
	   {productid:'CLOB',name:'CLOB'},
	   {productid:'BIGINT',name:'BIGINT'},
	   {productid:'SMALLINT',name:'SMALLINT'},
	   {productid:'BINARY',name:'BINARY'},
	   {productid:'LONGVARBINARY',name:'LONGVARBINARY'},
	   {productid:'LONGVARCHAR',name:'LONGVARCHAR'},
	   {productid:'NULL',name:'NULL'},
	   {productid:'NUMERIC',name:'NUMERIC'},
	   {productid:'OTHER',name:'OTHER'},
	   {productid:'REAL',name:'REAL'},
	   {productid:'TINYINT',name:'TINYINT'},
	   {productid:'VARBINARY',name:'VARBINARY'},
	   {productid:'REAL',name:'REAL'},
	   {productid:'XML',name:'XML'}
	];
	var service={
		getTr:function(){
			var index=$("#create_tbody tr").size();
			var tr="";
	    	tr+='<tr>';
	    	tr+='<td class="td_index">'+(index+1)+'</td>';
    		tr+='<td><input class="name" type="text"/></td>';
    		tr+='<td><span class="type"></span></td>';
    		tr+='<td><input type="text"/></td>';
    		tr+='<td><input type="text"/></td>';
    		tr+='<td><input type="checkbox" value="true" checked="checked" /></td>';
    		tr+='<td><a href="javascript:;" class="icon-remove icon" alt="删除"></a></td>';
	    	tr+='</tr>';
	    	return tr;
		},
		//添加一行
		addTr:function(){
			var tr=$(service.getTr());
			tr.appendTo($("#create_tbody"));
			service.bindType(tr.find('.type'));
		},
		removeTr:function(){
			$(this).parents("tr").remove();
			$(".td_index").each(function(i){
				$(this).html(i+1);
			});
		},
		//点击tr触发事件
		clickTr:function(){
			var that=$(this);
			if(that.hasClass("bhover")){
				$(this).removeClass("bhover");
			}
			else{
				$(this).addClass("bhover");
			}
		},
		checkText:function(){
			var isOk=true;
			$(".warned,.table_name").removeClass("warned");
			if($("#table_name").val()==""){
				$("#table_name").addClass("warned");
				var isOk=false;
			}
			$("#create_tbody tr").each(function(i){
				var text=$(this).find(":text");
				var name=text.eq(0).val();
				var type=text.eq(1).val();
				if(name==""){
					text.eq(0).addClass("warned");
					isOk=false;
				}
				if(type==""){
					$(this).find(".combo").addClass("warned");
					isOk=false;
				}
			});
			return isOk;
		},
		//获取sql代码
		getSql:function(){
			var table_name=$("#table_name").val();
			var sql="CREATE TABLE ADMINISTRATOR."+table_name+" ( \r\t";
			var length=$("#create_tbody tr").size();
			$("#create_tbody tr").each(function(i){
				var that=$(this);
				var text=that.find(":text");
				var name=text.eq(0).val();
				var type=text.eq(1).val();
				var size=text.eq(2).val();
				var def=text.eq(3).val();
				var nullable=that.find("input:checked").val()=="true"?"":"NOT NULL ";
				
				sql+=name+" "+type+" ";
				sql+=size!=""?"("+size+") ":"";
				sql+=nullable;
				sql+=def!=""?"DEFAULT "+def+" ":"";
				sql+=i==length-1?" \r)":", \r\t";
			});
			return sql;
		},
		//预览sql
		sqlPreview:function(){
			if(service.checkText()){
				$("#sql_text").val(service.getSql());
				$(".sql_preview").show();
			}
		},
		//保存sql
		sqlSave:function(){
			if(service.checkText()){
				var sql=service.getSql();
			    //var input =DWRUtil.getValue("user");
				//DWRUtil.setValue("result",str);
			    Conn.runSql(sql,function(result){
				    if(typeof result=="object"){
				    	if(result.recode==1){
				    		message.ok("创建表成功！");
				    		service.sqlClose();
				    	}else{
				    		message.error("创建表失败！");
				    	}
				    }else{
				    	message.stop("操作异常，程序已经停止");
				    }
				});
			}
		},
		sqlClose:function(){
			parent&&parent.close&&parent.close();
			location.reload();
		},
		bindType:function(target){
			$(target).combobox({  
		    	data:fieldType,  
		        valueField:'productid',  
		        textField:'name',
		        width:"120",
		        onSelect:function(record){
		        	if(record.name!=""){
		        		$(this).next().removeClass("warned");
		        	}
		        }
		    });
		},
		//绑定事件
		bindDom:function(){
			$("#input_add").bind("click",service.addTr);
			$("#input_sql").live("click",service.sqlPreview);
			$("#input_save").live("click",service.sqlSave);
			$("#input_cancel").live("click",service.sqlClose);
			$("#create_tbody tr").live("click",service.clickTr);
			$(".icon-remove").live("click",service.removeTr);
			
			$(".name,#table_name").live("change",function(){
				if($(this).val!=""){
					$(this).removeClass("warned");
				}
			});
			
		    //解决3.x版本DWRUtil未定义问题
		    if (typeof window['DWRUtil'] == 'undefined'){
		        window.DWRUtil = dwr.util;
		    }
		}
	};
	
	
	$(function(){
		service.bindDom();
	});
</script>