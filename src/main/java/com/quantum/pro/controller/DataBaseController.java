package com.quantum.pro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.pro.model.DataBaseDto;
import com.quantum.pro.service.database.DataBaseService;

@RestController
@RequestMapping("/dataBase")
public class DataBaseController {
	@Autowired
	private DataBaseService dataBaseService;
	/**
	 * 
	 * @return
	 */
	@RequestMapping("/getDataBase")
	public DataBaseDto getDataBase(){
		return dataBaseService.getDataBase();
	}
}
