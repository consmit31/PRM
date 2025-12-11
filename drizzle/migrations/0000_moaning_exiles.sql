CREATE TABLE `activity_items` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text,
	`title` text,
	`completed` integer,
	`completedAt` text,
	`createdAt` text,
	`priority` integer,
	`tags` text
);
