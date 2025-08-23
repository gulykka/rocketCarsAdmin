
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/api/health-check/{log}/{pswd}/")
async def cheack_health(log, pswd):
    return {"detail": "sosatt"}


@app.post("/api/login/")
async def read_root(data):
    return {
  "user": {
    "id": "12",
    "name": "Коротков - Suifenhe auto Кирилл",
    "login": "log_test",
    "password": "psw_test",
    "manager_id": "3000"
  },
  "manager": {
    "name": "Леоньтева Валерия Александровна",
    "number": "79990591910"
  },
  "cars": [
    {
      "id": "12",
      "name": "",
      "VIN": "ADASDadsasWDDSADDVASWEE",
      "auto": "Toyota Aqua",
      "year": 2012,
      "photos": [''],
      "status": {
        "level": 1,
        "description": "На оплате/на заводе",
        "datetime": ""
      },
      "parent_id": 12
    }
  ]
}


@app.post("/api/change-pass/")
async def change(data):
    if not data:
        return False
    return True




@app.get("/api/load-photos/{parent_id}/")
async def get_photos(parent_id):
    return 'https://rocketcars.bitrix24.ru/rest/1978/a5wanv92ux3qsw3w/crm.controller.item.getFile/?token=crm%7CYWN0aW9uPWNybS5jb250cm9sbGVyLml0ZW0uZ2V0RmlsZSZTSVRFX0lEPXMxJmVudGl0eVR5cGVJZD0xMDQ0JmlkPTgwOCZmaWVsZE5hbWU9VUZfQ1JNXzE2X1BPR1JVWktBJmZpbGVJZD0xNzE4MjYmXz1UTm1NS3lydjlETmp2NHVVc3FoNEttZ0JkN25NNzZkSg%3D%3D%7CImNybS5jb250cm9sbGVyLml0ZW0uZ2V0ZmlsZXxjcm18WVdOMGFXOXVQV055YlM1amIyNTBjbTlzYkdWeUxtbDBaVzB1WjJWMFJtbHNaU1pUU1ZSRlgwbEVQWE14Sm1WdWRHbDBlVlI1Y0dWSlpEMHhNRFEwSm1sa1BUZ3dPQ1ptYVdWc1pFNWhiV1U5VlVaZlExSk5YekUyWDFCUFIxSlZXa3RCSm1acGJHVkpaRDB4TnpFNE1qWW1YejFVVG0xTlMzbHlkamxFVG1wMk5IVlZjM0ZvTkV0dFowSmtOMjVOTnpaa1NnPT18MTk3OHxhNXdhbnY5MnV4M3FzdzN3Ig%3D%3D.zbRrU8hO1Nzw27%2F73hgYrcIJS2c2TnASpFWSAuDhyaw%3D'