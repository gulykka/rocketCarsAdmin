from schemas.admin_validators import User, Manager, Car, Status, AuthUser
import re
from dateutil import parser
from datetime import datetime


def normalize_phone(phone: str) -> str:
    digits = re.sub(r'\D', '', phone)

    if not digits:
        return ""

    if digits.startswith('8') and len(digits) == 11:
        return '7' + digits[1:]

    elif digits.startswith('7') and len(digits) == 11:
        return digits

    elif digits.startswith('7') and len(digits) == 10:
        return digits

    elif len(digits) == 10:
        return '7' + digits

    elif digits.startswith('9') and len(digits) == 10:
        return '7' + digits

    if len(digits) == 10:
        return '7' + digits

    return digits


class AdminSerializer:
    STAGES = {

        'DT135_12:NEW': {
            'level': 1,
            'description': 'На оплате/на заводе'
        },

        'DT135_12:PREPARATION': {
            'level': 2,
            'description': 'На стоянке в Китае'
        },
        'DT135_12:UC_G2QLMW': {
            'level': 3,
            'description': 'Доставка в РФ'
        },
        'DT135_12:CLIENT': {
            'level': 4,
            'description': 'На СВХ'

        },

        'DT135_12:UC_QFS3CA': {
            'level': 4,
            'description': 'На СВХ'

        },
        'DT135_12:UC_UST2QE': {
            'level': 4,
            'description': 'На СВХ'

        },

        'DT135_12:UC_37UMS1': {
            'level': 4,
            'description': 'На СВХ'

        },

        'DT135_12:UC_LHM1NV': {
            'level': 5,
            'description': 'На стоянке'

        },

        'DT135_12:UC_4WLJGM': {
            'level': 5,
            'description': 'На стоянке'

        },

        'DT135_12:SUCCESS': {
            'level': 6,
            'description': 'Авто выдан'
        },
    }

    @staticmethod
    def user_to_model(user_bx: dict) -> User:
        return User(
            id=user_bx['ID'],
            name=" ".join([
                user_bx.get('LAST_NAME', ''),
                user_bx.get('NAME', ''),
                user_bx.get('SECOND_NAME', '')
            ]).strip(),
            login=user_bx.get("UF_CRM_1753788313", ""),
            password=user_bx.get("UF_CRM_1753788329", ""),
            manager_id=user_bx.get("ASSIGNED_BY_ID", ""),
        )

    @staticmethod
    def manager_to_model(manager_bx: dict) -> Manager:
        return Manager(
            name=" ".join([
                manager_bx.get('LAST_NAME', ''),
                manager_bx.get('NAME', ''),
                manager_bx.get('SECOND_NAME', '')
            ]).strip(),
            number=normalize_phone(manager_bx.get("PERSONAL_MOBILE", ""))
        )

    def serialize_date(date_str: str) -> str:
        try:
            parsed_date: datetime = parser.parse(date_str)
            return parsed_date.strftime("%d.%m.%Y")
        except (ValueError, TypeError, OverflowError) as e:
            return ""

    @staticmethod
    def car_to_model(car_bx: dict) -> Car:
        stage_item = AdminSerializer.STAGES[car_bx["stageId"]]

        stage_history = car_bx.get('ufCrm8StageHistory')

        if not stage_history:
            history_dates = []
        elif isinstance(stage_history, list):
            history_dates = [AdminSerializer.serialize_date(date) for date in stage_history]
        elif isinstance(stage_history, str):
            serialized = AdminSerializer.serialize_date(stage_history)
            history_dates = [serialized] if serialized else []
        else:
            history_dates = []

        return Car(
            id=car_bx.get("ID", ""),
            name=car_bx.get('ufCrm8FioKlient', ''),
            VIN=car_bx.get("ufCrm8Vin", ""),
            auto=" ".join([
                car_bx.get('ufCrm8MarkaTc', ''),
                car_bx.get('ufCrm8ModelTc', '')
            ]).strip(),
            year=car_bx.get("ufCrm8DataVipuska", ""),
            photos=car_bx.get("ufCrm8FotoAvto", []) or [],
            status=Status(
                level=stage_item.get("level") if isinstance(stage_item, dict) else None,
                description=stage_item.get("description") if isinstance(stage_item, dict) else "",
                datetime=max(history_dates, default=""),
            ),
            parent_id=car_bx.get("parentId2", "")
        )
