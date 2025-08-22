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




@app.get("/api/load-photos/{parent_id}/{car_id}/")
async def get_photos(parent_id, car_id):
    return {"photos": [
        'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MjYmXz1UTm1NS3lydjlETmp2NHVVc3FoNEttZ0JkN25NNzZkSg%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE1qWW1YejFVVG0xTlMzbHlkamxFVG1wMk5IVlZjM0ZvTkV0dFowSmtOMjVOTnpaa1NnPT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.zbRrU8hO1Nzw27%2F73hgYrcIJS2c2TnASpFWSAuDhyaw%3D',
        'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MjImXz1mazZpSUo2UDViSXg4RmF4cTVobFQ3cWJHV0Y4R2lEeQ%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE1qSW1YejFtYXpacFNVbzJVRFZpU1hnNFJtRjRjVFZvYkZRM2NXSkhWMFk0UjJsRWVRPT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.g6S6nUYVTJc7jh%2BeebifpWozw7cZxG3oRt5JGwbeuqk%3D',
        'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MjgmXz11MDd5MVRFSHF5ZFMwQnE2NjZHWFJ0TkFUZDg1WmxscQ%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE1qZ21YejExTURkNU1WUkZTSEY1WkZNd1FuRTJOalpIV0ZKMFRrRlVaRGcxV214c2NRPT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.gZh9ay0lps6Fmp30STN0r9hGMC6Q5CgzHLWlrYzyeDc%3D',
        'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MjQmXz1oRzF1TExpTzkwbjZsZDBRS1UyVnFWdTdSRVB3d0pqbw%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE1qUW1YejFvUnpGMVRFeHBUemt3Ympac1pEQlJTMVV5Vm5GV2RUZFNSVkIzZDBwcWJ3PT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.AQLOKIe1Xwip6SjsE1GQb1aMcB03l9a42XKyPPiyy88%3D',
        'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MzAmXz1uZ3JLVDczZDJ1amJGWVZ0Yks3dzZQdG1JZHUyZ21mUQ%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE16QW1YejF1WjNKTFZEY3paREoxYW1KR1dWWjBZa3MzZHpaUWRHMUpaSFV5WjIxbVVRPT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.0LHRWM5TLHcoc46KLdE7iLiVpuiaJ8zGEBMVmFHgp0o%3D',]}
