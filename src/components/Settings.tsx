import { YearSelector } from './YearSelector'
import { UserColors } from './UserColors'
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
import { Button } from '~/components/ui/button'
import { useState } from 'react'

interface SettingsProps extends SettingsData {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

function SettingsContent({ users, userIdMap, years, selectedYear, onYearChange }: SettingsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white/50 dark:bg-slate-800/50 p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-slate-600 dark:text-slate-300">Фильтр по году</h3>
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
        />
      </div>
      <div className="rounded-lg bg-white/50 dark:bg-slate-800/50 p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-slate-600 dark:text-slate-300">Цвета пользователей</h3>
        <UserColors users={users} userIdMap={userIdMap} />
      </div>
    </div>
  )
}

export function Settings(props: SettingsProps) {
  const [open, setOpen] = useState(false)

  const handleYearChange = (year: string) => {
    props.onYearChange(year)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/50 dark:bg-slate-800/50">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={`${GeistSans.className} bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Настройки
          </DialogTitle>
        </DialogHeader>
        <SettingsContent {...props} onYearChange={handleYearChange} />
      </DialogContent>
    </Dialog>
  )
} 