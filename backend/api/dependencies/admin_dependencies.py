from repositories.admin_repositories import BitrixRepository
from services.admin_serializers import AdminSerializer
from services.admin_security import AdminSecurity
from dotenv import load_dotenv
import os

load_dotenv()
WEBHOOK_URL = os.getenv("WEBHOOK_URL")


def get_admin_security() -> AdminSecurity:
    repository = BitrixRepository(WEBHOOK_URL)
    serializer = AdminSerializer()
    return AdminSecurity(repository=repository, serializer=serializer)


def get_admin_repository() -> BitrixRepository:
    return BitrixRepository(WEBHOOK_URL)


def get_admin_serializer() -> AdminSerializer:
    return AdminSerializer()
