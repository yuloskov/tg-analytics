import { type ProcessedDataByYear } from "./dataProcessing";

interface SharedData {
  processedData: ProcessedDataByYear;
  userColors: Record<string, string>;
}

export function encodeDataForSharing(
  data: ProcessedDataByYear,
  userColors: Record<string, string>
): string {
  try {
    // Convert the data to a compressed string
    const jsonString = JSON.stringify({ processedData: data, userColors });
    // First encode to base64
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    // Make base64 URL safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error("Failed to encode data for sharing:", error);
    return '';
  }
}

export function decodeSharedData(encodedData: string): SharedData | null {
  try {
    // Restore base64 characters
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    try {
      const jsonString = decodeURIComponent(escape(atob(base64)));
      const data = JSON.parse(jsonString) as SharedData;
      return data;
    } catch (error) {
      // If the modern approach fails, try the legacy approach
      const jsonString = decodeURIComponent(atob(base64));
      const data = JSON.parse(jsonString) as SharedData;
      return data;
    }
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

export function clearSharedDataFromUrl(): void {
  if (typeof window === "undefined") return;
  
  // Remove the hash using both modern and legacy methods for maximum compatibility
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.location.hash = "";
} 