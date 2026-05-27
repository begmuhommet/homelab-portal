interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'unavailable'
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const config = {
  healthy: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10 ring-emerald-400/20',
    label: 'Healthy',
  },
  degraded: {
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-400/10 ring-amber-400/20',
    label: 'Degraded',
  },
  unavailable: {
    dot: 'bg-red-400',
    text: 'text-red-400',
    bg: 'bg-red-400/10 ring-red-400/20',
    label: 'Unavailable',
  },
}

export default function StatusBadge({ status, showLabel = true, size = 'md' }: StatusBadgeProps) {
  const c = config[status]
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ring-1 font-medium ${c.bg} ${c.text} ${sizeClass}`}>
      <span className={`size-1.5 rounded-full ${c.dot} ${status === 'healthy' ? 'animate-pulse' : ''}`} />
      {showLabel && c.label}
    </span>
  )
}
