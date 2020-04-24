package com.quantum.pro.service.user;

import java.util.List;

import com.quantum.pro.model.UserDomain;

public interface UserService {   
	
	int addUserImg (UserDomain user);
	
	void addUser(UserDomain user);
	
    List<UserDomain> findAllUser();
    
	void delUser(String id);
	
	UserDomain selectUserById(String id);
		
	void updateUserImg(UserDomain user) ;
	
	UserDomain topUser();

}
