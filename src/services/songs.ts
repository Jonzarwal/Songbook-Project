import { supabase } from "./supabase";
import type { Song } from "../types/song";

export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase.from("songs").select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error("Error fetching songs:", error);
    return [];
  }

  return data ?? [];
}
