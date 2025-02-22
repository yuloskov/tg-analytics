import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

interface YearSelectorProps {
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <Select value={selectedYear} onValueChange={onYearChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Years</SelectItem>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 