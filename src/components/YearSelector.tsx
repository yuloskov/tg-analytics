import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { motion } from 'framer-motion'
import { GeistSans } from 'geist/font/sans'

interface YearSelectorProps {
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
          <SelectValue placeholder="Выберите год" />
        </SelectTrigger>
        <SelectContent className={`${GeistSans.className} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700`}>
          <SelectItem 
            value="all"
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20"
          >
            Все года
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