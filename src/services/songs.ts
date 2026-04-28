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

export async function getSongsByList(listId: number): Promise<Song[]> {
  const { data, error } = await supabase
    .from("list_songs")
    .select(
      `
      position,
      songs (*)
    `,
    )
    .eq("list_id", listId)
    .order("position", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  if (!data) return [];

  return data.map((item: any) => item.songs as Song);
}
