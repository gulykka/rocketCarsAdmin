from fast_bitrix24 import Bitrix
from fast_bitrix24.server_response import ErrorInServerResponseException
import asyncio
from loguru import logger


class BitrixRepository:

    def __init__(self, WEBHOOK_URL: str) -> None:
        self.bitrix = Bitrix(WEBHOOK_URL)

    async def get_contact_by_login(self, login: str) -> dict | None:
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
        return contacts[0]

    async def get_manager_by_id(self, manager_id: str | int):
        users: list = await self.bitrix.get_all(
            'user.get',
            {
                'filter': {'ID': manager_id},
                'select': ['ID', 'LAST_NAME', 'NAME', 'SECOND_NAME', 'PERSONAL_MOBILE']
            }
        )

        if not users:
            logger.warning(f"No found agent with ID {manager_id}")
            return None
        return users[0]

    async def get_cars_by_agent_contact_id(self, contact_id: int | str):
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
                    'stageId',
                    'ufCrm8StageHistory',
                ]
            }
        )

        if not cars:
            logger.warning(f"No found car with agent ID {contact_id}")
            return []
        print(cars)
        return cars

    async def get_loading_photos_by_car_id(self, parent_id: str | int):
        deal_id = str(parent_id).strip() if parent_id else ""

        if not deal_id:
            logger.warning("Empty parent_id provided.")
            return []

        try:
            deal_response = await self.bitrix.call(
                'crm.deal.get',
                {
                    'ID': deal_id,
                    'SELECT': ['UF_CRM_1733760504']
                }
            )

            if not isinstance(deal_response, dict) or len(deal_response) == 0:
                logger.warning(f"Deal response is empty or invalid for deal ID {deal_id}.")
                return []

            inner_deal = deal_response
            if len(deal_response) == 1:
                first_value = next(iter(deal_response.values()))
                if isinstance(first_value, dict):
                    inner_deal = first_value

            loading_id = inner_deal.get('UF_CRM_1733760504')
            if not loading_id:
                logger.info(f"Поле UF_CRM_1733760504 (ID погрузки) пусто для сделки {deal_id}.")
                return []

            try:
                loading_response = await self.bitrix.call('crm.item.get', {
                    'entityTypeId': 1044,
                    'id': int(loading_id)
                })

                if not loading_response or not isinstance(loading_response, dict):
                    logger.warning(f"Погрузка с ID {loading_id} не найдена или ответ пуст.")
                    return []

                list_cars = loading_response.get('ufCrm16Pogruzka')
                if not list_cars:
                    return []

                if isinstance(list_cars, list):
                    return [car.get('urlMachine') for car in list_cars if isinstance(car, dict)]
                else:
                    return [list_cars] if list_cars else []

            except Exception as e:
                logger.error(f"Ошибка при получении погрузки {loading_id}: {e}")
                return []

        except ErrorInServerResponseException as e:
            logger.warning(f"Bitrix API error: {e}")
            if "Not found" in str(e):
                logger.info(f"Сделка не найдена (Not found) — возможно, неверный ID.")
                return []

        except Exception as e:
            logger.error(f"Неожиданная ошибка при получении данных для сделки {deal_id}: {e}")
            return []

    async def update_contact_pass(self, new_pass: str, contact_id: int | str):
        try:
            result = await self.bitrix.call('crm.contact.update', {
                'ID': contact_id,
                'fields': {
                    'UF_CRM_1753788329': new_pass
                }
            })
            logger.info(f"Пароль для контакта ID={contact_id} успешно обновлён.")
            return True
        except Exception as e:
            return False
