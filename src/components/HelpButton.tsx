import { HelpCircle } from "lucide-react";
import { useTranslation } from "next-i18next";

interface HelpButtonProps {
  onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex items-center gap-1">
      <p className="text-base text-slate-600 dark:text-slate-400">
        {t('upload.description')}
      </p>
      <button
        onClick={onClick}
        className="inline-flex items-center text-slate-500 transition-colors hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
        title={t('upload.howTo')}
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
