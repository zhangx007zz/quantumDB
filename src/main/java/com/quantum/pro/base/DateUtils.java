package com.quantum.pro.base;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.druid.util.StringUtils;

public class DateUtils {
	
	private DateUtils(){}
	
	private static Logger logger = LoggerFactory.getLogger(DateUtils.class);
	
	public static final String DEFAULT_DATE_FORMAT = "yyyyMMdd";
	
	public static final String NOMAL_DATE_FORMAT = "yyyy-MM-dd";
	
	public static final String WEEK_DATE_FORMAT = "MM-dd";
	
	public static final String WEEK_DATE_FORMAT1 = "MM/dd";
	
	public static final String MINUTE_DATE_FORMAT = "yyyy-MM-dd HH:mm";
	
	public static final String MINUTE_DATE_FORMAT1 = "yyyy-MM-dd HH:mm:ss";
	
	public static final String MINUTE_DATE_FORMAT2 = "yyyyMMdd HHmmss";

	
	/**
	 * 需要查询今天的日期传参数0,查询昨天传-1,查询明天传1;以此类推
	 * @param amount 距离今天的日期天数
	 * @return
	 */
	public static String getDate(int amount){
		return getDate(amount,DEFAULT_DATE_FORMAT);
	}
	
	/**
	 * 校验是否指定的日期格式
	 * @param dateStr
	 * @param format
	 * @return
	 */
	public static boolean checkDateFormat(String dateStr,String format){
		return parseDate(dateStr, format) != null;
	}
	
	/**
	 * 需要查询今天的日期传参数0,查询昨天传-1,查询明天传1;以此类推
	 * @param amount 距离今天的日期天数
	 * @param format 查询返回的日期格式
	 * @return
	 */
	public static String getDate(int amount,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
		String dateStr = sdf.format(new Date());
		return getDate(amount,dateStr,format);
	}
	
	public static String getDate(int amount,String dateStr,String format){
		return formatDate(getCalendar(amount, dateStr,DEFAULT_DATE_FORMAT).getTime(), format);
	}
	
	public static String formatDefaultDate(String date, String format) {
		if (StringUtils.isEmpty(date)) {
			return date;
		}

		return formatDate(parseDate(date, DEFAULT_DATE_FORMAT), format);
	}
	
	public static Date parseDate(String date,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Date dt = null;
		try {
			dt = sdf.parse(date);
		} catch (ParseException e) {
			logger.error("日期格式转换错误",e);
		}
		return dt;
	}
	
	/**
	 * 判断是否是周末
	 * @param amount
	 * @return
	 */
	public static boolean isWeekend(int amount) {
		return isWeekend(getCalendar(amount, null,DEFAULT_DATE_FORMAT));
	}
	
	private static Calendar getCalendar(int amount, String dateStr,String format) {
		Calendar cal = Calendar.getInstance();
		if (StringUtils.isEmpty(dateStr)) {
			cal.setTime(parseDate(dateStr, format));
		}
		if(amount!=0) {
			cal.add(Calendar.DATE, amount);
		}
		return cal;
	}
	
	public static boolean isWeekend(String dateStr,String format){
		return isWeekend(getCalendar(0, dateStr, format));
	}
	
	private static boolean isWeekend(Calendar cal) {
		int weekDay = cal.get(Calendar.DAY_OF_WEEK);
		return weekDay == Calendar.SATURDAY || weekDay == Calendar.SUNDAY;
	}
	
	public static Set<String> getWeekDays(String dateStr){
		Date date = null;
		try {
			date = parseDate(dateStr, DEFAULT_DATE_FORMAT);
		} catch (Exception e) {
			logger.error("日期转换错误",e);
			date = new Date();
		}
		Set<String> weekDays = new TreeSet<>((str1,str2) -> str1.compareTo(str2));
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.setFirstDayOfWeek(Calendar.MONDAY);
		int dayweek = cal.get(Calendar.DAY_OF_WEEK);
		if(dayweek == 1){
			dayweek=dayweek+7;
		}
		formatDate(cal.getTime(),DEFAULT_DATE_FORMAT);
		cal.add(Calendar.DATE, cal.getFirstDayOfWeek()-dayweek);
		weekDays.add(formatDate(cal.getTime(),DEFAULT_DATE_FORMAT));
		
		addweekDays(cal, weekDays);
		addweekDays(cal, weekDays);
		addweekDays(cal, weekDays);
		addweekDays(cal, weekDays);
		addweekDays(cal, weekDays);
		addweekDays(cal, weekDays);
		
		return weekDays;
	}
	
	private static void addweekDays(Calendar cal, Set<String> weekDays) {
		cal.add(Calendar.DATE, 1);
		weekDays.add(formatDate(cal.getTime(), DEFAULT_DATE_FORMAT));
	}
	
	public static String formatDate(Date date,String format){
		return new SimpleDateFormat(format).format(date);
	}
	
	public static Date getNextStartDate(){
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, 1);
		cal.set(Calendar.HOUR_OF_DAY,0);
		cal.set(Calendar.MINUTE,0);
		cal.set(Calendar.SECOND,0);
		cal.set(Calendar.MILLISECOND,0);
		return cal.getTime();
	}
	
	public static long getNextStartTime(){
		return getNextStartDate().getTime()-System.currentTimeMillis();
	}
}
