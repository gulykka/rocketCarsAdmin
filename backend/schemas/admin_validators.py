from pydantic import BaseModel


class LoginRequest(BaseModel):
    login: str
    password: str


class Status(BaseModel):
    level: int
    description: str
    datetime: str | None


class Car(BaseModel):
    id: int | str
    name: str | None
    VIN: str | None
    auto: str | None
    year: str | None
    photos: list[str | None] | None
    status: Status
    parent_id: int | str | None


class Manager(BaseModel):
    name: str
    number: str


class User(BaseModel):
    id: int | str
    name: str
    login: str
    password: str
    manager_id: int | str


class AuthUser(BaseModel):
    name: str
    login: str
    password: str
    manager_id: int | str


class Authorization(BaseModel):
    login: str
    password: str


class ChangePass(BaseModel):
    id: str
    old: str
    new: str


class CarResponse(BaseModel):
    user: User
    manager: Manager
    cars: list[Car]


class LoadPhoto(BaseModel):
    photos: list[str | None] | None
