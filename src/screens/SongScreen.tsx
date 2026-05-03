import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getSongById } from "../services/songs";
import type { Song } from "../shared/types";
import {
  ScreenRoot,
  BackButton,
  Label,
  tokens,
  neonGoldText,
} from "../shared/styles";

/* ── Helpers ─────────────────────────────────────────────── */

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/* ── Styles ─────────────────────────────────────────────── */

const Thumb = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.75rem;
  aspect-ratio: 16 / 9;
  background: ${tokens.bgCard};
  border: 0.5px solid #1e1e1e;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ThumbOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${Thumb}:hover & {
    opacity: 1;
  }
`;

const YtPlay = styled.div`
  background: #e00;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  box-shadow:
    0 0 16px rgba(255, 0, 0, 0.5),
    0 0 40px rgba(255, 0, 0, 0.2);

  .pi {
    font-size: 1.4rem !important;
    color: #fff;
  }
`;

const Meta = styled.div`
  margin-bottom: 2rem;
`;

const SongTitle = styled.h2`
  font-family: ${tokens.serif};
  font-size: clamp(1.8rem, 6vw, 2.4rem);
  font-weight: 700;
  color: ${tokens.text};
  line-height: 1.05;
  letter-spacing: -0.5px;
`;

const Artist = styled.p`
  margin-top: 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${tokens.gold};
  ${neonGoldText}
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const Lyrics = styled.div`
  font-size: clamp(1rem, 3vw, 1.15rem);
  line-height: 1.9;
  color: #a0aca4;

  p {
    margin: 0;
  }
  .spacer {
    height: 1em;
  }
`;

const Notes = styled.div`
  font-size: 0.82rem;
  line-height: 1.75;
  color: ${tokens.textDim};
  background: #0f0f0f;
  border-left: 2px solid ${tokens.gold}33;
  border-radius: 0 8px 8px 0;
  padding: 0.875rem 1.1rem;
`;

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: ${tokens.textDim};
  font-size: 0.8rem;
  letter-spacing: 0.1em;
`;

/* ── Component ───────────────────────────────────────────── */

export default function SongScreen() {
  const { listId, songId } = useParams<{ listId: string; songId: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (songId) getSongById(Number(songId)).then(setSong);
  }, [songId]);

  if (!song) return <LoadingWrap>chargement...</LoadingWrap>;

  const ytId = song.yt_url ? getYouTubeId(song.yt_url) : null;
  const thumbUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : null;

  return (
    <ScreenRoot>
      <BackButton onClick={() => navigate(`/list/${listId}`)}>
        <i className="pi pi-arrow-left" />{" "}
        {listId === "all" ? "All songs" : "Playlist"}
      </BackButton>

      {ytId && (
        <Thumb>
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <>
              <img
                src={thumbUrl!}
                alt={song.title}
                onClick={() => setPlaying(true)}
              />
              <ThumbOverlay onClick={() => setPlaying(true)}>
                <YtPlay>
                  <i className="pi pi-youtube" />
                </YtPlay>
              </ThumbOverlay>
            </>
          )}
        </Thumb>
      )}

      <Meta>
        <SongTitle>{song.title}</SongTitle>
        {song.artist && <Artist>{song.artist}</Artist>}
      </Meta>
      {song.notes && (
        <Section>
          <Label>Notes</Label>
          <Notes>{song.notes}</Notes>
        </Section>
      )}
      {song.lyrics && (
        <Section>
          <Label>Lyrics</Label>

          <Lyrics>
            {song.lyrics
              .split("\n")
              .map((line, i) =>
                line.trim() === "" ? (
                  <p key={i} className="spacer" />
                ) : (
                  <p key={i}>{line}</p>
                ),
              )}
          </Lyrics>
        </Section>
      )}
    </ScreenRoot>
  );
}
