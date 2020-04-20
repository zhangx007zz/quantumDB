package com.quantum.pro;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.quantum.pro.dao")
public class QuantumDbApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuantumDbApplication.class, args);
	}

}
