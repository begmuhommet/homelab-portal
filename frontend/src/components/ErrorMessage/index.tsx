import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({ message = 'Failed to load data', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="p-3 rounded-full bg-red-400/10">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300">{message}</p>
        <p className="text-xs text-gray-500 mt-1">Check if the backend is running</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  )
}
