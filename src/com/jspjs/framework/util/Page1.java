package com.jspjs.framework.util;

import java.util.List;

public class Page1<T> {
	private int pageIndex = 0;// 当前第几页
	private int pageSize = 0; // 每页显示多少条数据
	private int pageNum = 0; // 当前页有多少数据
	private int startNum; // 计算后查询的起始位置
	private int endNum; // 计算后查询的结束位置
	private int pageTotal; // 总共有多少页
	private int numTotal; // 总共有多少条数据
	private List<T> list; // 列表

	public Page1() {
		
	}

	public Page1(int pageIndex, int pageSize, List<T> list, int numTotal) {
		this.pageIndex = pageIndex;
		this.pageSize = pageSize;
		this.list = list;
		this.numTotal = numTotal;

		if (list != null) {
			this.pageNum = list.size();
		}

		this.pageTotal = (int) Math.ceil(Double.valueOf(numTotal) / Double.valueOf(pageSize));
		this.startNum =(pageIndex - 1)*pageSize;
		this.endNum = pageIndex * pageSize;
	}
	
	public static int getStartNum(int pageIndex,int pageSize){
		return (pageIndex - 1)*pageSize;
	}
	
	public static int getEndNum(int pageIndex,int pageSize){
		return pageIndex * pageSize;
	}

	public int getPageIndex() {
		return pageIndex;
	}

	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getPageNum() {
		return pageNum;
	}

	public void setPageNum(int pageNum) {
		this.pageNum = pageNum;
	}

	public int getStartNum() {
		return startNum;
	}

	public void setStartNum(int startNum) {
		this.startNum = startNum;
	}

	public int getEndNum() {
		return endNum;
	}

	public void setEndNum(int endNum) {
		this.endNum = endNum;
	}

	public int getPageTotal() {
		return pageTotal;
	}

	public void setPageTotal(int pageTotal) {
		this.pageTotal = pageTotal;
	}

	public int getNumTotal() {
		return numTotal;
	}

	public void setNumTotal(int numTotal) {
		this.numTotal = numTotal;
	}

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}
}