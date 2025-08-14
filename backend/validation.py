from pydantic import BaseModel
from pydantic import HttpUrl


class Car(BaseModel):
    name: str | None
    VIN: str | None
    auto: str | None
    year: str | None
    photos: list[str | None] | None
    status_complete: bool


class Manager(BaseModel):
    name: str
    number: str


class User(BaseModel):
    name: str


class Authorization(BaseModel):
    login: str
    password: str


class ChangePass(BaseModel):
    old: str
    new: str
    repeat: str

class CarResponse(BaseModel):
    user: User
    manager: Manager
    completed_cars: list[Car]
    operation_cars: list[Car]