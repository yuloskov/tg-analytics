import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { motion } from 'framer-motion'

export function HowToTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl text-transparent">
            Как скачать переписку из Telegram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              1. Откройте Telegram Desktop
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Экспорт данных доступен только в десктопной версии Telegram,
              скачать ее можно{" "}
              <a
                href="https://desktop.telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                здесь
              </a>
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              2. Откройте настройки экспорта
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
              <li>Откройте диалог с интересующим вас пользователем</li>
              <li>
                Нажмите на три точки справа от имени пользователя и выберите
                &quot;Экспорт истории чата&quot;
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              3. Настройте экспорт
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
              <li>В формате экспорта выберите &quot;JSON&quot;</li>
              <li>Снимите все галочки в настройках</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              4. Загрузите файл
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              После экспорта загрузите полученный JSON-файл на этот сайт для
              отчета
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 