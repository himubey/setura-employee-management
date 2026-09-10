"""One module per resource, each exporting an `APIRouter` named `router`.

Register it in `app/api/router.py`; the "/api/v1" prefix is applied there, so
a module here declares only its own prefix (e.g. `prefix="/employees"`).

Routes should stay thin: validate with a Pydantic schema, call a service,
return a schema. Business logic belongs in `app/services/`.
"""
