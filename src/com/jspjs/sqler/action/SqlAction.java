package com.jspjs.sqler.action;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.jspjs.framework.util.AjaxAction;
import com.jspjs.sqler.dto.JdbcDto;
import com.jspjs.sqler.service.MySqlConnection;

@Controller("sqlAction")
public class SqlAction extends AjaxAction {
	@Autowired
	private MySqlConnection mySqlConnection;
	@Autowired
	private SqlSessionFactory sqlSessionFactory;
	Connection conn=null;
	
	//获取数据库连接
	public SqlSession getSqlSession(){
		return sqlSessionFactory.openSession();
	}
	
	//主页
	public String index(){
		return "input";
	}
	
	//连接数据库
	public Connection getConnection() throws SQLException{
		//return getSqlSession().getConnection();
		return getConnection(null);
	}
	
	//连接数据库
	public Connection getConnection(String database) throws SQLException{
		Connection conn = null;
		try {
			JdbcDto jdbc=null;
			if(parameter!=null){
				jdbc=new JdbcDto(parameter);
				setSessionProperty("jdbc", jdbc);
			}else{
				jdbc = (JdbcDto) getSessionProperty("jdbc");
				if(StringUtils.isNotBlank(database)){
					jdbc.setDatabase(database);
					setSessionProperty("jdbc", jdbc);
				}
			}
			if(jdbc==null){
				throw new SQLException("请先登录!");
			}
			conn = mySqlConnection.getConnection(jdbc);
			parameter=null;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			throw new SQLException(e.getMessage(),e);
		}
		return conn;
	}
	
	//测试连接数据库
	public String testConnection(){
        try {
        	conn=getConnection();
			return ajaxUtil.setResult(!conn.isClosed());
		} catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//获取数据库中所有的表、表中所有的列
	public String getDatabases(){
		try {
			HttpServletRequest request=ServletActionContext.getRequest();
			String id=request.getParameter("id");
			if(StringUtils.isNotBlank(id)){
				String[] ids=id.split("—");
				conn=getConnection(ids[0]);
				if(ids.length==1){
					return getTables();
				}else if(ids.length==2){
					JSONArray array=mySqlConnection.findTableColumnInfo(conn, ids[1]);
					return ajaxUtil.setSuccess(formatTableColumn(array));
				}else{
					return ajaxUtil.setFail("选中的数据库或者数据表不正确！");
				}
			}else{
				conn=getConnection();
				return ajaxUtil.setSuccess(formatDatabaseName(mySqlConnection.findDatabases(conn)));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//获取数据库中所有的表、表中所有的列
	public String getTables(){
		try {
			conn=getConnection();
			return ajaxUtil.setSuccess(formatTableName(mySqlConnection.findTables(conn)));
		} catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//获取表中数据
	public String findTableData(){
		HttpServletRequest request=ServletActionContext.getRequest();
		String sql=request.getParameter("sql");
		try{
			conn=getConnection();
			String sqlCount="select count(1) from "+sql+" as temp";
			Integer pageIndex=Integer.valueOf(request.getParameter("page"));
			Integer pageSize=Integer.valueOf(request.getParameter("rows"));
			Integer total = mySqlConnection.findTableCount(conn, sqlCount);
			sql="select * from "+sql+" limit "+(pageIndex-1)*pageSize+","+pageSize;
			JSONArray rows = mySqlConnection.findTableDatas(conn, sql);
			JSONObject j=new JSONObject();
			j.accumulate("rows", rows);
			j.accumulate("total", total);
			return ajaxUtil.setSuccess(j);
		}catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//执行SQL-自动判断是select还是update
	public String executeSql(){
		HttpServletRequest request=ServletActionContext.getRequest();
		String sql=request.getParameter("sql");
		Integer pageIndex=Integer.valueOf(request.getParameter("page"));
		Integer pageSize=Integer.valueOf(request.getParameter("rows"));
		JSONObject result=new JSONObject();
		if(pageIndex>1){
			try {
				conn=getConnection();
				String sqlCount="select count(1) from ("+sql+") as temp";
				Integer total = mySqlConnection.findTableCount(conn, sqlCount);
				if(total>pageSize){
					sql="select * from ("+sql+") as temp limit "+(pageIndex-1)*pageSize+","+pageSize;
				}
				JSONArray rows = mySqlConnection.findTableDatas(conn, sql);
				result.accumulate("rows", rows);
				result.accumulate("total", total);
				return ajaxUtil.setSuccess(result);
			} catch (SQLException e) {
				e.printStackTrace();
				return ajaxUtil.setFail(e.getMessage());
			}finally{
				mySqlConnection.closeConnection(conn);
			}
		}
		try {
			conn=getConnection();
			JSONObject resultSql = mySqlConnection.executeSql(conn, sql,pageIndex,pageSize);
			if("select".equals(resultSql.get("type"))){
				List<JSONObject> list = (List<JSONObject>) resultSql.get("data");
				if(list.size()>100){
					result.accumulate("rows", list.subList(0, 100));
				}else{
					result.accumulate("rows", list);
				}
				result.accumulate("total", list.size());
			}else{
				result.accumulate("result", resultSql.get("data"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
		return ajaxUtil.setSuccess(result);
	}
	
	//获取表中数据
	public String executeSqlQuery(){
		HttpServletRequest request=ServletActionContext.getRequest();
		String sql=request.getParameter("sql");
		try{
			conn=getConnection();
			String sqlCount="select count(1) from ("+sql+") as temp";
			Integer pageIndex=Integer.valueOf(request.getParameter("page"));
			Integer pageSize=Integer.valueOf(request.getParameter("rows"));
			Integer total = mySqlConnection.findTableCount(conn, sqlCount);
			if(total>100){
				sql="("+sql+") limit "+(pageIndex-1)*pageSize+","+pageSize;
			}
			JSONArray rows = mySqlConnection.findTableDatas(conn, sql);
			JSONObject j=new JSONObject();
			j.accumulate("rows", rows);
			j.accumulate("total", total);
			return ajaxUtil.setSuccess(j);
		}catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//更新表中数据
	public String executeSqlUpdate(){
		HttpServletRequest request=ServletActionContext.getRequest();
		String sql=request.getParameter("sql");
		try{
			conn=getConnection();
			JSONObject result = mySqlConnection.executeSqlUpdate(conn, sql);
			return ajaxUtil.setSuccess(result);
		}catch (SQLException e) {
			e.printStackTrace();
			return ajaxUtil.setFail(e.getMessage());
		}finally{
			mySqlConnection.closeConnection(conn);
		}
	}
	
	//格式化database
	private JSONArray formatDatabaseName(List<String> list){
		JSONArray tablesArray=new JSONArray();
		for(String value : list){
			JSONObject j=new JSONObject();
			j.accumulate("id", value);
			j.accumulate("text", value);
			j.accumulate("name", value);
			j.accumulate("iconCls","icon-desktop");
			j.accumulate("state", "closed");
			j.accumulate("type", "database");
			tablesArray.add(j);
		}
		return tablesArray;
	}
	
	//格式化tables
	private JSONArray formatTableName(List<String> list) throws SQLException{
		JSONArray tablesArray=new JSONArray();
		JdbcDto jdbc =(JdbcDto) getSessionProperty("jdbc");
		Connection conn=getConnection();
		for(String value : list){
			JSONObject j=new JSONObject();
			JSONArray array=mySqlConnection.findTableColumnInfo(conn, value);
			j.accumulate("id", jdbc.getDatabase()+"—"+value);
			j.accumulate("text", value);
			j.accumulate("name", value);
			j.accumulate("iconCls","icon-table");
			j.accumulate("state", "closed");
			j.accumulate("type", "table");
			j.accumulate("columns", formatTableColumnDatagrid(array));
			j.accumulate("children", formatTableColumn(array));
			tablesArray.add(j);
		}
		return tablesArray;
	}
	
	//格式化table的column成easyui格式
	private JSONArray formatTableColumnDatagrid(JSONArray array){
		JSONArray tablesArray=new JSONArray();
		for(int i=0;i<array.size();i++){
			JSONObject column=(JSONObject)array.get(i);
			JSONObject j=new JSONObject();
			String value=(String) column.get("Field");
			j.accumulate("field", value);
			j.accumulate("title", value);
			j.accumulate("width", "100");
			//j.accumulate("sortable", true);
			tablesArray.add(j);
		}
		return tablesArray;
	}
	
	//格式化table的column
	private JSONArray formatTableColumn(JSONArray array){
		JSONArray tablesArray=new JSONArray();
		for(int i=0;i<array.size();i++){
			JSONObject column=(JSONObject) array.get(i);
			JSONObject j=new JSONObject();
			String value=(String) column.get("Field");
			String text=value+", "+column.get("Type");
			if("YES".equalsIgnoreCase((String) column.get("Null"))){
				text+=", Nullable";
			}
			if("PRI".equalsIgnoreCase((String) column.get("Key"))){
				j.accumulate("iconCls","icon-key");
			}else{
				j.accumulate("iconCls","icon-th-list");
			}
			j.accumulate("id", value);
			j.accumulate("text", text);
			j.accumulate("name", value);
			j.accumulate("type", "column");
			j.accumulate("attributes", column);
			tablesArray.add(j);
		}
		return tablesArray;
	}
}
