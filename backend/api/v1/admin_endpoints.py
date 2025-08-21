from fastapi import APIRouter
from backend.schemas.admin_validators import LoginRequest, Car

admin_router = APIRouter(prefix="/api", tags=["API_RocketAdmin"])
from backend.services.admin_security import AdminSecurity


@admin_router.post("/login", response_model=Car)
def login(request: LoginRequest):
    AdminSecurity.auth()
