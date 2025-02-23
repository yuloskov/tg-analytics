import { motion } from "framer-motion";
import { Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher";

interface Tab {
  id: string;
  label: string;
}

interface HeaderProps {
  onTabChange: (tabId: string) => void;
  activeTab: string;
}

export function Header({ onTabChange, activeTab }: HeaderProps) {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    { id: "main", label: t("header.report") },
    { id: "upload", label: t("header.newReport") },
    { id: "example", label: t("header.example") },
    { id: "howTo", label: t("header.howToDownload") },
  ];

  return (
    <div className="relative mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-purple-600/10 to-blue-500/10" />

      <div className="flex items-start justify-between p-4">
        <div>
          <Link href="/" className="block">
            <h1 className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
              {t("header.title")}
            </h1>
            <div className="mt-2 inline-block">
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {t("header.description")}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href="https://t.me/yuloskov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-slate-200/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20"
          >
            <MessageCircle className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
              {t("header.support")}
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
              {t("header.starOnGithub")}
            </span>
          </a>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex flex-col space-x-1 md:flex-row">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={{ query: { tab: tab.id } }}
              onClick={(e) => {
                e.preventDefault();
                onTabChange(tab.id);
              }}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
