import type { Song } from "../types/song";
import { Button } from "primereact/button";

interface Props {
  song: Song;
  onBack: () => void;
}

// Extrait l'ID YouTube depuis une URL
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function SongDetail({ song, onBack }: Props) {
  const ytId = song.yt_url ? getYouTubeId(song.yt_url) : null;
  const thumbUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : null;

  return (
    <div className="detail-root">
      {/* Header */}
      <div className="detail-header">
        <Button
          icon="pi pi-arrow-left"
          text
          className="back-btn"
          onClick={onBack}
          aria-label="Retour"
        />
      </div>

      {/* Miniature YouTube */}
      {thumbUrl ? (
        <a
          href={song.yt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="detail-thumb"
          aria-label={`Ouvrir ${song.title} sur YouTube`}
        >
          <img src={thumbUrl} alt={`Miniature YouTube de ${song.title}`} />
          <div className="detail-thumb__overlay">
            <div className="yt-play">
              <i className="pi pi-youtube" />
            </div>
          </div>
        </a>
      ) : (
        <div className="detail-thumb detail-thumb--empty">
          <i className="pi pi-music" />
        </div>
      )}

      {/* Titre + artiste */}
      <div className="detail-meta">
        <h2 className="detail-title">{song.title}</h2>
        {song.artist && <p className="detail-artist">{song.artist}</p>}
      </div>

      {/* Lyrics */}
      {song.lyrics && (
        <div className="detail-section">
          <div className="detail-section__label">Lyrics</div>
          <div className="detail-lyrics">
            {song.lyrics.split("\n").map((line, i) => (
              <p key={i} className={line.trim() === "" ? "lyric-spacer" : "lyric-line"}>
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {song.notes && (
        <div className="detail-section">
          <div className="detail-section__label">Notes</div>
          <div className="detail-notes">{song.notes}</div>
        </div>
      )}
    </div>
  );
}
