import { useState } from 'react'
import { type ChatData } from '~/types/chat'
import { FileUpload } from '~/components/FileUpload'
import { ChatOverview } from '~/components/ChatOverview'
import { MessagesChart } from '~/components/MessagesChart'
import { PrivacyNotice } from '~/components/PrivacyNotice'
import { FirstMessages } from '~/components/FirstMessages/FirstMessages'
import { VoiceMessages } from '~/components/VoiceMessages'
import { Settings } from '~/components/Settings'

export default function Home() {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('all')

  // Filter out messages with undefined users before passing to components
  const validMessages = chatData?.messages.filter(msg => msg.from !== undefined) ?? []

  // Get available years from messages
  const years = validMessages.length > 0
    ? Array.from(new Set(validMessages.map(msg => new Date(msg.date).getFullYear())))
        .sort((a, b) => b - a) // Sort years in descending order
    : []

  // Filter messages by selected year
  const filteredMessages = selectedYear === 'all'
    ? validMessages
    : validMessages.filter(msg => new Date(msg.date).getFullYear() === parseInt(selectedYear))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Telegram Chat Analysis</h1>
      
      <PrivacyNotice />

      <div className="mb-8">
        <FileUpload onChatDataLoad={setChatData} />
      </div>

      {chatData && (
        <>
          <div className="mb-8">
            <Settings
              messages={filteredMessages}
              years={years}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MessagesChart messages={filteredMessages} />
            <FirstMessages messages={filteredMessages} />
            <VoiceMessages messages={filteredMessages} />
          </div>
        </>
      )}
    </div>
  )
}
