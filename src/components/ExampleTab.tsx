import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { motion } from 'framer-motion'

export function ExampleTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Пример отчета
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Загрузите JSON-файл с перепиской из Telegram, чтобы увидеть:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            <li>📊 Статистику сообщений по месяцам</li>
            <li>⏰ Активность в разное время суток</li>
            <li>🎤 отчет голосовых сообщений</li>
            <li>📹 Статистику видеосообщений</li>
            <li>🔄 Пересланные сообщения</li>
            <li>💬 Первые сообщения дня</li>
            <li>☁️ Облако часто используемых слов</li>
            <li>👍 Популярные реакции</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
} 