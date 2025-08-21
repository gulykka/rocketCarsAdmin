from pydantic import BaseModel
from datetime import datetime


class LoginRequest(BaseModel):
    login: str
    password: str


class Status(BaseModel):
    level: int
    description: str
    datetime: datetime | None


class Car(BaseModel):
    name: str | None
    VIN: str | None
    auto: str | None
    year: str | None
    photos: list[str | None] | None
    status: Status


class Manager(BaseModel):
    name: str
    number: str


class User(BaseModel):
    name: str
    login: str
    password: str
    manager_id: int | str


class Authorization(BaseModel):
    login: str
    password: str


class ChangePass(BaseModel):
    login: str
    old: str
    new: str


class CarResponse(BaseModel):
    user: User
    manager: Manager
    completed_cars: list[Car]
    operation_cars: list[Car]
