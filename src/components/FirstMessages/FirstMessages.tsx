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
} from 'recharts'
import { analyzeChat } from './chatAnalysis'

interface FirstMessagesProps {
  messages: Message[]
}

export function FirstMessages({ messages }: FirstMessagesProps) {
  const analysis = analyzeChat(messages)
  
  // Prepare data for the chart
  const initiationsCountByUser = analysis.conversationInitiators.reduce<Record<string, number>>(
    (acc, initiation) => {
      acc[initiation.user] = (acc[initiation.user] ?? 0) + 1
      return acc
    },
    {}
  )
  
  const chartData = Object.entries(initiationsCountByUser).map(([name, count]) => ({
    name,
    initiations: count,
  }))
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>First Ever Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(analysis.firstMessageTime).map(([user, time]) => (
            <div key={user} className="mb-2">
              <p>
                <strong>{user}</strong>: {new Date(time).toLocaleString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Initiations Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <p className="text-sm text-muted-foreground mb-4">
            Number of times each user started conversations after 12+ hours of inactivity
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="initiations" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 