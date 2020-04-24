package com.quantum.pro.service.database.impl;

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import com.quantum.pro.base.CacheManager;
import com.quantum.pro.base.DateUtils;
import com.quantum.pro.base.utils.BigDecimalUtils;
import com.quantum.pro.base.utils.SystemUsageUtil;
import com.quantum.pro.dao.DataBaseDao;
import com.quantum.pro.model.DataBaseDto;
import com.quantum.pro.service.database.DataBaseService;

@Service
public class DataBaseServiceImpl implements DataBaseService {
	
	@Autowired
	private DataBaseDao dataBaseDao;
	
	@Override
	public DataBaseDto getDataBase() {
		DataBaseDto dto = dataBaseDao.getDataBase();
		CacheManager.addCache(CacheManager.READ,isCacheKey(CacheManager.READ));
		dto.setRead(CacheManager.getRealLink(CacheManager.READ,isCacheKey(CacheManager.READ)));
		dto.setWrite(CacheManager.getRealLink(CacheManager.WRITE,isCacheKey(CacheManager.WRITE)));
		dto.setTotalRead(CacheManager.getRealLink(CacheManager.TOTALREAD,isCacheKey(CacheManager.TOTALREAD)));
		dto.setTotalWrite(CacheManager.getRealLink(CacheManager.TOTALWRITE,isCacheKey(CacheManager.TOTALWRITE)));
		dto.setCpuUsage(SystemUsageUtil.getCpuUsage());
		dto.setMemoryUsage(SystemUsageUtil.getMemoryUsage());		
		return dto;
	}
	
	@Override
    public DataBaseDto isCacheKey(String type) {
    	String date = DateUtils.getDate(0); 
    	DataBaseDto dto = new DataBaseDto();
    	if(!CacheManager.map.containsKey(date+type)) {
    		dto = dataBaseDao.getReadWriteBase();
    		CacheManager.addCache(CacheManager.READ,dto);
		}
    	return dto;
    }

}
