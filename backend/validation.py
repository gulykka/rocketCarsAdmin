from pydantic import BaseModel


class Status(BaseModel):
    level: int
    description: str


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
