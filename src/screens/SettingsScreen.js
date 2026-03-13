import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';

export default function SettingsScreen() {
  const [volume, setVolume] = useState(80);
  const [vibrate, setVibrate] = useState(true);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [autoOffEnabled, setAutoOffEnabled] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      '清除所有数据',
      '确定要清除所有闹钟和设置吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            // TODO: 清除 AsyncStorage
            Alert.alert('已清除', '所有数据已重置');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      '关于 AI 闹钟',
      '版本：1.0.0\n\n一款支持 AI 音色克隆的智能闹钟应用。\n无需登录，保护隐私。',
      [{ text: '好的' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 声音设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔊 声音</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel">闹钟音量</Text>
          <Text style={styles.settingValue}>{volume}%</Text>
        </View>
        
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${volume}%` }]} />
          </View>
          <View style={styles.sliderDots}>
            {[1, 2, 3, 4, 5].map((dot) => (
              <TouchableOpacity
                key={dot}
                style={styles.sliderDot}
                onPress={() => setVolume(dot * 20)}
              >
                <View
                  style={[
                    styles.sliderDotInner,
                    volume >= dot * 20 && styles.sliderDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel">响铃时震动</Text>
          <Switch
            value={vibrate}
            onValueChange={setVibrate}
            trackColor={{ false: '#ccc', true: '#6C63FF' }}
            thumbColor={vibrate ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 贪睡设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle">😴 贪睡</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel">启用贪睡功能</Text>
          <Switch
            value={snoozeEnabled}
            onValueChange={setSnoozeEnabled}
            trackColor={{ false: '#ccc', true: '#6C63FF' }}
            thumbColor={snoozeEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {snoozeEnabled && (
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel">贪睡间隔</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                const durations = [5, 10, 15, 20, 30];
                const currentIndex = durations.indexOf(snoozeDuration);
                const nextIndex = (currentIndex + 1) % durations.length;
                setSnoozeDuration(durations[nextIndex]);
              }}
            >
              <Text style={styles.pickerValue}>{snoozeDuration} 分钟</Text>
              <Text style={styles.pickerIcon}>⌄</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 自动关闭 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle">⏱️ 自动关闭</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel">
            响铃后自动关闭
            {'\n'}
            <Text style={styles.settingHint}>
              无操作时自动停止响铃
            </Text>
          </Text>
          <Switch
            value={autoOffEnabled}
            onValueChange={setAutoOffEnabled}
            trackColor={{ false: '#ccc', true: '#6C63FF' }}
            thumbColor={autoOffEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {autoOffEnabled && (
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>自动关闭时间</Text>
            <Text style={styles.settingValue}>5 分钟</Text>
          </View>
        )}
      </View>

      {/* 数据管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 数据</Text>
        
        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleResetData}
        >
          <Text style={styles.actionLabel}>
            清除所有数据
            {'\n'}
            <Text style={styles.actionHint">删除所有闹钟和设置</Text>
          </Text>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle">ℹ️ 关于</Text>
        
        <TouchableOpacity style={styles.actionRow} onPress={handleAbout}>
          <Text style={styles.actionLabel">版本信息</Text>
          <Text style={styles.actionValue}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Linking.openURL('https://github.com')}
        >
          <Text style={styles.actionLabel">开源代码</Text>
          <Text style={styles.actionIcon}>🔗</Text>
        </TouchableOpacity>
      </View>

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
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  settingHint: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'normal',
  },
  settingValue: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  sliderContainer: {
    paddingVertical: 15,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sliderDot: {
    padding: 5,
  },
  sliderDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  sliderDotActive: {
    backgroundColor: '#6C63FF',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  pickerValue: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  pickerIcon: {
    fontSize: 18,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  actionHint: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'normal',
  },
  actionValue: {
    fontSize: 14,
    color: '#999',
  },
  actionIcon: {
    fontSize: 20,
  },
});
