import { type SettingsData } from '~/utils/dataProcessing'
import { Settings as SettingsIcon } from 'lucide-react'
import { GeistSans } from 'geist/font/sans'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { useState } from 'react'
import { UserColors } from './UserColors'

interface SettingsProps extends SettingsData {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

function SettingsContent({ users, userIdMap }: SettingsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white/50 dark:bg-slate-800/50 p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-slate-600 dark:text-slate-300">Цвета пользователей</h3>
        <UserColors users={users} userIdMap={userIdMap} />
      </div>
    </div>
  )
}

export function Settings(props: SettingsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 p-3 rounded-lg font-semibold text-slate-600 dark:text-slate-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-white/50 dark:bg-slate-800/50">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className={`${GeistSans.className} bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Настройки
          </DialogTitle>
        </DialogHeader>
        <SettingsContent {...props} />
      </DialogContent>
    </Dialog>
  )
} 