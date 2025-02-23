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
import { type MonthlyMessageData } from '~/utils/dataProcessing'
import { useResponsiveAxisInterval } from '~/hooks/useResponsiveAxisInterval'
import { useTranslation } from 'next-i18next'

interface TotalMessagesProps {
  monthlyData: MonthlyMessageData[];
  users: string[];
  userIdMap: Record<string, string>;
}

// Function to truncate text if it's too long
const truncateText = (text: string, maxLength = 12) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 2) + '..'
}

export function TotalMessages({ monthlyData, users, userIdMap }: TotalMessagesProps) {
  const { getUserColor } = useUserColors()
  const xAxisInterval = useResponsiveAxisInterval()
  const { t } = useTranslation()

  // Calculate total messages per user
  const totalMessagesPerUser = users.map(user => {
    const total = monthlyData.reduce((sum, month) => {
      return sum + (Number(month[user]) || 0)
    }, 0)
    return {
      user,
      total,
      userId: userIdMap[user] ?? ''
    }
  }).sort((a, b) => b.total - a.total) // Sort by total messages in descending order

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {t('report.totalMessages.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-slate-600 dark:text-slate-300"
          >
            {t('report.totalMessages.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-[500px] md:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={totalMessagesPerUser}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="user" 
                  stroke="#64748b"
                  interval={xAxisInterval}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tickFormatter={(value: string) => truncateText(value)}
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: number) => [value, t('report.totalMessages.messageCount')]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="total"
                  name={t('report.totalMessages.messageCount')}
                >
                  {totalMessagesPerUser.map((entry, index) => (
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