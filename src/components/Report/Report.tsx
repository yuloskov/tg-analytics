import { type ProcessedDataByYear, type ProcessedChatData } from "~/utils/dataProcessing";
import { UploadPrompt } from "./Blocks/UploadPrompt";
import { Settings } from "./Control/Settings";
import { ShareButton } from "./Control/ShareButton";
import { YearSelector } from "./Control/YearSelector";
import { MessagesChart } from "./Blocks/MessagesChart";
import { TimeOfDayChart } from "./Blocks/TimeOfDayChart";
import { FirstMessages } from "./Blocks/FirstMessages/FirstMessages";
import { PopularReactions } from "./Blocks/PopularReactions";
import { VoiceMessages } from "./Blocks/VoiceMessages";
import { VideoMessages } from "./Blocks/VideoMessages";
import { WordCloudChart } from "./Blocks/WordCloud";
import { ForwardedMessages } from "./Blocks/ForwardedMessages";
import { TotalMessages } from "./Blocks/TotalMessages";
import Masonry from "react-masonry-css";
import { PrivacyNotice } from "./Blocks/PrivacyNotice"
import { Loader } from "../ui/Loader"

interface ReportProps {
  processedDataByYear: ProcessedDataByYear | null;
  isSharedData: boolean;
  isLoading: boolean;
  selectedYear: string;
  processedData: ProcessedChatData;
  onUploadClick: () => void;
  onHowToClick: () => void;
  onYearChange: (year: string) => void;
}

const breakpointColumns = {
  default: 2,
  1024: 1,
  768: 1,
};

export function Report({
  processedDataByYear,
  isSharedData,
  isLoading,
  selectedYear,
  processedData,
  onUploadClick,
  onHowToClick,
  onYearChange,
}: ReportProps) {
  return (
    <>
      <PrivacyNotice />

      {!processedDataByYear && !isSharedData && !isLoading && (
        <UploadPrompt
          onUploadClick={onUploadClick}
          onHowToClick={onHowToClick}
        />
      )}

      {isLoading && (
        <div className="my-12">
          <Loader size="large" />
        </div>
      )}

      {!isLoading && processedDataByYear && (
        <>
          <div className="mb-8 flex sm:justify-between justify-end items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="w-full sm:w-48">
              <YearSelector
                years={processedData.settings.years}
                selectedYear={selectedYear}
                onYearChange={onYearChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Settings
                {...processedData.settings}
                selectedYear={selectedYear}
                onYearChange={onYearChange}
              />
              <ShareButton data={processedDataByYear} />
            </div>
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
              <TotalMessages {...processedData.messages} />
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
  );
} 