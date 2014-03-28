package com.jspjs.sqler.service.impl;

import net.sf.json.JSONObject;

import org.apache.ibatis.session.SqlSession;

public interface SqlConnectionable {
	/**
	 * 获取连接
	 * @return
	 */
	public SqlSession getSqlSession();
	
	/**
	 * 关闭连接
	 * @param sqlSession
	 */
	public void closeSqlSession(SqlSession sqlSession);
	
	/**
	 * 是否已经连接？
	 * @return
	 */
	public boolean isConnected();
	
	/**
	 * 查找所有表
	 * @return
	 */
	public JSONObject findTables();
	
	/**
	 * 查找表下面的所有列
	 * @param table 表名
	 * @return
	 */
	public JSONObject findTableColumns(String table);
	
	/**
	 * 查找表下面的所有数据
	 * @param table 表名
	 * @return
	 */
	public JSONObject findTableData(String table);
	
	/**
	 * 分页查找表下面的所有数据
	 * @param table 表名
	 * @param pageIndex 第几页索引
	 * @param pageSize  每页显示多少条
	 * @return
	 */
	public JSONObject findTableData(String table,int pageIndex,int pageSize);
}
