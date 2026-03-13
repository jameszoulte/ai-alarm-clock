import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextAlarm, setNextAlarm] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 加载下一个闹钟
    loadNextAlarm();

    return () => clearInterval(timer);
  }, []);

  const loadNextAlarm = async () => {
    // TODO: 从存储中加载下一个闹钟
    // const alarms = await AsyncStorage.getItem('alarms');
    setNextAlarm({ time: '07:30', label: '起床' });
  };

  return (
    <View style={styles.container}>
      {/* 时间显示 */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {format(currentTime, 'HH:mm', { locale: zhCN })}
        </Text>
        <Text style={styles.dateText}>
          {format(currentTime, 'yyyy 年 MM 月 dd 日 EEEE', { locale: zhCN })}
        </Text>
      </View>

      {/* 下一个闹钟 */}
      {nextAlarm && (
        <View style={styles.nextAlarmCard}>
          <Text style={styles.nextAlarmLabel}>下一个闹钟</Text>
          <View style={styles.nextAlarmRow}>
            <Text style={styles.nextAlarmTime}>{nextAlarm.time}</Text>
            <Text style={styles.nextAlarmLabel}>{nextAlarm.label}</Text>
          </View>
        </View>
      )}

      {/* 快捷操作 */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddAlarm')}
        >
          <Text style={styles.actionIcon}>⏰</Text>
          <Text style={styles.actionText}>添加闹钟</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AlarmList')}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>闹钟列表</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VoiceClone')}
        >
          <Text style={styles.actionIcon}>🎤</Text>
          <Text style={styles.actionText}>音色克隆</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>设置</Text>
        </TouchableOpacity>
      </View>

      {/* 功能说明 */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ 特色功能</Text>
        <Text style={styles.featureItem}>• AI 音色克隆，定制专属铃声</Text>
        <Text style={styles.featureItem}>• 支持节假日智能跳过</Text>
        <Text style={styles.featureItem}>• 自定义循环规则</Text>
        <Text style={styles.featureItem}>• 无需登录，保护隐私</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '200',
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  nextAlarmCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  nextAlarmLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  nextAlarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  nextAlarmTime: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 15,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});
