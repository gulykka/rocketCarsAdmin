from schemas.admin_validators import User, Manager, Car, Status, AuthUser
import re
from datetime import date


def date_sort(date_lst: list[str]) -> str:
    dates = []
    for date_str in date_lst:
        day, month, year = map(int, date_str.split('.'))
        dates.append(date(year=year, month=month, day=day))

    latest_date = max(dates)
    return latest_date


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

    @staticmethod
    def car_to_model(car_bx: dict) -> Car:
        if car_bx.get("stageId") == 'DT135_12:FAIL':
            return None

        stage_item = AdminSerializer.STAGES.get(car_bx.get("stageId"), {})
        if not isinstance(stage_item, dict):
            stage_item = {}

        stage_history = car_bx.get('ufCrm8StageHistory')
        history_dates = []

        if stage_history:
            if isinstance(stage_history, list):
                history_dates = [
                    date[:10]
                    for date in stage_history
                    if date and isinstance(date, str) and len(date) >= 10
                ]
            elif isinstance(stage_history, str) and len(stage_history) >= 10:
                serialized = stage_history[:10]
                if serialized:
                    history_dates = [serialized]

        latest_date = date_sort(history_dates) if history_dates else None
        status_date = latest_date.strftime("%d.%m.%Y") if latest_date else ""

        cars_photo = car_bx.get("ufCrm8FotoAvto")[0:1]
        photos = []
        if isinstance(cars_photo, list):
            for photo in cars_photo:
                if isinstance(photo, dict):
                    url = photo.get("urlMachine", "").strip()
                    if url:
                        photos.append(url)

        brand = car_bx.get('ufCrm8MarkaTc')
        model = car_bx.get('ufCrm8ModelTc')

        auto_parts = [str(val).strip() for val in [brand, model] if val is not None and str(val).strip() != '']
        auto = " ".join(auto_parts)

        vin = str(car_bx.get('ufCrm8Vin') or '').strip()
        year = str(car_bx.get('ufCrm8DataVipuska') or '').strip()
        return Car(
            id=str(car_bx.get("id", "")),
            name=str(car_bx.get('ufCrm8FioKlient') or '').strip(),
            VIN=vin,
            auto=auto,
            year=year,
            photos=photos,
            status=Status(
                level=stage_item.get("level"),
                description=str(stage_item.get("description") or "").strip(),
                datetime=status_date,
            ),
            parent_id=str(car_bx.get("parentId2", ""))
        )
