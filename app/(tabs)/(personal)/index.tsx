import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useActivityItemDb } from '@hooks/useActivityItemDb'

const PersonalPage = () => {
  const {
    items,
    isLoading,
    error,
    migrationSuccess,
    createItem,
    updateItem,
    deleteItem,
    clearAllItems,
    getItemsByType,
    getCompletedItems,
    getIncompleteItems,
  } = useActivityItemDb();

  // Add some sample data
  const addSampleData = async () => {
    await createItem({
      type: 'task',
      title: 'Sample Task 1',
      completed: 0,
      priority: 1,
      tags: 'personal,urgent',
    });

    await createItem({
      type: 'note',
      title: 'Sample Note 1',
      completed: 0,
      priority: 2,
      tags: 'personal',
    });
  };

  const toggleComplete = async (id: string, currentCompleted: number) => {
    const newCompletedStatus = currentCompleted === 1 ? 0 : 1;
    const completedAt = newCompletedStatus === 1 ? new Date().toISOString() : null;

    await updateItem(id, {
      completed: newCompletedStatus,
      completedAt,
    });
  };

  const handleDeleteItem = (id: string, title: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Items',
      'Are you sure you want to delete all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllItems },
      ]
    );
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!migrationSuccess || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Applying migrations...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const tasks = getItemsByType('task');
  const notes = getItemsByType('note');
  const completedItems = getCompletedItems();
  const incompleteItems = getIncompleteItems();

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Personal Activity Items</Text>

      <View style={styles.stats}>
        <Text>Total: {items.length} | Tasks: {tasks.length} | Notes: {notes.length}</Text>
        <Text>Completed: {completedItems.length} | Incomplete: {incompleteItems.length}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addSampleData}>
          <Text style={styles.buttonText}>Add Sample Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearAll}>
          <Text style={[styles.buttonText, styles.whiteText]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>No items found. Add some sample data to get started!</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={[styles.itemCard, item.completed === 1 && styles.completedCard]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, item.completed === 1 && styles.completedText]}>
                {item.title}
              </Text>
              <Text style={styles.itemType}>{item.type?.toUpperCase()}</Text>
            </View>

            <Text style={styles.itemDetail}>Priority: {item.priority}</Text>
            <Text style={styles.itemDetail}>Tags: {item.tags}</Text>
            <Text style={styles.itemDetail}>
              Status: {item.completed ? 'Completed' : 'Incomplete'}
            </Text>

            {item.completedAt && (
              <Text style={styles.itemDetail}>
                Completed: {new Date(item.completedAt).toLocaleDateString()}
              </Text>
            )}

            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.actionButton, item.completed === 1 ? styles.undoButton : styles.completeButton]}
                onPress={() => toggleComplete(item.id, item.completed || 0)}
              >
                <Text style={styles.actionButtonText}>
                  {item.completed === 1 ? 'Mark Incomplete' : 'Mark Complete'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteItem(item.id, item.title || 'Untitled')}
              >
                <Text style={[styles.actionButtonText, styles.whiteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  )
}

export default PersonalPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stats: {
    backgroundColor: '#e8f4f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  whiteText: {
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginTop: 50,
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f0f9ff',
    opacity: 0.8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  itemType: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    flex: 0.48,
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  undoButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
})