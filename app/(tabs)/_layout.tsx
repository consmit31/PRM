import { Tabs } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TabLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

    
      <CustomHeader 
          todayScore={85}
          todosLeft={3}
          streakValue={10}
          title="Personal Dashboard" 
          subtitle="Manage your personal information"
          rightIcon="notifications-outline"
          onRightIconPress={() => console.log('Notifications pressed')}
        />

      <Tabs>
        <Tabs.Screen 
          name="(personal)/index" 
          options={{ 
            headerShown: false,
            title: 'Personal',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size} 
                color={color} 
              />
            )
          }}
        />
          <Tabs.Screen 
            name="(overview)/index" 
            options={{ 
              headerShown: false,
              title: 'Overview',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'stats-chart' : 'stats-chart-outline'} 
                  size={size} 
                  color={color} 
                />
              )
            }} 
          />
          <Tabs.Screen 
            name="(settings)/index" 
            options={{ 
              headerShown: false,
              title: 'Settings',
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'settings' : 'settings-outline'} 
                  size={size} 
                  color={color} 
                />
              )
            }} 
          />
      </Tabs>
    </SafeAreaView>
  )
}

export default TabLayout

const styles = StyleSheet.create({})