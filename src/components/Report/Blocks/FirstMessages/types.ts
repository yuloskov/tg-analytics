export interface ConversationInitiation {
  user: string
  time: string
  timeSinceLastMessage: number // in hours
}

export interface ChatAnalysis {
  messagesByUser: Record<string, number>
  firstMessageTime: Record<string, string>
  conversationInitiators: ConversationInitiation[]
}
