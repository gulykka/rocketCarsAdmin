# routers/admin_router.py
from fastapi import APIRouter, Depends, HTTPException
from schemas.admin_validators import LoginRequest, Car, User, CarResponse, ChangePass
from api.dependencies.admin_dependencies import get_admin_security, get_admin_repository
from services.admin_security import AdminSecurity
from repositories.admin_repositories import BitrixRepository
from fastapi.responses import StreamingResponse
import httpx
import io
import zipfile
from loguru import logger
from urllib.parse import quote

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
    manager = await security.get_manager(user.manager_id)
    cars = await security.get_cars(user.id)
    return CarResponse(
        user=user,
        manager=manager,
        cars=cars,
    )


@admin_router.get(
    "/load-photo/{parent_id}/",
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

    photos = await bitrix_repo.get_loading_photos_by_car_id(int(parent_id))
    return {"photos": photos}


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
    success = await bitrix_repo.update_contact_pass(data.new_pass, data.id)

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Не удалось изменить пароль. Контакт не найден или произошла ошибка в Bitrix24."
        )

    return {"success": True}


@admin_router.get("/download-photos/{parent_id}/{agent_id}/{car_id}/{client_name}/{win}/")
async def download_photos(
        parent_id: int | None,
        agent_id: int | None,
        car_id: int | None,
        client_name: str,
        win: str,
        bitrix_repo: BitrixRepository = Depends(get_admin_repository),
):
    """
    Скачивание фото автомобилей и погрузок в виде ZIP-архива.
    """
    photos_cars_bx: list[str] = []
    photos_loading: list[str] = []

    # Сбор фото автомобилей по agent_id
    if agent_id is not None and car_id is not None:
        try:
            photos_cars_bx = await bitrix_repo.get_cars_photos(agent_id, car_id)
            logger.info(f"Получено {len(photos_cars_bx)} записей с фото автомобилей для agent_id={agent_id}")

        except Exception as e:
            logger.warning(f"Ошибка при получении фото автомобилей для agent_id={agent_id}: {e}")

    if parent_id is not None:
        try:
            photos_loading = await bitrix_repo.get_loading_photos_by_car_id(parent_id)
            logger.info(f"Получено {len(photos_loading)} фото погрузок для parent_id={parent_id}")
        except Exception as e:
            logger.warning(f"Ошибка при получении фото погрузок для parent_id={parent_id}: {e}")

    all_photo_urls: list[str] = photos_cars_bx + photos_loading
    if not all_photo_urls:
        raise HTTPException(status_code=404, detail="Фотографии не найдены")

    zip_buffer = io.BytesIO()

    async with httpx.AsyncClient(timeout=30.0) as client:
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for idx, url in enumerate(all_photo_urls):
                try:
                    response = await client.get(url)
                    response.raise_for_status()

                    # Определяем тип фото для имени файла
                    if idx < len(photos_cars_bx):
                        filename = f"car_{idx + 1}.jpg"
                    else:
                        rel_idx = idx - len(photos_cars_bx) + 1
                        filename = f"loading_{rel_idx}.jpg"

                    zip_file.writestr(filename, response.content)
                except Exception as e:
                    error_msg = f"Failed to download: {url}\nError: {str(e)}"
                    logger.warning(f"Не удалось скачать фото {url}: {e}")
                    zip_file.writestr(f"error_{idx}.txt", error_msg)

    # Подготовка к отправке
    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={quote(client_name)}_{quote(win)}.zip"
        }
    )
