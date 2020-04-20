package com.quantum.pro.model;

import java.sql.Blob;

public class UserDomain {
    private Integer userId;

    private String age;

    private Blob userimg;

    private String sex;
    
    private String addr;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

	public String getAge() {
		return age;
	}

	public void setAge(String age) {
		this.age = age;
	}

	public Blob getUserimg() {
		return userimg;
	}

	public void setUserimg(Blob userimg) {
		this.userimg = userimg;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

    
}