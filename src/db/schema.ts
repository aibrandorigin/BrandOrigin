import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table mapping Firebase Auth UID to relational record
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enquiries table storing inbound client proposals & briefs
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  enquiryRef: text('enquiry_ref').unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  stage: text('stage'),
  timeline: text('timeline'),
  budget: text('budget'),
  concept: text('concept'),
  status: text('status').default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects case studies table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  client: text('client').notNull(),
  industry: text('industry'),
  year: text('year'),
  headline: text('headline').notNull(),
  image: text('image'),
  stages: text('stages'),
  metrics: text('metrics'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Services & capability offerings table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  number: text('number'),
  title: text('title').notNull(),
  category: text('category'),
  description: text('description'),
  deliverables: text('deliverables'),
  impactMetric: text('impact_metric'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Global Site Content table synchronized across all browsers
export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  data: text('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
