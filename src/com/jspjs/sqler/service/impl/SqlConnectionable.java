package com.jspjs.sqler.service.impl;

import net.sf.json.JSONObject;

public interface SqlConnectionable {
	
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
