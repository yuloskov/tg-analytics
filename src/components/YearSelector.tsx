import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface YearSelectorProps {
  years: number[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter by Year</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
} 