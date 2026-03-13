import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { format } from 'date-fns';

export default function AddAlarmScreen({ navigation, route }) {
  const [time, setTime] = useState('07:30');
  const [label, setLabel] = useState('起床');
  const [enabled, setEnabled] = useState(true);
  const [repeatDays, setRepeatDays] = useState([1, 2, 3, 4, 5]); // 周一到周五
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [soundType, setSoundType] = useState('default'); // default, cloned, custom
  const [selectedSound, setSelectedSound] = useState(null);

  const weekDays = [
    { key: 0, label: '日', active: false },
    { key: 1, label: '一', active: true },
    { key: 2, label: '二', active: true },
    { key: 3, label: '三', active: true },
    { key: 4, label: '四', active: true },
    { key: 5, label: '五', active: true },
    { key: 6, label: '六', active: false },
  ];

  const toggleDay = (dayKey) => {
    if (repeatDays.includes(dayKey)) {
      setRepeatDays(repeatDays.filter(d => d !== dayKey));
    } else {
      setRepeatDays([...repeatDays, dayKey]);
    }
  };

  const handleSave = async () => {
    const alarm = {
      id: Date.now().toString(),
      time,
      label,
      enabled,
      repeatDays,
      skipHolidays,
      soundType,
      selectedSound,
      createdAt: new Date().toISOString(),
    };

    // TODO: 保存到 AsyncStorage
    // const existingAlarms = await AsyncStorage.getItem('alarms');
    // const alarms = existingAlarms ? JSON.parse(existingAlarms) : [];
    // alarms.push(alarm);
    // await AsyncStorage.setItem('alarms', JSON.stringify(alarms));

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* 时间选择 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>闹钟时间</Text>
        <TouchableOpacity style={styles.timePicker}>
          <Text style={styles.timePickerText}>{time}</Text>
          <Text style={styles.timePickerIcon}>⏰</Text>
        </TouchableOpacity>
      </View>

      {/* 标签 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>标签</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="给闹钟起个名字"
          maxLength={20}
        />
      </View>

      {/* 重复设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>重复</Text>
        <View style={styles.weekDays}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.weekDay,
                repeatDays.includes(day.key) && styles.weekDayActive,
              ]}
              onPress={() => toggleDay(day.key)}
            >
              <Text
                style={[
                  styles.weekDayText,
                  repeatDays.includes(day.key) && styles.weekDayTextActive,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 节假日跳过 */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>节假日自动跳过</Text>
          <Switch
            value={skipHolidays}
            onValueChange={setSkipHolidays}
            trackColor={{ false: '#ccc', true: '#6C63FF' }}
            thumbColor={skipHolidays ? '#fff' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.settingHint}>
          法定节假日闹钟不会响起
        </Text>
      </View>

      {/* 铃声选择 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>铃声</Text>
        
        <TouchableOpacity
          style={[
            styles.soundOption,
            soundType === 'default' && styles.soundOptionActive,
          ]}
          onPress={() => setSoundType('default')}
        >
          <Text style={styles.soundOptionIcon}>🔔</Text>
          <View style={styles.soundOptionContent}>
            <Text style={styles.soundOptionTitle}>默认铃声</Text>
            <Text style={styles.soundOptionDesc}>系统预设铃声</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.soundOption,
            soundType === 'cloned' && styles.soundOptionActive,
          ]}
          onPress={() => {
            setSoundType('cloned');
            navigation.navigate('VoiceClone');
          }}
        >
          <Text style={styles.soundOptionIcon}>🎤</Text>
          <View style={styles.soundOptionContent}>
            <Text style={styles.soundOptionTitle}>AI 克隆音色</Text>
            <Text style={styles.soundOptionDesc}>
              {selectedSound ? selectedSound.name : '点击设置克隆音色'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.soundOption,
            soundType === 'custom' && styles.soundOptionActive,
          ]}
          onPress={() => setSoundType('custom')}
        >
          <Text style={styles.soundOptionIcon}>🎵</Text>
          <View style={styles.soundOptionContent}>
            <Text style={styles.soundOptionTitle}>自定义音频</Text>
            <Text style={styles.soundOptionDesc}>上传本地音频文件</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 启用开关 */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>启用闹钟</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: '#ccc', true: '#6C63FF' }}
            thumbColor={enabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 保存按钮 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存闹钟</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  timePickerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  timePickerIcon: {
    fontSize: 24,
  },
  input: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    fontSize: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayActive: {
    backgroundColor: '#6C63FF',
  },
  weekDayText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  weekDayTextActive: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  soundOptionActive: {
    borderColor: '#6C63FF',
    backgroundColor: '#f0efff',
  },
  soundOptionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  soundOptionContent: {
    flex: 1,
  },
  soundOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  soundOptionDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    margin: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
