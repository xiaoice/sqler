package com.jspjs.sqler.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.jspjs.sqler.dto.JdbcDto;

public class SqlConnection {
	@Autowired
	private SqlSessionFactory sqlSessionFactory;
	
	//获取本地ibatis数据库连接
	public SqlSession getSqlSession(){
		return sqlSessionFactory.openSession();
	}
	
	//关闭本地ibatis数据库连接
	public void closeSqlSession(SqlSession sqlSession){
		if (sqlSession != null) {
			sqlSession.close();
			sqlSession = null;
		}
	}
	
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
	
	//获取Ibatis连接
	public Connection getConnection(){
		return getSqlSession().getConnection();
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
