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
import { VideoOff } from 'lucide-react'
import { EmptyState } from '~/components/ui/EmptyState'
import { useTranslation } from 'next-i18next'

// Function to truncate text if it's too long
const truncateText = (text: string, maxLength = 12) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 2) + '..'
}

export function VideoMessages({ userStats, longestMessageStats, totalCount }: VideoMessagesData) {
  const { getUserColor } = useUserColors()
  const { t } = useTranslation()

  if (totalCount === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {t('report.videoMessages.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t('report.videoMessages.noMessages')}
            message={t('report.videoMessages.noMessagesDesc')}
            icon={VideoOff}
          />
        </CardContent>
      </Card>
    )
  }

  // Format duration as minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} ${t('report.voiceMessages.minutes')} ${remainingSeconds} ${t('report.voiceMessages.seconds')}`
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {t('report.videoMessages.title')}
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
              <p className="text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">{t('report.videoMessages.totalVideo')}</p>
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
              <p className="text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">{t('report.videoMessages.longestMessage')}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {formatDuration(longestMessageStats.longestMessage)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('report.videoMessages.from')} {longestMessageStats.user}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-[500px] md:h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="user" 
                  stroke="#64748b"
                  interval={0}
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
                  dataKey="count"
                  name={t('report.totalMessages.messageCount')}
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