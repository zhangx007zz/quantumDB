package com.quantum.pro.service.user.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quantum.pro.dao.UserTestDao;
import com.quantum.pro.model.UserTestDto;
import com.quantum.pro.service.user.UserTestService;

@Service
public class UserTestServiceImpl implements UserTestService{
	
	@Autowired
	private UserTestDao dao;

	@Override
	public List<UserTestDto> selectUser() {
		return dao.selectUsers();
	}

	@Transactional
	@Override
	public boolean insertUser(UserTestDto dto) {
		// TODO Auto-generated method stub
		int id = dao.insertAUser(dto);
		dao.insertBUser(dto);		
		return true;
	}

	@Transactional
	@Override
	public boolean updateUser(UserTestDto dto) {
		dao.updateAUser(dto);
		dao.updateBUser(dto);
		return true;
	}

	@Transactional
	@Override
	public boolean delUser(String id) {
		dao.delAUser(id);
		dao.delBUser(id);
		return true;
	}

	@Override
	public List<UserTestDto> selectAUser() {
		return dao.selectAUsers();
	}

	@Override
	public int insertAUser(UserTestDto dto) {
		return dao.insertAUser(dto);
	}

	@Override
	public int updateAUser(UserTestDto dto) {
		return dao.updateAUser(dto);
	}

	@Override
	public int delAUser(String id) {
		return dao.delAUser(id);
	}

}
