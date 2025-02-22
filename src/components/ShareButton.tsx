import { useState } from "react";
import { type ProcessedDataByYear } from "~/utils/dataProcessing";
import { generateShareableUrl } from "~/utils/sharing";
import { useUserColors } from "~/store/userColors";

interface ShareButtonProps {
  data: ProcessedDataByYear;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const userColors = useUserColors((state) => state.userColors);

  const handleShare = async () => {
    try {
      const shareableUrl = generateShareableUrl(data, userColors);
      await navigator.clipboard.writeText(shareableUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const buttonBaseStyle = "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5";

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className={`${buttonBaseStyle} ${
          isCopied 
            ? "bg-gradient-to-r from-green-500 to-green-600" 
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
            isCopied 
              ? "M5 13l4 4L19 7"
              : "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          } />
        </svg>
        {isCopied ? "Copied!" : "Поделиться"}
      </button>
    </div>
  );
} 