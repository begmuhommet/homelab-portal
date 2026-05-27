from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, services, cluster
from app.services.kubernetes import load_kube_config
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="HomeLab Portal API",
    description="Internal Developer Platform backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://portal.home.lab"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    logger.info("Starting HomeLab Portal API")
    # load_kube_config()


app.include_router(health.router)
app.include_router(services.router)
app.include_router(cluster.router)


# Also expose /api/deployments at top level for frontend convenience
@app.get("/api/deployments")
def deployments():
    from app.routers.cluster import list_deployments
    return list_deployments()
