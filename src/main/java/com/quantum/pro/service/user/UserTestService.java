package com.quantum.pro.service.user;

import java.util.List;

import com.quantum.pro.model.UserTestDto;

public interface UserTestService {
	
	List<UserTestDto> selectUser();
	
	boolean insertUser(UserTestDto dto);
	
	boolean updateUser(UserTestDto dto);
	
	boolean delUser(String id);
	
	List<UserTestDto> selectAUser();
	
	int insertAUser(UserTestDto dto);
	
	int updateAUser(UserTestDto dto);
	
	int delAUser(String id);

}
