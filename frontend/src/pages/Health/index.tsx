import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { useHealth } from '@/hooks'
import type { HealthCheck } from '@/types'

function HealthIcon({ status }: { status: HealthCheck['status'] }) {
  if (status === 'healthy') return <CheckCircle size={18} className="text-emerald-400" />
  if (status === 'degraded') return <AlertTriangle size={18} className="text-amber-400" />
  return <XCircle size={18} className="text-red-400" />
}

export default function Health() {
  const { data: health, isLoading, isError, refetch, dataUpdatedAt } = useHealth()

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Health</h1>
          <p className="text-gray-400 text-sm mt-1">Platform component status</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock size={12} />
            Updated {lastUpdated}
          </div>
        )}
      </div>

      {isLoading && <LoadingSpinner message="Checking platform health..." />}
      {isError && <ErrorMessage message="Failed to load health status" onRetry={refetch} />}

      {health && (
        <>
          {/* Overall status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Overall Status</p>
              <p className="text-lg font-semibold text-white capitalize">{health.status}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {health.checks.filter(c => c.status === 'healthy').length} of {health.checks.length} components healthy
              </p>
            </div>
            <StatusBadge status={health.status} />
          </div>

          {/* Individual checks */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Components</h2>
            {health.checks.map((check) => (
              <div
                key={check.name}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HealthIcon status={check.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-medium text-white">{check.name}</p>
                      {check.latency !== undefined && (
                        <span className="text-xs text-gray-600 font-mono">{check.latency}ms</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{check.message}</p>
                  </div>
                  <StatusBadge status={check.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
