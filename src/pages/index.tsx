import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { type ChatData } from "~/types/chat";
import { FileUpload } from "~/components/FileUpload";
import { HowToTab } from "~/components/HowToTab";
import { Report } from "~/components/Report/Report";
import { Layout } from "~/components/Layout/Layout";
import {
  getSharedDataFromUrl,
  decodeSharedData,
  clearSharedDataFromUrl,
} from "~/utils/sharing";
import {
  processDataByYear,
  defaultData,
  type ProcessedDataByYear,
  type ProcessedChatData,
} from "~/utils/dataProcessing";
import { useUserColors } from "~/store/userColors";
import { exampleData } from "~/utils/exampleData";
import { exampleDataEn } from "~/utils/exampleDataEn";
import { PrivacyNotice } from "~/components/Report/Blocks/PrivacyNotice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { type GetStaticProps } from "next";
import { useTranslation } from "next-i18next";

export default function Home() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSharedData, setIsSharedData] = useState(false);
  const [processedDataByYear, setProcessedDataByYear] =
    useState<ProcessedDataByYear | null>(null);
  const setUserColor = useUserColors((state) => state.setUserColor);
  const clearUserColors = useUserColors((state) => state.clearUserColors);

  // Check for shared data in URL on mount
  useEffect(() => {
    async function loadSharedData() {
      const sharedData = getSharedDataFromUrl();
      if (!sharedData) return;

      setIsLoading(true);

      try {
        const { recordId, key } = sharedData;
        const decodedData = await decodeSharedData(recordId, key);

        if (decodedData) {
          setProcessedDataByYear(decodedData.processedData);
          setIsSharedData(true);
          // Clear existing colors and set the shared colors
          clearUserColors();
          Object.entries(decodedData.userColors).forEach(([userId, color]) => {
            setUserColor(userId, color);
          });
        } else {
          console.error(
            "Failed to decode shared data: Data not found or invalid",
          );
        }
      } catch (error) {
        console.error("Failed to decode shared data:", error);
      }

      setIsLoading(false);
    }

    void loadSharedData();
  }, [clearUserColors, setUserColor]);

  useEffect(() => {
    if (!chatData) return;
    setIsLoading(true);
    // Process data asynchronously to prevent UI blocking
    setTimeout(() => {
      const result = processDataByYear(chatData?.messages, defaultData);
      setProcessedDataByYear(result);
      setIsLoading(false);
    }, 0);
  }, [chatData]);

  // Get the current year's data
  const processedData = processedDataByYear?.[selectedYear] ?? defaultData;

  // Get current active tab, defaulting to "main"
  const activeTab = (router.query.tab as string) ?? "main";

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    if (tab === "upload") {
      clearSharedDataFromUrl();
    }
    void router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "example" && (
        <Report
          processedDataByYear={(i18n.language === "en" ? exampleDataEn : exampleData) as ProcessedDataByYear}
          isSharedData={false}
          isLoading={false}
          selectedYear={selectedYear}
          processedData={
            ((i18n.language === "en" ? exampleDataEn : exampleData)[selectedYear as keyof typeof exampleData] ??
              defaultData) as ProcessedChatData
          }
          onUploadClick={() => {
            clearSharedDataFromUrl();
            handleTabChange("upload");
          }}
          onHowToClick={() => handleTabChange("howTo")}
          onYearChange={setSelectedYear}
        />
      )}

      {activeTab === "howTo" && <HowToTab />}

      {activeTab === "upload" && (
        <div className="mb-8">
          <PrivacyNotice />

          <FileUpload
            onChatDataLoad={(data) => {
              clearSharedDataFromUrl();
              setChatData(data);
              handleTabChange("main");
            }}
            onHowToClick={() => handleTabChange("howTo")}
          />
        </div>
      )}

      {activeTab === "main" && (
        <Report
          processedDataByYear={processedDataByYear}
          isSharedData={isSharedData}
          isLoading={isLoading}
          selectedYear={selectedYear}
          processedData={processedData}
          onUploadClick={() => {
            clearSharedDataFromUrl();
            handleTabChange("upload");
          }}
          onHowToClick={() => handleTabChange("howTo")}
          onYearChange={setSelectedYear}
        />
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
