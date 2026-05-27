from fastapi import APIRouter, HTTPException
from app.models.schemas import Service
from app.services import kubernetes as k8s

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[Service])
def list_services():
    try:
        return k8s.get_services()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
