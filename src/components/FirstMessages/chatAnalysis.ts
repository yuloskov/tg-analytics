import { type Message } from '~/types/chat'

export interface ConversationInitiation {
  user: string
  time: string
  timeSinceLastMessage: number // in hours
}

interface ChatAnalysis {
  messagesByUser: Record<string, number>
  firstMessageTime: Record<string, string>
  conversationInitiators: ConversationInitiation[]
}

export function analyzeChat(messages: Message[]): ChatAnalysis {
  const messagesByUser: Record<string, number> = {}
  const firstMessageTime: Record<string, string> = {}
  const conversationInitiators: ConversationInitiation[] = []
  
  // Sort messages by date
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  let lastMessageTime: Date | null = null
  
  sortedMessages.forEach((message) => {
    // Count messages by user
    messagesByUser[message.from] = (messagesByUser[message.from] ?? 0) + 1
    
    // Track first message time for each user
    if (!firstMessageTime[message.from]) {
      firstMessageTime[message.from] = message.date
    }
    
    // Check for conversation initiations (after 12 hours of inactivity)
    const currentMessageTime = new Date(message.date)
    if (lastMessageTime) {
      const hoursSinceLastMessage = 
        (currentMessageTime.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastMessage >= 12) {
        conversationInitiators.push({
          user: message.from,
          time: message.date,
          timeSinceLastMessage: Math.round(hoursSinceLastMessage)
        })
      }
    }
    
    lastMessageTime = currentMessageTime
  })

  return {
    messagesByUser,
    firstMessageTime,
    conversationInitiators
  }
} 