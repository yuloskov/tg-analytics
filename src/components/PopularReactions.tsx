import { type Message } from '~/types/chat'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface PopularReactionsProps {
  messages: Message[]
}

export function PopularReactions({ messages }: PopularReactionsProps) {
  // Count reactions across all messages and track who used them
  const reactionStats = messages.reduce((acc, message) => {
    if (!message.reactions) return acc

    message.reactions.forEach(reaction => {
      const emoji = reaction.emoji
      
      // Initialize emoji stats if not exists
      if (!acc[emoji]) {
        acc[emoji] = {
          totalCount: 0,
          userCounts: {} as Record<string, number>
        }
      }
      
      // Update total count
      acc[emoji].totalCount += reaction.count

      // Update per-user counts
      if (reaction.recent) {
        reaction.recent.forEach(user => {
          if (!user.from) return
          acc[emoji].userCounts[user.from] = (acc[emoji].userCounts[user.from] || 0) + 1
        })
      }
    })

    return acc
  }, {} as Record<string, { totalCount: number; userCounts: Record<string, number> }>)

  // Get top 5 reactions overall
  const topReactions = Object.entries(reactionStats)
    .sort(([, a], [, b]) => b.totalCount - a.totalCount)
    .slice(0, 5)

  // Get favorite reaction for each user
  const userFavorites = new Map<string, { emoji: string; count: number }>()
  
  Object.entries(reactionStats).forEach(([emoji, stats]) => {
    Object.entries(stats.userCounts).forEach(([user, count]) => {
      const current = userFavorites.get(user)
      if (!current || count > current.count) {
        userFavorites.set(user, { emoji, count })
      }
    })
  })

  // Sort users by their favorite reaction count
  const sortedUserFavorites = Array.from(userFavorites.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика реакций</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Самые популярные реакции</h3>
            <div className="space-y-2">
              {topReactions.map(([emoji, stats], index) => (
                <div key={emoji} className="flex items-center gap-2 text-lg">
                  <span>{index + 1}.</span>
                  <span>{emoji}</span>
                  <span>- {stats.totalCount}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Любимые реакции участников</h3>
            <div className="space-y-2">
              {sortedUserFavorites.map(([user, { emoji, count }], index) => (
                <div key={user} className="flex items-center gap-2 text-lg">
                  <span>{index + 1}.</span>
                  <span>{user}:</span>
                  <span>{emoji}</span>
                  <span>- {count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 