import { create } from 'zustand'

interface UserColorsState {
  userColors: Record<string, string>
  setUserColor: (userId: string, color: string) => void
  getUserColor: (userId: string) => string
  clearUserColors: () => void
}

const defaultColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export const useUserColors = create<UserColorsState>((set, get) => ({
  userColors: {},
  setUserColor: (userId: string, color: string) =>
    set((state) => ({
      userColors: { ...state.userColors, [userId]: color },
    })),
  getUserColor: (userId: string) => {
    const state = get()
    if (state.userColors[userId]) {
      return state.userColors[userId]
    }
    // If no color is assigned, assign the next available color
    const colorIndex = Object.keys(state.userColors).length % defaultColors.length
    const newColor = defaultColors[colorIndex] ?? defaultColors[0]!
    state.setUserColor(userId, newColor)
    return newColor
  },
  clearUserColors: () => set({ userColors: {} }),
})) 