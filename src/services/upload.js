import { supabase } from "./supabase";

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(bucket, file) {
  if (!bucket) throw new Error("Storage bucket is required");
  if (!file) throw new Error("No file provided for upload");

  const safeName = file.name.replace(/\s+/g, "_");
  const filePath = `${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Supabase upload failed:", {
      bucket,
      filePath,
      error,
    });
    throw error;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
