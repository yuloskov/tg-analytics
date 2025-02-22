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
import { motion } from 'framer-motion'

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
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Кто пишет в какое время?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-slate-600 dark:text-slate-300"
          >
            Распределение сообщений по времени суток
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  interval={2}
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
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
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 