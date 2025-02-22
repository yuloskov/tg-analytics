export interface Message {
  id: number
  type: string
  date: string
  from: string
  from_id: string
  text: string
  media_type?: string
  duration_seconds?: number
}

export interface ChatData {
  name: string
  type: string
  id: number
  messages: Message[]
} 