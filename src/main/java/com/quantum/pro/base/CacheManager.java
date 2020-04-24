package com.quantum.pro.base;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.druid.util.StringUtils;
import com.quantum.pro.model.DataBaseDto;


public class CacheManager {
	private final static Logger logger = LoggerFactory.getLogger(CacheManager.class);
	public final static String READ = "read";
	public final static String WRITE = "write";
	public final static String TOTALWRITE = "totalWrite";
	public final static String TOTALREAD = "totalRead";	
    
    /**存储缓存数据**/
    public static  Map<String, Long> map = new HashMap<String, Long>();
    /**
     * 更新缓存数据
     */
    public static void updateCache(DataBaseDto dto){
        clearCache();
        loadData(dto);
        logger.info(map.size()+"条数据已加载到缓存!");
    }
    
    public static void addReadCache(){    	
    	String key = new StringBuilder(DateUtils.getDate(0)).append(READ).toString();
    	String totalKey = new StringBuilder(DateUtils.getDate(0)).append(TOTALREAD).toString(); 
        map.put(key, map.get(key)+1);
        map.put(totalKey, map.get(totalKey)+1);
    }
    
    public static void addCache(String type,DataBaseDto dto){
    	String date = DateUtils.getDate(0); 
    	if(!CacheManager.map.containsKey(date+type)) {
			updateCache(dto);
		}
    	if(StringUtils.equals(type, READ)) {
    		addReadCache();
    	}else {
    		addWriteCache();
		}
    }
    
    public static void addWriteCache(){
    	String key = new StringBuilder(DateUtils.getDate(0)).append(WRITE).toString(); 
    	String totalKey = new StringBuilder(DateUtils.getDate(0)).append(TOTALWRITE).toString(); 
        map.put(key, map.get(key)+1);
        map.put(totalKey, map.get(totalKey)+1);
    }
    /**
     * 清理缓存数据
     */
    public static void clearCache(){
        map.clear();
    }
    /**
     * 获取缓存数据
     */
    public static Long getRealLink(String type,DataBaseDto dto){
    	String date = DateUtils.getDate(0); 
    	if(!CacheManager.map.containsKey(date+type)) {
			updateCache(dto);
		}
        return map.get(date+type);
    }
    /**
     * 加载缓存数据
     */
    private static void loadData(DataBaseDto dto){
    	String date = DateUtils.getDate(0); 	
    	map.put(new StringBuilder(date).append(READ).toString(), dto.getRead()==null?0L:dto.getRead());
    	map.put(new StringBuilder(date).append(WRITE).toString(), dto.getWrite()==null?0L:dto.getWrite());
    	map.put(new StringBuilder(date).append(TOTALWRITE).toString(), dto.getTotalRead()==null?210L:dto.getTotalRead());
    	map.put(new StringBuilder(date).append(TOTALREAD).toString(), dto.getTotalWrite()==null?750L:dto.getTotalWrite());
    	logger.info("加载缓存数据,这里根据业务需求完成缓存数据的获取!");
    }
    
}