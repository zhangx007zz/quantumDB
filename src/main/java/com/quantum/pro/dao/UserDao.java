package com.quantum.pro.dao;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.quantum.pro.model.UserDomain;

@Mapper
public interface UserDao {


    int insert(UserDomain record);



    List<UserDomain> selectUsers();
}