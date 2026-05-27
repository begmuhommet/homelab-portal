import { useQuery } from '@tanstack/react-query'
import { fetchClusterInfo, fetchServices, fetchDeployments, fetchHealth } from '@/api'

export const useClusterInfo = () =>
  useQuery({
    queryKey: ['cluster-info'],
    queryFn: fetchClusterInfo,
    refetchInterval: 30000,
  })

export const useServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    refetchInterval: 30000,
  })

export const useDeployments = () =>
  useQuery({
    queryKey: ['deployments'],
    queryFn: fetchDeployments,
    refetchInterval: 30000,
  })

export const useHealth = () =>
  useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 15000,
  })
