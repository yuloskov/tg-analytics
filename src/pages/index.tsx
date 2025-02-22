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
import { processChatData } from '~/utils/dataProcessing'

// Default empty data structures
const defaultData = {
  messages: {
    monthlyData: [],
    users: [],
    userIdMap: {},
  },
  timeOfDay: {
    hourCounts: [],
    users: [],
    userIdMap: {},
  },
  firstMessages: {
    monthlyInitiations: [],
    users: [],
    userIdMap: {},
  },
  reactions: {
    topReactions: [],
    userFavorites: [],
  },
  voiceMessages: {
    userStats: [],
    longestMessageStats: { user: '', longestMessage: 0 },
    totalCount: 0,
  },
  videoMessages: {
    userStats: [],
    longestMessageStats: { user: '', longestMessage: 0 },
    totalCount: 0,
  },
  wordCloud: {
    wordData: [],
  },
  forwardedMessages: {
    userStats: [],
    totalCount: 0,
  },
  settings: {
    users: [],
    userIdMap: {},
    years: [],
  },
}

export default function Home() {
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('main')

  // Filter out messages with undefined users before passing to components
  const validMessages = chatData?.messages.filter(msg => msg.from !== undefined) ?? []

  // Filter messages by selected year
  const filteredMessages = selectedYear === 'all'
    ? validMessages
    : validMessages.filter(msg => new Date(msg.date).getFullYear() === parseInt(selectedYear))

  // Process all data at once, using validMessages for settings and filteredMessages for charts
  const processedData = validMessages.length > 0 
    ? processChatData(filteredMessages, validMessages) 
    : defaultData

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
                  {...processedData.settings}
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
                  <MessagesChart {...processedData.messages} />
                </div>
                <div className="masonry-grid-item">
                  <TimeOfDayChart {...processedData.timeOfDay} />
                </div>
                <div className="masonry-grid-item">
                  <FirstMessages {...processedData.firstMessages} />
                </div>
                <div className="masonry-grid-item">
                  <PopularReactions {...processedData.reactions} />
                </div>
                <div className="masonry-grid-item">
                  <VoiceMessages {...processedData.voiceMessages} />
                </div>
                <div className="masonry-grid-item">
                  <VideoMessages {...processedData.videoMessages} />
                </div>
                <div className="masonry-grid-item">
                  <WordCloudChart {...processedData.wordCloud} />
                </div>
                <div className="masonry-grid-item">
                  <ForwardedMessages {...processedData.forwardedMessages} />
                </div>
              </Masonry>
            </>
          )}
        </>
      )}
    </div>
  )
}
