package com.quantum.pro.service.database;

import com.quantum.pro.model.DataBaseDto;

public interface DataBaseService {
	 DataBaseDto getDataBase();
	 DataBaseDto isCacheKey(String type);
}
