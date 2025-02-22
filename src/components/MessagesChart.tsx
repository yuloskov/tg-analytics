import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
import { Message } from '~/types/chat'

interface MessagesChartProps {
  messages: Message[]
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

export function MessagesChart({ messages }: MessagesChartProps) {
  // Get unique users
  const users = Array.from(new Set(messages.map(msg => msg.from)))

  // Initialize data structure for each month
  const monthlyData = MONTHS.map(month => ({
    month,
    ...Object.fromEntries(users.map(user => [user, 0]))
  }))

  // Count messages by month and user
  messages.forEach(msg => {
    const date = new Date(msg.date)
    const monthIndex = date.getMonth()
    monthlyData[monthIndex][msg.from]++
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Кто больше писал?</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {users.map((user, index) => (
              <Bar
                key={user}
                dataKey={user}
                stackId="a"
                fill={index === 0 ? '#1e88e5' : '#e91e63'}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 