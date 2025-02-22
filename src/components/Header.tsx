import { motion } from "framer-motion";
import { Github, MessageCircle } from "lucide-react";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "main", label: "Отчет" },
  { id: "upload", label: "Новый отчет" },
  { id: "example", label: "Пример" },
  { id: "how-to", label: "Как скачать переписку" },
];

interface HeaderProps {
  onTabChange: (tabId: string) => void;
  activeTab: string;
}

export function Header({ onTabChange, activeTab }: HeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-purple-600/10 to-blue-500/10" />

      <div className="flex items-start justify-between p-4">
        <div>
          <h1 className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
            TG Chat Analyzer
          </h1>
          <div className="mt-2 inline-block">
            <span className="rounded-full border border-orange-200/20 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-3 py-1 text-sm text-orange-700 dark:text-orange-300">
              Анализируйте свои чаты в Telegram
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://t.me/yuloskov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-slate-200/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20"
          >
            <MessageCircle className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
              Поддержка
            </span>
          </a>

          <a
            href="https://github.com/yuloskov/tg-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-slate-200/20 bg-gradient-to-r from-purple-600/10 to-blue-500/10 px-4 py-2 transition-all duration-300 hover:from-purple-600/20 hover:to-blue-500/20"
          >
            <Github className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
              Star on GitHub
            </span>
          </a>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative rounded-lg px-3 py-1.5 text-sm font-medium outline-2 outline-sky-400 transition ${
                activeTab === tab.id
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              } `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
