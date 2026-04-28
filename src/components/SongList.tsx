import type { Song } from "../types/song";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";

interface Props {
  songs: Song[];
  listName: string;
  loading: boolean;
  onSelectSong: (song: Song) => void;
  onBack: () => void;
}

export default function SongList({ songs, listName, loading, onSelectSong, onBack }: Props) {
  return (
    <div className="songlist-root">
      {/* Header */}
      <div className="songlist-header">
        <Button
          icon="pi pi-arrow-left"
          text
          className="back-btn"
          onClick={onBack}
          aria-label="Retour"
        />
        <div>
          <h2 className="songlist-title">{listName}</h2>
          <p className="songlist-sub">
            {loading ? "..." : `${songs.length} chanson${songs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="songlist-loading">
          <ProgressSpinner style={{ width: 40, height: 40 }} />
        </div>
      ) : songs.length === 0 ? (
        <div className="songlist-empty">
          <i className="pi pi-music" style={{ fontSize: "2rem", opacity: 0.3 }} />
          <p>Aucune chanson dans cette liste</p>
        </div>
      ) : (
        <ul className="songlist-list">
          {songs.map((song, index) => (
            <li
              key={song.id}
              className="song-row"
              onClick={() => onSelectSong(song)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectSong(song)}
            >
              {/* Numéro de position */}
              <span className="song-row__num">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Infos */}
              <div className="song-row__info">
                <div className="song-row__title">{song.title}</div>
                {song.artist && (
                  <div className="song-row__artist">{song.artist}</div>
                )}
              </div>

              {/* Barre couleur (si définie sur la song) */}
              {(song as any).color && (
                <div
                  className="song-row__color"
                  style={{ background: (song as any).color + "66" }}
                />
              )}

              <i className="pi pi-chevron-right song-row__arrow" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
