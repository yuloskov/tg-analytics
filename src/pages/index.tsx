import { useState } from 'react'
import { type ChatData } from '~/types/chat'
import { FileUpload } from '~/components/FileUpload'
import { ChatOverview } from '~/components/ChatOverview'
import { MessagesChart } from '~/components/MessagesChart'
import { PrivacyNotice } from '~/components/PrivacyNotice'
import { FirstMessages } from '~/components/FirstMessages/FirstMessages'

export default function Home() {
  const [chatData, setChatData] = useState<ChatData | null>(null)

  // Filter out messages with undefined users before passing to components
  const validMessages = chatData?.messages.filter(msg => msg.from !== undefined) ?? []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Telegram Chat Analysis</h1>
      
      <PrivacyNotice />

      <div className="mb-8">
        <FileUpload onChatDataLoad={setChatData} />
      </div>

      {chatData && (
        <div className="grid gap-4 md:grid-cols-2">
          <ChatOverview chatData={{...chatData, messages: validMessages}} />
          <MessagesChart messages={validMessages} />
          <FirstMessages messages={validMessages} />
        </div>
      )}
    </div>
  )
}
