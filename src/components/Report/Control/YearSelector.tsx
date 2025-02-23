import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { motion } from 'framer-motion'
import { GeistSans } from 'geist/font/sans'
import { Calendar } from 'lucide-react'
import { useTranslation } from 'next-i18next'

interface YearSelectorProps {
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="h-12 inline-flex items-center gap-2 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
          <Calendar className="w-5 h-5" />
          <SelectValue placeholder={t('report.yearSelector.placeholder')} />
        </SelectTrigger>
        <SelectContent className={`${GeistSans.className} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700`}>
          <SelectItem 
            value="all"
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
          >
            {t('report.allTime')}
          </SelectItem>
          {years.map((year) => (
            <SelectItem 
              key={year} 
              value={year.toString()}
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  )
} 