import { useUserColors } from '~/store/userColors'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { motion } from 'framer-motion'

interface UserColorPickerProps {
  userId: string
  userName: string
}

const colors = [
  { value: 'hsl(var(--chart-1))', label: 'Красный' },
  { value: 'hsl(var(--chart-2))', label: 'Бирюзовый' },
  { value: 'hsl(var(--chart-3))', label: 'Синий' },
  { value: 'hsl(var(--chart-4))', label: 'Желтый' },
  { value: 'hsl(var(--chart-5))', label: 'Оранжевый' },
]

export function UserColorPicker({ userId, userName }: UserColorPickerProps) {
  const { getUserColor, setUserColor } = useUserColors()
  const currentColor = getUserColor(userId)

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
          {userName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <motion.button
              key={color.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              onClick={() => setUserColor(userId, color.value)}
              className="relative h-6 w-6 min-h-[24px] min-w-[24px] rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-purple-400 dark:focus:ring-offset-slate-900"
              style={{ 
                backgroundColor: color.value,
                transform: currentColor === color.value ? 'scale(1.1)' : undefined
              }}
              title={color.label}
            >
              {currentColor === color.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-2 w-2 rounded-full bg-white dark:bg-slate-900 shadow-sm" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 