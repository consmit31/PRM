export interface ActivityItem {
    id: string;
    type: string;
    title: string;
    completed: boolean;
    completedAt?: Date;
    createdAt: Date;
    priority: number;
    tags?: string[];
}

export function createActivityItem(): ActivityItem {
    return {
        id: '',
        type: '',
        title: '',
        completed: false,
        createdAt: new Date(),
        priority: 0,
    };
}

// Default export containing all exports
export default {
    createActivityItem
};