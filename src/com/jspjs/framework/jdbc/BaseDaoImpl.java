package com.jspjs.framework.jdbc;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

public class BaseDaoImpl<T> extends SqlSessionDaoSupport implements BaseDao<T> {
	@Autowired
	SqlSession sqlSession;

	@Override
	public T selectOne(String statement, Object parameter) {
		return sqlSession.selectOne(statement, parameter);
	}

	@Override
	public <E> List<E> selectList(String statement, Object parameter) {
		return sqlSession.selectList(statement, parameter);
	}

	@Override
	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey) {
		return sqlSession.selectMap(statement, parameter,mapKey);
	}

	@Override
	public int insert(String statement, Object parameter) {
		return sqlSession.insert(statement,parameter);
	}

	@Override
	public int update(String statement, Object parameter) {
		return sqlSession.update(statement,parameter);
	}

	@Override
	public int delete(String statement, Object parameter) {
		return sqlSession.delete(statement,parameter);
	}

	@Override
	public T selectOne(String statement) {
		return sqlSession.selectOne(statement);
	}

	@Override
	public <E> List<E> selectList(String statement) {
		return sqlSession.selectList(statement);
	}

	@Override
	public <K, V> Map<K, V> selectMap(String statement, String mapKey) {
		return sqlSession.selectMap(statement,mapKey);
	}

	@Override
	public int insert(String statement) {
		return sqlSession.insert(statement);
	}

	@Override
	public int update(String statement) {
		return sqlSession.update(statement);
	}

	@Override
	public int delete(String statement) {
		return sqlSession.delete(statement);
	}

	@Override
	public <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds) {
		return sqlSession.selectList(statement,parameter,rowBounds);
	}

	@Override
	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
		return sqlSession.selectMap(statement,parameter,mapKey,rowBounds);
	}
	
	@Override
	public ResultHandler select(String statement, ResultHandler handler) {
		sqlSession.select(statement, handler);
		return handler;
	}

	@Override
	public ResultHandler select(String statement, Object parameter, ResultHandler handler) {
		sqlSession.select(statement,parameter,handler);
		return handler;
	}

	@Override
	public ResultHandler select(String statement, Object parameter, RowBounds rowBounds,ResultHandler handler) {
		sqlSession.select(statement,parameter,handler);
		return handler;
	}
	
	
}
