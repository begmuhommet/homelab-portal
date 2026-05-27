from fastapi import APIRouter, HTTPException
from app.models.schemas import ClusterInfo, Deployment
from app.services import kubernetes as k8s

router = APIRouter(prefix="/api/cluster", tags=["cluster"])


@router.get("/info", response_model=ClusterInfo)
def cluster_info():
    try:
        return k8s.get_cluster_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/deployments", response_model=list[Deployment])
def list_deployments():
    try:
        return k8s.get_deployments()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
