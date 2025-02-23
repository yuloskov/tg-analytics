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
import { useUserColors } from "~/store/userColors";
import { motion } from "framer-motion";
import { type MonthlyMessageData } from "~/utils/dataProcessing";
import { useResponsiveAxisInterval } from "~/hooks/useResponsiveAxisInterval";
import { useTranslation } from "next-i18next";

interface FirstMessagesProps {
  monthlyInitiations: MonthlyMessageData[];
  users: string[];
  userIdMap: Record<string, string>;
}

export function FirstMessages({
  monthlyInitiations,
  users,
  userIdMap,
}: FirstMessagesProps) {
  const { getUserColor } = useUserColors();
  const xAxisInterval = useResponsiveAxisInterval();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-2xl text-transparent">
            {t('report.firstMessages.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-slate-600 dark:text-slate-300"
            >
              {t('report.firstMessages.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-[800px] rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800 md:h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyInitiations}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    interval={xAxisInterval}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                  {users
                    .filter(
                      (user): user is string =>
                        typeof user === "string" && user in userIdMap,
                    )
                    .map((user) => (
                      <Bar
                        key={user}
                        dataKey={user}
                        stackId="a"
                        fill={getUserColor(userIdMap[user] ?? "")}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
