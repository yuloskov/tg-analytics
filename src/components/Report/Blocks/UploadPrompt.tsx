import { HelpButton } from "../../HelpButton";

interface UploadPromptProps {
  onUploadClick: () => void;
  onHowToClick: () => void;
}

export function UploadPrompt({
  onUploadClick,
  onHowToClick,
}: UploadPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <HelpButton onClick={onHowToClick} />
      <button
        onClick={onUploadClick}
        className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-600"
      >
        Новый отчет
      </button>
    </div>
  );
}
