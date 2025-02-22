import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { motion } from 'framer-motion'
import { type TopReaction, type UserFavorite } from '~/utils/dataProcessing'
import { EmptyState } from './EmptyState'
import { SmilePlus } from 'lucide-react'

interface PopularReactionsProps {
  topReactions: TopReaction[];
  userFavorites: UserFavorite[];
}

export function PopularReactions({ topReactions, userFavorites }: PopularReactionsProps) {
  if (topReactions.length === 0 && userFavorites.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Статистика реакций
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Нет реакций"
            message="В этом чате пока никто не использовал реакции"
            icon={SmilePlus}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Статистика реакций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-4 text-xl">Самые популярные реакции</h3>
            <div className="space-y-3">
              {topReactions.map(({ emoji, stats }, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={emoji}
                  className="flex items-center gap-3 text-lg bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full font-semibold text-purple-600 dark:text-purple-300">
                    {index + 1}
                  </span>
                  <span className="text-2xl">{emoji}</span>
                  <span className="ml-auto font-medium text-slate-600 dark:text-slate-300">
                    {stats.totalCount}
                  </span>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.totalCount / (topReactions[0]?.stats.totalCount ?? stats.totalCount)) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-xl">Любимые реакции участников</h3>
            <div className="space-y-3">
              {userFavorites.map(({ user, emoji, count }, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={user}
                  className="flex items-center gap-3 text-lg bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full font-semibold text-blue-600 dark:text-blue-300">
                    {index + 1}
                  </span>
                  <span className="font-medium truncate max-w-[150px]">{user}</span>
                  <span className="text-2xl">{emoji}</span>
                  <span className="ml-auto font-medium text-slate-600 dark:text-slate-300">
                    {count}
                  </span>
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / (userFavorites[0]?.count ?? count)) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 