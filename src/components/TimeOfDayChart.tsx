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
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useUserColors } from '~/store/userColors'

interface TimeOfDayChartProps {
  messages: Message[]
}

export function TimeOfDayChart({ messages }: TimeOfDayChartProps) {
  const { getUserColor } = useUserColors()

  // Get unique users
  const users = Array.from(
    new Set(
      messages
        .map((msg) => msg.from)
        .filter((from): from is string => typeof from === 'string')
    )
  )

  // Create user ID map for colors
  const userIdMap: Record<string, string> = Object.fromEntries(
    messages
      .filter((msg): msg is Message & { from: string; from_id: string } => 
        typeof msg.from === 'string' && typeof msg.from_id === 'string'
      )
      .map((msg) => [msg.from, msg.from_id])
  )

  // Initialize array for 24 hours with counts for each user
  const hourCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, '0')}:00`,
    ...Object.fromEntries(users.map(user => [user, 0]))
  }))

  // Count messages for each hour and user
  messages.forEach((msg) => {
    const hour = new Date(msg.date).getHours()
    if (msg.from && typeof msg.from === 'string') {
      hourCounts[hour][msg.from] = (hourCounts[hour][msg.from] || 0) + 1
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Кто пишет в какое время?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Распределение сообщений по времени суток
        </p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                interval={2}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
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
  )
} 