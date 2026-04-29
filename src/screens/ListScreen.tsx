import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ProgressSpinner } from "primereact/progressspinner";
import { getSongs, getSongsByList } from "../services/songs";
import { getLists } from "../services/lists";
import type { ListSong, List } from "../shared/types";
import {
  BaseCard,
  ScreenRoot,
  BackButton,
  AccentBar,
  tokens,
  neonColor,
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
  gap: 0.5rem;
`;

const SongCard = styled(BaseCard)<{ $accent?: string }>`
  && {
    border-radius: 10px;

    &:hover {
      ${({ $accent }) =>
        $accent
          ? neonColor($accent)
          : `box-shadow: 0 0 12px rgba(255,255,255,0.04);`}
      border-color: ${({ $accent }) =>
        $accent ? `${$accent}66` : tokens.borderHover};
    }
  }
`;

const CardInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
`;

const Num = styled.span`
  font-size: 0.8rem;
  color: ${tokens.textFaint};
  min-width: 1.6rem;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const SongTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
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

const ColorDot = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Chevron = styled.i`
  color: ${tokens.textFaint} !important;
  font-size: 0.65rem !important;
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

/* ── Component ───────────────────────────────────────────── */

export default function ListScreen() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const [songs, setSongs] = useState<ListSong[]>([]);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);

  const isAll = listId === "all";

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (isAll) {
        const data = await getSongs();
        setSongs(data);
      } else {
        const [songsData, listsData] = await Promise.all([
          getSongsByList(Number(listId)),
          getLists(),
        ]);
        setSongs(songsData);
        setList(listsData.find((l) => l.id === Number(listId)) ?? null);
      }
      setLoading(false);
    }
    load();
  }, [listId]);

  const listName = isAll ? "All songs" : (list?.name ?? "...");
  const accent = list?.color;
  console.log(songs);
  return (
    <ScreenRoot>
      <BackButton onClick={() => navigate("/")}>
        <i className="pi pi-arrow-left" /> Playlists
      </BackButton>

      <Header>
        <Title>{listName}</Title>
        <Sub>
          {loading
            ? "..."
            : `${songs.length} chanson${songs.length !== 1 ? "s" : ""}`}
        </Sub>
      </Header>

      {loading ? (
        <Center>
          <ProgressSpinner style={{ width: 36, height: 36 }} />
        </Center>
      ) : songs.length === 0 ? (
        <Center>
          <i
            className="pi pi-music"
            style={{ fontSize: "1.8rem", opacity: 0.25 }}
          />
          <span>Aucune chanson</span>
        </Center>
      ) : (
        <List>
          {songs.map((song, i) => (
            <li key={song.id}>
              <SongCard
                $accent={accent}
                onClick={() => navigate(`/list/${listId}/song/${song.id}`)}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate(`/list/${listId}/song/${song.id}`)
                }
              >
                {accent && <AccentBar $color={accent} />}
                <CardInner>
                  <Num>{String(i + 1).padStart(2, "0")}</Num>
                  <Info>
                    <SongTitle>{song.title}</SongTitle>
                    {song.artist && <Artist>{song.artist}</Artist>}
                  </Info>
                  {song.color && <ColorDot $color={song.color} />}
                  <Chevron className="pi pi-chevron-right" />
                </CardInner>
              </SongCard>
            </li>
          ))}
        </List>
      )}
    </ScreenRoot>
  );
}
