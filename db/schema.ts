import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const activityItemsTable = sqliteTable('activity_items', {
    id: text('id').primaryKey(),
    type: text('type'),
    title: text('title'),
    completed: int('completed'),
    completedAt: text('completedAt'),
    createdAt: text('createdAt'),
    priority: int('priority'),
    tags: text('tags'),
});