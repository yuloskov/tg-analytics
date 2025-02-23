import { useState, useEffect } from "react";
import { type ChatData } from "~/types/chat";
import { FileUpload } from "~/components/FileUpload";
import { HowToTab } from "~/components/HowToTab";
import { Report } from "~/components/Report";
import { Layout } from "~/components/Layout";
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
import { PrivacyNotice } from "~/components/PrivacyNotice";

export default function Home() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("main");
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

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab === "upload") {
          clearSharedDataFromUrl();
        }
        setActiveTab(tab);
      }}
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
            setActiveTab("upload");
          }}
          onHowToClick={() => setActiveTab("how-to")}
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
              setActiveTab("main");
            }}
            onHowToClick={() => setActiveTab("how-to")}
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
            setActiveTab("upload");
          }}
          onHowToClick={() => setActiveTab("how-to")}
          onYearChange={setSelectedYear}
        />
      )}
    </Layout>
  );
}
