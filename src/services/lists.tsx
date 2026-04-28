import { supabase } from "./supabase";
import type { List } from "../types/list";

export async function getLists(): Promise<List[]> {
  const { data, error } = await supabase.from("lists").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
