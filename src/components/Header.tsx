import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { ExampleTab } from './ExampleTab'
import { HowToTab } from './HowToTab'

interface Tab {
  id: string
  label: string
}

const tabs: Tab[] = [
  { id: 'main', label: 'Анализ' },
  { id: 'example', label: 'Пример' },
  { id: 'how-to', label: 'Как скачать переписку' },
]

interface HeaderProps {
  onTabChange: (tabId: string) => void
}

export function Header({ onTabChange }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('main')

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange(tabId)
  }

  return (
    <div className="relative mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-lg -z-10" />
      
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            TG Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Анализируйте свои чаты в Telegram
          </p>
        </div>

        <a
          href="https://github.com/yuloskov/tg-analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Github className="w-6 h-6" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>

      <div className="px-4 pb-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative rounded-lg px-3 py-1.5 text-sm font-medium outline-2 outline-sky-400 transition
                ${
                  activeTab === tab.id
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }
              `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 