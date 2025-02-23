import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
import { type ForwardedMessagesData } from '~/utils/dataProcessing'
import { Forward } from 'lucide-react'
import { EmptyState } from '~/components/ui/EmptyState'

export function ForwardedMessages({ userStats, totalCount }: ForwardedMessagesData) {
  const { getUserColor } = useUserColors()

  if (totalCount === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Пересланные сообщения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Нет пересланных сообщений"
            message="В этом чате пока нет пересланных сообщений из других чатов"
            icon={Forward}
          />
        </CardContent>
      </Card>
    )
  }

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