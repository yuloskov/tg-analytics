import { useState } from "react";
import { type ProcessedDataByYear } from "~/utils/dataProcessing";
import { encodeDataForSharing, generateShareableUrl } from "~/utils/sharing";
import { useUserColors } from "~/store/userColors";
import { supabase } from "~/lib/supabase";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

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

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          disabled={isLoading}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/20 font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 bg-gradient-to-r from-purple-600/10 to-blue-500/10 hover:from-purple-600/20 hover:to-blue-500/20 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Share2 className="h-4 w-4 text-slate-700 dark:text-slate-200" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {isLoading
              ? t('share.saving')
              : isCopied
                ? t('share.copied')
                : t('share.share')}
          </span>
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl">
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
                {t('share.securityInfo')}
              </h3>
            </div>
            <div className="mb-8 text-center leading-relaxed text-gray-600 space-y-4">
              <p>{t('share.securityInfoDescription1')}</p>
              <p>{t('share.securityInfoDescription2')}</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-lg px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {t('share.cancel')}
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
                {isLoading ? t('share.saving') : t('share.understand')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
