import { useState } from 'react'
import { type ChatData } from '~/types/chat'
import { FileUpload } from '~/components/FileUpload'
import { MessagesChart } from '~/components/MessagesChart'
import { PrivacyNotice } from '~/components/PrivacyNotice'
import { FirstMessages } from '~/components/FirstMessages/FirstMessages'
import { VoiceMessages } from '~/components/VoiceMessages'
import { VideoMessages } from '~/components/VideoMessages'
import { Settings } from '~/components/Settings'
import { TimeOfDayChart } from '~/components/TimeOfDayChart'
import { WordCloudChart } from '~/components/WordCloud'
import { ForwardedMessages } from '~/components/ForwardedMessages'
import { PopularReactions } from '~/components/PopularReactions'
import { Header } from '~/components/Header'
import { ExampleTab } from '~/components/ExampleTab'
import { HowToTab } from '~/components/HowToTab'
import Masonry from 'react-masonry-css'

export default function Home() {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('main')

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

  const breakpointColumns = {
    default: 2,
    1024: 2,
    768: 1
  }

  return (
    <div className="container mx-auto p-4">
      <Header onTabChange={setActiveTab} />
      
      {activeTab === 'example' && <ExampleTab />}
      
      {activeTab === 'how-to' && <HowToTab />}
      
      {activeTab === 'main' && (
        <>
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

              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                <div className="masonry-grid-item">
                  <MessagesChart messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <TimeOfDayChart messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <FirstMessages messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <PopularReactions messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <VoiceMessages messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <VideoMessages messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <WordCloudChart messages={filteredMessages} />
                </div>
                <div className="masonry-grid-item">
                  <ForwardedMessages messages={filteredMessages} />
                </div>
              </Masonry>
            </>
          )}
        </>
      )}
    </div>
  )
}
