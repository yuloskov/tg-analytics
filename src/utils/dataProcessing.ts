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

export interface FirstMessagesData {
  monthlyInitiations: MonthlyMessageData[];
  users: string[];
  userIdMap: Record<string, string>;
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

export interface SettingsData {
  users: string[];
  userIdMap: Record<string, string>;
  years: number[];
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

function processMonthlyMessage(msg: Message, monthlyData: MonthlyMessageData[]) {
  const date = new Date(msg.date);
  const monthIndex = date.getMonth();
  
  if (msg.from && monthlyData[monthIndex]) {
    const monthData = monthlyData[monthIndex];
    monthData[msg.from] = ((monthData[msg.from] as number) || 0) + 1;
  }
}

function processTimeOfDay(msg: Message, hourCounts: HourCount[]) {
  const hour = new Date(msg.date).getHours();
  
  if (msg.from && hourCounts[hour]) {
    const hourData = hourCounts[hour];
    hourData[msg.from] = ((hourData[msg.from] as number) || 0) + 1;
  }
}

function processConversationInitiation(
  msg: Message, 
  monthlyInitiations: MonthlyMessageData[], 
  lastMessageTime: number,
  CONVERSATION_GAP: number
): number {
  const date = new Date(msg.date);
  const monthIndex = date.getMonth();
  const currentTime = date.getTime();

  if (currentTime - lastMessageTime > CONVERSATION_GAP && msg.from && monthlyInitiations[monthIndex]) {
    const monthData = monthlyInitiations[monthIndex];
    monthData[msg.from] = ((monthData[msg.from] as number) || 0) + 1;
  }
  
  return currentTime;
}

function processReactions(msg: Message, reactionStats: Record<string, ReactionStats>) {
  if (!msg.reactions) return;
  
  msg.reactions.forEach(reaction => {
    const emoji = reaction.emoji;
    if (!reactionStats[emoji]) {
      reactionStats[emoji] = {
        totalCount: 0,
        userCounts: {}
      };
    }
    reactionStats[emoji].totalCount += reaction.count;
    if (reaction.recent) {
      reaction.recent.forEach(user => {
        if (!user.from) return;
        const stats = reactionStats[emoji];
        if (stats) {
          stats.userCounts[user.from] = (stats.userCounts[user.from] ?? 0) + 1;
        }
      });
    }
  });
}

function processVoiceMessage(
  msg: Message, 
  voiceStats: Record<string, UserVoiceStat>
): number {
  if (msg.media_type !== 'voice_message' || !msg.from) return 0;
  
  const duration = msg.duration_seconds ?? 0;
  if (!voiceStats[msg.from]) {
    voiceStats[msg.from] = {
      user: msg.from,
      count: 0,
      longestMessage: 0,
      userId: msg.from_id ?? ''
    };
  }
  const stats = voiceStats[msg.from];
  if (stats) {
    stats.count++;
    stats.longestMessage = Math.max(stats.longestMessage, duration);
  }
  return 1;
}

function processVideoMessage(
  msg: Message, 
  videoStats: Record<string, UserVideoStat>
): number {
  if (msg.media_type !== 'video_message' || !msg.from) return 0;
  
  const duration = msg.duration_seconds ?? 0;
  if (!videoStats[msg.from]) {
    videoStats[msg.from] = {
      user: msg.from,
      count: 0,
      longestMessage: 0,
      userId: msg.from_id ?? ''
    };
  }
  const stats = videoStats[msg.from];
  if (stats) {
    stats.count++;
    stats.longestMessage = Math.max(stats.longestMessage, duration);
  }
  return 1;
}

function processWordCloud(msg: Message, wordCount: Record<string, number>) {
  const text = Array.isArray(msg.text) ? msg.text.join(' ') : msg.text;
  if (!text) return;
  
  text.toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[.,!?(){}[\]<>:;'"]/g, ''))
    .filter(word => word.length > 3 && !EXCLUDED_WORDS.has(word))
    .forEach(word => {
      wordCount[word] = (wordCount[word] ?? 0) + 1;
    });
}

function processForwardedMessage(
  msg: Message, 
  forwardedStats: Record<string, { userId: string; sources: Record<string, number> }>
): number {
  if (!msg.forwarded_from || !msg.from) return 0;
  
  if (!forwardedStats[msg.from]) {
    forwardedStats[msg.from] = {
      userId: msg.from_id ?? '',
      sources: {}
    };
  }
  const stats = forwardedStats[msg.from];
  if (stats) {
    stats.sources[msg.forwarded_from] = (stats.sources[msg.forwarded_from] ?? 0) + 1;
  }
  return 1;
}

export function processChatData(messages: Message[], allMessages: Message[]): ProcessedChatData {
  // Calculate base data once
  const baseData = calculateBaseData(allMessages);
  const CONVERSATION_GAP = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

  // Initialize all data structures
  const monthlyData = MONTHS.map((month) => ({
    month,
    ...Object.fromEntries(baseData.users.map((user) => [user, 0])),
  })) as MonthlyMessageData[];

  const hourCounts: HourCount[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, '0')}:00`,
    ...Object.fromEntries(baseData.users.map(user => [user, 0]))
  }));

  const monthlyInitiations = MONTHS.map(month => ({
    month,
    ...Object.fromEntries(baseData.users.map(user => [user, 0])),
  })) as MonthlyMessageData[];

  const reactionStats: Record<string, ReactionStats> = {};
  const voiceStats: Record<string, UserVoiceStat> = {};
  const videoStats: Record<string, UserVideoStat> = {};
  const wordCount: Record<string, number> = {};
  const forwardedStats: Record<string, { userId: string; sources: Record<string, number> }> = {};
  
  let lastMessageTime = 0;
  let totalVoiceMessages = 0;
  let totalVideoMessages = 0;
  let totalForwardedMessages = 0;

  // Single pass through messages
  messages.forEach((msg) => {
    processMonthlyMessage(msg, monthlyData);
    processTimeOfDay(msg, hourCounts);
    lastMessageTime = processConversationInitiation(msg, monthlyInitiations, lastMessageTime, CONVERSATION_GAP);
    processReactions(msg, reactionStats);
    totalVoiceMessages += processVoiceMessage(msg, voiceStats);
    totalVideoMessages += processVideoMessage(msg, videoStats);
    processWordCloud(msg, wordCount);
    totalForwardedMessages += processForwardedMessage(msg, forwardedStats);
  });

  // Post-process collected data

  // Process reactions data
  const topReactions = Object.entries(reactionStats)
    .sort(([, a], [, b]) => b.totalCount - a.totalCount)
    .slice(0, 5)
    .map(([emoji, stats]) => ({ emoji, stats }));

  const userFavorites = new Map<string, { emoji: string; count: number }>();
  Object.entries(reactionStats).forEach(([emoji, stats]) => {
    Object.entries(stats.userCounts).forEach(([user, count]) => {
      const current = userFavorites.get(user);
      if (!current || count > current.count) {
        userFavorites.set(user, { emoji, count });
      }
    });
  });

  // Process voice messages data
  const voiceUserStats = Object.values(voiceStats).sort((a, b) => b.count - a.count);
  const voiceLongestMessage = voiceUserStats.length > 0 
    ? voiceUserStats.reduce((max, curr) => curr.longestMessage > max.longestMessage ? curr : max)
    : { user: '', longestMessage: 0 };

  // Process video messages data
  const videoUserStats = Object.values(videoStats).sort((a, b) => b.count - a.count);
  const videoLongestMessage = videoUserStats.length > 0
    ? videoUserStats.reduce((max, curr) => curr.longestMessage > max.longestMessage ? curr : max)
    : { user: '', longestMessage: 0 };

  // Process word cloud data
  const wordData = Object.entries(wordCount)
    .map(([text, value]) => ({ text, value }))
    .filter(item => item.value > 5)
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);

  // Process forwarded messages data
  const forwardedUserStats = Object.entries(forwardedStats).map(([user, data]) => ({
    user,
    userId: data.userId,
    sources: Object.entries(data.sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  })).sort((a, b) => {
    const totalA = a.sources.reduce((sum, src) => sum + src.count, 0);
    const totalB = b.sources.reduce((sum, src) => sum + src.count, 0);
    return totalB - totalA;
  });

  return {
    messages: {
      monthlyData,
      users: baseData.users,
      userIdMap: baseData.userIdMap,
    },
    timeOfDay: {
      hourCounts,
      users: baseData.users,
      userIdMap: baseData.userIdMap,
    },
    firstMessages: {
      monthlyInitiations,
      users: baseData.users,
      userIdMap: baseData.userIdMap,
    },
    reactions: {
      topReactions,
      userFavorites: Array.from(userFavorites.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5)
        .map(([user, { emoji, count }]) => ({ user, emoji, count }))
    },
    voiceMessages: {
      userStats: voiceUserStats,
      longestMessageStats: voiceLongestMessage,
      totalCount: totalVoiceMessages,
    },
    videoMessages: {
      userStats: videoUserStats,
      longestMessageStats: videoLongestMessage,
      totalCount: totalVideoMessages,
    },
    wordCloud: {
      wordData,
    },
    forwardedMessages: {
      userStats: forwardedUserStats,
      totalCount: totalForwardedMessages,
    },
    settings: {
      ...baseData,
      years: allMessages.length > 0
        ? Array.from(new Set(allMessages.map(msg => new Date(msg.date).getFullYear())))
            .sort((a, b) => b - a)
        : []
    },
  };
}