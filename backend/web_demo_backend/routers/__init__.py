from fastapi import APIRouter
from .predict import router as predict_router
from .attributes import router as attributes_router

router = APIRouter()

router.include_router(predict_router, prefix="/predict")
router.include_router(attributes_router, prefix="/attributes")
