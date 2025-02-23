import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { type WordCloudData } from '~/utils/dataProcessing'
import { useTranslation } from 'next-i18next'

function LoadingComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        className="text-slate-600 dark:text-slate-300"
      >
        {t('report.wordCloud.loading')}
      </motion.div>
    </div>
  );
}

const ReactWordCloud = dynamic(() => import('react-d3-cloud'), {
  ssr: false,
  loading: () => <LoadingComponent />
})

export function WordCloudChart({ wordData }: WordCloudData) {
  const { t } = useTranslation();
  const processedWordData = wordData.map(item => ({ ...item }));
  const maxValue = Math.max(...processedWordData.map(w => w.value));

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {t('report.wordCloud.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-[310px] md:h-[400px]"
        >
          {processedWordData.length > 0 && (
            <ReactWordCloud
              data={processedWordData}
              width={500}
              height={310}
              font="Times"
              padding={0}
              fontWeight={500}
              rotate={() => Math.random() * 90 - 45}
              fontSize={(word: { value: number }) => {
                const minSize = 10;
                const maxSize = 80;
                const scale = Math.pow(word.value / maxValue, 2);
                return minSize + (scale * (maxSize - minSize));
              }}
            />
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
} 