/**
 * 数据表组件
 * 曾小斌
 * 2014-01-01 00:00:23
 */

define(function(require,exports,module){
	var sql=require("sql"),login=require("login"),util=require("util"),message=util.message;
	var $document=$(document),databaseSelect=$("#database_select"),target=$('.dataBaseTree');
	var editIndex = undefined; //当前编辑的行索引
	var editRows={},delRows={};//修改的行、删除的行
	var dialog=undefined,datagrid=undefined,dialogUtil={};
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
			},
			onBeforeSelect:function(node){
				$("#input_con_database").val(node.text);
				if(databaseSelect.html()!=node.text&&node.type=="database"){
					login.loginDatabase(function(){
						message.ok("成功切换到数据库【"+node.text+"】",0.5);
						databaseSelect.html(node.text);
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
			}
			],
			buttons:[{
				text:'<i class="icon-eye-open"></i> 预览Sql',
				handler:preview
			},{
				text:'<i class="icon-save"></i> 保存',
				handler:preview
			},{
				text:'<i class="icon-remove"></i> 关闭',
				handler:function(){dialogUtil.dialog_edit.window('close');}
			}]
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
	
	//重写扩展输入框-默认值
    $.extend($.fn.datagrid.defaults.editors, {
    	textDefault: {
	        init: function(container, options){
		        var input = $('<input type="text" class="datagrid-editable-input"/>').width("100%").css("border-color","#805C1E").appendTo(container);
		        return input.wrap("<div class=\"datagrid-editable-input-div\"></div>").validatebox(options);
	        },
	        destroy: function(target){
	        	$(target).remove();
	        },
	        getValue: function(target){
	        	var value=$(target).val();
	        	return $.isEmptyObject(value)?"":value;
	        },
	        setValue: function(target, value){
	        	$(target).val($.isEmptyObject(value)?"":value);
	        },
	        resize: function(target, width){
		        $(target)._outerWidth(width);
		    }
        }
    });
	
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
			if($.isEmptyObject(value)){
				return "";
			}else{
				return value;
			}
		}
	};
	
	//编辑器工具
	var editorUtil={
		//字段名
		Field:{
			type:'textDefault',
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
        		    {value: 'INT',text: 'INT'},
        		    {value: 'FLOAT',text: 'FLOAT'},
        		    {value: 'DOUBLE',text: 'DOUBLE'},
        		    {value: 'BIT',text: 'BIT'},
        		    {value: 'VARCHAR()',text: 'VARCHAR()'},
        		    {value: 'CHAR()',text: 'CHAR()'},
        		    {value: 'TEXT',text: 'TEXT'},
        		    {value: 'BLOB',text: 'BLOB'},
        		    {value: 'DATE',text: 'DATE'},
        		    {value: 'DATETIME',text: 'DATETIME'},
        		],
                required:true,
                missingMessage:"请输入字段类型"
            }
		},
		//键约束
		Key:{
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
		//复选框
		checkbox:{
			type:'checkbox',    
			options:{on: "<i class=\"icon-ok\"></i>",off:""}
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
			datagrid.datagrid("appendRow", {Field:"",Type:"",Extra:"",Null:"",Collation:"",Key:"",Privileges:"",Default:"",Comment:""});
			datagrid.datagrid('selectRow', rowCount).datagrid('beginEdit', rowCount);
			editIndex=rowCount;
		}
	}
	
	//删除行
	function deleteRow(){
		var rowData=datagrid.datagrid('getSelected');
		if(rowData!=null){
			datagrid.datagrid('deleteRow', datagrid.datagrid('getRowIndex',rowData));
			delRows[rowData.Field]=rowData;
		}else{
			message.error("请先选中要删除的行");
		}
	}
	
	//验证创建数据表
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
	
	//创建数据表生成的SQL
	function createTableSql(){
		var rows = datagrid.datagrid('getChanges');
		var tablename=$("#dialog_create_tablename_input").val();
		var sqls=[],primaryKeys=[];
		for(var i in rows){
			var row=rows[i];
			var Field="\r\t<span class=\"Field\">"+row.Field+"</span>";
			var Type="<span class=\"Type\"> "+row.Type+"</span>";
			var Null=row.Null=='<i class="icon-ok"></i>'?"":"<span class=\"Null\"> NOT NULL</span>";
			var Extra=row.Extra=='<i class="icon-ok"></i>'?"<span class=\"Extra\"> AUTO_INCREMENT</span>":"";
			var Default="<span class=\"Default\"> DEFAULT</span> '"+row.Default+"'";
			var Comment="<span class=\"Comment\"> COMMENT</span> '"+row.Comment+"'";
			var sql=Field+Type;
			if(row.Key=="<i class=\"icon-ok\"></i>"){
				primaryKeys.push(row.Field);
			}else{
				sql+=Null;
			}
			
			if(row.Extra==""&&row.Default!=""){
				sql+=Default;
			}else if(Extra!=""){
				sql+=Extra;
			}
			sql+=row.Comment!=""?Comment:"";
			sqls.push(sql);
		}
		if(primaryKeys.length>0){
			sqls.push("\r\t<span class=\"Key\">PRIMARY KEY </span>("+primaryKeys.join(",")+")");
		}
		return "<span class=\"Type\">CREATE TABLE </span>"+tablename+"(<br>"+sqls.join(",<br>")+"<br><span>\r)<span>";
	}
	//预览SQL
	function createTablePreview(){
		if(createTableValidator()){
			var sql_table = createTableSql();
			dialogUtil.dialog_create_panel_sql.html(sql_table).show();
			dialogUtil.dialog_create_panel_sql_close.show();
		}
	}
	
	//保存数据表
	function createTableSave(){
		if(createTableValidator()){
			var sql_table = createTableSql(),_sql=$(sql_table).text();
			sql.executeSqlUpdate(_sql,function(result){
				var tablename=$("#dialog_create_tablename_input").val();
				if(result.recode==1){
					reloadTable();
					message.ok("创建表【"+tablename+"】成功！");
					dialogUtil.dialog_create.window('close');
				}else{
					dialogUtil.dialog_create_panel_sql.html(result.message).show();
					dialogUtil.dialog_create_panel_sql_close.show();
					message.error("创建表【"+tablename+"】失败！");
				}
			});
		}
	}
	
	function preview(){
		message.error("暂时没有开发！");
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
		        {field:'Extra',title:'自增',width:100,align:"center",formatter:formatUtil.Extra,editor:editorUtil.checkbox},
		        {field:'Null',title:'可为空',width:40,align:"center",formatter:formatUtil.Null,editor:editorUtil.checkbox},
		        {field:'Collation',title:'Collation',width:100,align:"center",hidden:true},
		        {field:'Key',title:'主键',width:65,align:"center",formatter:formatUtil.Key,editor:editorUtil.checkbox},
		        {field:'Privileges',title:'权限',width:190,align:"center",hidden:true},
		        {field:'Default',title:'默认值',width:100,align:"center",formatter:formatUtil.formatEmpty,editor:'textDefault'},
		        {field:'Comment',title:'注释',width:108,editor:'textDefault'}
	        ]],
	        onAfterEdit:function(rowIndex, rowData, changes){
	        	editRows[rowData.Field]=changes;
	        }
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
			          {field:'Extra',title:'自增',width:100,align:"center",formatter:formatUtil.Extra,editor:editorUtil.checkbox},
			          {field:'Null',title:'可空',width:40,align:"center",formatter:formatUtil.Null,editor:editorUtil.checkbox},
			          {field:'Collation',title:'Collation',width:100,align:"center",hidden:true},
			          {field:'Key',title:'主键',width:65,align:"center",formatter:formatUtil.Key,editor:editorUtil.checkbox},
			          {field:'Privileges',title:'权限',width:190,align:"center",hidden:true},
			          {field:'Default',title:'默认值',width:100,align:"center",formatter:formatUtil.formatEmpty,editor:'textDefault'},
			          {field:'Comment',title:'注释',width:108,editor:'textDefault'}
			          ]],
			          onAfterEdit:function(rowIndex, rowData, changes){
			        	  editRows[rowData.Field]=changes;
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
		        {field:'Comment',title:'注释',width:100}
	        ]]
	    }).datagrid('loadData', data);
		dialog.window("open");
	});
	module.exports.target=target;
});