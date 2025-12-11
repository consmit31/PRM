import { StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { use, useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { activityItemsTable } from '../../../db/schema';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../../drizzle/migrations/migrations';


const expo = SQLite.openDatabaseSync('prm.db');

const db = drizzle(expo);

const PersonalPage = () => {
  const [migrationSuccess, setMigrationSuccess] = useState(false);
  const [migrationError, setMigrationError] = useState<Error | null>(null);
  const [items, setItems] = useState<typeof activityItemsTable.$inferSelect[]>([]);

  useEffect(() => {
    const runMigrations = async () => {
      try {
        await migrate(db, migrations);
        setMigrationSuccess(true);
      } catch (error) {
        setMigrationError(error as Error);
      }
    };

    runMigrations();
  }, []);

  useEffect(() => {
    if (!migrationSuccess) return;

    (async () => {
      await db.delete(activityItemsTable);

      await db.insert(activityItemsTable).values([
        {
          id: '1',
          type: 'task',
          title: 'Sample Task 1',
          completed: 0,
          createdAt: new Date().toISOString(),
          priority: 1,
          tags: 'personal,urgent',
        },
        {
          id: '2',
          type: 'note',
          title: 'Sample Note 1',
          completed: 0,
          createdAt: new Date().toISOString(),
          priority: 2,
          tags: 'personal',
        },
      ]);

      const allItems = await db.select().from(activityItemsTable);
      setItems(allItems);
    })();

  }, [migrationSuccess]);

  if (migrationError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Error applying migrations: {migrationError.message}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!migrationSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Applying migrations...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {items.map((item) => (
          <View key={item.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Priority: {item.priority}</Text>
            <Text>Tags: {item.tags}</Text>
            <Text>Completed: {item.completed ? 'Yes' : 'No'}</Text>
          </View>
        ))}
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