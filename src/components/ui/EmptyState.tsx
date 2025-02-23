import { type LucideIcon, MessageSquareOff } from 'lucide-react'

interface EmptyStateProps {
  title: string
  message: string
  icon?: LucideIcon
}

export function EmptyState({ title, message, icon: Icon = MessageSquareOff }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </div>
  )
} 