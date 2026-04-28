import { useEffect, useState } from "react";

import type { Song } from "./types/song";
import type { List } from "./types/list";

import ListGrid from "./components/ListGrid";
import SongList from "./components/SongList";
import SongDetail from "./components/SongDetail";

import { getSongs, getSongsByList } from "./services/songs";
import { getLists } from "./services/lists";

type View = "lists" | "songs" | "detail";

function App() {
  const [view, setView] = useState<View>("lists");
  const [songs, setSongs] = useState<Song[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger les listes au démarrage
  useEffect(() => {
    async function loadLists() {
      const data = await getLists();
      setLists(data);
    }
    loadLists();
  }, []);

  // Charger les songs quand on choisit une liste
  useEffect(() => {
    if (view !== "songs") return;
    async function loadSongs() {
      setLoading(true);
      if (selectedList === null) {
        const data = await getSongs();
        setSongs(data);
      } else {
        const data = await getSongsByList(selectedList.id);
        setSongs(data);
      }
      setLoading(false);
    }
    loadSongs();
  }, [view, selectedList]);

  // Navigation : sélectionner une liste
  function handleSelectList(list: List | null) {
    setSelectedList(list);
    setView("songs");
  }

  // Navigation : sélectionner une chanson
  function handleSelectSong(song: Song) {
    setSelectedSong(song);
    setView("detail");
  }

  // Navigation : retour arrière
  function handleBack() {
    if (view === "detail") setView("songs");
    else if (view === "songs") setView("lists");
  }

  return (
    <div className="app-root">
      {view === "lists" && (
        <ListGrid
          lists={lists}
          onSelectList={handleSelectList}
        />
      )}

      {view === "songs" && (
        <SongList
          songs={songs}
          listName={selectedList ? selectedList.name : "All songs"}
          loading={loading}
          onSelectSong={handleSelectSong}
          onBack={handleBack}
        />
      )}

      {view === "detail" && selectedSong && (
        <SongDetail
          song={selectedSong}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
