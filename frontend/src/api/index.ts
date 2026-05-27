import client from './client'
import type { ClusterInfo, Service, Deployment, HealthStatus } from '@/types'

export const fetchClusterInfo = async (): Promise<ClusterInfo> => {
  const { data } = await client.get('/cluster/info')
  return data
}

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await client.get('/services')
  return data
}

export const fetchDeployments = async (): Promise<Deployment[]> => {
  const { data } = await client.get('/deployments')
  return data
}

export const fetchHealth = async (): Promise<HealthStatus> => {
  const { data } = await client.get('/health')
  return data
}
