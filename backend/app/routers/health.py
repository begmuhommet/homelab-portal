import asyncio
import time
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter

from app.models.schemas import HealthCheck, HealthStatus
from app.services import kubernetes as k8s

router = APIRouter(prefix="/api/health", tags=["health"])


async def check_kubernetes() -> HealthCheck:
    start = time.monotonic()
    try:
        info = k8s.get_cluster_info()
        latency = int((time.monotonic() - start) * 1000)
        return HealthCheck(
            name="Kubernetes API",
            status="healthy",
            message=f"{info['nodes']} node(s) available",
            latency=latency,
        )
    except Exception as e:
        return HealthCheck(
            name="Kubernetes API",
            status="unavailable",
            message=str(e),
        )


async def check_argocd() -> HealthCheck:
    start = time.monotonic()
    try:
        async with httpx.AsyncClient(verify=False, timeout=5) as client:
            resp = await client.get("https://argocd-server.argocd.svc.cluster.local/healthz")
            latency = int((time.monotonic() - start) * 1000)
            if resp.status_code == 200:
                return HealthCheck(
                    name="ArgoCD",
                    status="healthy",
                    message="Responding normally",
                    latency=latency,
                )
            return HealthCheck(
                name="ArgoCD",
                status="degraded",
                message=f"Returned status {resp.status_code}",
                latency=latency,
            )
    except Exception:
        return HealthCheck(
            name="ArgoCD",
            status="unavailable",
            message="Could not reach ArgoCD",
        )


async def check_grafana() -> HealthCheck:
    start = time.monotonic()
    try:
        async with httpx.AsyncClient(verify=False, timeout=5) as client:
            resp = await client.get("http://monitoring-grafana.monitoring.svc.cluster.local/api/health")
            latency = int((time.monotonic() - start) * 1000)
            if resp.status_code == 200:
                return HealthCheck(
                    name="Grafana",
                    status="healthy",
                    message="Responding normally",
                    latency=latency,
                )
            return HealthCheck(
                name="Grafana",
                status="degraded",
                message=f"Returned status {resp.status_code}",
                latency=latency,
            )
    except Exception:
        return HealthCheck(
            name="Grafana",
            status="unavailable",
            message="Could not reach Grafana",
        )


@router.get("", response_model=HealthStatus)
async def health():
    checks = await asyncio.gather(
        check_kubernetes(),
        check_argocd(),
        check_grafana(),
    )
    checks = list(checks)

    if all(c.status == "healthy" for c in checks):
        overall = "healthy"
    else:
        overall = "degraded"

    return HealthStatus(
        status=overall,
        checks=checks,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
