from kubernetes import client, config as k8s_config
from datetime import datetime, timezone
from app.config import IS_LOCAL, KUBECONFIG
import logging

logger = logging.getLogger(__name__)


def load_kube_config():
    """Load kubeconfig — from file in local dev, from ServiceAccount in production."""
    try:
        if IS_LOCAL and KUBECONFIG:
            k8s_config.load_kube_config(config_file=KUBECONFIG)
            logger.info("Loaded kubeconfig from file: %s", KUBECONFIG)
        else:
            k8s_config.load_incluster_config()
            logger.info("Loaded in-cluster kubeconfig")
    except Exception as e:
        logger.error("Failed to load kubeconfig: %s", e)
        raise


def get_age(creation_timestamp) -> str:
    """Convert a Kubernetes timestamp to a human-readable age string."""
    if not creation_timestamp:
        return "unknown"
    now = datetime.now(timezone.utc)
    delta = now - creation_timestamp
    days = delta.days
    hours = delta.seconds // 3600
    minutes = (delta.seconds % 3600) // 60
    if days > 0:
        return f"{days}d"
    if hours > 0:
        return f"{hours}h"
    return f"{minutes}m"


def get_cluster_info() -> dict:
    v1 = client.CoreV1Api()
    version_api = client.VersionApi()

    nodes = v1.list_node()
    pods = v1.list_pod_for_all_namespaces()
    services = v1.list_service_for_all_namespaces()
    namespaces = v1.list_namespace()
    version_info = version_api.get_code()

    return {
        "nodes": len(nodes.items),
        "pods": len(pods.items),
        "services": len(services.items),
        "namespaces": len(namespaces.items),
        "version": version_info.git_version,
    }


def get_services() -> list[dict]:
    v1 = client.CoreV1Api()
    services = v1.list_service_for_all_namespaces()
    result = []

    for svc in services.items:
        ports = []
        if svc.spec.ports:
            for p in svc.spec.ports:
                port_str = f"{p.port}"
                if p.protocol and p.protocol != "TCP":
                    port_str += f"/{p.protocol}"
                ports.append(port_str)

        result.append({
            "name": svc.metadata.name,
            "namespace": svc.metadata.namespace,
            "type": svc.spec.type or "ClusterIP",
            "clusterIP": svc.spec.cluster_ip or "None",
            "ports": ports,
            "age": get_age(svc.metadata.creation_timestamp),
        })

    result.sort(key=lambda x: (x["namespace"], x["name"]))
    return result


def get_deployments() -> list[dict]:
    apps_v1 = client.AppsV1Api()
    deployments = apps_v1.list_deployment_for_all_namespaces()
    result = []

    for d in deployments.items:
        desired = d.spec.replicas or 0
        ready = d.status.ready_replicas or 0
        available = d.status.available_replicas or 0

        if ready == desired and desired > 0:
            status = "healthy"
        elif ready > 0:
            status = "degraded"
        else:
            status = "unavailable"

        result.append({
            "name": d.metadata.name,
            "namespace": d.metadata.namespace,
            "ready": ready,
            "desired": desired,
            "available": available,
            "age": get_age(d.metadata.creation_timestamp),
            "status": status,
        })

    result.sort(key=lambda x: (x["namespace"], x["name"]))
    return result
