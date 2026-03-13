import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import AlarmListScreen from './src/screens/AlarmListScreen';
import AddAlarmScreen from './src/screens/AddAlarmScreen';
import VoiceCloneScreen from './src/screens/VoiceCloneScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6C63FF',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'AI 闹钟' }}
            />
            <Stack.Screen 
              name="AlarmList" 
              component={AlarmListScreen}
              options={{ title: '我的闹钟' }}
            />
            <Stack.Screen 
              name="AddAlarm" 
              component={AddAlarmScreen}
              options={{ title: '添加闹钟' }}
            />
            <Stack.Screen 
              name="VoiceClone" 
              component={VoiceCloneScreen}
              options={{ title: '音色克隆' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: '设置' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
