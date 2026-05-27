import { useState } from 'react'
import { Search } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { useServices } from '@/hooks'

export default function Services() {
  const { data: services, isLoading, isError, refetch } = useServices()
  const [search, setSearch] = useState('')
  const [selectedNamespace, setSelectedNamespace] = useState('all')

  const namespaces = services
    ? ['all', ...Array.from(new Set(services.map((s) => s.namespace))).sort()]
    : ['all']

  const filtered = services?.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.namespace.toLowerCase().includes(search.toLowerCase())
    const matchesNamespace = selectedNamespace === 'all' || s.namespace === selectedNamespace
    return matchesSearch && matchesNamespace
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <p className="text-gray-400 text-sm mt-1">All Kubernetes services running in the cluster</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-colors"
          />
        </div>
        <select
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-700 transition-colors"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>
              {ns === 'all' ? 'All namespaces' : ns}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingSpinner message="Loading services..." />}
      {isError && <ErrorMessage message="Failed to load services" onRetry={refetch} />}

      {filtered && (
        <>
          <p className="text-xs text-gray-600 mb-4">{filtered.length} service{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid gap-3">
            {filtered.map((service) => (
              <div
                key={`${service.namespace}-${service.name}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                      <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                        {service.namespace}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        Type: <span className="text-gray-400">{service.type}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        IP: <span className="text-gray-400 font-mono">{service.clusterIP}</span>
                      </span>
                      {service.ports.length > 0 && (
                        <span className="text-xs text-gray-500">
                          Ports: <span className="text-gray-400 font-mono">{service.ports.join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0">{service.age}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">No services match your search</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
