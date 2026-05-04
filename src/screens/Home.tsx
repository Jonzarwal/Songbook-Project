import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLists } from "../services/lists";
import type { List } from "../shared/types";
import {
  BaseCard,
  ScreenRoot,
  AccentBar,
  LongPressBar,
  EditBadge,
  tokens,
  neonColor,
} from "../shared/styles";

/* ── Props ───────────────────────────────────────────────── */
interface Props {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

/* ── Styles ─────────────────────────────────────────────── */
const Root = styled(ScreenRoot)`
  padding-top: 2.5rem;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  user-select: none;
`;

const Title = styled.h1`
  font-family: ${tokens.serif};
  font-size: clamp(2.6rem, 9vw, 3.8rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -1.5px;
  color: ${tokens.text};
  cursor: pointer;

  span {
    color: ${tokens.gold};
    text-shadow:
      0 0 8px ${tokens.goldGlow},
      0 0 24px ${tokens.goldGlow};
  }
`;

const Sub = styled.p`
  margin-top: 0.6rem;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${tokens.textDim};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 0.75rem;
`;

const ListCard = styled(BaseCard)<{
  $accent: string;
  $isAll?: boolean;
  $isOrphan?: boolean;
}>`
  && {
    border-color: ${({ $accent }) => $accent}22;

    &:hover {
      border-color: ${({ $accent }) => $accent}88;
      ${({ $accent }) => neonColor($accent)}
    }

    ${({ $isAll }) =>
      $isAll &&
      `
      background: linear-gradient(135deg, #c9a84c0a, #c9a84c05);
    `}

    ${({ $isOrphan }) =>
      $isOrphan &&
      `
      background: linear-gradient(135deg, #ff3c3c0a, #ff3c3c05);
    `}
  }
`;

const CardBody = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
`;

const Icon = styled.span<{ $color: string }>`
  font-size: 1.3rem;
  color: ${({ $color }) => $color};
  text-shadow: 0 0 10px ${({ $color }) => $color}88;
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
`;

const CardName = styled.div`
  font-size: 1rem;
  color: ${tokens.text};
  letter-spacing: 0.02em;
`;

const CardDesc = styled.div`
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: ${tokens.textDim};
`;

const EditHint = styled.p`
  margin-top: 0.4rem;
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${tokens.gold}88;
  text-align: center;
`;

/* ── Helpers ─────────────────────────────────────────────── */
const FALLBACK_COLORS = ["#c9a84c", "#5a8a6a", "#6a5a8a", "#8a5a5a", "#5a6a8a"];
const getAccent = (list: List, i: number) =>
  list.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

const LONG_PRESS_MS = 1000;

/* ── Component ───────────────────────────────────────────── */
export default function Home({ editMode, setEditMode }: Props) {
  const [lists, setLists] = useState<List[]>([]);
  const [pressing, setPressing] = useState(false);
  const navigate = useNavigate();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getLists().then(setLists);
  }, []);

  // Nettoyage timer si le composant est démonté pendant un appui
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const startPress = useCallback(() => {
    setPressing(true);
    timerRef.current = setTimeout(() => {
      setPressing(false);
      setEditMode(!editMode);
    }, LONG_PRESS_MS);
  }, [editMode, setEditMode]);

  const cancelPress = useCallback(() => {
    setPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <Root>
      {/* Barre de progression appui long */}
      <LongPressBar $active={pressing} $duration={LONG_PRESS_MS} />

      {/* Badge mode édition */}
      {editMode && <EditBadge>✎ édition</EditBadge>}

      <Header>
        <Title
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
        >
          Girl Outlaws And Troubadours
          <br />
          <span>Songbook</span>
        </Title>
        <Sub>
          {lists.length} playlist{lists.length !== 1 ? "s" : ""}
        </Sub>
        {!editMode && <EditHint>-</EditHint>}
      </Header>

      <Grid>
        {/* All songs */}
        <ListCard
          $accent={tokens.gold}
          $isAll
          onClick={() => navigate("/list/all")}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/list/all")}
        >
          <AccentBar $color={tokens.gold} />
          <CardBody>
            <Icon $color={tokens.gold}>★</Icon>
            <div>
              <CardName>All songs</CardName>
              <CardDesc>Toute ta musique</CardDesc>
            </div>
          </CardBody>
        </ListCard>

        {/* Orphelins */}
        <ListCard
          $accent={tokens.red}
          $isOrphan
          onClick={() => navigate("/orphans")}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/orphans")}
        >
          <AccentBar $color={tokens.red} />
          <CardBody>
            <Icon $color={tokens.red}>⚠</Icon>
            <div>
              <CardName>Sans playlist</CardName>
              <CardDesc>Songs dans aucune liste</CardDesc>
            </div>
          </CardBody>
        </ListCard>

        {/* Playlists */}
        {lists.map((list, i) => {
          const accent = getAccent(list, i);
          return (
            <ListCard
              key={list.id}
              $accent={accent}
              onClick={() => navigate(`/list/${list.id}`)}
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/list/${list.id}`)
              }
            >
              <AccentBar $color={accent} />
              <CardBody>
                <Icon $color={accent}>♪</Icon>
                <div>
                  <CardName>{list.name}</CardName>
                  {list.description && <CardDesc>{list.description}</CardDesc>}
                </div>
              </CardBody>
            </ListCard>
          );
        })}
      </Grid>
    </Root>
  );
}
