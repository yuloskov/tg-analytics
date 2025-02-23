import { type ProcessedDataByYear } from "./dataProcessing";
import { generateEncryptionKey, exportKey, importKey, encryptData, decryptData } from "./encryption";
import { supabase } from "~/lib/supabase";

interface SharedData {
  processedData: ProcessedDataByYear;
  userColors: Record<string, string>;
}

interface EncryptedShareData {
  data: string;  // encrypted data
  key: string;   // encryption key
}

interface SharedReportRecord {
  encrypted_data: string;
}

export async function encodeDataForSharing(
  data: ProcessedDataByYear,
  userColors: Record<string, string>
): Promise<EncryptedShareData> {
  try {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify({ processedData: data, userColors });
    
    // Generate a new encryption key
    const key = await generateEncryptionKey();
    
    // Encrypt the data
    const encryptedData = await encryptData(jsonString, key);
    
    // Export the key to base64
    const keyBase64 = await exportKey(key);
    
    return {
      data: encryptedData,
      key: keyBase64
    };
  } catch (error) {
    console.error("Failed to encode data for sharing:", error);
    throw error;
  }
}

export async function decodeSharedData(recordId: string, keyBase64: string): Promise<SharedData | null> {
  try {
    // Fetch the encrypted data from Supabase
    const { data: record, error } = await supabase
      .from("shared_reports")
      .select("encrypted_data")
      .eq("id", recordId)
      .single() as { data: SharedReportRecord | null; error: Error | null };

    if (error || !record) {
      console.error("Failed to fetch shared data:", error);
      return null;
    }

    // Import the key
    const key = await importKey(keyBase64);
    
    // Decrypt the data
    const jsonString = await decryptData(record.encrypted_data, key);
    
    // Parse the JSON
    const data = JSON.parse(jsonString) as SharedData;
    return data;
  } catch (error) {
    console.error("Failed to decode shared data:", error);
    return null;
  }
}

export function getSharedDataFromUrl(): { recordId: string; key: string } | null {
  if (typeof window === "undefined") return null;
  
  // Get the hash part of the URL (everything after #)
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  try {
    const [recordId, key] = hash.split('.');
    if (!recordId || !key) return null;
    
    return { recordId, key };
  } catch (error) {
    console.error("Failed to parse shared data from URL:", error);
    return null;
  }
}

export function setSharedDataInUrl(recordId: string, key: string): void {
  if (typeof window === "undefined") return;
  
  // Update the URL hash without causing a page reload
  // Format: #recordId.key
  window.history.pushState(null, "", `#${recordId}.${key}`);
}

export async function generateShareableUrl(recordId: string, key: string): Promise<string> {
  const url = new URL(window.location.href);
  url.hash = `${recordId}.${key}`;
  return url.toString();
}

export function clearSharedDataFromUrl(): void {
  if (typeof window === "undefined") return;
  
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.location.hash = "";
} 