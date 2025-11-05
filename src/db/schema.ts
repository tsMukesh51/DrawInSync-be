import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const collaboratorTypeEnum = pgEnum('collaborator_type', ["EDITOR", "VIEWER"]);

export const shapeTypeEnum = pgEnum('shape_type', ["RECTANGLE", "CIRCLE", "LINE", "TRIANGLE"])

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userName: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  deletedAt: timestamp(),
});

export const userProfileTable = pgTable("user_profile", {
  userId: integer().references(() => userTable.id),
  email: varchar({ length: 255 }).notNull().unique(),
  profilePic: varchar({ length: 255 }),
}, (t) => [primaryKey({ columns: [t.userId] })]);

export const boardTable = pgTable("board", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  boardName: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  ownerId: integer().notNull().references(() => userTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  deletedAt: timestamp(),
});

export const boardCollaboratorTable = pgTable("board_collaborator", {
  collaboratorId: integer().notNull().references(() => userTable.id),
  boardId: integer().notNull().references(() => boardTable.id),
  collaboratorType: collaboratorTypeEnum(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  deletedAt: timestamp(),
}, (t) => [primaryKey({ columns: [t.collaboratorId, t.boardId] })]);

export const elementTable = pgTable("element", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  shapeType: shapeTypeEnum(),
  shapeProperties: jsonb(),
  boardId: integer().notNull().references(() => boardTable.id),
  updateById: integer().notNull().references(() => userTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
  deletedAt: timestamp(),
})

export const userRelations = relations(userTable, ({ one, many }) => ({
  profileInfo: one(userProfileTable),
  boards: many(boardTable),
  boardCollaborators: many(boardCollaboratorTable),
  elements: many(elementTable),
}));

export const userProfileRelations = relations(userProfileTable, ({ one }) => ({
  user: one(userTable, { fields: [userProfileTable.userId], references: [userTable.id] }),
}));

export const boardRelations = relations(boardTable, ({ one, many }) => ({
  onwer: one(userTable, {
    fields: [boardTable.ownerId],
    references: [userTable.id]
  }),
  elements: many(elementTable),
  collaborators: many(boardCollaboratorTable),
}));

export const boardCollaboratorRelations = relations(boardCollaboratorTable, ({ one, many }) => ({
  board: one(boardTable, {
    fields: [boardCollaboratorTable.boardId],
    references: [boardTable.id]
  }),
  collaborator: one(userTable, {
    fields: [boardCollaboratorTable.collaboratorId],
    references: [userTable.id]
  }),
}));

export const elementRelations = relations(elementTable, ({ one, many }) => ({
  board: one(boardTable, {
    fields: [elementTable.boardId],
    references: [boardTable.id]
  }),
  updatedBy: one(userTable, {
    fields: [elementTable.updateById],
    references: [userTable.id]
  }),
}));