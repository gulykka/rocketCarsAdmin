import os
from dotenv import load_dotenv
from fast_bitrix24 import Bitrix
import asyncio
from loguru import logger

load_dotenv()
WEBHOOK_URL = os.getenv("WEBHOOK_URL")


class BitrixRepository:

    def __init__(self, WEBHOOK_URL: str) -> None:
        self.bitrix = Bitrix(WEBHOOK_URL)

    async def get_contact_by_login(self, login) -> dict | None:
        logger.info(f"Attempt to login with login: {login}")
        contacts = await self.bitrix.get_all(
            'crm.contact.list',
            {
                'select': [
                    'ID',
                    'UF_CRM_1753788313',  # Логин
                    'UF_CRM_1753788329',  # Пароль
                    'LAST_NAME',
                    'NAME',
                    'SECOND_NAME',
                    'ASSIGNED_BY_ID'
                ],
                'filter': {
                    'UF_CRM_1753788313': login
                }
            }
        )
        if not contacts:
            logger.warning(f"No contact found for {login}")
            return None
        return contacts

    async def get_manager_by_id(self, agent_id: str | int):
        users: list = await self.bitrix.get_all(
            'user.get',
            {
                'filter': {'ID': agent_id},
                'select': ['ID', 'LAST_NAME', 'NAME', 'SECOND_NAME']
            }
        )

        if not users:
            logger.warning(f"No found agent with ID {agent_id}")
            return None
        return users[0]

    async def get_cars_by_agent_contact_id(self, contact_id: int):
        cars = await self.bitrix.get_all(
            'crm.item.list',
            {
                'entityTypeId': 135,
                'filter': {
                    'CONTACT_ID': contact_id
                },
                'select': [
                    'ID',
                    'ufCrm8Vin',
                    'ufCrm8FotoAvto',
                    'ufCrm8MarkaTc',
                    'ufCrm8ModelTc',
                    'ufCrm8DataVipuska',
                    'ufCrm8FioKlient',
                    'parentId2',
                ]
            }
        )

        if not cars:
            logger.warning(f"No found car with agent ID {contact_id}")
            return []
        print(cars)
        return cars

    async def get_loading_photos_by_car_id(self, parent_id: str | int):
        deal_id = parent_id
        if not deal_id:
            logger.warning(f"Not fount parent_ID with {parent_id}")
            return []

        deal_response = await self.bitrix.call('crm.deal.get', {'id': deal_id})
        if not deal_response:
            logger.warning(f"Сделка с ID {deal_id} не найдена.")
            return []
        loading_id = deal_response.get('UF_CRM_1733760504')
        if not loading_id:
            logger.info(f"Поле UF_CRM_1733760504 (ID погрузки) пусто для сделки {deal_id}.")
            return []

        loading_response = await self.bitrix.call('crm.item.get', {
            'entityTypeId': 1044,
            'id': int(loading_id)
        })

        loading = loading_response.get('item')
        if not loading:
            logger.warning(f"Погрузка с ID {loading_id} не найдена.")
            return []

        photo_loading = loading.get('ufCrm16Pogruzka')

        if isinstance(photo_loading, list):
            return photo_loading
        elif photo_loading:
            return [photo_loading]
        else:
            return []

    async def update_contact_pass(self, new_pass, contact_id):
        try:
            result = await self.bitrix.call('crm.contact.update', {
                'id': contact_id,
                'fields': {
                    'UF_CRM_1753788329': new_pass
                }
            })
            logger.info(f"Пароль для контакта ID={contact_id} успешно обновлён.")
            return True
        except Exception as e:
            return False

