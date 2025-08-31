from fastapi import FastAPI
from api.v1.admin_endpoints import admin_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="API сервиса личного кабинета агента RocketCars", redirect_slashes=False)

app.include_router(admin_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=5000,
        reload=True,
        log_level="info"
    )
