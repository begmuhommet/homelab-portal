export interface ClusterInfo {
  nodes: number
  pods: number
  services: number
  namespaces: number
  version: string
}

export interface Service {
  name: string
  namespace: string
  type: string
  clusterIP: string
  ports: string[]
  age: string
}

export interface Deployment {
  name: string
  namespace: string
  ready: number
  desired: number
  available: number
  age: string
  status: 'healthy' | 'degraded' | 'unavailable'
}

export interface HealthCheck {
  name: string
  status: 'healthy' | 'degraded' | 'unavailable'
  message: string
  latency?: number
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unavailable'
  checks: HealthCheck[]
  timestamp: string
}

export interface ApiError {
  message: string
  status?: number
}
