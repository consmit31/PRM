import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
    streakValue: number;
    todosLeft: number;
    todayScore: number;
  title: string;
  subtitle?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ 
    streakValue,
    todosLeft,
    todayScore,
  title, 
  subtitle, 
  rightIcon, 
  onRightIconPress 
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
            <Ionicons
                name="star"
                size={24}
                color="#FFD700"
            />
            {todayScore}
        </Text>

        <Text style={styles.icon}>
            <Ionicons
                name="flame"
                size={24}
                color="#FF4500"
            />
            {streakValue}
        </Text>

        <Text style={styles.icon}>
            <Ionicons
                name="checkmark-done"
                size={24}
                color="#32CD32"
            />
            {todosLeft}
        </Text>
      </View>
      
      {rightIcon && (
        <Ionicons 
          name={rightIcon as any} 
          size={24} 
          color="#007AFF"
          onPress={onRightIconPress}
          style={styles.rightIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  iconContainer: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    marginHorizontal: 8,
    fontSize: 24,
  },
  rightIcon: {
    padding: 5,
  },
});

export default CustomHeader;