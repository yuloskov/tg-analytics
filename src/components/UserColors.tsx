import { UserColorPicker } from './UserColorPicker'

interface UserColorsProps {
  users: string[];
  userIdMap: Record<string, string>;
}

export function UserColors({ users, userIdMap }: UserColorsProps) {
  return (
    <div className="max-h-[500px] overflow-y-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(userIdMap)
          .filter(([user]) => users.includes(user))
          .map(([user, userId]) => (
            <UserColorPicker
              key={userId}
              userId={userId}
              userName={user}
            />
          ))}
      </div>
    </div>
  )
} 