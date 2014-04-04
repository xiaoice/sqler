package com.jspjs.sqler.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import com.jspjs.sqler.dto.JdbcDto;

public class SqlConnection {
	//获取JDBC连接
	public Connection getConnection(JdbcDto jdbcDto) throws ClassNotFoundException, SQLException{
		Class.forName(jdbcDto.getDriver());
		return DriverManager.getConnection(jdbcDto.getUrl(), jdbcDto.getUser(), jdbcDto.getPassword());
	}
	
	//获取JDBC连接
	public Connection getConnection(String driver,String url,String user,String password) throws ClassNotFoundException, SQLException{
		Class.forName(driver);
		return DriverManager.getConnection(url, user, password);
	}
	
	//关闭JDBC连接
	public void closeConnection(Connection conn){
		try {
			if(!conn.isClosed()){
				conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
