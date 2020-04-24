package com.quantum.pro.dao;

import org.apache.ibatis.annotations.Mapper;

import com.quantum.pro.model.DataBaseDto;

@Mapper
public interface DataBaseDao {
	DataBaseDto getDataBase();
	DataBaseDto getReadWriteBase();
}
