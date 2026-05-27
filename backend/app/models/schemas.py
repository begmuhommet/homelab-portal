from pydantic import BaseModel
from typing import Literal


class ClusterInfo(BaseModel):
    nodes: int
    pods: int
    services: int
    namespaces: int
    version: str


class Service(BaseModel):
    name: str
    namespace: str
    type: str
    clusterIP: str
    ports: list[str]
    age: str


class Deployment(BaseModel):
    name: str
    namespace: str
    ready: int
    desired: int
    available: int
    age: str
    status: Literal["healthy", "degraded", "unavailable"]


class HealthCheck(BaseModel):
    name: str
    status: Literal["healthy", "degraded", "unavailable"]
    message: str
    latency: int | None = None


class HealthStatus(BaseModel):
    status: Literal["healthy", "degraded", "unavailable"]
    checks: list[HealthCheck]
    timestamp: str
