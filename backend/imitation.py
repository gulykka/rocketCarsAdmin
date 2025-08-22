import json
import os

from fastapi import FastAPI, HTTPException
from logic import change_pass, sign_in
from schemas.admin_validators import Authorization, Car, CarResponse, ChangePass, Manager, User
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "test_data.json")

test_user = User(name="Агентский Агент Агентович", id=1234567)
test_manager = Manager(name="Манагер", number="88005553535")


@app.get("/api/health-check/{log}/{pswd}/")
async def cheack_health(log, pswd):
    return {"detail": "sosatt"}


@app.post("/api/login", response_model=CarResponse | list)
async def read_root(data: Authorization):
    if not sign_in(data):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            cars_data = json.load(f)
        for car in cars_data:
            car["photos"] = ["https://placedog.net/500" for i in range(3)]
        cars = [Car(**car) for car in cars_data]
        return CarResponse(
            user=test_user,
            manager=test_manager,
            cars=cars,
        )


@app.post("/api/change-pass/")
async def change(data: ChangePass):
    if not change_pass(data):
        return {"detail": "Ты лох, как можно так было. Пароли не совпадают"}


@app.get("/api/load-photos/")
async def change(data: ChangePass):
    return {"detail": "Ты лох"}