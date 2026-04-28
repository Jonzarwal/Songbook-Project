import { useEffect, useState } from "react";

import type { Song } from "./types/song";
import type { List } from "./types/list";

import SongList from "./components/SongList";

import { getSongs, getSongsByList } from "./services/songs";
import { getLists } from "./services/lists";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<string>("all");

  useEffect(() => {
    async function loadLists() {
      const data = await getLists();
      setLists(data);
    }

    loadLists();
  }, []);

  useEffect(() => {
    async function loadSongs() {
      if (selectedList === "all") {
        const data = await getSongs();
        setSongs(data);
      } else {
        const data = await getSongsByList(Number(selectedList));
        setSongs(data);
      }
    }

    loadSongs();
  }, [selectedList]);

  return (
    <div>
      <h1>🎸 Songbook</h1>

      {/* Dropdown */}
      <select
        value={selectedList}
        onChange={(e) => setSelectedList(e.target.value)}
      >
        <option value="all">Toutes les chansons</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>

      <SongList songs={songs} />
    </div>
  );
}

export default App;
