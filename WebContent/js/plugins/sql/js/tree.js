/**
 * 数据表组件
 * 曾小斌
 * 2014-01-01 00:00:23
 */

define(function(require,exports,module){
	var sql=require("sql"),login=require("login"),util=require("util"),message=util.message;
	var $document=$(document),databaseSelect=$("#database_select"),target=$('.dataBaseTree');
	var editIndex = undefined; //当前编辑的行索引
	var dialog=undefined,datagrid=undefined,dialogUtil={},loginUtil={};
	module.exports.init=function(callback){
		dialogInit();
		//绑定数据到到左侧树上
		target.tree({
			checkbox: false,
			lines:true,
			url: 'sql/getDatabases.action',
			onBeforeLoad:function(node){
				message.wait("正在加载数据，请稍后");
			}, 
			loadFilter: function(data){
				if (data.data){
					return data.data;
				} else {
					return data;
				}
			},
			onDblClick:function(node){
				if(node.type=="table"){
					sql.selectTable($(".sql_table_data"),node.text);
				}
			},
			onContextMenu:function(e,node){
				target.tree("select", node.target);
				e.preventDefault();
				if(node.type=="database"){
					$('#context_database').menu('show', {
			    		left: e.pageX,
			    		top: e.pageY
			    	});
				}
				else if(node.type=="table"){
					$('#context_table').menu('show', {
			    		left: e.pageX,
			    		top: e.pageY
			    	});
				}
				return false;
			},
			onLoadSuccess:function(node, data){
				message.hide();
				callback&&callback();
			},
			onBeforeExpand:function(node){
				target.tree("select", node.target);
				if(node.iconCls==="icon-desktop"){
					return !!loginUtil[node.name];
				}
			},
			onBeforeSelect:function(node){
				//$("#input_con_database").val(node.text);
				if(databaseSelect.html()!=node.text&&node.type=="database"){
					login.loginDatabase(function(){
						message.ok("成功切换到数据库【"+node.text+"】",0.5);
						databaseSelect.html(node.text);
						loginUtil[node.name]=true;
						target.tree("expand",node.target);
					});
				}else if(node.type=="table"){
					$("#database_select").html(node.id.split("—")[0]);
				}
			},
			onAfterEdit:function(node){
				if(node.name!=node.text){
					if(node.type=="database"){
						//TODO
					}
					else if(node.type=="table"){
						var _sql="alter table "+node.name+" rename to "+node.text;
						sql.executeSqlUpdate(_sql,function(result){
							//若重命名失败，刷新还原恢复
							if(result.recode==0){
								message.error("重命名失败！");
								reloadTable();
							}
						});
					}
				}
			},formatter:function(node){
				if(node.iconCls==="icon-th-list"||node.iconCls==="icon-key"){
					var Null=node.text.indexOf(", Nullable")!==-1?"":", not null";
					node.text=node.text.replace(", Nullable","")+Null;
				}
				return node.text;
			}
		});
		
		bindDomEvent();
	};
	
	//弹出框初始化
	function dialogInit(){
		//创建表弹出框初始化
		if($("#dialog_create_table").size()==0){
			dialogUtil.dialog_create=$("<div id=\"dialog_create_table\" class=\"dialog_edit_table\">").appendTo($("#base_data"));
		}
		if($("#datagrid_create_table").size()==0){
			dialogUtil.datagrid_create=$("<span id=\"datagrid_create_table\"></span>").appendTo(dialogUtil.dialog_create);
		}
		//修改表弹出框初始化
		if($("#dialog_edit_table").size()==0){
			dialogUtil.dialog_edit=$("<div id=\"dialog_edit_table\" class=\"dialog_edit_table\">").appendTo($("#base_data"));
		}
		if($("#datagrid_edit_table").size()==0){
			dialogUtil.datagrid_edit=$("<span id=\"datagrid_edit_table\"></span>").appendTo(dialogUtil.dialog_edit);
		}
		
		//查看表结构弹出框初始化
		if($("#dialog_selete_table").size()==0){
			dialogUtil.dialog_select=$("<div id=\"dialog_selete_table\" class=\"dialog_select_table\">").appendTo($("#base_data"));
		}
		if($("#datagrid_selete_table").size()==0){
			dialogUtil.datagrid_select=$("<span id=\"datagrid_selete_table\"></span>").appendTo(dialogUtil.dialog_select);
		}
	}
	
	//绑定事件
	function bindDomEvent(){
		//初始化【创建表】弹出框
		dialogUtil.dialog_create.dialog({
		    title: '创建表',
		    cache: false,
		    modal: true,
		    iconCls:'icon-plus-sign',
		    closed:true,
		    collapsible:false,
		    maximizable:false,
		    minimizable:false,
		    resizable:false,
		    width:'1000',
		    height:$("body").height()-30,
		    toolbar:[{
					text:'<i class="icon-plus"></i> 增加',
					id:"dialog_create_add",
					group:"dialog_create_group",
					handler:appendRow
				},'-',{
					text:'<i class="icon-trash"></i> 删除',
					id:"dialog_create_del",
					group:"dialog_create_group",
					handler:deleteRow
				},'-',{
					text:'<i class="icon-eye-close"></i> 关闭预览',
					id:"dialog_create_panel_sql_close",
					group:"dialog_create_group",
					handler:function(){
						dialogUtil.dialog_create_panel_sql.hide();
						dialogUtil.dialog_create_panel_sql_close.hide();
						dialogUtil.dialog_create.find(".dialog-toolbar td:lt(4)").show();
					}
				},{
					id:"dialog_create_tablename",
					group:"dialog_create_group",
					handler:function(){}
				}
			],
			buttons:[{
				text:'<i class="icon-eye-open"></i> 预览Sql',
				handler:createTablePreview
			},{
				text:'<i class="icon-save"></i> 保存',
				handler:createTableSave
			},{
				text:'<i class="icon-remove"></i> 关闭',
				handler:function(){dialogUtil.dialog_create.window('close');}
			}],
			onBeforeOpen:function(){
				if(dialogUtil.dialog_create_panel_sql==undefined){
					dialogUtil.dialog_create.find(".panel:first").css("position","relative").append("<div class=\"dialog_create_panel_sql\" readonly=\"true\"></div>");
					dialogUtil.dialog_create_panel_sql=dialogUtil.dialog_create.find(".dialog_create_panel_sql");
					dialogUtil.dialog_create_panel_sql_close=$("#dialog_create_panel_sql_close");
					$("#dialog_create_tablename").removeAttr("class").removeAttr("href").addClass("dialog_create_tablename").html("新建表名：<span><input id=\"dialog_create_tablename_input\" class=\"dialog_create_tablename_input\" type=\"text\"></span>");
				}else{
					dialogUtil.dialog_create_panel_sql.hide();
				}
				dialogUtil.dialog_create_panel_sql_close.hide();
			},
			onClose:function(){
				$("#dialog_create_tablename_input").val("");
				dialogUtil.datagrid_create.datagrid('loadData', { total: 0, rows: []});
				dialogUtil.dialog_create.find(".dialog-toolbar td:lt(4)").show();
				reloadTable();
			}
		});
		
		//初始化【修改表】弹出框
		dialogUtil.dialog_edit.dialog({
			title: '修改表结构',
			cache: false,
			modal: true,
			iconCls:'icon-edit',
			closed:true,
			collapsible:false,
			maximizable:false,
			minimizable:false,
			resizable:false,
			width:'1000',
			height:$("body").height()-30,
			toolbar:[{
				text:'<i class="icon-plus"></i> 增加',
				handler:appendRow
				},'-',{
					text:'<i class="icon-trash"></i> 删除',
					handler:deleteRow
				},'-',{
					text:'<i class="icon-eye-close"></i> 关闭预览',
					id:"dialog_edit_panel_sql_close",
					group:"dialog_edit_group",
					handler:function(){
						dialogUtil.dialog_edit_panel_sql.hide();
						dialogUtil.dialog_edit_panel_sql_close.hide();
						dialogUtil.dialog_edit.find(".dialog-toolbar td:lt(4)").show();
					}
				}
			],
			buttons:[{
				text:'<i class="icon-eye-open"></i> 预览Sql',
				handler:alterTablePreview
			},{
				text:'<i class="icon-save"></i> 保存',
				handler:editTableSave
			},{
				text:'<i class="icon-remove"></i> 关闭',
				handler:function(){dialogUtil.dialog_edit.window('close');}
			}],
			onBeforeOpen:function(){
				if(dialogUtil.dialog_edit_panel_sql==undefined){
					dialogUtil.dialog_edit.find(".panel:first").css("position","relative").append("<div class=\"dialog_edit_panel_sql\" readonly=\"true\"></div>");
					dialogUtil.dialog_edit_panel_sql=dialogUtil.dialog_edit.find(".dialog_edit_panel_sql");
					dialogUtil.dialog_edit_panel_sql_close=$("#dialog_edit_panel_sql_close");
				}else{
					dialogUtil.dialog_edit_panel_sql.hide();
				}
				dialogUtil.dialog_edit_panel_sql_close.hide();
			},
			onClose:function(){
				//清空更新数据缓存
		    	datagrid.data("datagrid")._updatedRows=[];
				datagrid.datagrid("rejectChanges");
				dialogUtil.dialog_edit.find(".dialog-toolbar td:lt(4)").show();
				reloadTable();
			}
		});
		
		//初始化【查看表结构】弹出框
		dialogUtil.dialog_select.dialog({
		    title: '查看表结构',
		    cache: false,
		    modal: true,
		    iconCls:'icon-list-alt',
		    closed:true,
		    collapsible:false,
		    maximizable:false,
		    minimizable:false,
		    resizable:false,
		    width:'1000',
		    height:$("body").height()-30,
			buttons:[{
				text:'<i class="icon-remove"></i> 关闭',
				handler:function(){dialogUtil.dialog_select.window('close');}
			}]
		});
	}
	
	//根据原始数据删除数组中指定的数据
	function deleteByOriginalRow(rows,originalRow){
		var _rows=$.extend([],rows);
		for(var i=0,j=_rows.length;i<j;i++){
			var dataRow=_rows[i];
			if(equals(dataRow.originalRow,originalRow)){
				rows.splice(i,1);
			}
		}
	}
	
	//格式化工具
	var formatUtil={
		//是否自增
		Extra:function(val){
			return val=="auto_increment"?"<i class=\"icon-ok\"></i>":val;
		},
		//是否为空
		Null:function(val){
			return val=="YES"?"<i class=\"icon-ok\"></i>":(val=="NO"?"":val);
		},
		//是否主键
		Key:function(val){
			return val=="PRI"?"<i class=\"icon-ok\"></i>":(val=="UNI"?"":val);
		},
		//键约束
		Key1:function(val){
			return val=="PRI"?"主键":(val=="UNI"?"唯一":val);
		},
		//格式化空对象
		formatEmpty:function(value){
			if(typeof value =="object" && $.isEmptyObject(value)){
				return '';
			}else{
				return value;
			}
		}
	};
	
	//编辑器工具
	var editorUtil={
		//字段名
		Field:{
			type:'textbox',
            options:{
            	required:true,
            	missingMessage:"请输入字段名称"
            }
		},
		//字段类型
		Type:{
			type:'combobox',
            options:{
                valueField: 'value',
        		textField: 'text',
        		height:24,
         		panelHeight:"auto",
        		data: [
        		    {value: 'int',text: 'int'},
        		    {value: 'varchar(32)',text: 'varchar(32)'},
        		    {value: 'text',text: 'text'},
        		    {value: 'blob',text: 'blob'},
        		    {value: 'timestamp',text: 'timestamp'},
        		    {value: 'datetime',text: 'datetime'},
        		    {value: 'char(32)',text: 'char(32)'},
        		    {value: 'float',text: 'float'},
        		    {value: 'double',text: 'double'},
        		    {value: 'bit',text: 'bit'}
        		],
                required:true,
                missingMessage:"请输入字段类型"
            }
		},
		//键约束
		Keys:{
			type:'combobox',
            options:{
                valueField: 'value',
        		textField: 'text',
        		height:24,
        		panelHeight:"auto",
        		data: [
        		    {value: '',text: '自定义'},
        		    {value: 'PRI',text: '主键'},
        		    {value: 'UNI',text: '唯一'}
        		]
            }
		},
		//主键
		Key:{
			type:'checkbox',
			options:{on: "PRI",off:""}
		},
		//复选框
		Null:{
			type:'checkbox',
			options:{on: "YES",off:"NO"}
		},
		//是否自增
		Extra:{
			type:'checkbox',
			options:{on: "auto_increment",off:""}
		},
		//允许为null
		comboboxNull:{
			type:'combobox',
            options:{
                valueField: 'value',
        		textField: 'text',
        		height:24,
        		panelHeight:"auto",
        		data: [
        		    {value: '',text: '自定义'},
        		    {value: 'null',text: 'null'}
        		]
            }
		},
	};
	
	//结束编辑状态
	function endEditing(){
		if (editIndex == undefined){return true;}
		if (datagrid.datagrid('validateRow', editIndex)){
			datagrid.datagrid('endEdit', editIndex);
			editIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	
	//修改行
	function editRow(rowIndex){
		if(endEditing()){
			datagrid.datagrid('endEdit', editIndex);
			datagrid.datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
			editIndex=rowIndex;
		}else{
			datagrid.datagrid('selectRow', editIndex);
		}
	}
	
	//增加行
	function appendRow(rowIndex){
		if(endEditing()){
			var rowCount = datagrid.datagrid('getRows').length;
			datagrid.datagrid('endEdit', editIndex);
			datagrid.datagrid("appendRow", {Field:"",Type:"",Extra:"",Null:"YES",Collation:"",Key:"",Privileges:"",Default:"",Comment:""});
			datagrid.datagrid('selectRow', rowCount).datagrid('beginEdit', rowCount);
			editIndex=rowCount;
			dialogUtil.dialog_edit.find(".panel-body").scrollTop(9999);
		}
	}
	
	//删除行
	function deleteRow(){
		var rowData=datagrid.datagrid('getSelected');
		if(rowData!=null){
			datagrid.datagrid('deleteRow', datagrid.datagrid('getRowIndex',rowData));
		}else{
			message.error("请先选中要删除的行");
		}
	}
	
	//数据表-验证sql
	function createTableValidator(){
		datagrid.datagrid('unselectAll');
		var tablename=$("#dialog_create_tablename_input").val();
		if(tablename==""){
			message.error("请输入表名！");
		}
		else if(datagrid.datagrid('getRows').length==0){
			message.error("请添加数据列！");
		}
		else if(!endEditing()){
			message.error("数据列验证未通过，请检查并修改！");
		}else{
			return true;
		}
		return false;
	}
	
	//数据表-生成SQL
	function createTableSql(){
		var rows = datagrid.datagrid('getChanges');
		var tablename=$("#dialog_create_tablename_input").val();
		var sqls=[],primaryKeys=[];
		for(var i in rows){
			var row=rows[i];
			var Field="\r\t<span class=\"Field\">"+row.Field+"</span>";
			var Type="<span class=\"Type\"> "+row.Type+"</span>";
			var Null=row.Null=='YES'?"":"<span class=\"Null\"> NOT NULL</span>";
			var Extra=row.Extra=='auto_increment'?"<span class=\"Extra\"> AUTO_INCREMENT</span>":"";
			var Default="<span class=\"Default\"> DEFAULT</span> '"+row.Default+"'";
			var Comment="<span class=\"Comment\"> COMMENT</span> '"+row.Comment+"'";
			var sql=Field+Type;
			
			if(row.Key=="PRI"){
				primaryKeys.push(row.Field);
			}else{
				sql+=Null;
			}
			
			if(row.Extra!=""||$.isEmptyObject(row.Default)||row.Default==""){
				Default="";
			}
			
			sql+=Extra+Default+row.Comment!=""?Comment:"";
			sqls.push(sql);
		}
		if(primaryKeys.length>0){
			sqls.push("\r\t<span class=\"Key\">PRIMARY KEY </span>("+primaryKeys.join(",")+")");
		}
		return "<span class=\"Type\">CREATE TABLE </span>"+tablename+"(<br>"+sqls.join(",<br>")+"<br><span>\r)<span>";
	}
	
	//新建表-预览SQL
	function createTablePreview(){
		if(createTableValidator()){
			var sql_table = createTableSql();
			dialogUtil.dialog_create_panel_sql.html(sql_table).show();
			dialogUtil.dialog_create_panel_sql_close.show();
			dialogUtil.dialog_create.find(".dialog-toolbar td:lt(4)").hide();
		}
	}
	
	//新建表-保存数据表
	function createTableSave(){
		if(createTableValidator()){
			var sql_table = createTableSql(),_sql=$(sql_table).text();
			sql.executeSqlUpdate(_sql,function(result){
				var tablename=$("#dialog_create_tablename_input").val();
				if(result.recode==1){
					message.ok("创建表【"+tablename+"】成功！",function(){
						dialogUtil.dialog_create.window('close');
					});
				}else{
					dialogUtil.dialog_create_panel_sql.html(result.message).show();
					dialogUtil.dialog_create_panel_sql_close.show();
					message.error("创建表【"+tablename+"】失败！");
				}
			});
		}
	}
	
	//修改表-验证sql
	function editTableValidator(){
		datagrid.datagrid('unselectAll');
		if(datagrid.datagrid('getRows').length==0){
			message.error("无法保存，请最少添加一行数据列！");
		}
		else if(!endEditing()){
			message.error("数据列验证未通过，请检查并修改！");
		}else{
			return true;
		}
		return false;
	}
	
	//修改表-生成SQL
	function alterTableSql(){
		var tablename=target.tree("getSelected").name;
		var deleteArray=datagrid.datagrid("getChanges","deleted");
		var updateArray=datagrid.datagrid("getChanges","updated");
		var _updatedRows = datagrid.data("datagrid")._updatedRows||[];
		var insertArray=datagrid.datagrid("getChanges","inserted");
		var deleteFields=[],insertFields=[],updateFields=[],originalFields=[],sqls=[];
		
		//原始数据的字段集合
    	var originalRows=datagrid.data("datagrid").originalRows;
    	for(var i=0,j=originalRows.length;i<j;i++){
    		var Field=originalRows[i].Field;
    		if(originalFields.indexOf(Field)==-1){
    			originalFields.push(Field);
			}
    	}
		
		//获取预【delete】的字段集合
		for(var i=0,j=deleteArray.length;i<j;i++){
			var Field=deleteArray[i].Field;
			if(originalFields.indexOf(Field)!=-1||deleteFields.indexOf(Field)==-1){
				deleteFields.push(Field);
			}
		}
		
		//获取预【insert】的字段集合
		for(var i=0,j=insertArray.length;i<j;i++){
			var Field=insertArray[i].Field;
			if(insertFields.indexOf(Field)==-1){
				insertFields.push(Field);
			}
		}
		
		//获取预【update】的字段集合
		for(var i=0,j=_updatedRows.length;i<j;i++){
			var Field=_updatedRows[i].originalRow.Field;
			if(updateFields.indexOf(Field)==-1){
				updateFields.push(Field);
			}
		}
		
		//获取【delete】的sql
		for(var i=0,j=deleteArray.length;i<j;i++){
			var row=deleteArray[i];
			var Field="<span class=\"Field\"> "+row.Field+"</span>";
			
			//若原始数据存在这个字段，则允许删除
			if(originalFields.indexOf(row.Field)!=-1){
				sqls.push("DROP COLUMN"+Field);
			}
		}
		
		//获取【insert】的sql
		for(var i=0,j=insertArray.length;i<j;i++){
			var row=insertArray[i];
			var Field="<span class=\"Field\"> "+row.Field+"</span>";
			var Type="<span class=\"Type\"> "+row.Type+"</span>";
			var Null=row.Null=='YES'?"":"<span class=\"Null\"> NOT NULL</span>";
			var Extra=row.Extra=='auto_increment'?"<span class=\"Extra\"> AUTO_INCREMENT</span>":"";
			var Key=row.Key=='PRI'?"<span class=\"Key\"> PRIMARY KEY</span>":"";
			var Default=row.Default==""?"":"<span class=\"Default\"> DEFAULT</span> '"+row.Default+"'";
			var Comment=row.Comment==""?"":"<span class=\"Comment\"> COMMENT</span> '"+row.Comment+"'";
			
			//若字段为自增字段，则不显示【默认值】
			if(Extra!=""||$.isEmptyObject(row.Default)){
				Default="";
			}
			
			//若原始数据不存在这个字段或者已经删除了这个字段
			if((originalFields.indexOf(row.Field)==-1||deleteArray.indexOf(row.Field)!=-1)){
				sqls.push("ADD COLUMN"+Field+Type+Null+Extra+Key+Default+Comment);
			}
		}
		
		//获取【update】的sql
		for(var i=0,j=_updatedRows.length;i<j;i++){
			//originalRow:原始数据，rowData:更新后的数据
			var originalRow=_updatedRows[i].originalRow,row=_updatedRows[i].rowData;
			if(equals(originalRow,row)||(deleteFields.indexOf(originalRow.Field)!=-1&&insertFields.indexOf(originalRow.Field)==-1)){
				continue;
			}
			var originalField="<span class=\"Field\"> "+originalRow.Field+"</span>";
			var Field="<span class=\"Field\"> "+row.Field+"</span>";
			var Type="<span class=\"Type\"> "+row.Type+"</span>";
			var Null=row.Null=='YES'?"":"<span class=\"Null\"> NOT NULL</span>";
			var Extra=row.Extra=='auto_increment'?"<span class=\"Extra\"> AUTO_INCREMENT</span>":"";
			var Key=row.Key=='PRI'?"<span class=\"Key\"> PRIMARY KEY</span>":"";
			var Default=row.Default==""?"":"<span class=\"Default\"> DEFAULT</span> '"+row.Default+"'";
			var Comment=row.Comment==""?"":"<span class=\"Comment\"> COMMENT</span> '"+row.Comment+"'";

			//若字段为自增字段，则不显示【默认值】
			if(Extra!=""||$.isEmptyObject(row.Default)){
				Default="";
			}
			
			//若未删除这个字段
			if(deleteArray.indexOf(originalRow.Field)==-1){
				sqls.push("CHANGE COLUMN"+originalField+Field+Type+Null+Extra+Key+Default+Comment);
			}
		}
		if(sqls.length==0){
			return "";
		}
		return "<span class=\"Type\">ALTER TABLE </span>"+tablename.toUpperCase()+" <br>"+sqls.join(",<br>")+"<span>\r;<span>";
	}
	
	//修改表-预览SQL
	function alterTablePreview(){
		if(editTableValidator()){
			var sql_table = alterTableSql();
			dialogUtil.dialog_edit_panel_sql.html(sql_table).show();
			dialogUtil.dialog_edit_panel_sql_close.show();
			dialogUtil.dialog_edit.find(".dialog-toolbar td:lt(4)").hide();
		}
	}
	
	
	//修改表-保存数据表
	function editTableSave(){
		if(editTableValidator()){
			var sql_table = alterTableSql(),_sql=$(sql_table).text();
			if(_sql==""){
				return message.stop("无法执行空语句！");
			}
			sql.executeSqlUpdate(_sql,function(result){
				var tablename=target.tree("getSelected").name;
				if(result.recode==1){
					message.ok("修改表【"+tablename+"】成功！",function(){
						dialogUtil.dialog_edit.window('close');
					});
					//清空缓存
					datagrid.data("datagrid")._updatedRows=[];
					datagrid.datagrid("acceptChanges");
				}else{
					dialogUtil.dialog_edit_panel_sql.html("<span class=\"error\"> "+result.message+"</span>").show();
					dialogUtil.dialog_edit_panel_sql_close.show();
					message.error("修改表【"+tablename+"】失败！",2);
				}
			});
		}
	}
	
	//刷新数据库
	function reloadDatabase(){
		target.tree("reload",target.tree("getSelected").target);
	}
	
	//刷新数据表
	function reloadTable(){
		target.tree("reload",target.tree("getSelected").target);
	}
	
	//右键-刷新数据库
	$document.on("click","#context_database_reload",reloadDatabase);
	
	//右键-刷新数据表
	$document.on("click","#context_table_reload",reloadTable);
	
	//右键-删除数据表
	$document.on("click","#context_table_delete",function(){
		var node=target.tree("getSelected");
		var _sql="drop table if exists "+node.text;
		$.messager.confirm('系统提示', '<i class="icon-question-sign messager_question"></i> 你确定要删除表【'+node.text+'】吗？', function(result){
			if (result){
				message.wait("正在删除数据表【"+node.text+"】");
				sql.executeSqlUpdate(_sql,function(result){
					if(result.recode==1){
						target.tree("remove",target.tree("getSelected").target);
						message.ok("删除表【"+node.text+"】成功！");
					}else{
						message.error("删除表【"+node.text+"】失败！");
					}
				});
			}
		});
	});
	
	//右键-重命名数据表
	$document.on("click","#context_table_rename",function(){
		target.tree("beginEdit",target.tree("getSelected").target);
	});
	
	//右键-打开表
	$document.on("click","#context_table_open",function(){
		var table=$(target.tree("getSelected").target).find(".tree-title").text();
		sql.selectTable($(".sql_table_data"),table);
	});
	
	//右键-创建表
	$document.on("click",".context_table_create",function(e){
		dialog=dialogUtil.dialog_create;
		datagrid=dialogUtil.datagrid_create;
		var treeTable=target.tree("getSelected");
		datagrid.datagrid({
			width:"100%",
			rownumbers:true,
			singleSelect:true,
			onClickRow: editRow,
	        columns:[[
		        //{checkbox:true,width:32},
		        {field:'Field',title:'字段名',width:150,editor:editorUtil.Field},
		        {field:'Type',title:'字段类型',width:110,align:"center",editor:editorUtil.Type},
		        {field:'Extra',title:'自增',width:100,align:"center",formatter:formatUtil.Extra,editor:editorUtil.Extra},
		        {field:'Null',title:'允许为空',width:60,align:"center",formatter:formatUtil.Null,editor:editorUtil.Null},
		        {field:'Collation',title:'Collation',width:100,align:"center",hidden:true},
		        {field:'Key',title:'主键',width:65,align:"center",formatter:formatUtil.Key,editor:editorUtil.Key},
		        {field:'Privileges',title:'权限',width:190,align:"center",hidden:true},
		        {field:'Default',title:'默认值',width:100,align:"center",formatter:formatUtil.formatEmpty,editor:'textbox'},
		        {field:'Comment',title:'注释',width:108,formatter:formatUtil.formatEmpty,editor:'textComment'}
	        ]]
	    });
		dialog.window("open");
	});
	
	//右键-修改表
	$document.on("click","#context_table_edit",function(e){
		dialog=dialogUtil.dialog_edit;
		datagrid=dialogUtil.datagrid_edit;
		datagrid.empty();
		var treeTable=target.tree("getSelected");
		var data=[];
		for(var i in treeTable.children){
			data.push(treeTable.children[i].attributes);
		}
		datagrid.datagrid({
			width:"100%",
			rownumbers:true,
			singleSelect:true,
			onClickRow: editRow,
			columns:[[
			    //{checkbox:true,width:32},
				{field:'Field',title:'字段名',width:150,editor:editorUtil.Field},
				{field:'Type',title:'字段类型',width:110,align:"center",editor:editorUtil.Type},
				{field:'Extra',title:'自增',width:100,align:"center",formatter:formatUtil.Extra,editor:editorUtil.Extra},
				{field:'Null',title:'允许为空',width:60,align:"center",formatter:formatUtil.Null,editor:editorUtil.Null},
				{field:'Collation',title:'Collation',width:100,align:"center",hidden:true},
				{field:'Key',title:'主键',width:65,align:"center",formatter:formatUtil.Key,editor:editorUtil.Key},
				{field:'Privileges',title:'权限',width:190,align:"center",hidden:true},
				{field:'Default',title:'默认值',width:100,align:"center",formatter:formatUtil.formatEmpty,editor:'textbox'},
				{field:'Comment',title:'注释',width:108,formatter:formatUtil.formatEmpty,editor:'textComment'}
			]],
			onAfterEdit:function(rowIndex, rowData, changes){
	        	var datagridData=datagrid.data("datagrid");
	        	//原始数据row
	        	var originalRow=datagridData.originalRows[rowIndex];
	        	//若没有原始数据，则说明是新增操作
	        	if(typeof originalRow=="undefined"){
	        		return;
	        	}
	        	if(typeof datagridData._updatedRows=="undefined"){
	            	datagridData._updatedRows=[];
	            }
	        	
	        	//使用副本数据
	        	rowData=$.extend(false, {}, rowData);
	        	datagrid.datagrid('endEdit', editIndex);
	             
				var dataRow={originalRow:originalRow,rowData:rowData};
				
				if(!$.isEmptyObject(dataRow.rowData)){
					//删除数组中某条原始数据
					deleteByOriginalRow(datagridData._updatedRows,originalRow);
					datagridData._updatedRows.push(dataRow);
				}
	        }
		}).datagrid('loadData', data);
		dialog.window("open");
	});
	
	//右键-查看表结构
	$document.on("click","#context_table_select",function(e){
		dialog=dialogUtil.dialog_select;
		datagrid=dialogUtil.datagrid_select;
		datagrid.empty();
		var treeTable=target.tree("getSelected");
		var data=[];
		for(var i in treeTable.children){
			data.push(treeTable.children[i].attributes);
		}
		datagrid.datagrid({
			width:"100%",
			rownumbers:true,
			singleSelect:true,
			onClickRow: editRow,
	        columns:[[
		        //{checkbox:true,width:32},
		        {field:'Field',title:'字段名',width:150},
		        {field:'Type',title:'字段类型',width:110,align:"center"},
		        {field:'Extra',title:'自增',width:100,align:"center",formatter:formatUtil.Extra},
		        {field:'Null',title:'可空',width:40,align:"center",formatter:formatUtil.Null},
		        {field:'Collation',title:'Collation',width:100,align:"center",formatter:formatUtil.formatEmpty},
		        {field:'Key',title:'主键',width:40,align:"center",formatter:formatUtil.Key},
		        {field:'Privileges',title:'权限',width:190,align:"center",formatter:formatUtil.formatEmpty},
		        {field:'Default',title:'默认值',width:100,align:"center",formatter:formatUtil.formatEmpty},
		        {field:'Comment',title:'注释',width:100,formatter:formatUtil.formatEmpty}
	        ]]
	    }).datagrid('loadData', data);
		dialog.window("open");
	});
	
	//右键-生成SQL语句-生成create语句
	$document.on("click","#context_table_sql_create",function(e){
		var treeTable=target.tree("getSelected");
		var sql="CREATE  TABLE\t"+treeTable.name+" (\n";
		for(var i=0,j=treeTable.children.length;i<j;i++){
			var row=treeTable.children[i].attributes;
			sql+="\t"+row.Field+"\t"+row.Type;
			//如果不能为空
			if(row.Null=="NO"){
				sql+="\t"+"NOT NULL";
			}
			
			//如果自增
			if(row.Extra=="auto_increment"){
				sql+="\t"+"AUTO_INCREMENT";
			}
			
			//如果是主键
			if(row.Key=="PRI"){
				sql+="\t"+"PRIMARY KEY";
			}
			
			//如果是最后一行，则不输入【,】
			if(i==j-1){
				sql+="\n";
			}else{
				sql+=",\n";
			}
		}
		sql+=")";
		$("#sql_text").val(sql.toUpperCase());
		$("#sql_tabs").tabs("select",'命令提示行');
	});
	
	//右键-生成SQL语句-生成select语句
	$document.on("click","#context_table_sql_select",function(e){
		var treeTable=target.tree("getSelected");
		var fields=[],values=[];
		for(var i=0,j=treeTable.children.length;i<j;i++){
			var row=treeTable.children[i].attributes;
			fields.push("\t"+row.Field);
			values.push("\t''");
		}
		var sql="SELECT\t\n"+fields.join(" ,\n")+"\nFROM "+treeTable.name+"\nlimit 20";
		$("#sql_text").val(sql.toUpperCase());
		$("#sql_tabs").tabs("select",'命令提示行');
	});
	//右键-生成SQL语句-生成insert语句
	$document.on("click","#context_table_sql_insert",function(e){
		var treeTable=target.tree("getSelected");
		var fields=[],values=[];
		for(var i=0,j=treeTable.children.length;i<j;i++){
			var row=treeTable.children[i].attributes;
			fields.push("\t"+row.Field);
			values.push("\t''");
		}
		var sql="INSERT  INTO  "+treeTable.name+" (\n";
		sql+=fields.join(" ,\n")+"\n)\n values(\n"+values.join(" ,\n")+"\n)";
		$("#sql_text").val(sql.toUpperCase());
		$("#sql_tabs").tabs("select",'命令提示行');
	});
	
	//右键-生成SQL语句-生成insert语句
	$document.on("click","#context_table_sql_update",function(e){
		var treeTable=target.tree("getSelected");
		var fields=[];
		for(var i=0,j=treeTable.children.length;i<j;i++){
			var row=treeTable.children[i].attributes;
			fields.push("\t"+row.Field+"= ''");
		}
		var sql="UPDATE  "+treeTable.name+" SET \n";
		sql+=fields.join(" ,\n")+"  \nWHERE 1=2";
		$("#sql_text").val(sql.toUpperCase());
		$("#sql_tabs").tabs("select",'命令提示行');
	});
	
	module.exports.target=target;
});