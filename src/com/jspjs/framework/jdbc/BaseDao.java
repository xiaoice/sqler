package com.jspjs.framework.jdbc;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Repository;

@Repository("baseDao")
public interface BaseDao<T>{
	
    T selectOne(String statement, Object parameter);
    <E> List<E> selectList(String statement, Object parameter);
    <K,V> Map<K,V> selectMap(String statement, Object parameter, String mapKey);
    int insert(String statement, Object parameter);
    int update(String statement, Object parameter);
    int delete(String statement, Object parameter);
      
    T selectOne(String statement);
    <E> List<E> selectList(String statement);
    <K,V> Map<K,V> selectMap(String statement, String mapKey);
    int insert(String statement);
    int update(String statement);
    int delete(String statement);
      
    <E> List<E> selectList (String statement, Object parameter, RowBounds rowBounds);
    <K,V> Map<K,V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds);
    ResultHandler select(String statement, ResultHandler handler);
    ResultHandler select (String statement, Object parameter, ResultHandler handler);
    ResultHandler select (String statement, Object parameter, RowBounds rowBounds, ResultHandler handler);
}
