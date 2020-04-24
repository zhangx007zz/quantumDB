package com.quantum.pro.base.filter;

import java.util.Properties;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Component;

import com.quantum.pro.base.CacheManager;
import com.quantum.pro.base.DateUtils;

@Intercepts({@Signature(type = Executor.class, method ="update", args = {MappedStatement.class, Object.class}),
	  @Signature(type = Executor.class, method = "query", args = {  
              MappedStatement.class, Object.class, RowBounds.class,ResultHandler.class })})
@Component
public class MybatisIntercepts implements Interceptor {
	
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
    	String methodName = invocation.getMethod().getName(); 
    	String date = DateUtils.getDate(0); 
    	
    	if (methodName.equals("query")&&CacheManager.map.containsKey(date+"read")) {
        	CacheManager.addReadCache();
    	}else if(methodName.equals("update")&&CacheManager.map.containsKey(date+"write")){
    		CacheManager.addWriteCache();
    	}
    	return invocation.proceed();
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }


}