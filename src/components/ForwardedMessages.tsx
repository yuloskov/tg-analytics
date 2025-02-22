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
import { motion } from 'framer-motion'

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
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Пересланные сообщения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-300">Нет пересланных сообщений</p>
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
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Пересланные сообщения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {userStats.map((stat, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={stat.userId}
              className="space-y-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {stat.user}
              </h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stat.sources}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis 
                      type="category" 
                      dataKey="source"
                      width={120}
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}`, 'Количество сообщений']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill={getUserColor(stat.userId)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 