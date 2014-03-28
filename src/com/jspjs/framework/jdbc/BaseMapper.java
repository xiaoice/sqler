package com.jspjs.framework.jdbc;

import java.util.List;

import org.springframework.stereotype.Component;

@Component("baseMapper")
public interface BaseMapper<T>{
	public int insert(T user);
	public int deleteById(int id);
	public int update(T user);
	public T getById(int id);
	public List<T> findAll();
}
