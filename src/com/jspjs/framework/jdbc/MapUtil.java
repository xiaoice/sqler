package com.jspjs.framework.jdbc;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.sf.json.JSON;
import net.sf.json.JSONObject;

import org.springframework.beans.BeanUtils;

import com.zte.user.domain.User;

public class MapUtil {
	
	public static <T> Map<String,Object> fromObject(T t){
        Map<String,Object> map=new HashMap<String, Object>();
        Class<? extends Object> clazz=t.getClass();
        Field[] fields=clazz.getDeclaredFields();
        PropertyDescriptor[] ps = BeanUtils.getPropertyDescriptors(clazz);
        for(PropertyDescriptor p : ps){
        	String name = p.getName();
        	String type=p.getPropertyType().toString();
        	//String w=p.getWriteMethod().toGenericString();
        	String d=p.getDisplayName();
        	//String r=p.getReadMethod().getDefaultValue().toString();
        	String s=p.getShortDescription();
        	String value=(String) p.getValue(name);
        	System.out.println(name+"|"+type+"|"+value+"|"+"|"+d+"|"+"|"+s);
        }

        
        for(Field field:fields){
			try {
				 String fieldname= field.getName();
				 String name= getMethodName(fieldname);
	            Type type =field.getGenericType();
	            //System.out.println(type.toString()+"|"+name);
	            Method method;
	            if(type==boolean.class){
	                method=clazz.getMethod("is"+name);
	            }else{
	            	method=clazz.getMethod("get"+name);
	            }
	            map.put(field.getName(), method.invoke(t));
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
        return map;
    }
    
    // 把一个字符串的第一个字母大写、效率是最高的、  
    private static String getMethodName(String fildeName) throws Exception{
        char[] items = fildeName.toCharArray();  
        items[0] = (char) (items[0] -32);  
        return new String(items);  
    }
    
    @SuppressWarnings("unchecked")
	public static void main(String[] agrs) throws Exception{
    	User user=new User();
    	Map<String,Object> map=MapUtil.fromObject(user);
    	//Map<String,Object> map=JSONObject.fromObject(user);
    	System.out.println(map);
    	
    }
}
