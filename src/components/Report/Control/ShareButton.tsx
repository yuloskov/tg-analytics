import { useState } from "react";
import { type ProcessedDataByYear } from "~/utils/dataProcessing";
import { encodeDataForSharing, generateShareableUrl } from "~/utils/sharing";
import { useUserColors } from "~/store/userColors";
import { supabase } from "~/lib/supabase";

interface ShareButtonProps {
  data: ProcessedDataByYear;
}

interface SharedReportRecord {
  id: string;
  encrypted_data: string;
  created_at: string;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userColors = useUserColors((state) => state.userColors);

  const handleShare = async () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      // Encrypt the data and get both the encrypted data and key
      const { data: encryptedData, key } = await encodeDataForSharing(data, userColors);

      // Store the encrypted data in Supabase and get the record ID
      const { data: record, error } = await supabase
        .from("shared_reports")
        .insert([
          {
            encrypted_data: encryptedData,
            created_at: new Date().toISOString(),
          },
        ])
        .select('id')
        .single() as { data: SharedReportRecord | null; error: Error | null };

      if (error) {
        console.error("Error storing share data:", error);
        throw error;
      }

      if (!record) {
        throw new Error("Failed to create shared report record");
      }

      // Generate the shareable URL with record ID and key
      const shareableUrl = await generateShareableUrl(record.id, key);

      await navigator.clipboard.writeText(shareableUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to share:", error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const buttonBaseStyle =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5";

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          disabled={isLoading}
          className={`${buttonBaseStyle} ${
            isCopied
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          }`}
        >
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isCopied
                    ? "M5 13l4 4L19 7"
                    : "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                }
              />
            </svg>
          )}
          {isLoading
            ? "Сохранение..."
            : isCopied
              ? "Скопировано!"
              : "Поделиться"}
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Информация о безопасности данных
              </h3>
            </div>
            <p className="mb-8 text-center leading-relaxed text-gray-600">
              Ваши данные надёжно защищены с помощью сквозного шифрования. 
              Только получатели ссылки смогут расшифровать и просмотреть отчёт.
              <br />
              <br />
              В базе данных сохраняются только зашифрованные агрегированные данные 
              (графики и статистика). Оригинальные сообщения никогда не сохраняются 
              и не передаются.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-lg px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`rounded-lg px-6 py-2.5 font-medium shadow-sm transition-colors hover:shadow ${
                  isLoading
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Сохранение..." : "Понятно, скопировать ссылку"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
