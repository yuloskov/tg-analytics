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
import { PrivacyNotice } from "~/components/Report/Blocks/PrivacyNotice";

export default function Home() {
  const router = useRouter();
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
    const encodedData = getSharedDataFromUrl();
    if (encodedData) {
      const decodedData = decodeSharedData(encodedData);
      if (decodedData) {
        setProcessedDataByYear(decodedData.processedData);
        setIsSharedData(true);
        // Clear existing colors and set the shared colors
        clearUserColors();
        Object.entries(decodedData.userColors).forEach(([userId, color]) => {
          setUserColor(userId, color);
        });
      }
    }
  }, []);

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
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, tab },
    }, undefined, { shallow: true });
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {activeTab === "example" && (
        <Report
          processedDataByYear={exampleData as ProcessedDataByYear}
          isSharedData={false}
          isLoading={false}
          selectedYear={selectedYear}
          processedData={
            (exampleData[selectedYear as keyof typeof exampleData] ??
              defaultData) as ProcessedChatData
          }
          onUploadClick={() => {
            clearSharedDataFromUrl();
            handleTabChange("upload");
          }}
          onHowToClick={() => handleTabChange("how-to")}
          onYearChange={setSelectedYear}
        />
      )}

      {activeTab === "how-to" && <HowToTab />}

      {activeTab === "upload" && (
        <div className="mb-8">
          <PrivacyNotice />

          <FileUpload
            onChatDataLoad={(data) => {
              clearSharedDataFromUrl();
              setChatData(data);
              handleTabChange("main");
            }}
            onHowToClick={() => handleTabChange("how-to")}
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
          onHowToClick={() => handleTabChange("how-to")}
          onYearChange={setSelectedYear}
        />
      )}
    </Layout>
  );
}
