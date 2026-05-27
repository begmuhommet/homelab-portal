import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  trend?: string
}

export default function MetricCard({ label, value, icon: Icon, iconColor = 'text-blue-400', trend }: MetricCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4 hover:border-gray-700 transition-colors">
      <div className={`p-2.5 rounded-lg bg-gray-800 ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white mt-0.5">{value}</p>
        {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
      </div>
    </div>
  )
}
