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
  Cell,
} from 'recharts'
import { useUserColors } from '~/store/userColors'

interface VideoMessagesProps {
  messages: Message[]
}

export function VideoMessages({ messages }: VideoMessagesProps) {
  const { getUserColor } = useUserColors()

  // Get only video messages
  const videoMessages = messages.filter(msg => msg.media_type === 'video_message')
  
  if (videoMessages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Видео сообщения</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет сообщений(</p>
        </CardContent>
      </Card>
    )
  }

  // Get unique users
  const users = Array.from(new Set(videoMessages.map(msg => msg.from)))
  
  // Calculate statistics for each user
  interface UserStat {
    user: string
    count: number
    longestMessage: number
    userId: string
  }

  const userStats = users.map(user => {
    const userVideoMessages = videoMessages.filter(msg => msg.from === user)
    const count = userVideoMessages.length
    const longestMessage = userVideoMessages.reduce((max, msg) => 
      Math.max(max, msg.duration_seconds ?? 0), 0
    )
    
    return {
      user,
      count,
      longestMessage,
      userId: userVideoMessages[0]?.from_id ?? '',
    }
  })

  // Sort by count
  userStats.sort((a, b) => b.count - a.count)

  // Find the longest message overall
  const longestMessageStats = userStats.reduce((max, curr) => 
    curr.longestMessage > max.longestMessage ? curr : max
  , userStats[0] ?? { user: '', longestMessage: 0 })

  // Format duration as minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} мин ${remainingSeconds} сек`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Видео сообщения</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-1">Всего видео</p>
              <p className="text-2xl font-bold">{videoMessages.length}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-1">Самое длинное</p>
              <p className="text-2xl font-bold">{formatDuration(longestMessageStats.longestMessage)}</p>
              <p className="text-sm text-muted-foreground">от {longestMessageStats.user}</p>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [value, 'Количество сообщений']}
                />
                <Bar
                  dataKey="count"
                  name="Количество сообщений"
                >
                  {userStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getUserColor(entry.userId)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 