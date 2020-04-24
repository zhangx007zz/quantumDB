package com.quantum.pro.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.quantum.pro.model.UserTestDto;

@Mapper
public interface UserTestDao {
	
    int insertAUser(UserTestDto dto);
    
    int updateAUser(UserTestDto dto);
    
    int delAUser(String id);
    
    List<UserTestDto> selectUsers();
    
    List<UserTestDto> selectAUsers();
    
    int insertBUser(UserTestDto dto);
    
    int updateBUser(UserTestDto dto);
    
    int delBUser(String id);
    
}
