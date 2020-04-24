package com.quantum.pro.dao;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.quantum.pro.model.UserDomain;

@Mapper
public interface UserDao {
	int insertUserImg (UserDomain record);
	
    int insertUser(UserDomain record);
    
    int updateUserImg(UserDomain user);
    
    UserDomain selectUserById(String id);    
    
    int delUser(String id);
    
    List<UserDomain> selectUsers();
    
    List<UserDomain> topUser();
}