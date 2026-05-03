import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ProgressSpinner } from "primereact/progressspinner";
import { getOrphanSongs } from "../services/songs";
import type { Song } from "../shared/types";
import {
  ScreenRoot, BackButton,
  tokens,
} from "../shared/styles";

/* ── Styles ─────────────────────────────────────────────── */
const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-family: ${tokens.serif};
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-style: italic;
  font-weight: 400;
  color: ${tokens.text};
  line-height: 1.1;
`;

const Sub = styled.p`
  margin-top: 0.3rem;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${tokens.textDim};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0.5rem;
  border-bottom: 0.5px solid ${tokens.border};
  border-radius: 8px;
  transition: background 0.15s;

  &:hover { background: ${tokens.bgHover}; }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const SongTitle = styled.div`
  font-size: 0.9rem;
  color: ${tokens.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  margin-top: 0.2rem;
  font-size: 0.72rem;
  color: ${tokens.textDim};
`;

const WarningDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${tokens.red};
  box-shadow: 0 0 6px ${tokens.redGlow}, 0 0 12px ${tokens.redGlow};
  flex-shrink: 0;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 0;
  color: ${tokens.textDim};
  font-size: 0.8rem;
  letter-spacing: 0.1em;
`;

const AllGood = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 5rem 0;
  color: ${tokens.textDim};
  font-size: 0.8rem;
  letter-spacing: 0.1em;

  span.check {
    font-size: 2rem;
    color: #5a8a6a;
    text-shadow: 0 0 10px #5a8a6a88, 0 0 24px #5a8a6a44;
  }
`;

/* ── Component ───────────────────────────────────────────── */
export default function OrphanScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrphanSongs().then((data) => {
      setSongs(data);
      setLoading(false);
    });
  }, []);

  return (
    <ScreenRoot>
      <BackButton onClick={() => navigate("/")}>
        <i className="pi pi-arrow-left" /> Playlists
      </BackButton>

      <Header>
        <Title>Sans playlist</Title>
        <Sub>
          {loading ? "..." : `${songs.length} song${songs.length !== 1 ? "s" : ""} orpheline${songs.length !== 1 ? "s" : ""}`}
        </Sub>
      </Header>

      {loading ? (
        <Center><ProgressSpinner style={{ width: 36, height: 36 }} /></Center>
      ) : songs.length === 0 ? (
        <AllGood>
          <span className="check">✓</span>
          <span>Toutes les songs sont dans une liste</span>
        </AllGood>
      ) : (
        <List>
          {songs.map((song) => (
            <Row key={song.id}>
              <WarningDot />
              <Info>
                <SongTitle>{song.title}</SongTitle>
                {song.artist && <Artist>{song.artist}</Artist>}
              </Info>
            </Row>
          ))}
        </List>
      )}
    </ScreenRoot>
  );
}
