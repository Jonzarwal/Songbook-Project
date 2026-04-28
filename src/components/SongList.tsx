import type { Song } from "../types/song";

type Props = {
  songs: Song[];
};

function SongList({ songs }: Props) {
  return (
    <ul>
      {songs.map((song) => (
        <li key={song.id}>
          {song.title} — {song.artist}
        </li>
      ))}
    </ul>
  );
}

export default SongList;
