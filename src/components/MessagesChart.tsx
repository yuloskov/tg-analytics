import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type Message } from "~/types/chat";
import { useUserColors } from "~/store/userColors";
import { MONTHS } from "~/constants";

interface MessagesChartProps {
  messages: Message[];
}

export function MessagesChart({ messages }: MessagesChartProps) {
  const { getUserColor } = useUserColors();
  
  // Get unique users and their IDs
  const users = Array.from(
    new Set(
      messages
        .map((msg) => msg.from)
        .filter((from): from is string => typeof from === 'string')
    )
  );
  const userIdMap: Record<string, string> = Object.fromEntries(
    messages
      .filter((msg): msg is Message & { from: string; from_id: string } => 
        typeof msg.from === 'string' && typeof msg.from_id === 'string'
      )
      .map((msg) => [msg.from, msg.from_id])
  );

  // Initialize data structure for each month
  const monthlyData = MONTHS.map((month) => ({
    month,
    ...Object.fromEntries(users.map((user) => [user, 0])),
  }));

  // Count messages by month and user
  messages.forEach((msg) => {
    const date = new Date(msg.date);
    const monthIndex = date.getMonth();
    const monthData = monthlyData[monthIndex];
    if (monthData && msg.from) {
      // @ts-expect-error - msg.from is a string
      monthData[msg.from]++;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Кто больше писал?</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {users
              .filter((user): user is string => typeof user === 'string' && user in userIdMap)
              .map((user) => (
                <Bar
                  key={user}
                  dataKey={user}
                  stackId="a"
                  fill={getUserColor(userIdMap[user] ?? '')}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
