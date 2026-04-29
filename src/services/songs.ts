import { supabase } from "./supabase";
import type { Song, ListSong } from "../shared/types";

export async function getSongs(): Promise<ListSong[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("title");
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export async function getSongsByList(listId: number): Promise<ListSong[]> {
  const { data, error } = await supabase
    .from("list_songs")
    .select("position, color, notes, songs(*)")
    .eq("list_id", listId)
    .order("position");
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map((row: any) => ({
    ...row.songs,
    position: row.position,
    color: row.color,
    notes: row.notes,
  }));
}
export async function getSongById(id: number): Promise<Song | null> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}
