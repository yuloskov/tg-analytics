import { type Message } from "~/types/chat";
import { MONTHS } from "~/constants";

export interface MonthlyMessageData {
  month: string;
  [key: string]: number | string;
}

export interface ProcessedMessagesData {
  monthlyData: MonthlyMessageData[];
  users: string[];
  userIdMap: Record<string, string>;
}

export function processMessagesData(messages: Message[], baseData: BaseData): ProcessedMessagesData {
  // Initialize data structure for each month
  const monthlyData = MONTHS.map((month) => ({
    month,
    ...Object.fromEntries(baseData.users.map((user) => [user, 0])),
  }));

  // Count messages by month and user
  messages.forEach((msg) => {
    const date = new Date(msg.date);
    const monthIndex = date.getMonth();
    const monthData = monthlyData[monthIndex] as MonthlyMessageData;
    if (monthData && msg.from) {
      monthData[msg.from] = (monthData[msg.from] as number) + 1;
    }
  });

  return {
    monthlyData,
    users: baseData.users,
    userIdMap: baseData.userIdMap,
  };
}

export interface HourCount {
  hour: number;
  label: string;
  [key: string]: number | string;  // Allow string indexing for user names
}

export interface TimeOfDayData {
  hourCounts: HourCount[];
  users: string[];
  userIdMap: Record<string, string>;
}

export function processTimeOfDayData(messages: Message[], baseData: BaseData): TimeOfDayData {
  // Initialize array for 24 hours with counts for each user
  const hourCounts: HourCount[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, '0')}:00`,
    ...Object.fromEntries(baseData.users.map(user => [user, 0]))
  }));

  // Count messages for each hour and user
  messages.forEach((msg) => {
    const hour = new Date(msg.date).getHours();
    if (msg.from && typeof msg.from === 'string' && hourCounts[hour]) {
      const currentCount = hourCounts[hour][msg.from] as number;
      hourCounts[hour][msg.from] = currentCount + 1;
    }
  });

  return {
    hourCounts,
    users: baseData.users,
    userIdMap: baseData.userIdMap,
  };
}

export interface FirstMessagesData {
  monthlyInitiations: MonthlyMessageData[];
  users: string[];
  userIdMap: Record<string, string>;
}

interface ConversationInitiator {
  user: string;
  time: number;
}

function analyzeConversationInitiators(messages: Message[]): ConversationInitiator[] {
  const CONVERSATION_GAP = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const initiators: ConversationInitiator[] = [];
  let lastMessageTime = 0;

  messages.forEach((message) => {
    const currentTime = new Date(message.date).getTime();
    if (currentTime - lastMessageTime > CONVERSATION_GAP && message.from) {
      initiators.push({
        user: message.from,
        time: currentTime,
      });
    }
    lastMessageTime = currentTime;
  });

  return initiators;
}

export function processFirstMessagesData(messages: Message[], baseData: BaseData): FirstMessagesData {
  // Get conversation initiators
  const conversationInitiators = analyzeConversationInitiators(messages);
  
  // Initialize monthly data structure
  const monthlyInitiations = MONTHS.map(month => ({
    month,
    ...Object.fromEntries(baseData.users.map(user => [user, 0]))
  }));

  // Count initiations by month and user
  conversationInitiators.forEach(initiation => {
    const date = new Date(initiation.time);
    const monthIndex = date.getMonth();
    const monthData = monthlyInitiations[monthIndex] as MonthlyMessageData;
    if (initiation.user && monthData) {
      monthData[initiation.user] = (monthData[initiation.user] as number) + 1;
    }
  });

  return {
    monthlyInitiations,
    users: baseData.users,
    userIdMap: baseData.userIdMap,
  };
}

interface ReactionStats {
  totalCount: number;
  userCounts: Record<string, number>;
}

export interface TopReaction {
  emoji: string;
  stats: ReactionStats;
}

export interface UserFavorite {
  user: string;
  emoji: string;
  count: number;
}

export interface ReactionsData {
  topReactions: TopReaction[];
  userFavorites: UserFavorite[];
}

export function processReactionsData(messages: Message[]): ReactionsData {
  // Count reactions across all messages and track who used them
  const reactionStats = messages.reduce((acc, message) => {
    if (!message.reactions) return acc;

    message.reactions.forEach(reaction => {
      const emoji = reaction.emoji;
      
      // Initialize emoji stats if not exists
      if (!acc[emoji]) {
        acc[emoji] = {
          totalCount: 0,
          userCounts: {} as Record<string, number>
        };
      }
      
      // Update total count
      acc[emoji].totalCount += reaction.count;

      // Update per-user counts
      if (reaction.recent) {
        reaction.recent.forEach(user => {
          if (!user.from) return;
          acc[emoji]!.userCounts[user.from] = (acc[emoji]!.userCounts[user.from] ?? 0) + 1;
        });
      }
    });

    return acc;
  }, {} as Record<string, ReactionStats>);

  // Get top 5 reactions overall
  const topReactions = Object.entries(reactionStats)
    .sort(([, a], [, b]) => b.totalCount - a.totalCount)
    .slice(0, 5)
    .map(([emoji, stats]) => ({ emoji, stats }));

  // Get favorite reaction for each user
  const userFavorites = new Map<string, { emoji: string; count: number }>();
  
  Object.entries(reactionStats).forEach(([emoji, stats]) => {
    Object.entries(stats.userCounts).forEach(([user, count]) => {
      const current = userFavorites.get(user);
      if (!current || count > current.count) {
        userFavorites.set(user, { emoji, count });
      }
    });
  });

  // Sort users by their favorite reaction count
  const sortedUserFavorites = Array.from(userFavorites.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([user, { emoji, count }]) => ({ user, emoji, count }));

  return {
    topReactions,
    userFavorites: sortedUserFavorites,
  };
}

export interface UserVoiceStat {
  user: string;
  count: number;
  longestMessage: number;
  userId: string;
}

export interface VoiceMessagesData {
  userStats: UserVoiceStat[];
  longestMessageStats: {
    user: string;
    longestMessage: number;
  };
  totalCount: number;
}

export function processVoiceMessagesData(messages: Message[]): VoiceMessagesData {
  // Get only voice messages
  const voiceMessages = messages.filter(msg => msg.media_type === 'voice_message');
  
  if (voiceMessages.length === 0) {
    return {
      userStats: [],
      longestMessageStats: { user: '', longestMessage: 0 },
      totalCount: 0,
    };
  }

  // Calculate statistics for each user
  const userStats = voiceMessages.reduce((acc, msg) => {
    if (!msg.from) return acc;
    
    const existingStat = acc.find(stat => stat.user === msg.from);
    const duration = msg.duration_seconds ?? 0;
    
    if (existingStat) {
      existingStat.count++;
      existingStat.longestMessage = Math.max(existingStat.longestMessage, duration);
    } else {
      acc.push({
        user: msg.from,
        count: 1,
        longestMessage: duration,
        userId: msg.from_id ?? '',
      });
    }
    
    return acc;
  }, [] as UserVoiceStat[]);

  // Sort by count in descending order
  userStats.sort((a, b) => b.count - a.count);

  // Find the longest message overall
  const longestMessageStats = userStats.reduce((max, curr) => 
    curr.longestMessage > max.longestMessage ? curr : max
  , userStats[0] ?? { user: '', longestMessage: 0 });

  return {
    userStats,
    longestMessageStats,
    totalCount: voiceMessages.length,
  };
}

export interface UserVideoStat {
  user: string;
  count: number;
  longestMessage: number;
  userId: string;
}

export interface VideoMessagesData {
  userStats: UserVideoStat[];
  longestMessageStats: {
    user: string;
    longestMessage: number;
  };
  totalCount: number;
}

export function processVideoMessagesData(messages: Message[]): VideoMessagesData {
  // Get only video messages
  const videoMessages = messages.filter(msg => msg.media_type === 'video_message');
  
  if (videoMessages.length === 0) {
    return {
      userStats: [],
      longestMessageStats: { user: '', longestMessage: 0 },
      totalCount: 0,
    };
  }

  // Calculate statistics for each user
  const userStats = videoMessages.reduce((acc, msg) => {
    if (!msg.from) return acc;
    
    const existingStat = acc.find(stat => stat.user === msg.from);
    const duration = msg.duration_seconds ?? 0;
    
    if (existingStat) {
      existingStat.count++;
      existingStat.longestMessage = Math.max(existingStat.longestMessage, duration);
    } else {
      acc.push({
        user: msg.from,
        count: 1,
        longestMessage: duration,
        userId: msg.from_id ?? '',
      });
    }
    
    return acc;
  }, [] as UserVideoStat[]);

  // Sort by count in descending order
  userStats.sort((a, b) => b.count - a.count);

  // Find the longest message overall
  const longestMessageStats = userStats.reduce((max, curr) => 
    curr.longestMessage > max.longestMessage ? curr : max
  , userStats[0] ?? { user: '', longestMessage: 0 });

  return {
    userStats,
    longestMessageStats,
    totalCount: videoMessages.length,
  };
}

// Technical words to filter out
const EXCLUDED_WORDS = new Set([
  'object',
  'null',
  'undefined',
  'true',
  'false',
  'function',
  'return',
  'const',
  'let',
  'var'
]);

export interface WordData {
  text: string;
  value: number;
}

export interface WordCloudData {
  wordData: WordData[];
}

export function processWordCloudData(messages: Message[]): WordCloudData {
  if (messages.length === 0) {
    return { wordData: [] };
  }

  // Combine all message texts
  const text = messages
    .map(msg => {
      // If the message text is an array (sometimes happens with formatted messages),
      // join it into a string
      if (Array.isArray(msg.text)) {
        return msg.text.join(' ');
      }
      return msg.text;
    })
    .join(' ')
    .toLowerCase();

  // Split into words and remove punctuation
  const words = text.split(/\s+/)
    .map(word => word.replace(/[.,!?(){}[\]<>:;'"]/g, ''))
    .filter(word => word.length > 3 && !EXCLUDED_WORDS.has(word)); // Filter out short words and excluded words

  // Count word frequencies
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] ?? 0) + 1;
  });

  // Convert to format required by react-d3-cloud
  const wordData = Object.entries(wordCount)
    .map(([text, value]) => ({ text, value }))
    .filter(item => item.value > 5) // Only show words that appear more than 5 times
    .sort((a, b) => b.value - a.value)
    .slice(0, 100); // Limit to top 100 words

  return { wordData };
}

export interface ForwardSource {
  source: string;
  count: number;
}

export interface ForwardStats {
  user: string;
  userId: string;
  sources: ForwardSource[];
}

export interface ForwardedMessagesData {
  userStats: ForwardStats[];
  totalCount: number;
}

export function processForwardedMessagesData(messages: Message[]): ForwardedMessagesData {
  // Get only forwarded messages
  const forwardedMessages = messages.filter(msg => msg.forwarded_from !== undefined);
  
  if (forwardedMessages.length === 0) {
    return {
      userStats: [],
      totalCount: 0,
    };
  }

  // Get unique users who forwarded messages
  const users = Array.from(new Set(forwardedMessages.map(msg => msg.from)));
  
  // Calculate statistics for each user
  const userStats: ForwardStats[] = users.map(user => {
    const userForwardedMessages = forwardedMessages.filter(msg => msg.from === user);
    
    // Count messages by source for this user
    const sourceCount: Record<string, number> = {};
    userForwardedMessages.forEach(msg => {
      if (msg.forwarded_from) {
        sourceCount[msg.forwarded_from] = (sourceCount[msg.forwarded_from] ?? 0) + 1;
      }
    });
    
    // Convert to array and sort by count
    const sources = Object.entries(sourceCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Keep only top 3 sources
    
    return {
      user: user ?? '',
      userId: userForwardedMessages[0]?.from_id ?? '',
      sources,
    };
  });

  // Sort users by total number of forwards
  userStats.sort((a, b) => {
    const totalA = a.sources.reduce((sum, src) => sum + src.count, 0);
    const totalB = b.sources.reduce((sum, src) => sum + src.count, 0);
    return totalB - totalA;
  });

  return {
    userStats,
    totalCount: forwardedMessages.length,
  };
}

export interface SettingsData {
  users: string[];
  userIdMap: Record<string, string>;
  years: number[];
}

export function processSettingsData(messages: Message[]): SettingsData {
  // Get unique users
  const users = Array.from(
    new Set(
      messages
        .map((msg) => msg.from)
        .filter((from): from is string => typeof from === 'string')
    )
  );

  // Create user ID map for colors
  const userIdMap: Record<string, string> = Object.fromEntries(
    messages
      .filter((msg): msg is Message & { from: string; from_id: string } => 
        typeof msg.from === 'string' && typeof msg.from_id === 'string'
      )
      .map((msg) => [msg.from, msg.from_id])
  );

  // Get available years
  const years = messages.length > 0
    ? Array.from(new Set(messages.map(msg => new Date(msg.date).getFullYear())))
        .sort((a, b) => b - a) // Sort years in descending order
    : [];

  return {
    users,
    userIdMap,
    years,
  };
}

export interface ProcessedChatData {
  messages: ProcessedMessagesData;
  timeOfDay: TimeOfDayData;
  firstMessages: FirstMessagesData;
  reactions: ReactionsData;
  voiceMessages: VoiceMessagesData;
  videoMessages: VideoMessagesData;
  wordCloud: WordCloudData;
  forwardedMessages: ForwardedMessagesData;
  settings: SettingsData;
}

interface BaseData {
  users: string[];
  userIdMap: Record<string, string>;
}

function calculateBaseData(messages: Message[]): BaseData {
  // Get unique users
  const users = Array.from(
    new Set(
      messages
        .map((msg) => msg.from)
        .filter((from): from is string => typeof from === 'string')
    )
  );

  // Create user ID map for colors
  const userIdMap: Record<string, string> = Object.fromEntries(
    messages
      .filter((msg): msg is Message & { from: string; from_id: string } => 
        typeof msg.from === 'string' && typeof msg.from_id === 'string'
      )
      .map((msg) => [msg.from, msg.from_id])
  );

  return { users, userIdMap };
}

export function processChatData(messages: Message[], allMessages: Message[]): ProcessedChatData {
  // Calculate base data once
  const baseData = calculateBaseData(allMessages);

  return {
    messages: processMessagesData(messages, baseData),
    timeOfDay: processTimeOfDayData(messages, baseData),
    firstMessages: processFirstMessagesData(messages, baseData),
    reactions: processReactionsData(messages),
    voiceMessages: processVoiceMessagesData(messages),
    videoMessages: processVideoMessagesData(messages),
    wordCloud: processWordCloudData(messages),
    forwardedMessages: processForwardedMessagesData(messages),
    settings: {
      ...baseData,
      years: allMessages.length > 0
        ? Array.from(new Set(allMessages.map(msg => new Date(msg.date).getFullYear())))
            .sort((a, b) => b - a)
        : []
    },
  };
}