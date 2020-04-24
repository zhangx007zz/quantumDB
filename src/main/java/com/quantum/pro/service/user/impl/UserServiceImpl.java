package com.quantum.pro.service.user.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quantum.pro.base.CacheManager;
import com.quantum.pro.dao.UserDao;
import com.quantum.pro.model.UserDomain;
import com.quantum.pro.service.database.DataBaseService;
import com.quantum.pro.service.user.UserService;



@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DataBaseService dataBaseService;
	
	/**
	 * 插入更新User
	 */
	@Override
	public void addUser(UserDomain user) {	
		CacheManager.addCache(CacheManager.WRITE,dataBaseService.isCacheKey(CacheManager.WRITE));
		userDao.insertUser(user);
	}
	
	/**
	 * 根据id查询用户头像
	 */
	@Override
	public UserDomain selectUserById(String id) {
		CacheManager.addCache(CacheManager.READ,dataBaseService.isCacheKey(CacheManager.READ));
		return userDao.selectUserById(id);
	}
	
	/**
	 * 添加用户头像
	 */
	@Override
	public int  addUserImg(UserDomain user) {
		CacheManager.addCache(CacheManager.WRITE,dataBaseService.isCacheKey(CacheManager.WRITE));
		 userDao.insertUserImg(user);
		 return user.getId();
	}
	
	/**
	 * 更新用户头像
	 */
	@Override
	public void updateUserImg(UserDomain user) {
		CacheManager.addCache(CacheManager.WRITE,dataBaseService.isCacheKey(CacheManager.WRITE));
		 userDao.updateUserImg(user);
	}
	
	/**
	 * 获取User表
	 */
	@Override
	public List<UserDomain> findAllUser() {	
		CacheManager.addCache(CacheManager.READ,dataBaseService.isCacheKey(CacheManager.READ));
		return userDao.selectUsers();
	}
	
	/**
	 * 删除user表
	 */
	@Override
	public void delUser(String id) {	
		CacheManager.addCache(CacheManager.WRITE,dataBaseService.isCacheKey(CacheManager.WRITE));
		userDao.delUser(id);
	}

	@Override
	public UserDomain topUser() {
		CacheManager.addCache(CacheManager.READ,dataBaseService.isCacheKey(CacheManager.READ));
		return userDao.topUser();
	}


}
