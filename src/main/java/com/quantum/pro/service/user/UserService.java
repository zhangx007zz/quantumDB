package com.quantum.pro.service.user;

import com.github.pagehelper.PageInfo;
import com.quantum.pro.model.UserDomain;

public interface UserService {

    int addUser(UserDomain user);

    PageInfo<UserDomain> findAllUser(int pageNum, int pageSize);
}
