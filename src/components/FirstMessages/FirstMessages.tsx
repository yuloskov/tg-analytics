import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { type Message } from '~/types/chat'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { analyzeChat } from './chatAnalysis'
import { useUserColors } from '~/store/userColors'
import { MONTHS } from '~/constants'

interface FirstMessagesProps {
  messages: Message[]
}

interface MonthlyData {
  month: string;
  [key: string]: number | string;
}

export function FirstMessages({ messages }: FirstMessagesProps) {
  const { getUserColor } = useUserColors()
  const analysis = analyzeChat(messages)
  const users = Array.from(
    new Set(
      messages
        .map((msg) => msg.from)
        .filter((from): from is string => typeof from === 'string')
    )
  );
  const userIdMap: Record<string, string> = Object.fromEntries(
    messages
      .filter((msg): msg is Message & { from: string; from_id: string } => 
        typeof msg.from === 'string' && typeof msg.from_id === 'string'
      )
      .map((msg) => [msg.from, msg.from_id])
  );
  
  // Initialize monthly data structure
  const monthlyInitiations: MonthlyData[] = MONTHS.map(month => ({
    month,
    ...Object.fromEntries(users.map(user => [user, 0]))
  }))

  // Count initiations by month and user
  analysis.conversationInitiators.forEach(initiation => {
    const date = new Date(initiation.time)
    const monthIndex = date.getMonth()
    const monthData = monthlyInitiations[monthIndex]
    if (initiation.user && monthData) {
      monthData[initiation.user] = (monthData[initiation.user] as number) + 1
    }
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Кто чаще начинал диалог?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Количество раз, когда пользователь начинал диалог после 12+ часов тишины
          </p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyInitiations}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {users
                  .filter((user): user is string => typeof user === 'string' && user in userIdMap)
                  .map(user => (
                    <Bar
                      key={user}
                      dataKey={user}
                      stackId="a"
                      fill={getUserColor(userIdMap[user] ?? '')}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 