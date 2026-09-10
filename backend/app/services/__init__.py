"""Business logic.

Planned: auth_service, employee_service, attendance_service, leave_service.
None implemented yet.

A service owns a unit of work: it validates, applies the rules, commits, and
raises a meaningful error. Routes stay thin so that the same logic is
reachable from a route, a CLI command or a test without going through HTTP.
"""
