import { Card, CardContent } from '~/components/ui/card'
import { motion } from 'framer-motion'

export function PrivacyNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg 
                  className="w-6 h-6 text-blue-500 dark:text-blue-400" 
                  fill="none" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
                  />
                </svg>
              </motion.div>
            </div>
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              Вся обработка происходит в вашем браузере - данные никогда не отправляются на сервер.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 