import { type ProcessedDataByYear, type ProcessedChatData } from "~/utils/dataProcessing";
import { PrivacyNotice } from "./PrivacyNotice";
import { UploadPrompt } from "./UploadPrompt";
import { Loader } from "./Loader";
import { Settings } from "./Settings";
import { ShareButton } from "./ShareButton";
import { MessagesChart } from "./MessagesChart";
import { TimeOfDayChart } from "./TimeOfDayChart";
import { FirstMessages } from "./FirstMessages/FirstMessages";
import { PopularReactions } from "./PopularReactions";
import { VoiceMessages } from "./VoiceMessages";
import { VideoMessages } from "./VideoMessages";
import { WordCloudChart } from "./WordCloud";
import { ForwardedMessages } from "./ForwardedMessages";
import Masonry from "react-masonry-css";

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
  1024: 2,
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
  console.log(processedDataByYear);
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
          <div className="mb-8 flex justify-end gap-2">
            <Settings
              {...processedData.settings}
              selectedYear={selectedYear}
              onYearChange={onYearChange}
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
  );
} 