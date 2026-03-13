import axios from 'axios';
import { format } from 'date-fns';

const BACKEND_URL = 'http://localhost:3000';

/**
 * 节假日服务
 * 提供节假日查询、工作日判断等功能
 */
class HolidayService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 小时缓存
  }

  /**
   * 获取指定年份的节假日数据
   * @param {number} year - 年份
   * @returns {Promise<Object>} 节假日数据
   */
  async getHolidays(year = new Date().getFullYear()) {
    const cacheKey = `holidays-${year}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/holidays?year=${year}`);
      const data = response.data;

      if (data.success) {
        this.cache.set(cacheKey, {
          data: data.data,
          timestamp: Date.now(),
        });
        return data.data;
      }

      throw new Error('获取节假日数据失败');
    } catch (error) {
      console.error('获取节假日失败:', error);
      // 返回空数据，不阻止应用运行
      return { year, holidays: [], workdays: [] };
    }
  }

  /**
   * 检查指定日期是否为节假日
   * @param {Date|string} date - 日期
   * @returns {Promise<Object>} 检查结果
   */
  async checkDate(date) {
    const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    const year = new Date(dateStr).getFullYear();

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/holidays/check?date=${dateStr}`
      );
      return response.data;
    } catch (error) {
      // 如果 API 失败，使用本地缓存数据判断
      const holidaysData = await this.getHolidays(year);
      
      const isHoliday = holidaysData.holidays.some(h => h.date === dateStr);
      const isWorkday = holidaysData.workdays.some(w => w.date === dateStr);

      return {
        success: true,
        date: dateStr,
        isHoliday,
        isWorkday,
        message: isHoliday ? '今天是节假日' : isWorkday ? '今天是调休工作日' : '今天是普通工作日',
      };
    }
  }

  /**
   * 判断闹钟是否应该在指定日期响起
   * @param {Object} alarm - 闹钟对象
   * @param {Date} date - 日期
   * @returns {Promise<boolean>} 是否应该响起
   */
  async shouldAlarmRing(alarm, date) {
    // 检查是否启用
    if (!alarm.enabled) return false;

    // 检查重复日期
    const dayOfWeek = date.getDay();
    if (!alarm.repeatDays.includes(dayOfWeek)) {
      return false;
    }

    // 检查节假日跳过
    if (alarm.skipHolidays) {
      const check = await this.checkDate(date);
      
      // 如果是节假日且不是调休工作日，则不响
      if (check.isHoliday && !check.isWorkday) {
        return false;
      }
    }

    return true;
  }

  /**
   * 获取下一个闹钟应该响起的日期
   * @param {Object} alarm - 闹钟对象
   * @param {Date} fromDate - 起始日期
   * @returns {Promise<Date|null>} 下一个响铃日期
   */
  async getNextAlarmDate(alarm, fromDate = new Date()) {
    const checkDate = new Date(fromDate);
    
    // 最多检查未来 365 天
    for (let i = 0; i < 365; i++) {
      checkDate.setDate(checkDate.getDate() + (i === 0 ? 0 : 1));
      
      // 如果时间已过，跳过今天
      if (i === 0) {
        const [hours, minutes] = alarm.time.split(':').map(Number);
        const alarmTime = new Date(checkDate);
        alarmTime.setHours(hours, minutes, 0, 0);
        
        if (alarmTime <= fromDate) {
          continue;
        }
      }

      const shouldRing = await this.shouldAlarmRing(alarm, checkDate);
      if (shouldRing) {
        return checkDate;
      }
    }

    return null;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 预加载节假日数据
   * @param {number} year - 年份
   */
  async preload(year = new Date().getFullYear()) {
    await this.getHolidays(year);
    // 预加载下一年
    await this.getHolidays(year + 1);
  }
}

// 单例导出
export default new HolidayService();
