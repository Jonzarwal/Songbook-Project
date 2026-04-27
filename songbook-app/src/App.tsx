import type { Song } from "./types/song";
import SongList from "./components/SongList";

function App() {
  const songs: Song[] = [
    {
      id: 1,
      title: "Wonderwall",
      artist: "Oasis",
    },
    {
      id: 2,
      title: "Knocking on Heaven's Door",
      artist: "Bob Dylan",
    },
  ];

  return (
    <div>
      <h1>🎸 Songbook</h1>
      <SongList songs={songs} />
    </div>
  );
}

export default App;
