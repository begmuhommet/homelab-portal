import { Server, Box, Layers, GitBranch } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { useClusterInfo, useDeployments } from '@/hooks'

export default function Home() {
  const { data: cluster, isLoading: clusterLoading, isError: clusterError, refetch: refetchCluster } = useClusterInfo()
  const { data: deployments, isLoading: deploymentsLoading, isError: deploymentsError, refetch: refetchDeployments } = useDeployments()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Platform health and cluster status</p>
      </div>

      {/* Cluster Metrics */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Cluster</h2>
        {clusterLoading && <LoadingSpinner message="Loading cluster info..." />}
        {clusterError && <ErrorMessage message="Failed to load cluster info" onRetry={refetchCluster} />}
        {cluster && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Nodes" value={cluster.nodes} icon={Server} iconColor="text-blue-400" />
            <MetricCard label="Pods" value={cluster.pods} icon={Box} iconColor="text-purple-400" />
            <MetricCard label="Services" value={cluster.services} icon={Layers} iconColor="text-emerald-400" />
            <MetricCard label="Namespaces" value={cluster.namespaces} icon={GitBranch} iconColor="text-amber-400" />
          </div>
        )}
      </section>

      {/* Deployments */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Deployments</h2>
        {deploymentsLoading && <LoadingSpinner message="Loading deployments..." />}
        {deploymentsError && <ErrorMessage message="Failed to load deployments" onRetry={refetchDeployments} />}
        {deployments && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Namespace</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ready</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {deployments.map((d) => (
                  <tr key={`${d.namespace}-${d.name}`} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{d.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">
                        {d.namespace}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {d.ready}/{d.desired}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={d.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{d.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deployments.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">No deployments found</div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
