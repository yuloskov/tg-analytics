import { useState, useEffect } from "react";
import { type ChatData } from "~/types/chat";
import { FileUpload } from "~/components/FileUpload";
import { MessagesChart } from "~/components/MessagesChart";
import { PrivacyNotice } from "~/components/PrivacyNotice";
import { FirstMessages } from "~/components/FirstMessages/FirstMessages";
import { VoiceMessages } from "~/components/VoiceMessages";
import { VideoMessages } from "~/components/VideoMessages";
import { Settings } from "~/components/Settings";
import { TimeOfDayChart } from "~/components/TimeOfDayChart";
import { WordCloudChart } from "~/components/WordCloud";
import { ForwardedMessages } from "~/components/ForwardedMessages";
import { PopularReactions } from "~/components/PopularReactions";
import { Header } from "~/components/Header";
import { ExampleTab } from "~/components/ExampleTab";
import { HowToTab } from "~/components/HowToTab";
import { Loader } from "~/components/Loader";
import { ShareButton } from "~/components/ShareButton";
import { UploadPrompt } from "~/components/UploadPrompt";
import {
  getSharedDataFromUrl,
  decodeSharedData,
  clearSharedDataFromUrl,
} from "~/utils/sharing";
import Masonry from "react-masonry-css";
import {
  processDataByYear,
  defaultData,
  type ProcessedDataByYear,
} from "~/utils/dataProcessing";
import { useUserColors } from "~/store/userColors";

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

  const breakpointColumns = {
    default: 2,
    1024: 2,
    768: 1,
  };

  return (
    <div className="container mx-auto p-4">
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "upload") {
            clearSharedDataFromUrl();
          }
          setActiveTab(tab);
        }}
      />

      {activeTab === "example" && <ExampleTab />}

      {activeTab === "how-to" && <HowToTab />}

      {activeTab === "upload" && (
        <div className="mb-8">
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
        <>
          <PrivacyNotice />

          {!processedDataByYear && !isSharedData && !isLoading && (
            <UploadPrompt
              onUploadClick={() => {
                clearSharedDataFromUrl();
                setActiveTab("upload");
              }}
              onHowToClick={() => setActiveTab("how-to")}
            />
          )}

          {isLoading && (
            <div className="my-12">
              <Loader size="large" />
            </div>
          )}

          {!isLoading && processedDataByYear && (
            <>
              <div className="mb-8 flex justify-end gap-2">
                <Settings
                  {...processedData.settings}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                />
                <ShareButton data={processedDataByYear} />
              </div>

              <Masonry
                breakpointCols={breakpointColumns}
                className="-ml-4 flex w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                <div className="masonry-grid-item">
                  <MessagesChart {...processedData.messages} />
                </div>
                <div className="masonry-grid-item">
                  <TimeOfDayChart {...processedData.timeOfDay} />
                </div>
                <div className="masonry-grid-item">
                  <FirstMessages {...processedData.firstMessages} />
                </div>
                <div className="masonry-grid-item">
                  <PopularReactions {...processedData.reactions} />
                </div>
                <div className="masonry-grid-item">
                  <VoiceMessages {...processedData.voiceMessages} />
                </div>
                <div className="masonry-grid-item">
                  <VideoMessages {...processedData.videoMessages} />
                </div>
                <div className="masonry-grid-item">
                  <WordCloudChart {...processedData.wordCloud} />
                </div>
                <div className="masonry-grid-item">
                  <ForwardedMessages {...processedData.forwardedMessages} />
                </div>
              </Masonry>
            </>
          )}
        </>
      )}
    </div>
  );
}
