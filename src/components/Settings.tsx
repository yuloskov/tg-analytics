import { type Message } from '~/types/chat'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { YearSelector } from './YearSelector'
import { UserColors } from './UserColors'

interface SettingsProps {
  messages: Message[]
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function Settings({ messages, years, selectedYear, onYearChange }: SettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Фильтр по году</h3>
            <YearSelector
              years={years}
              selectedYear={selectedYear}
              onYearChange={onYearChange}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Цвета пользователей</h3>
            <UserColors messages={messages} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 