package com.jspjs.sqler.action;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

public class ConnTest {
	static {
		String driver = "com.mysql.jdbc.Driver";
		try {
			Class.forName(driver);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public ConnTest(){
		getConnection141();
	}
	
	public static Connection con=null;
	public static String schema=null;
	public static Connection getConnection185() {
		schema="edu_jyg2";
		String url = "jdbc:mysql://10.20.11.185:3306/edu_jyg2?useUnicode=true&amp;characterEncoding=utf-8";
		String usr = "edu_duoduo";
		String pwd = "edu_duoduo";
		try {
			con = DriverManager.getConnection(url, usr, pwd);
		} catch (Exception e) {
			System.out.println("连接错误:" + e.getMessage());
			e.printStackTrace();  
		}
		return con;
	}
	public static Connection getConnection155() {
		schema="newest_edu2";
		String url = "jdbc:mysql://10.17.82.155:3306/newest_edu2?useUnicode=true&amp;characterEncoding=utf-8";
		String usr = "edu_jyg";
		String pwd = "Zte@ict2012";
		try {
			con = DriverManager.getConnection(url, usr, pwd);
		} catch (Exception e) {
			System.out.println("连接错误:" + e.getMessage());
			e.printStackTrace();  
		}
		return con;
	}
	public static Connection getConnection141() {
		schema="edu_jyg2";
		String url = "jdbc:mysql://10.20.11.141:3306/edu_jyg2?useUnicode=true&amp;characterEncoding=utf-8";
		String usr = "edu_duoduo";
		String pwd = "edu_duoduo";
		try {
			con = DriverManager.getConnection(url, usr, pwd);
		} catch (Exception e) {
			System.out.println("连接错误:" + e.getMessage());
			e.printStackTrace();  
		}
		return con;
	}
	
	//获取表的数据
	public static JSONObject findTable(String sql){
		JSONObject result=new JSONObject();
		List<Map<String,String>> listData=new ArrayList<Map<String,String>>();
		try {
			Statement stmt = getConnection185().createStatement();
			ResultSet rs = stmt.executeQuery("select * from "+schema+"."+sql);
			
			// 获取结果集元数据  
		    ResultSetMetaData rsmd = rs.getMetaData();
		    String[] columns=new String[rsmd.getColumnCount()];
		    for (int i = 1; i <= rsmd.getColumnCount(); i++) {
		    	String column=rsmd.getColumnName(i),type=rsmd.getColumnTypeName(i);
		    	int size=rsmd.getColumnDisplaySize(i);
		    	result.accumulate(column, type+"_"+size);
		    	columns[i-1]=column;
		    }
			// 获取集中数据  
			while (rs.next()) {  
				Map<String,String> map=new HashMap<String, String>();
				for (int i = 0; i < columns.length; i++) {
					String key=columns[i], value=rs.getString(columns[i]);
					map.put(key,value);
				}
				listData.add(map);
			}
			
			result.accumulate("DATA", listData);
		    
			stmt.close();
			rs.close();
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	//封装表的数据
	public static JSONObject findTableData(String[] tables){
		JSONObject result=new JSONObject();
		for(String table:tables){
			if(StringUtils.isNotBlank(table)){
				JSONObject tableData =findTable(table);
				result.accumulate(table, tableData);
			}
		}
		return result;
	}
	
	public static void main(String[] arg){
		String[] tables=new String[]{"sb_use","sb_type","sb_term","sb_space","sb_sourse","sb_resource_version","sb_gradetype","sb_grade_term","sb_grade","sb_course"};
		JSONObject result = findTableData(tables);
		System.out.println(result);
	}
}
