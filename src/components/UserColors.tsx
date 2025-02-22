import { type Message } from '~/types/chat'
import { UserColorPicker } from './UserColorPicker'

interface UserColorsProps {
  messages: Message[]
}

export function UserColors({ messages }: UserColorsProps) {
  // Get unique users with their IDs
  const uniqueUserIds = Array.from(new Set(messages.map(msg => msg.from_id)))
  const users = uniqueUserIds.map(id => {
    const message = messages.find(msg => msg.from_id === id)!
    return {
      id,
      name: message.from
    }
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <UserColorPicker
          key={user.id}
          userId={user.id}
          userName={user.name}
        />
      ))}
    </div>
  )
} 