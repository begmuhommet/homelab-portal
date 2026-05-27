interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const sizes = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-3',
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} rounded-full border-gray-700 border-t-blue-500 animate-spin`} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}
