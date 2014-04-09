package com.jspjs.sqler.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
@Controller("mySqlConnection")
public class MySqlConnection extends SqlConnection{
	
	/**
	 * 使用指定的连接名获取库中所有的库
	 * @param conn
	 * @return
	 * @throws SQLException 
	 */
	public List<String> findDatabases(Connection conn) throws SQLException {
		return findFristFelidList(conn, "SHOW DATABASES");
	}
	
	/**
	 * 使用指定的连接名获取库中所有的表
	 * @param conn
	 * @return
	 * @throws SQLException 
	 */
	public List<String> findTables(Connection conn) throws SQLException {
		return findFristFelidList(conn, "SHOW TABLES");
	}
	
	/**
	 * 运行sql，获取第一列结果
	 * @param conn
	 * @param sql
	 * @return
	 * @throws SQLException 
	 */
	public List<String> findFristFelidList(Connection conn,String sql) throws SQLException {
		List<String> resultList=new ArrayList<String>();
		Statement stmt=conn.createStatement();
		ResultSet resultSet=stmt.executeQuery(sql);
		while (resultSet.next()) {
			String value = resultSet.getString(1);
			resultList.add(value);
		}
		stmt.close();
		resultSet.close();
		return resultList;
	}
	
	/**
	 * 使用指定的连接名、表名获取所有的列信息
	 * @param conn 连接名
	 * @param table 表名
	 * @return
	 */
	public JSONArray findTableColumnInfo(Connection conn, String table) {
		JSONArray resultList=new JSONArray();
		JSONObject result=new JSONObject();
		try{
			Statement stmt=conn.createStatement();
			ResultSet resultSet=stmt.executeQuery("SHOW FULL FIELDS FROM "+table);
			ResultSetMetaData rsmd = resultSet.getMetaData();
		    String[] columns=new String[rsmd.getColumnCount()];
		    for (int i = 1; i <= rsmd.getColumnCount(); i++) {
		    	String column=rsmd.getColumnLabel(i),type=rsmd.getColumnTypeName(i);
		    	int size=rsmd.getColumnDisplaySize(i);
		    	result.accumulate(column, type+"_"+size);
		    	columns[i-1]=column;
		    }
			// 获取集中数据  
			while (resultSet.next()) {  
				JSONObject jo=new JSONObject();
				for (int i = 0; i < columns.length; i++) {
					String key=columns[i], value=resultSet.getString(columns[i]);
					jo.accumulate(key,value);
				}
				resultList.add(jo);
			}
			
			result.accumulate("DATA", resultList);
			stmt.close();
			resultSet.close();
		}catch (SQLException e) {
			e.printStackTrace();
		}finally{
			//this.closeConnection(conn);
		}
		return resultList;
	}
	
	//获取所有的列
	public String[] findTableColumn(Connection conn,String sql) {
		try{
			Statement stmt=conn.createStatement();
			ResultSet resultSet=stmt.executeQuery(sql);
			ResultSetMetaData rsmd = resultSet.getMetaData();
		    String[] columns=new String[rsmd.getColumnCount()];
		    for (int i = 1; i <= rsmd.getColumnCount(); i++) {
		    	String column=rsmd.getColumnLabel(i);
		    	columns[i-1]=column;
		    }
		    return columns;
		}catch (SQLException e) {
			e.printStackTrace();
		}finally{
			//this.closeConnection(conn);
		}
		return new String[]{};
	}
	
	//获取表中所有数据
	public JSONArray findTableDatas(Connection conn,String sql) throws SQLException {
		return this.findTableDatas(conn, sql, null);
	}
	//获取表中所有数据
	public JSONArray findTableDatas(Connection conn,String sql,JSONArray fields) throws SQLException {
		JSONArray resultList=new JSONArray();
		Statement stmt=conn.createStatement();
		ResultSet resultSet=stmt.executeQuery(sql);
	    String[] columns=findTableColumn(conn, sql);
	    
		// 获取集中数据  
		while (resultSet.next()) {  
			JSONObject jo=new JSONObject();
			for (int i = 0; i < columns.length; i++) {
				String key=columns[i], value=resultSet.getString(columns[i]);
				if(value==null){
					jo.accumulate(key,null);
				}else{
					jo.accumulate(key,value);
				}
				//若列数组不为null
				/*if(fields!=null){
					JSONObject field=fields.getJSONObject(i);
					String type=field.getString("Type");
					if(type.toLowerCase().indexOf("time")>-1){
						int index=value.lastIndexOf(".");
						if(value.length()>index){
							jo.put(key,value.substring(0, index));
						}
					}
				}
				*/
			}
			resultList.add(jo);
		}
		stmt.close();
		resultSet.close();
		return resultList;
	}
	
	//获取表中返回的一条数据
	public Integer findTableCount(Connection conn,String sql) throws SQLException {
		String result=null;
		Statement stmt=conn.createStatement();
		ResultSet resultSet=stmt.executeQuery(sql);
		// 获取集中数据  
		while (resultSet.next()) {  
			result=resultSet.getString(1);
		}
		stmt.close();
		resultSet.close();
		return Integer.valueOf(result);
	}
	
	/**
	 * 执行Sql
	 * @param conn
	 * @param sql
	 * @return type:[select:查询,返回list，update:增、删、改,返回int],data:返回的数据
	 * @throws SQLException 
	 */
	public JSONObject executeSql(Connection conn,String sql,Integer pageIndex,Integer pageSize) throws SQLException {
		JSONObject result=new JSONObject();
		Statement stmt=conn.createStatement();
		boolean isResultSet=stmt.execute(sql);
		if(isResultSet){
			String[] columns=findTableColumn(conn, sql);
			List<JSONObject> resultList=new ArrayList<JSONObject>();
			ResultSet resultSet = stmt.getResultSet();
			// 获取集中数据  
			while (resultSet.next()) {  
				JSONObject jo=new JSONObject();
				for (int i = 0; i < columns.length; i++) {
					String key=columns[i], value=resultSet.getString(columns[i]);
					if(value==null){
						jo.accumulate(key,"");
					}else{
						jo.accumulate(key,value);
					}
				}
				resultList.add(jo);
			}
			stmt.close();
			resultSet.close();
			result.accumulate("type", "select");
			result.accumulate("data", resultList);
		}else{
			int resultCount=stmt.getUpdateCount();
			stmt.close();
			result.accumulate("type", "update");
			result.accumulate("data", resultCount);
		}
		return result;
	}
	
	/**
	 * 执行更新Sql
	 * @param conn
	 * @param sql
	 * @throws SQLException 
	 */
	public JSONObject executeSqlUpdate(Connection conn,String sql) throws SQLException {
		JSONObject result=new JSONObject();
		Statement stmt=conn.createStatement();
		result.accumulate("result", stmt.executeUpdate(sql));
		stmt.close();
		return result;
	}
	
	/**
	 * 批量执行更新Sql
	 * @param conn
	 * @param sql
	 * @throws SQLException 
	 */
	public JSONObject executeSqlBatch(Connection conn,String sql) throws SQLException {
		JSONObject result=new JSONObject();
		sql=sql.replace("\n","").replace("\t","");
		//conn.setAutoCommit(false);
		Statement stmt=conn.createStatement();
		String sqls[]=sql.split(";");
		for(String s : sqls){
			stmt.addBatch(s);
		}
		result.accumulate("result", stmt.executeBatch());
		stmt.close();
		return result;
	}

	public JSONObject findTableData(String table, int pageIndex, int pageSize) {
		// TODO Auto-generated method stub
		return null;
	}
}
