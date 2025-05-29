from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


def start():
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)


def start_prod():
    import uvicorn

    """Launched with `poetry run start_prod` at root level"""
    # The `reload` option watches for changes in the code and reloads the server automatically.
    # This should be disabled in production (see https://fastapi.tiangolo.com/deployment/manually/#run-the-server-program).
    uvicorn.run(
        "web_demo_backend.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="warning",
    )
