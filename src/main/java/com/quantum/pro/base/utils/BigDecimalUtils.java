package com.quantum.pro.base.utils;

import java.math.BigDecimal;

import org.apache.commons.lang3.StringUtils;

public class BigDecimalUtils {
	private BigDecimalUtils(){}
	
	public static BigDecimal sum(BigDecimal ... values){
		BigDecimal sum = BigDecimal.ZERO;
		for (BigDecimal val : values) {
			sum = sum.add(nvl(val));
		}
		return sum;
	}
	
	public static BigDecimal nvl(BigDecimal val){
		if(null == val){
			return BigDecimal.ZERO;
		}
		return val;
	}
	
	public static BigDecimal nvl(BigDecimal val,String defult){
		if(null != val){
			return val;
		}
		if(null == defult){
			return BigDecimal.ZERO;
		}
		return new BigDecimal(defult);
	}
	
	public static BigDecimal nvl(BigDecimal val,BigDecimal defult){
		if(null != val){
			return val;
		}
		return defult;
	}
	
	public static BigDecimal nvl(BigDecimal val,Integer defult){
		if(null != val){
			return val;
		}
		if(null == defult){
			return BigDecimal.ZERO;
		}
		return new BigDecimal(defult);
	}
	
	public static BigDecimal min(BigDecimal ... values){
		if(null == values){
			return null;
		}
		BigDecimal min  = null;
		for (BigDecimal val : values) {
			if(val == null){
				continue;
			}
			if(null == min){
				min = val;
			}
			if(val.compareTo(min)<0 ){
				min = val;
			}
		}
		return min;
	}

	public static BigDecimal max(BigDecimal ... values){
		if(null == values){
			return null;
		}
		BigDecimal max = BigDecimal.ZERO;
		for (BigDecimal val : values) {
			if(val.compareTo(max)>0 ){
				max = val;
			}
		}
		return max;
	}
	
	/**
	 * 是否整数
	 * @param val
	 * @return
	 */
	public static boolean isInteger(BigDecimal val){
		if(null == val){
			return false;
		}
		return new BigDecimal(val.intValue()).compareTo(val) == 0;
	}

	/**
	 * 判断val1的值是否大于val2的值,为空则默认0
	 * @param val1
	 * @param val2
	 * @return
	 */
	public static boolean greater(BigDecimal val1,BigDecimal val2){
		return nvl(val1).compareTo(nvl(val2))>0;
	}
	
	/**
	 * 判断val1的值是否小于val2的值,为空则默认0
	 * @param val1
	 * @param val2
	 * @return
	 */
	public static boolean less(BigDecimal val1,BigDecimal val2){
		return nvl(val1).compareTo(nvl(val2))<0;
	}
	
	/**
	 * 判断val1的值是否等于val2的值,为空则默认0
	 * @param val1
	 * @param val2
	 * @return
	 */
	public static boolean equals(BigDecimal val1,BigDecimal val2){
		return nvl(val1).compareTo(nvl(val2))==0;
	}
	
	public static BigDecimal safeBigDecimal(String val){
		if(StringUtils.isEmpty(val)){
			return null;
		}
		return new BigDecimal(val);
	}
}
