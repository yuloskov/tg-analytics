import { type ProcessedDataByYear } from "./dataProcessing";

interface SharedData {
  processedData: ProcessedDataByYear;
  userColors: Record<string, string>;
}

export function encodeDataForSharing(
  data: ProcessedDataByYear,
  userColors: Record<string, string>
): string {
  // Convert the data to a compressed string
  const jsonString = JSON.stringify({ processedData: data, userColors });
  const compressedData = btoa(encodeURIComponent(jsonString));
  return compressedData;
}

export function decodeSharedData(encodedData: string): SharedData | null {
  try {
    // Decode the compressed string back to data
    const jsonString = decodeURIComponent(atob(encodedData));
    const data = JSON.parse(jsonString) as SharedData;
    return data;
  } catch (error) {
    console.error("Failed to decode shared data:", error);
    return null;
  }
}

export function getSharedDataFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  
  // Get the hash part of the URL (everything after #)
  const hash = window.location.hash.slice(1);
  return hash || null;
}

export function setSharedDataInUrl(encodedData: string): void {
  if (typeof window === "undefined") return;
  
  // Update the URL hash without causing a page reload
  window.history.pushState(null, "", `#${encodedData}`);
}

export function generateShareableUrl(
  data: ProcessedDataByYear,
  userColors: Record<string, string>
): string {
  const encodedData = encodeDataForSharing(data, userColors);
  const url = new URL(window.location.href);
  url.hash = encodedData;
  return url.toString();
} 