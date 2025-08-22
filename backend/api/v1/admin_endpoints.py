# routers/admin_router.py
from fastapi import APIRouter, Depends, HTTPException
from schemas.admin_validators import LoginRequest, Car, User, CarResponse, ChangePass
from api.dependencies.admin_dependencies import get_admin_security, get_admin_repository
from services.admin_security import AdminSecurity
from repositories.admin_repositories import BitrixRepository

# Создаём роутер с тегом и префиксом
admin_router = APIRouter(
    prefix="/api",
    tags=["🚀 RocketAdmin API"],
    responses={404: {"description": "Не найдено"}}
)


@admin_router.post(
    "/login",
    response_model=CarResponse,
    summary="Аутентификация администратора",
    description="""
        Аутентифицирует пользователя по логину и паролю.  
        Если данные верны — возвращает информацию о пользователе, его менеджере и связанных машинах.
        
        **Требуется:**
        - `username` — логин
        - `password` — пароль
        
        **Возвращает:**
        - `user` — данные пользователя
        - `manager` — данные ответственного менеджера
        - `cars` — список автомобилей клиента
""",
    responses={
        200: {
            "description": "Успешный вход",
            "content": {
                "application/json": {
                    "example": {
                        "user": {
                            "name": "Иван Иванов",
                            "login": "ivan123",
                            "manager": "123"
                        },
                        "manager": {
                            "name": "Анна Петрова",
                            "number": "79142147067"
                        },
                        "cars": [
                            {
                                "id": "123",
                                "name": "Иван Иванов",
                                "VIN": "XW8AB45C10J567890",
                                "auto": "Toyota Camry",
                                "year": "2023",
                                "photos": ["https://...jpg"],
                                "status": {
                                    "level": 3,
                                    "description": "Доставка в РФ",
                                    "datetime": "15.06.2025"
                                }
                            }
                        ]
                    }
                }
            }
        },
        401: {
            "description": "Неверный логин или пароль",
            "content": {
                "application/json": {
                    "example": {"detail": "Incorrect login or password"}
                }
            }
        }
    }
)
async def login(request: LoginRequest, security: AdminSecurity = Depends(get_admin_security)):
    """
    ## Вход в систему
    Аутентификация пользователя через Bitrix24 по логину и паролю.
    """
    user = await security.auth(username=request.login, password=request.password)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect login or password"
        )
    return CarResponse(
        user=user,
        manager=await security.get_manager(user.manager_id),
        cars=await security.get_cars(user.manager_id),
    )


@admin_router.get(
    "/load-photo/{parent_id}",
    summary="Получить фото погрузки по ID машины",
    description="""
        Возвращает список URL-фото погрузки, связанных с автомобилем.
        
        **Параметры:**
        - `parent_id` — ID машины (внутренний или Bitrix ID)
        
        **Возвращает:**
        - Массив строк с URL изображений.
        """,
    responses={
        200: {
            "description": "Список фото успешно получен",
            "content": {
                "application/json": {
                    "example": [
                        "https://your-bitrix.com/upload/123/photo1.jpg",
                        "https://your-bitrix.com/upload/123/photo2.jpg"
                    ]
                }
            }
        },
        404: {
            "description": "Машина или погрузка не найдена",
            "content": {
                "application/json": {
                    "example": {"detail": "Car or loading not found"}
                }
            }
        }
    }
)
async def load_photo(parent_id: str, bitrix_repo: BitrixRepository = Depends(get_admin_repository)):
    """
    Загружает фото погрузки, связанные с автомобилем.
    """
    photos = await bitrix_repo.get_loading_photos_by_car_id(parent_id)
    return {"phohtos": photos}


@admin_router.post(
    "/change-pass",
    summary="Изменить пароль клиента",
    description="""
        Обновляет поле с паролем у контакта в Bitrix24.
        
        **Тело запроса:**
        - `id` — ID контакта
        - `new` — новый пароль
        
        **Возвращает:**
        - `success: true` при успехе.
        """,
    responses={
        200: {
            "description": "Пароль успешно изменён",
            "content": {
                "application/json": {
                    "example": {"success": True}
                }
            }
        },
        400: {
            "description": "Ошибка обновления",
            "content": {
                "application/json": {
                    "example": {"success": False, "error": "Contact not found"}
                }
            }
        }
    }
)
async def change(data: ChangePass, bitrix_repo: BitrixRepository = Depends(get_admin_repository)):
    """
    Изменяет пароль клиента в Bitrix24.
    """
    return await bitrix_repo.update_contact_pass(data.new, data.id)
