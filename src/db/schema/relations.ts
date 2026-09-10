import { relations } from "drizzle-orm";

import { attendance } from "./attendance";
import { auditLogs } from "./audit-logs";
import { departments } from "./departments";
import { documents } from "./documents";
import { employees } from "./employees";
import { leaveRequests, leaveTypes } from "./leave";
import { account, session, user } from "./users";

/**
 * All Drizzle relations are declared here rather than beside each table, so
 * that schema files never import one another (no module cycles between
 * departments, employees and leave).
 *
 * Two Drizzle rules are being followed deliberately:
 *  - In a one-to-one, only the side holding the foreign key declares
 *    `fields`/`references`; the other side is the bare inverse.
 *  - When two tables are related more than once (employees appears twice on
 *    leave_requests, as requester and as reviewer), every one of those
 *    relations carries a matching `relationName` on both sides.
 */

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  // Inverse side of the 1:1 — employees.userId holds the key.
  employee: one(employees),
  auditLogs: many(auditLogs),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ many, one }) => ({
  user: one(user, { fields: [employees.userId], references: [user.id] }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
    relationName: "employee_manager",
  }),
  reports: many(employees, { relationName: "employee_manager" }),
  attendance: many(attendance),
  documents: many(documents),
  leaveRequests: many(leaveRequests, { relationName: "leave_requester" }),
  reviewedLeaveRequests: many(leaveRequests, {
    relationName: "leave_reviewer",
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));

export const leaveTypesRelations = relations(leaveTypes, ({ many }) => ({
  requests: many(leaveRequests),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
    relationName: "leave_requester",
  }),
  reviewer: one(employees, {
    fields: [leaveRequests.reviewedBy],
    references: [employees.id],
    relationName: "leave_reviewer",
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveRequests.leaveTypeId],
    references: [leaveTypes.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  employee: one(employees, {
    fields: [documents.employeeId],
    references: [employees.id],
  }),
  uploader: one(user, {
    fields: [documents.uploadedBy],
    references: [user.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(user, { fields: [auditLogs.actorId], references: [user.id] }),
}));
