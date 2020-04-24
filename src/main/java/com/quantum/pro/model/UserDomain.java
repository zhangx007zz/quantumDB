package com.quantum.pro.model;

public class UserDomain {
	private String  name;
	
    private Integer id;

    private String age;

    private byte[] userimg;

    private String sex;
    
    private String addr;

   

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getAge() {
		return age;
	}

	public void setAge(String age) {
		this.age = age;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public byte[] getUserimg() {
		return userimg;
	}

	public void setUserimg(byte[] userimg) {
		this.userimg = userimg;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

    
}