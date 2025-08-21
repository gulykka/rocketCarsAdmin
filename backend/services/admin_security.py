from backend.repositories.admin_repositories import BitrixRepository
from backend.services.admin_serializers import AdminSerializer
from loguru import logger


class AdminSecurity:

    def __init__(self, repository: BitrixRepository, serializer: AdminSerializer):
        self.repository = repository
        self.serializer = serializer

    async def auth(self, username, password):
        user_bx = await self.repository.get_contact_by_login(login=username)
        if not user_bx:
            return False
        user = self.serializer.user_to_model(user_bx)
        if password != user.password:
            logger.warning(f"User {username} does not match password")
            return False
        return user

    async def change_password(self, new_password, contact_id):
        result = await self.repository.update_contact_pass(new_password, contact_id)
        return result
