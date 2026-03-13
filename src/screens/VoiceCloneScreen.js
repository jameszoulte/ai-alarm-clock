import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

export default function VoiceCloneScreen({ navigation }) {
  const [clonedVoices, setClonedVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewAudio, setPreviewAudio] = useState(null);

  // 上传音频样本
  const handleUploadSample = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const audioFile = result.assets[0];
      
      // 播放预览
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFile.uri },
        { shouldPlay: true }
      );
      setPreviewAudio(sound);

      Alert.alert(
        '音频已上传',
        '请确认这是要克隆的声音样本（建议 30 秒以上清晰录音）',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '开始克隆', 
            onPress: () => startCloning(audioFile)
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '上传失败：' + error.message);
    }
  };

  // 开始克隆
  const startCloning = async (audioFile) => {
    setIsCloning(true);

    try {
      // 调用后端 API 进行声音克隆
      const formData = new FormData();
      formData.append('audio', {
        uri: audioFile.uri,
        name: audioFile.name || 'sample.mp3',
        type: audioFile.mimeType || 'audio/mpeg',
      });

      const response = await fetch('http://localhost:3000/api/voice/clone', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        const newVoice = {
          id: data.voiceId,
          name: `克隆声音${clonedVoices.length + 1}`,
          createdAt: new Date().toISOString(),
          voiceId: data.voiceId,
        };

        setClonedVoices([...clonedVoices, newVoice]);
        setSelectedVoice(newVoice);
        Alert.alert('成功', '声音克隆完成！');
      } else {
        Alert.alert('失败', data.message || '克隆失败');
      }
    } catch (error) {
      Alert.alert('错误', '克隆失败：' + error.message);
    } finally {
      setIsCloning(false);
    }
  };

  // 生成测试音频
  const handleGenerateTest = async () => {
    if (!selectedVoice) {
      Alert.alert('提示', '请先选择或克隆一个声音');
      return;
    }

    if (!textInput.trim()) {
      Alert.alert('提示', '请输入要转换的文字');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:3000/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId: selectedVoice.voiceId,
          text: textInput,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 播放生成的音频
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.audioUrl },
          { shouldPlay: true }
        );
        setPreviewAudio(sound);
        Alert.alert('成功', '音频生成完成！');
      } else {
        Alert.alert('失败', data.message || '生成失败');
      }
    } catch (error) {
      Alert.alert('错误', '生成失败：' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // 设置为闹钟铃声
  const handleSetAsRingtone = () => {
    if (!selectedVoice) {
      Alert.alert('提示', '请先选择或克隆一个声音');
      return;
    }

    // TODO: 保存到设置
    Alert.alert(
      '设置成功',
      `已将"${selectedVoice.name}"设置为默认闹钟铃声`,
      [{ text: '好的' }]
    );

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* 说明卡片 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🎤 AI 音色克隆</Text>
        <Text style={styles.infoText}>
          上传一段清晰的声音样本（建议 30 秒以上），AI 将学习并克隆该音色。
          之后可以用克隆的声音生成任意文字的闹钟铃声。
        </Text>
      </View>

      {/* 上传按钮 */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUploadSample}
        disabled={isCloning}
      >
        <Text style={styles.uploadIcon}>📁</Text>
        <Text style={styles.uploadText}>
          {isCloning ? '克隆中...' : '上传声音样本'}
        </Text>
        {isCloning && <ActivityIndicator size="small" color="#fff" />}
      </TouchableOpacity>

      {/* 已克隆的声音列表 */}
      {clonedVoices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的克隆音色</Text>
          {clonedVoices.map((voice) => (
            <TouchableOpacity
              key={voice.id}
              style={[
                styles.voiceItem,
                selectedVoice?.id === voice.id && styles.voiceItemActive,
              ]}
              onPress={() => setSelectedVoice(voice)}
            >
              <Text style={styles.voiceIcon}>🎤</Text>
              <View style={styles.voiceInfo}>
                <Text style={styles.voiceName}>{voice.name}</Text>
                <Text style={styles.voiceDate}>
                  创建于 {new Date(voice.createdAt).toLocaleDateString()}
                </Text>
              </View>
              {selectedVoice?.id === voice.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 文字转语音测试 */}
      {selectedVoice && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>测试生成</Text>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="输入文字，用克隆的声音朗读..."
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateTest}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '生成中...' : '生成测试音频'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 设置为铃声 */}
      {selectedVoice && (
        <TouchableOpacity
          style={styles.setRingtoneButton}
          onPress={handleSetAsRingtone}
        >
          <Text style={styles.setRingtoneText}>设为默认闹钟铃声</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#6C63FF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceItemActive: {
    borderColor: '#6C63FF',
    backgroundColor: '#f0efff',
  },
  voiceIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  voiceDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  checkmark: {
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  textInput: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  setRingtoneButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  setRingtoneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
