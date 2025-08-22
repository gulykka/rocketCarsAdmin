import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from repositories.admin_repositories import BitrixRepository
from services.admin_serializers import AdminSerializer
from loguru import logger
import asyncio
from schemas.admin_validators import User, Car


class AdminSecurity:

    def __init__(self, repository: BitrixRepository, serializer: AdminSerializer):
        self.repository = repository
        self.serializer = serializer
        self.password_key = 'UF_CRM_1753788329'
        self.manager_id_key = 'ASSIGNED_BY_ID'

    async def auth(self, username: str, password: str) -> User | None:
        user_bx = await self.repository.get_contact_by_login(login=username)
        if not user_bx:
            return None
        if password != user_bx[self.password_key]:
            logger.warning(f"User {username} does not match password")
            return None
        return self.serializer.user_to_model(user_bx)

    async def get_manager(self, contact_id: str | None):
        manager_bx = await self.repository.get_manager_by_id(contact_id)
        if not manager_bx:
            return None
        return self.serializer.manager_to_model(manager_bx)

    async def get_cars(self, contact_id: int | str) -> list[Car] | None:
        cars_bx = await self.repository.get_cars_by_agent_contact_id(contact_id)
        if cars_bx is not None:
            return [self.serializer.car_to_model(car) for car in cars_bx]
        return None

    async def change_password(self, new_password: str, contact_id: str | int) -> bool:
        result = await self.repository.update_contact_pass(new_password, contact_id)
        return result
