"""Optional data-access helpers.

Intentionally empty, and possibly it should stay that way. SQLAlchemy already
is the data-access layer; wrapping `session.get(Employee, id)` in a repository
method adds a file to read without adding a guarantee.

Worth introducing for a query that is genuinely complex, reused across
services, or that you want to swap out in tests. Not as a default.
"""
