package com.jspjs.sqler.dto;

import java.io.Serializable;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
@Component("jdbcDto")
public class JdbcDto implements Serializable {
	private static final long serialVersionUID = -594370196014833241L;
	private String driver;
    private String ip;
    private String port;
    private String database;
    private String user;
    private String password;
    private String chatset;
    
    public JdbcDto(){}
    public JdbcDto(Map<String, String> parameter){
    	driver=parameter.get("driver");
    	ip=parameter.get("ip");
    	port=parameter.get("port");
    	database=parameter.get("database");
        user=parameter.get("user");
        password=parameter.get("password");
        chatset=parameter.get("chatset");
    }
    
    public String getUrl(){
        if(StringUtils.isNotBlank(database)){
        	return "jdbc:mysql://"+ip+":"+port+"/"+database+"?useUnicode=true&amp;allowMultiQueries=true&amp;characterEncoding="+chatset+"&zeroDateTimeBehavior=convertToNull";
        }else{
        	return "jdbc:mysql://"+ip+":"+port+"?useUnicode=true&amp;allowMultiQueries=true&amp;characterEncoding="+chatset+"&zeroDateTimeBehavior=convertToNull";
        }
    }

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getDatabase() {
		return database;
	}

	public void setDatabase(String database) {
		this.database = database;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getChatset() {
		return chatset;
	}

	public void setChatset(String chatset) {
		this.chatset = chatset;
	}
}
