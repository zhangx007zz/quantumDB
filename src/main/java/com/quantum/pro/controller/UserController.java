package com.quantum.pro.controller;

import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.quantum.pro.model.UserDomain;
import com.quantum.pro.service.user.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	private final static Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @RequestMapping("/getAllUser")
	public List<UserDomain> getAllUser() {    	
    	return userService.findAllUser();
	} 
    
    @RequestMapping("/topUser")
   	public List<UserDomain> topUser() {    	
       	return userService.topUser();
   	} 
    
    @RequestMapping("/addUser")
    public boolean addUser(@RequestBody UserDomain user){
    	userService.addUser(user);
    	return true;
    }
    
    @RequestMapping("/delUser")
    public boolean delUser(@RequestParam("id") String id){
    	userService.delUser(id);
    	return true;
    }
    
    @RequestMapping("/upload")
    @ResponseBody
    public String upload(@RequestParam("file") MultipartFile file,@RequestParam("id") String id) {
        if (file.isEmpty()) {
            return "上传图片失败，请选择文件";
        }
        try {
        	 byte[] imgByte= file.getBytes();
        	 UserDomain user = new UserDomain();
        	 user.setUserimg(imgByte);
        	 if(StringUtils.isNoneBlank(id)) {
        		 user.setId(Integer.valueOf(id));
        		 userService.updateUserImg(user);
        		 return "上传成功！";
        	 }
        	 int newId = userService.addUserImg(user);
        	 return String.valueOf(newId);
		} catch (Exception e) {
			logger.error("获取异常", e);
		}      
        return "上传成功！";
    }

    @RequestMapping("/getImg")
	public void getImg(HttpServletResponse response, HttpServletRequest request, String id) {
    	UserDomain user = new UserDomain();
    	user = userService.selectUserById(id);
    	if(user==null||user.getUserimg()==null){
    		return;
    	}
		byte[] bytes = user.getUserimg();
		response.reset(); // 非常重要
		response.setContentType("image/*");
		try (OutputStream out = response.getOutputStream();) {
			response.setHeader("Content-Disposition", "inline; filename=" + java.net.URLEncoder.encode("demo", "UTF-8"));
			if (bytes != null) {
				out.write(bytes, 0, bytes.length);
			} else {
				logger.error("未获取到图片文件流");
			}
		} catch (Exception e) {
			logger.error("获取异常", e);
		}

	}    
    
}
