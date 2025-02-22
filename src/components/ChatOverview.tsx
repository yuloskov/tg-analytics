import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ChatData } from '~/types/chat'

interface ChatOverviewProps {
  chatData: ChatData
}

export function ChatOverview({ chatData }: ChatOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Chat Name: {chatData.name}</p>
        <p>Total Messages: {chatData.messages.length}</p>
        <p>Chat Type: {chatData.type}</p>
      </CardContent>
    </Card>
  )
} 