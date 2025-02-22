import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Message } from '~/types/chat'
import { analyzeChat } from '~/utils/chatAnalysis'

interface MessagesChartProps {
  messages: Message[]
}

export function MessagesChart({ messages }: MessagesChartProps) {
  const getMessageCountChartData = (messagesByUser: Record<string, number>) => {
    return Object.entries(messagesByUser).map(([name, count]) => ({
      name,
      messages: count,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages by User</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getMessageCountChartData(analyzeChat(messages).messagesByUser)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="messages" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 