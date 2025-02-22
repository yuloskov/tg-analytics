import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
import { motion } from 'framer-motion'
import { type VideoMessagesData } from '~/utils/dataProcessing'

export function VideoMessages({ userStats, longestMessageStats, totalCount }: VideoMessagesData) {
  const { getUserColor } = useUserColors()

  if (totalCount === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Видео сообщения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-300">Нет сообщений(</p>
        </CardContent>
      </Card>
    )
  }

  // Format duration as minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} мин ${remainingSeconds} сек`
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Видео сообщения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Всего видео</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {totalCount}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Самое длинное</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {formatDuration(longestMessageStats.longestMessage)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">от {longestMessageStats.user}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="user" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: number, name: string) => [value, 'Количество сообщений']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
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
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 