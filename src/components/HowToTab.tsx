import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { motion } from 'framer-motion'

export function HowToTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Как скачать переписку из Telegram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
              1. Откройте Telegram Desktop
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Экспорт данных доступен только в десктопной версии Telegram, скачать ее можно <a href="https://desktop.telegram.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">здесь</a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
              2. Откройте Настройки
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Нажмите на кнопку меню (≡) и выберите &quot;Настройки&quot;
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
              3. Перейдите в раздел экспорта данных
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Выберите &quot;Расширенные настройки&quot; → &quot;Экспортировать данные&quot;
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
              4. Настройте экспорт
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Выберите чат для экспорта</li>
              <li>В формате экспорта выберите &quot;JSON&quot;</li>
              <li>Можете отключить медиафайлы для ускорения экспорта</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
              5. Загрузите файл
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              После экспорта загрузите полученный JSON-файл на этот сайт для отчета
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 