/**
 * 运行sql组件
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var util=require("util"),message=util.message;
	var $document=$(document);
	var editIndex = undefined; //当前编辑的行索引
	var editRows={},delRows={};//修改的行、删除的行
	module.exports.init=function(callback){
		
	};
    
	//结束编辑状态
	function endEditing(){
		if (editIndex == undefined){return true;}
		var datagrid=$(".sql_table_data .table_datagrid");
		if (datagrid.datagrid('validateRow', editIndex)){
			datagrid.datagrid('endEdit', editIndex);
			editIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	
	//修改行
	function editRow(rowIndex,newRow){
		var datagrid=$(".sql_table_data .table_datagrid"),datagridView=$(".sql_table_data .datagrid-view");
		//移除以前的dom
		/*$(".sql_table_data .datagrid_editable_row_warp").remove();
		var datagridEditable=$("<div class='datagrid_editable_row_warp'></div>").css("top",51+25*rowIndex).appendTo(datagridView);
		var $btOk=$("<a class='button'>确定</a>").appendTo(datagridEditable),$btCancel=$("<a class='button'>取消</a>").appendTo(datagridEditable);
		*/
		
		if(endEditing()){
			datagrid.datagrid('endEdit', editIndex);
			datagrid.datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
			editIndex=rowIndex;
		}else{
			datagrid.datagrid('selectRow', rowIndex);
		}
	}
	
	//清空缓存
	function clearCacheData(){
		var datagrid=$(".sql_table_data .table_datagrid");
		//清空更新数据缓存
    	datagrid.data("datagrid")._updatedRows=[];
    	//提交数据状态到datadird
		datagrid.datagrid("acceptChanges");
	}
	
	//获取选中表的主键列表  TODO
	function getPrimarys(){
		var primarys=[];
		var treeTable=$('.dataBaseTree').tree("getSelected");
		for(var i=0,j=treeTable.children.length;i<j;i++){
			var field=treeTable.children[i];
			if(field.iconCls=="icon-key"){
				primarys.push(field.name);
			}
		}
		return primarys;
	}
	
	//根据数据字段类型获取单元格编辑器类型
	function getEditorType(type){
		if(/int/ig.test(type)){
			return "numberbox";
		}else if(/char/ig.test(type)){
			return "textbox";
		}else if(/datatime/ig.test(type)){
			return "my97";
		}else if(/time/ig.test(type)){
			return "datetimebox";
		}else{
			return "textbox";
		}
	}
	
	
	//数组是否存在指定元素
	function isExistInArray(array,val){
		for(var i=0,j=array.length;i<j;i++){
			if(array[i]===val){
				return true;
			}
		}
		return false;
	}
	
	//从datagrid获取修改后的sql列表
	function getUpdateSqls(array,table){
		var sqls=[];
		for(var i=0,j=array.length;i<j;i++){
			var originalRow=array[i].originalRow,rowData=array[i].rowData,fields=[],wheres=[];
			
			//组合set字段
			for(var field in rowData){
				var value=rowData[field];
				if(typeof value =="object" && $.isEmptyObject(value)){
					fields.push(" "+field+"= null");
				}else{
					fields.push(" "+field+"='"+value+"'");
				}
			}
			
			//组合where条件字段
			for(var field in originalRow){
				var value=originalRow[field];
				//若为空对象，则说明数据是null
				if(typeof value =="object" && $.isEmptyObject(value)){
					wheres.push(" "+field+" is null");
				}
				else{
					wheres.push(" "+field+"='"+value+"'");
				}
			}
			
			var sql=" update "+table+" set "+fields.join(" , ");
			if(wheres.length>0){
				sql+=" where "+wheres.join(" and ")+" limit 1";
			}
			sqls.push(sql);
		}
		return sqls.join(";");
	}
	
	//从datagrid获取新增后的sql列表
	function getinsertSqls(array,table){
		var sqls=[];
		for(var i=0,j=array.length;i<j;i++){
			var field=array[i],fields=[],wheres=[];
			for(var key in field){
				var value=field[key];
				if(value!=null&&!$.isEmptyObject(value)){
					value=" '"+value+"'";
				}else{
					value=" null";
				}
				
				fields.push(key);
				wheres.push(value);
			}
			
			var sql=" insert into "+table+"("+fields.join(",")+") values ("+wheres.join(",")+")";
			sqls.push(sql);
		}
		return sqls.join(";");
	}
	
	//从datagrid获取删除后的sql列表
	function getdeleteSqls(array,table){
		var sqls=[];
		for(var i=0,j=array.length;i<j;i++){
			var field=array[i],wheres=[];
			for(var key in field){
				var value=field[key];
				//若为空对象，则说明数据是null
				if(typeof value =="object" && $.isEmptyObject(value)){
					wheres.push(" "+key+" is null");
				}
				else if(value!=null){
					wheres.push(" "+key+" ='"+value+"'");
				}
			}
			
			var sql=" delete from "+table+" where "+wheres.join(" and ")+" limit 1";
			sqls.push(sql);
		}
		return sqls.join(";");
	}
	
	//获取批量操作结果
	function getBatchResult(result){
		var tip={message:"",type:"info"},errors=[],oks=[];
		if(result.recode==1){
			var array=result.data.result;
			if($.isArray(array)){
				for(var i=0,j=array.length;i<j;i++){
					if(array[i]==1){
						oks.push(array[i]);
					}else{
						errors.push(array[i]);
					}
				}
				if(oks.length>0&&errors==0){
					tip.message="命令执行成功；"+oks.length+"条数据受影响！";
					tip.type="ok";
				}else if(oks.length==0&&errors>0){
					tip.message="命令执行失败；"+errors.length+"条数据受影响！";
					tip.type="error";
				}else{
					tip.message="命令执行完毕；"+oks.length+"条数据成功！"+errors.length+"条数据失败！";
				}
			}else{
				tip.message="操作失败！返回结果异常！";
				tip.type="error";
			}
		}else{
			tip.message=result.message;
		}
		tip.oks=oks;
		tip.errors=errors;
		return tip;
	}
	
	//运行Sql
	$document.on("click","#btn_run",function(e){
		var sql=getRangeById("sql_text")||$("#sql_text").val();
		if(sql==""){
			return message.error("系统提示：请输入sql语句");
		}
		executeTable($(".exe_result_list"),sql,1,100);
	});
	
	//验证数据是否可以被添加缓存数组  其中参数rows会被改变数值  【rows 原始数据数组，rowData新数据】
	function checkedUpdateRows(rows,dataRow){
		if($.isEmptyObject(dataRow.rowData)){
			return false;
		}
		if(rows.length==0){
			return true;
		}
		var _rows=$.extend([],rows);
		for(var i=0,j=_rows.length;i<j;i++){
			var row=_rows[i];
			//验证2个对象是否相同
			if(equals(row.originalRow,dataRow.originalRow)){
				//时间类型会自动去掉后面的【.0】,追加【.0】验证数据是不是一样
				for(var r in row.rowData){
					if(row.originalRow[r]==row.rowData[r]){
						continue;
					}
					else if(row.originalRow[r]==row.rowData[r]+".0"){
						continue;
					}else{
						rows.splice(i,1);
						return true;
					}
				}
				return false;
			}
			return true;
		}
	}
	
	//打开表自动生成Sql调用的
	function selectTable(that,sql,callback){
		if(that.find(".table_datagrid").size()==0){
			that.find(".result_table").html(createTable());
		}
		var datagrid=that.find(".table_datagrid"),treeTable=$('.dataBaseTree').tree("getSelected");
		for(var i=0,j=treeTable.columns.length;i<j;i++){
			var field=treeTable.columns[i];
			field.editor=getEditorType(field.type)||"textbox";
			if(/time/ig.test(field.editor)){
				field.formatter=function(val,row){
					if(typeof val!="undefined"){
						return $.isEmptyObject(val)?"<i>null<i>":val.replace(".0","");
					}
					return val;
				};
				field.width=140;
			}else{
				field.formatter=function(val,row){
					if(typeof val=="object"){
						return $.isEmptyObject(val)?"<i>null<i>":val;
					}
					return val;
				};
			}
		}
        
		datagrid.datagrid({
	        url:"sql/findTableData.action",
	        queryParams: {"sql":sql},
	        columns:[treeTable.columns],
	        height:$(that).height(),
	        remoteSort:false,
	        //singleSelect:false,
	        loadMsg:"正在加载，请稍后...",
	        //loadMsg:"",
	        onClickRow: editRow,
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
				
				//若原始数据数组中不存在这条数据
				if(checkedUpdateRows(datagridData._updatedRows,dataRow)){
					//删除数据没有变化的字段，只保留有数据变化的字段
					for(var i in dataRow.rowData){
						if(dataRow.originalRow[i]==dataRow.rowData[i]){
							delete dataRow.rowData[i];
						}else if(dataRow.originalRow[i]==dataRow.rowData[i]+".0"){
							delete dataRow.rowData[i];
						}
					}
					if(!$.isEmptyObject(dataRow.rowData)){
						datagridData._updatedRows.push(dataRow);
					}
				}
	        },
	        pageSize:20,
	        pageList: [20,50,100,200],
	        loadFilter: function(result){
	        	if(result.recode==0){
	        		that.find(".msg_tip").html("<div class=\"no-result\">系统错误，原因："+result.message+"</div>");
	        	}else{
	        		that.find(".msg_tip").html("");
	        	}
	    		if (result.data){
	    			return result.data;
	    		} else {
	    			return result;
	    		}
	    	},
	        onLoadSuccess: function(result){
	        	//清空缓存
	        	clearCacheData();
	        	
	        	$("#sql_tabs").tabs("select",'列表展示');
	        	var layout=['list','sep','first','prev','sep',"links",'sep','next','last','sep','refresh','sep','manual'];
	        	
	        	if(result.recode==0){
					return that.find(".msg_tip").html("<div class=\"no-result\">"+result.message+"</div>");
				}
	        	else if(result.total==0){
	        		layout=['refresh'];
	        		that.find(".result_table .datagrid-view2 .datagrid-body").html("<div class=\"no-result\">表中没有数据！</div>");
	        	}
	        	else if(result.total<=20){
	        		layout=['list','sep','refresh'];
	        	}
	        	
	        	datagrid.datagrid('getPager').pagination({
	        		buttons:[
	    			    {
		    				iconCls:'icon-plus',
		    				handler:function(){
		    					var rowIndex=datagrid.datagrid('getRows').length;
		    					datagrid.datagrid('appendRow',{});
		    					datagrid.datagrid('selectRow', rowIndex);
		    				}
	    				},
	    				{
	    					iconCls:'icon-minus',
		    				handler:function(){
		    					var row=datagrid.datagrid('getSelected');
		    					if(row!=null){
		    						var index=datagrid.datagrid('getRowIndex',row);
		    						if(typeof index!="undefined"){
		    							datagrid.datagrid('deleteRow',index);
		    						}
		    					}
		    				}
	    				},{
		    				iconCls:'icon-ok',
		    				handler:function(){
		    					datagrid.datagrid('endEdit', editIndex);
		    					editIndex = undefined;
		    					var _updatedRows = datagrid.data("datagrid")._updatedRows||[];
		    					var insertArray=datagrid.datagrid("getChanges","inserted");
		    					var deleteArray=datagrid.datagrid("getChanges","deleted");
		    					executeSqlBatch({updated:_updatedRows,insertd:insertArray,deleted:deleteArray},function(result){
		    						var tip=getBatchResult(result);
		    						if(result.recode==1){
	    								message.show(tip.type,tip.message);
	    								//清空缓存
	    								clearCacheData();
	    								datagrid.datagrid("reload");
		    						}else{
		    							message.error(tip.message);
		    						}
		    					});
		    				}
	    				}
	    			],
	        		layout:layout,
	        		beforePageText:'跳转：第',
	        		afterPageText:'页',
	        		displayMsg:"当前第[{from}-{to}]条 共[{total}]条"
	        	});
	        	
	        	callback&&callback();
	    	}
	    });
	};
	
	//执行SQL并返回结果
	function executeTable(that,sql,pageIndex,pageSize,callback){
		$("#sql_text").focus();
		message.wait("正在运行sql，请稍后...");
		var sqlType=$("#selectTableType").combobox("getValue");
		$.post("sql/"+sqlType+".action",{"sql":sql,"page":pageIndex||"1","rows":pageSize},function(result){
			if(typeof result=="object" && typeof result.data=="object"){
				that.find(".msg_tip").html("");
				that.find(".result_table").empty().show();
				message.hide();
				if(that.find(".table_datagrid").size()==0){
					that.find(".result_table").html(createTable());
				}
				
				if(result.recode==1){
					if(result.data.total==0){
						return that.find(".msg_tip").html("<div class=\"no-result\">表中没有数据！</div>");
					}
				}else{
					return that.find(".msg_tip").html("<div class=\"no-result\">"+result.message+"</div>");
				}
				
				if(typeof result.data.result!="undefined"){
					var resultTip="命令成功完成！";
					if(result.data.result>0){
						resultTip+="<br>"+result.data.result+"条数据受影响！";
					}
					return that.find(".msg_tip").show().html("<div class=\"ok-result\">"+resultTip+"</div>");
				}
				
				var fields=[];
				for(var field in result.data.rows[0]){
					fields.push({field:field,title:field,width:100,editor:'textbox',formatter:function(val){return $.isEmptyObject(val)?"<i>null<i>":val;}});
				}
				var datagrid=that.find(".table_datagrid");
				datagrid.datagrid({
			        columns:[fields],
			        height:$(that).height(),
			        remoteSort:false,
			        loadMsg:"正在加载，请稍后...",
			        //loadMsg:"",
			        pageNumber:pageIndex,
			        pageSize:pageSize,
			        pageList: [pageSize],
			        loadFilter:function(data){
			    		var pager = datagrid.datagrid('getPager');
			    		pager.pagination({
			    			onSelectPage:function(pageNum, pageSize){
			    				executeTable(that,sql,pageNum,pageSize);
			    			}
			    		});
			    		return data;
			    	},
			        onLoadSuccess: function(result){
			        	var layout=['first','prev','sep',"links",'sep','next','last','sep','refresh','sep','manual'];
			        	var displayMsg="当前第[{from}-{to}]条 共[{total}]条";
			        	
			        	if(result.total==0){
			        		layout=['refresh'];
			        		return that.find(".result_table").html("<div class=\"no-result\">表中没有数据！</div>");
			        	}
			        	else if(result.total<=100){
			        		layout=['refresh'];
			        	}else{
			        		displayMsg="因浏览器性能限制，若查询语句未加分页，默认每100条数据进行分页；当前第[{from}-{to}]条 共[{total}]条";
			        	}
			        	datagrid.datagrid('getPager').pagination({
			        		layout:layout,
			        		displayMsg:displayMsg
			        	});
			        	callback&&callback();
			    	}
			    }).datagrid('loadData', result.data||result);
			}else{
		    	message.stop("系统出现错误！");
				return that.find(".msg_tip").show().html("<div class=\"no-result\">系统出现错误，"+result.message+"</div>");
		    }
		});
	};
	
	//执行更新SQL操作
	function executeSqlUpdate(sql,callback){
		$.post("sql/executeSqlUpdate.action",{"sql":sql},function(result){
			callback&&callback(result);
		});
	}
	
	//执行批量更新SQL操作
	function executeSqlBatch(option,callback){
		var treeTable=$('.dataBaseTree').tree("getSelected");
		var sqls=[];
		var updateSql=getUpdateSqls(option.updated,treeTable.name);
		var insertSql=getinsertSqls(option.insertd,treeTable.name);
		var deleteSql=getdeleteSqls(option.deleted,treeTable.name);
		updateSql!=""&&sqls.push(updateSql);
		insertSql!=""&&sqls.push(insertSql);
		deleteSql!=""&&sqls.push(deleteSql);
		var sql=sqls.join(";");
		if(sql!=""){
			$.post("sql/executeSqlBatch.action",{"sql":sql},function(result){
				callback&&callback(result);
			});
		}
	}
	
	//创建表
	function createTable(){
		var table = ''+
		'<table class="table_datagrid" title="数据结果" '+
		'	data-options=" rownumbers:true,singleSelect:true,autoRowHeight:false,pagination:true">'+
		'	<thead><tr class="table_datagrid_head">'+
		'	</tr></thead>'+
		'</table>';
		return $(table);
	};
	
	//获取选中的文本值
	function getRangeById(id){ 
		var word='';
		if (document.selection){
			var obj=document.selection.createRange();
			if(obj.text.length>0){
				word=obj.text;
			}
		}else{ 
			var obj=document.getElementById(id); 
			var start=obj.selectionStart,end=obj.selectionEnd; 
			if (start||start=='0'){
				if(start!=end){
					word=obj.value.substring(start,end);
				}
				else{
					word=obj.value;
				}
			}
		} 
		return word;
	};
	
	module.exports.executeTable=executeTable;
	module.exports.selectTable=selectTable;
	module.exports.executeSqlUpdate=executeSqlUpdate;
	module.exports.checkedUpdateRows=checkedUpdateRows;
	module.exports.resize=function(){datagrid.datagrid("resize",{})};
});