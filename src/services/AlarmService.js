import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import HolidayService from './HolidayService';

const ALARM_STORAGE_KEY = 'alarms';
const SETTINGS_STORAGE_KEY = 'alarm_settings';

/**
 * 闹钟服务
 * 管理闹钟的存储、调度、响铃
 */
class AlarmService {
  constructor() {
    this.sound = null;
    this.alarmTriggered = null;
    
    // 配置通知
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  /**
   * 获取所有闹钟
   * @returns {Promise<Array>} 闹钟列表
   */
  async getAlarms() {
    try {
      const stored = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取闹钟失败:', error);
      return [];
    }
  }

  /**
   * 保存所有闹钟
   * @param {Array} alarms - 闹钟列表
   */
  async saveAlarms(alarms) {
    try {
      await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
      await this.scheduleAllAlarms(alarms);
    } catch (error) {
      console.error('保存闹钟失败:', error);
    }
  }

  /**
   * 添加闹钟
   * @param {Object} alarm - 闹钟对象
   * @returns {Promise<Object>} 添加后的闹钟
   */
  async addAlarm(alarm) {
    const alarms = await this.getAlarms();
    const newAlarm = {
      ...alarm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    alarms.push(newAlarm);
    await this.saveAlarms(alarms);
    return newAlarm;
  }

  /**
   * 更新闹钟
   * @param {string} id - 闹钟 ID
   * @param {Object} updates - 更新内容
   */
  async updateAlarm(id, updates) {
    const alarms = await this.getAlarms();
    const index = alarms.findIndex(a => a.id === id);
    
    if (index !== -1) {
      alarms[index] = { ...alarms[index], ...updates };
      await this.saveAlarms(alarms);
    }
  }

  /**
   * 删除闹钟
   * @param {string} id - 闹钟 ID
   */
  async deleteAlarm(id) {
    const alarms = await this.getAlarms();
    const filtered = alarms.filter(a => a.id !== id);
    await this.saveAlarms(filtered);
    
    // 取消对应的通知
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  /**
   * 调度所有闹钟
   * @param {Array} alarms - 闹钟列表
   */
  async scheduleAllAlarms(alarms) {
    // 取消所有现有通知
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 为每个启用的闹钟调度通知
    for (const alarm of alarms) {
      if (alarm.enabled) {
        await this.scheduleAlarm(alarm);
      }
    }
  }

  /**
   * 调度单个闹钟
   * @param {Object} alarm - 闹钟对象
   */
  async scheduleAlarm(alarm) {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    
    // 计算下一次响铃时间
    const nextDate = await HolidayService.getNextAlarmDate(alarm, new Date());
    
    if (!nextDate) return;

    const triggerTime = new Date(nextDate);
    triggerTime.setHours(hours, minutes, 0, 0);

    // 创建通知
    await Notifications.scheduleNotificationAsync({
      identifier: alarm.id,
      content: {
        title: '⏰ 闹钟响了',
        body: alarm.label || '起床时间到了',
        sound: await this.getAlarmSound(alarm),
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'alarm',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerTime.getTime(),
        channelId: 'alarms',
      },
    });

    console.log(`闹钟已调度：${alarm.time} ${alarm.label}`);
  }

  /**
   * 获取闹钟声音
   * @param {Object} alarm - 闹钟对象
   * @returns {Promise<string>} 声音文件路径
   */
  async getAlarmSound(alarm) {
    if (alarm.soundType === 'custom' && alarm.selectedSound) {
      return alarm.selectedSound.uri;
    }
    
    if (alarm.soundType === 'cloned' && alarm.selectedSound) {
      // 从后端获取克隆的声音
      try {
        const response = await fetch(
          `http://localhost:3000/api/voice/generate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              voiceId: alarm.selectedSound.voiceId,
              text: '起床时间到了',
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          return data.audioUrl;
        }
      } catch (error) {
        console.error('获取克隆声音失败:', error);
      }
    }

    // 默认声音
    return 'default';
  }

  /**
   * 播放闹钟声音
   * @param {Object} alarm - 闹钟对象
   */
  async playAlarm(alarm) {
    try {
      // 停止之前的声音
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      }

      const soundPath = await this.getAlarmSound(alarm);
      
      // 加载并播放声音
      this.sound = new Audio.Sound();
      await this.sound.loadAsync(
        { uri: soundPath },
        { shouldPlay: true, isLooping: true },
        this.onPlaybackStatusUpdate
      );

      // 震动
      if (Platform.OS === 'android') {
        // Android 震动
        const { Vibration } = require('react-native');
        Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
      }

      this.alarmTriggered = alarm;
    } catch (error) {
      console.error('播放闹钟失败:', error);
    }
  }

  /**
   * 停止闹钟
   */
  async stopAlarm() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // 停止震动
      if (Platform.OS === 'android') {
        const { Vibration } = require('react-native');
        Vibration.cancel();
      }

      this.alarmTriggered = null;
    } catch (error) {
      console.error('停止闹钟失败:', error);
    }
  }

  /**
   * 贪睡
   * @param {number} minutes - 贪睡分钟数
   */
  async snooze(minutes = 5) {
    await this.stopAlarm();

    if (!this.alarmTriggered) return;

    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    
    await Notifications.scheduleNotificationAsync({
      identifier: `${this.alarmTriggered.id}-snooze-${Date.now()}`,
      content: {
        title: '⏰ 贪睡闹钟',
        body: this.alarmTriggered.label || '该起床了',
        sound: await this.getAlarmSound(this.alarmTriggered),
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: snoozeTime.getTime(),
      },
    });

    console.log(`贪睡 ${minutes} 分钟`);
  }

  /**
   * 播放状态更新回调
   */
  onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      // 播放结束，重新开始（循环）
      if (this.sound) {
        this.sound.replayAsync();
      }
    }
  };

  /**
   * 请求通知权限
   */
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('通知权限未授予');
      return false;
    }

    // 创建通知频道（Android）
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alarms', {
        name: '闹钟',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500, 200, 500],
        sound: 'default',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    return true;
  }

  /**
   * 获取设置
   */
  async getSettings() {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultSettings();
    } catch (error) {
      console.error('获取设置失败:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * 保存设置
   */
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }

  /**
   * 默认设置
   */
  getDefaultSettings() {
    return {
      volume: 80,
      vibrate: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
      autoOffEnabled: false,
      autoOffDuration: 5,
    };
  }
}

// 单例导出
export default new AlarmService();
