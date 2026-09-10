from fastapi import APIRouter

# ---------------------------------------------------------------------------
# The v1 API root.
#
# `app.main` mounts this once under `settings.api_v1_prefix` ("/api/v1"), so
# nothing below repeats the version. Adding a resource is two lines:
#
#     backend/app/api/routes/employees.py
#
#         from fastapi import APIRouter
#
#         router = APIRouter(prefix="/employees", tags=["employees"])
#
#         @router.get("")
#         def list_employees() -> ...:
#             ...
#
#     then here:
#
#         from app.api.routes import employees
#         api_router.include_router(employees.router)
#
# `tags` groups the resource in the /docs page — worth setting on every router.
#
# Planned resources, none implemented yet:
#     /api/v1/auth         /api/v1/employees    /api/v1/departments
#     /api/v1/attendance   /api/v1/leave        /api/v1/users
# ---------------------------------------------------------------------------

api_router = APIRouter()
