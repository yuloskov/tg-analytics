import { useState } from "react";
import { type ProcessedDataByYear } from "~/utils/dataProcessing";
import { generateShareableUrl } from "~/utils/sharing";
import { useUserColors } from "~/store/userColors";

interface ShareButtonProps {
  data: ProcessedDataByYear;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userColors = useUserColors((state) => state.userColors);

  const handleShare = async () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const shareableUrl = generateShareableUrl(data, userColors);
      await navigator.clipboard.writeText(shareableUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
    setIsDialogOpen(false);
  };

  const buttonBaseStyle = "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5";

  return (
    <>
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
          {isCopied ? "Скопировано!" : "Поделиться"}
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Важная информация о конфиденциальности</h3>
            </div>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Когда вы делитесь отчетом, все данные сохраняются в URL-адресе и никогда не отправляются на сервер. 
              <br /><br />
              Получатели ссылки будут иметь доступ только к обобщённой статистике (графикам и диаграммам), но не к оригинальным сообщениям.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
              >
                Понятно, скопировать ссылку
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 