package com.quantum.pro.model;

import java.math.BigDecimal;

public class DataBaseDto {
	
	private Long tableNum;

    private Long rowsNum;
    
    private Long columnNum;
    
    private Long totalRead;
    
    private Long totalWrite;
    
    private Long write;
    
    private Long read;
    
    private BigDecimal cpuUsage;
    
    private BigDecimal memoryUsage;
    
    private String  readRta;
    
    private String  writeRta;
    

	public String getReadRta() {
		return readRta;
	}

	public void setReadRta(String readRta) {
		this.readRta = readRta;
	}

	public String getWriteRta() {
		return writeRta;
	}

	public void setWriteRta(String writeRta) {
		this.writeRta = writeRta;
	}

	public BigDecimal getCpuUsage() {
		return cpuUsage;
	}

	public void setCpuUsage(BigDecimal cpuUsage) {
		this.cpuUsage = cpuUsage;
	}

	public BigDecimal getMemoryUsage() {
		return memoryUsage;
	}

	public void setMemoryUsage(BigDecimal memoryUsage) {
		this.memoryUsage = memoryUsage;
	}

	public Long getTableNum() {
		return tableNum;
	}

	public void setTableNum(Long tableNum) {
		this.tableNum = tableNum;
	}

	public Long getRowsNum() {
		return rowsNum;
	}

	public void setRowsNum(Long rowsNum) {
		this.rowsNum = rowsNum;
	}

	public Long getColumnNum() {
		return columnNum;
	}

	public void setColumnNum(Long columnNum) {
		this.columnNum = columnNum;
	}

	public Long getTotalRead() {
		return totalRead;
	}

	public void setTotalRead(Long totalRead) {
		this.totalRead = totalRead;
	}

	public Long getTotalWrite() {
		return totalWrite;
	}

	public void setTotalWrite(Long totalWrite) {
		this.totalWrite = totalWrite;
	}

	public Long getWrite() {
		return write;
	}

	public void setWrite(Long write) {
		this.write = write;
	}

	public Long getRead() {
		return read;
	}

	public void setRead(Long read) {
		this.read = read;
	}
    

	
    
}
