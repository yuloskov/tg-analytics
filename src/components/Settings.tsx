import { type Message } from '~/types/chat'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { YearSelector } from './YearSelector'
import { UserColors } from './UserColors'
import { motion } from 'framer-motion'

interface SettingsProps {
  messages: Message[]
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function Settings({ messages, years, selectedYear, onYearChange }: SettingsProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Настройки
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-300">Фильтр по году</h3>
            <YearSelector
              years={years}
              selectedYear={selectedYear}
              onYearChange={onYearChange}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-300">Цвета пользователей</h3>
            <UserColors messages={messages} />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 