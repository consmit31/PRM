import { StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import CustomHeader from '../../../components/CustomHeader'

const PersonalPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <CustomHeader 
        todayScore={85}
        todosLeft={3}
        streakValue={10}
        title="Personal Dashboard" 
        subtitle="Manage your personal information"
        rightIcon="notifications-outline"
        onRightIconPress={() => console.log('Notifications pressed')}
      /> */}
      <View style={styles.content}>
        <Text>PersonalPage Content</Text>
      </View>
    </SafeAreaView>
  )
}

export default PersonalPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
})