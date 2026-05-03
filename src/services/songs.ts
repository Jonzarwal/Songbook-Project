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

export async function getOrphanSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*, list_songs(id)")
    .order("title");
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).filter((s: any) => s.list_songs.length === 0);
}

export async function addSongToList(
  listId: number,
  songId: number,
  position: number,
  color?: string,
  notes?: string,
): Promise<void> {
  const { error } = await supabase
    .from("list_songs")
    .insert({ list_id: listId, song_id: songId, position, color, notes });
  if (error) console.error(error);
}

export async function removeSongFromList(
  listId: number,
  songId: number,
): Promise<void> {
  const { error } = await supabase
    .from("list_songs")
    .delete()
    .eq("list_id", listId)
    .eq("song_id", songId);
  if (error) console.error(error);
}
export async function updatePositions(
  listId: number,
  songs: ListSong[],
): Promise<void> {
  const rows = songs.map((s, i) => ({
    list_id: listId,
    song_id: s.id,
    position: i + 1,
  }));
  console.log("updatePositions", rows); // ← ajoute ça
  const { error, data } = await supabase
    .from("list_songs")
    .upsert(rows, { onConflict: "list_id,song_id" });
  console.log("result", { error, data }); // ← et ça
  if (error) console.error(error);
}
