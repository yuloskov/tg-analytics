import { type Message } from '~/types/chat'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactWordCloud = dynamic(() => import('react-d3-cloud'), {
  ssr: false,
  loading: () => <div>Loading word cloud...</div>
})

// Technical words to filter out
const EXCLUDED_WORDS = new Set([
  'object',
  'null',
  'undefined',
  'true',
  'false',
  'function',
  'return',
  'const',
  'let',
  'var'
])

interface WordCloudProps {
  messages: Message[]
}

export function WordCloudChart({ messages }: WordCloudProps) {
  const wordData = useMemo(() => {
    if (messages.length === 0) {
      return []
    }
    // Combine all message texts
    const text = messages
      .map(msg => {
        // If the message text is an array (sometimes happens with formatted messages),
        // join it into a string
        if (Array.isArray(msg.text)) {
          return msg.text.join(' ')
        }
        return msg.text
      })
      .join(' ')
      .toLowerCase()

    // Split into words and remove punctuation
    const words = text.split(/\s+/)
      .map(word => word.replace(/[.,!?(){}[\]<>:;'"]/g, ''))
      .filter(word => word.length > 3 && !EXCLUDED_WORDS.has(word)) // Filter out short words and excluded words

    // Count word frequencies
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] ?? 0) + 1
    })

    // Convert to format required by react-d3-cloud
    return Object.entries(wordCount)
      .map(([text, value]) => ({ text, value }))
      .filter(item => item.value > 5) // Only show words that appear more than 5 times
      .sort((a, b) => b.value - a.value)
      .slice(0, 100) // Limit to top 100 words
  }, [messages])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Популярные слова</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {wordData.length > 0 && (
          <ReactWordCloud
            data={wordData}
            width={500}
            height={310}
            font="Impact"
            padding={2}
            rotate={() => Math.random() * 90 - 45}
            fontSize={(word: { value: number }) => Math.log2(word.value) * 2 + 12}
          />
        )}
      </CardContent>
    </Card>
  )
} 