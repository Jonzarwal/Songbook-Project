import { useEffect, useState } from "react";
import type { Song } from "./types/song";
import SongList from "./components/SongList";
import { getSongs } from "./services/songs";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSongs() {
      const data = await getSongs();
      setSongs(data);
      setLoading(false);
    }

    loadSongs();
  }, []);

  return (
    <div>
      <h1>🎸 Songbouuuuuk </h1>

      {loading ? <p>Chargement...</p> : <SongList songs={songs} />}
    </div>
  );
}

export default App;
