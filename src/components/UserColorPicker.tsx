import { useUserColors } from '~/store/userColors'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface UserColorPickerProps {
  userId: string
  userName: string
}

const colors = [
  { value: 'hsl(var(--chart-1))', label: 'Red' },
  { value: 'hsl(var(--chart-2))', label: 'Teal' },
  { value: 'hsl(var(--chart-3))', label: 'Navy' },
  { value: 'hsl(var(--chart-4))', label: 'Yellow' },
  { value: 'hsl(var(--chart-5))', label: 'Orange' },
]

export function UserColorPicker({ userId, userName }: UserColorPickerProps) {
  const { getUserColor, setUserColor } = useUserColors()
  const currentColor = getUserColor(userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {userName}&apos;s Color
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setUserColor(userId, color.value)}
              className="h-6 w-6 min-h-[24px] min-w-[24px] rounded-full border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{ 
                backgroundColor: color.value,
                borderColor: currentColor === color.value ? 'black' : undefined,
                transform: currentColor === color.value ? 'scale(1.1)' : undefined
              }}
              title={color.label}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 