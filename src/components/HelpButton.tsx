import { HelpCircle } from "lucide-react";

interface HelpButtonProps {
  onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <div className="mb-6 flex items-center gap-1">
      <p className="text-base text-slate-600 dark:text-slate-400">
        Загрузите файл с чатом, чтобы начать анализ
      </p>
      <button
        onClick={onClick}
        className="inline-flex items-center text-slate-500 transition-colors hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
        title="Как скачать данные?"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
