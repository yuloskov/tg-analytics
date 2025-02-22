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
import { useUserColors } from '~/store/userColors'

interface ForwardedMessagesProps {
  messages: Message[]
}

interface ForwardStats {
  user: string
  userId: string
  sources: { source: string; count: number }[]
}

export function ForwardedMessages({ messages }: ForwardedMessagesProps) {
  const { getUserColor } = useUserColors()

  // Get only forwarded messages
  const forwardedMessages = messages.filter(msg => msg.forwarded_from !== undefined)
  
  if (forwardedMessages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Пересланные сообщения</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет пересланных сообщений</p>
        </CardContent>
      </Card>
    )
  }

  // Get unique users who forwarded messages
  const users = Array.from(new Set(forwardedMessages.map(msg => msg.from)))
  
  // Calculate statistics for each user
  const userStats: ForwardStats[] = users.map(user => {
    const userForwardedMessages = forwardedMessages.filter(msg => msg.from === user)
    
    // Count messages by source for this user
    const sourceCount: Record<string, number> = {}
    userForwardedMessages.forEach(msg => {
      if (msg.forwarded_from) {
        sourceCount[msg.forwarded_from] = (sourceCount[msg.forwarded_from] ?? 0) + 1
      }
    })
    
    // Convert to array and sort by count
    const sources = Object.entries(sourceCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3) // Keep only top 3 sources
    
    return {
      user,
      userId: userForwardedMessages[0]?.from_id ?? '',
      sources,
    }
  })

  // Sort users by total number of forwards
  userStats.sort((a, b) => {
    const totalA = a.sources.reduce((sum, src) => sum + src.count, 0)
    const totalB = b.sources.reduce((sum, src) => sum + src.count, 0)
    return totalB - totalA
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пересланные сообщения</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {userStats.map(stat => (
            <div key={stat.userId} className="space-y-2">
              <h3 className="font-medium">{stat.user}</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stat.sources}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="source"
                      width={200}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}`, 'Количество сообщений']}
                    />
                    <Bar
                      dataKey="count"
                      fill={getUserColor(stat.userId)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 