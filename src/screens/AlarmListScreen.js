import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
} from 'react-native';

export default function AlarmListScreen({ navigation }) {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    loadAlarms();
    
    // 监听焦点，刷新列表
    const unsubscribe = navigation.addListener('focus', loadAlarms);
    return unsubscribe;
  }, []);

  const loadAlarms = async () => {
    // TODO: 从 AsyncStorage 加载
    // const stored = await AsyncStorage.getItem('alarms');
    // setAlarms(stored ? JSON.parse(stored) : []);
    
    // 模拟数据
    setAlarms([
      {
        id: '1',
        time: '07:30',
        label: '起床',
        enabled: true,
        repeatDays: [1, 2, 3, 4, 5],
        skipHolidays: true,
        soundType: 'cloned',
      },
      {
        id: '2',
        time: '08:00',
        label: '晨跑',
        enabled: false,
        repeatDays: [6, 0],
        skipHolidays: false,
        soundType: 'default',
      },
    ]);
  };

  const toggleAlarm = async (id) => {
    const updated = alarms.map(alarm =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    setAlarms(updated);
    // TODO: 保存到 AsyncStorage
  };

  const deleteAlarm = (id) => {
    Alert.alert('确认删除', '确定要删除这个闹钟吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          setAlarms(alarms.filter(a => a.id !== id));
          // TODO: 保存到 AsyncStorage
        },
      },
    ]);
  };

  const getRepeatText = (days) => {
    const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
    if (days.length === 0) return '仅一次';
    if (days.length === 7) return '每天';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) {
      return '工作日';
    }
    if (days.length === 2 && days.includes(0) && days.includes(6)) {
      return '周末';
    }
    return days.map(d => dayMap[d]).join(', ');
  };

  const renderAlarm = ({ item }) => (
    <View style={[styles.alarmCard, !item.enabled && styles.alarmCardDisabled]}>
      <View style={styles.alarmTimeRow}>
        <Text style={styles.alarmTime}>{item.time}</Text>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleAlarm(item.id)}
          trackColor={{ false: '#ccc', true: '#6C63FF' }}
          thumbColor={item.enabled ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <Text style={styles.alarmLabel}>{item.label}</Text>
      
      <View style={styles.alarmMeta}>
        <Text style={styles.alarmRepeat}>
          📅 {getRepeatText(item.repeatDays)}
        </Text>
        {item.skipHolidays && (
          <Text style={styles.alarmHoliday}>🎌 节假日跳过</Text>
        )}
        <Text style={styles.alarmSound}>
          🔔 {item.soundType === 'cloned' ? 'AI 克隆音色' : item.soundType === 'custom' ? '自定义' : '默认'}
        </Text>
      </View>

      <View style={styles.alarmActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddAlarm', { alarm: item })}
        >
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteAlarm(item.id)}
        >
          <Text style={styles.deleteButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⏰</Text>
          <Text style={styles.emptyText}>还没有闹钟</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAlarm')}
          >
            <Text style={styles.addButtonText}>添加第一个闹钟</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={alarms}
          renderItem={renderAlarm}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAlarm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 15,
  },
  alarmCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  alarmCardDisabled: {
    opacity: 0.6,
  },
  alarmTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alarmTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  alarmLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  alarmMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  alarmRepeat: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  alarmHoliday: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  alarmSound: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  alarmActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  deleteButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
