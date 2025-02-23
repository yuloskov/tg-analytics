import { HelpButton } from "../../HelpButton";
import { useTranslation } from "next-i18next";

interface UploadPromptProps {
  onUploadClick: () => void;
  onHowToClick: () => void;
}

export function UploadPrompt({
  onUploadClick,
  onHowToClick,
}: UploadPromptProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <HelpButton onClick={onHowToClick} />
      <button
        onClick={onUploadClick}
        className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-600"
      >
        {t('header.newReport')}
      </button>
    </div>
  );
}
