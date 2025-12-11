import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { activityItemsTable } from '../db/schema';
import migrations from '../drizzle/migrations/migrations';
import { eq } from 'drizzle-orm';

// Initialize database connection
const expo = SQLite.openDatabaseSync('prm.db');
const db = drizzle(expo);

// Type for activity items based on the schema
type ActivityItem = typeof activityItemsTable.$inferSelect;
type NewActivityItem = typeof activityItemsTable.$inferInsert;

interface UseActivityItemDbReturn {
  // State
  items: ActivityItem[];
  isLoading: boolean;
  error: Error | null;
  migrationSuccess: boolean;
  
  // CRUD operations
  createItem: (item: Omit<NewActivityItem, 'id' | 'createdAt'>) => Promise<ActivityItem | null>;
  updateItem: (id: string, updates: Partial<Omit<ActivityItem, 'id'>>) => Promise<ActivityItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  getItemById: (id: string) => Promise<ActivityItem | null>;
  refreshItems: () => Promise<void>;
  clearAllItems: () => Promise<void>;
  
  // Query operations
  getItemsByType: (type: string) => ActivityItem[];
  getCompletedItems: () => ActivityItem[];
  getIncompleteItems: () => ActivityItem[];
  getItemsByPriority: (priority: number) => ActivityItem[];
  searchItemsByTitle: (searchTerm: string) => ActivityItem[];
}

export const useActivityItemDb = (): UseActivityItemDbReturn => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [migrationSuccess, setMigrationSuccess] = useState(false);

  // Run migrations on hook initialization
  useEffect(() => {
    const runMigrations = async () => {
      try {
        setIsLoading(true);
        await migrate(db, migrations);
        setMigrationSuccess(true);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setMigrationSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    runMigrations();
  }, []);

  // Load initial data after successful migration
  useEffect(() => {
    if (migrationSuccess) {
      refreshItems();
    }
  }, [migrationSuccess]);

  // Generate unique ID
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Refresh items from database
  const refreshItems = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const allItems = await db.select().from(activityItemsTable);
      setItems(allItems);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new item
  const createItem = async (item: Omit<NewActivityItem, 'id' | 'createdAt'>): Promise<ActivityItem | null> => {
    try {
      const newItem: NewActivityItem = {
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      await db.insert(activityItemsTable).values(newItem);
      await refreshItems();
      
      // Return the created item
      const created = await getItemById(newItem.id!);
      return created;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  // Update an existing item
  const updateItem = async (id: string, updates: Partial<Omit<ActivityItem, 'id'>>): Promise<ActivityItem | null> => {
    try {
      await db
        .update(activityItemsTable)
        .set(updates)
        .where(eq(activityItemsTable.id, id));
      
      await refreshItems();
      
      // Return the updated item
      const updated = await getItemById(id);
      return updated;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  // Delete an item
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      await db.delete(activityItemsTable).where(eq(activityItemsTable.id, id));
      await refreshItems();
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  // Get item by ID
  const getItemById = async (id: string): Promise<ActivityItem | null> => {
    try {
      const result = await db
        .select()
        .from(activityItemsTable)
        .where(eq(activityItemsTable.id, id))
        .limit(1);
      
      return result[0] || null;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  // Clear all items
  const clearAllItems = async (): Promise<void> => {
    try {
      await db.delete(activityItemsTable);
      await refreshItems();
    } catch (err) {
      setError(err as Error);
    }
  };

  // Query functions (these work on the current items state for better performance)
  const getItemsByType = (type: string): ActivityItem[] => {
    return items.filter(item => item.type === type);
  };

  const getCompletedItems = (): ActivityItem[] => {
    return items.filter(item => item.completed === 1);
  };

  const getIncompleteItems = (): ActivityItem[] => {
    return items.filter(item => item.completed === 0);
  };

  const getItemsByPriority = (priority: number): ActivityItem[] => {
    return items.filter(item => item.priority === priority);
  };

  const searchItemsByTitle = (searchTerm: string): ActivityItem[] => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter(item => 
      item.title?.toLowerCase().includes(lowerSearchTerm)
    );
  };

  return {
    // State
    items,
    isLoading,
    error,
    migrationSuccess,
    
    // CRUD operations
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    refreshItems,
    clearAllItems,
    
    // Query operations
    getItemsByType,
    getCompletedItems,
    getIncompleteItems,
    getItemsByPriority,
    searchItemsByTitle,
  };
};

export default useActivityItemDb;