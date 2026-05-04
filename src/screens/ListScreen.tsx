import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  getSongs,
  getSongsByList,
  addSongToList,
  removeSongFromList,
  updatePositions,
} from "../services/songs";
import { getLists } from "../services/lists";
import type { Song, ListSong, List } from "../shared/types";
import {
  BaseCard,
  ScreenRoot,
  BackButton,
  AccentBar,
  DragHandle,
  RemoveButton,
  SongPickerRow,
  CheckIcon,
  tokens,
  neonColor,
} from "../shared/styles";

/* ── Props ───────────────────────────────────────────────── */
interface Props {
  editMode: boolean;
}

/* ── Styles ─────────────────────────────────────────────── */
const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const HeaderText = styled.div``;

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

const AddButton = styled.button`
  background: none;
  border: 1px solid ${tokens.gold}44;
  color: ${tokens.gold};
  font-family: ${tokens.mono};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  white-space: nowrap;
  margin-top: 0.25rem;

  &:hover {
    border-color: ${tokens.gold};
    box-shadow:
      0 0 10px ${tokens.goldGlow},
      0 0 24px ${tokens.goldGlow};
  }
`;

const SongList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SongCard = styled(BaseCard)<{ $accent?: string; $isDragging?: boolean }>`
  && {
    border-radius: 10px;
    ${({ $isDragging }) =>
      $isDragging &&
      `
      opacity: 0.95;
      box-shadow:
        0 0 6px rgba(201,168,76,0.35),
        0 0 18px rgba(201,168,76,0.35);
      border-color: #c9a84c66;
    `}

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
  font-weight: bold;
  color: ${tokens.textFaint};
  min-width: 1.6rem;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  cursor: pointer;
`;

const SongTitle = styled.div`
  font-size: 1.5;
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

const ListNotes = styled.div`
  font-size: 0.72rem;
  color: ${tokens.textDim};
  line-height: 1.5;
  flex-shrink: 0;
  max-width: 120px;
  text-align: right;
`;

const ColorDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 6px ${({ $color }) => $color}88;
  flex-shrink: 0;
  align-self: center;
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

/* Dialog styles */
const StyledDialog = styled(Dialog)`
  .p-dialog-header {
    background: #1a1a1a;
    border-bottom: 0.5px solid ${tokens.border};
    color: ${tokens.text};
    font-family: ${tokens.mono};
  }

  .p-dialog-content {
    background: #1a1a1a;
    padding: 0.5rem 1.25rem;
  }

  .p-dialog-footer {
    background: #1a1a1a;
    border-top: 0.5px solid ${tokens.border};
    padding: 0.75rem 1.25rem;
  }
`;

const DialogList = styled.ul`
  list-style: none;
  max-height: 60vh;
  overflow-y: auto;
  margin-top: 0.5rem;
`;

const PickerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PickerTitle = styled.div`
  font-size: 0.88rem;
  color: ${tokens.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PickerArtist = styled.div`
  font-size: 0.72rem;
  color: ${tokens.textDim};
  margin-top: 0.15rem;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? tokens.gold : "none")};
  color: ${({ $primary }) => ($primary ? tokens.bg : tokens.textDim)};
  border: 1px solid
    ${({ $primary }) => ($primary ? tokens.gold : tokens.border)};
  font-family: ${tokens.mono};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  cursor: pointer;
  transition:
    opacity 0.15s,
    box-shadow 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

/* ── Sortable Song Item ───────────────────────────────────── */
interface SortableItemProps {
  song: ListSong;
  index: number;
  editMode: boolean;
  accent?: string;
  onRemove: (songId: number) => void;
  onNavigate: (songId: number) => void;
}

function SortableItem({
  song,
  index,
  editMode,
  accent,
  onRemove,
  onNavigate,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <SongCard $accent={accent} $isDragging={isDragging}>
        {accent && <AccentBar $color={accent} />}
        <CardInner>
          {editMode && (
            <DragHandle {...attributes} {...listeners}>
              ⠿
            </DragHandle>
          )}
          <Num>{String(index + 1).padStart(2, "0")}</Num>
          <Info onClick={() => !editMode && onNavigate(song.id)}>
            <SongTitle>{song.title}</SongTitle>
            {song.artist && <Artist>{song.artist}</Artist>}
          </Info>
          {song.notes && <ListNotes>{song.notes}</ListNotes>}

          {song.color && <ColorDot $color={song.color} />}
          {editMode ? (
            <RemoveButton onClick={() => onRemove(song.id)}>✕</RemoveButton>
          ) : (
            <Chevron className="pi pi-chevron-right" />
          )}
        </CardInner>
      </SongCard>
    </li>
  );
}

/* ── Component ───────────────────────────────────────────── */
export default function ListScreen({ editMode }: Props) {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const [songs, setSongs] = useState<ListSong[]>([]);
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);

  // Picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const isAll = listId === "all";
  const numericListId = Number(listId);
  const accent = list?.color;

  /* Chargement */
  useEffect(() => {
    async function load() {
      setLoading(true);
      if (isAll) {
        const data = await getSongs();
        setSongs(data);
      } else {
        const [songsData, listsData] = await Promise.all([
          getSongsByList(numericListId),
          getLists(),
        ]);
        setSongs(songsData);
        setList(listsData.find((l) => l.id === numericListId) ?? null);
      }
      setLoading(false);
    }
    load();
  }, [listId]);

  /* DnD sensors — seuil de 8px pour ne pas bloquer le scroll */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSongs((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Persist en BDD
      updatePositions(numericListId, reordered);
      return reordered;
    });
  }

  /* Retirer une song */
  async function handleRemove(songId: number) {
    await removeSongFromList(numericListId, songId);
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  }

  /* Ouvrir le picker */
  async function openPicker() {
    const all = await getSongs();
    setAllSongs(all);
    // Pré-cocher les songs déjà dans la liste
    const existingIds = new Set(songs.map((s) => s.id));
    setSelected(existingIds);
    setPickerOpen(true);
  }

  /* Valider la sélection */
  async function confirmPicker() {
    const existingIds = new Set(songs.map((s) => s.id));
    const toAdd = [...selected].filter((id) => !existingIds.has(id));

    let nextPosition = songs.length + 1;
    for (const songId of toAdd) {
      const song = allSongs.find((s) => s.id === songId)!;
      const notes = `${listName} — ${song.title}`;
      await addSongToList(
        numericListId,
        songId,
        nextPosition++,
        "#ffffff",
        notes,
      );
    }

    const updated = await getSongsByList(numericListId);
    setSongs(updated);
    setPickerOpen(false);
  }

  function togglePick(id: number, alreadyIn: boolean) {
    if (alreadyIn) return; // on ne peut pas décocher depuis ici (utiliser ✕)
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const listName = isAll ? "All songs" : (list?.name ?? "...");
  const existingIds = new Set(songs.map((s) => s.id));

  return (
    <ScreenRoot>
      <BackButton onClick={() => navigate("/")}>
        <i className="pi pi-arrow-left" /> Playlists
      </BackButton>

      <HeaderRow>
        <HeaderText>
          <Title>{listName}</Title>
          <Sub>
            {loading
              ? "..."
              : `${songs.length} chanson${songs.length !== 1 ? "s" : ""}`}
          </Sub>
        </HeaderText>
        {editMode && !isAll && (
          <AddButton onClick={openPicker}>+ Ajouter</AddButton>
        )}
      </HeaderRow>

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={songs.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <SongList>
              {songs.map((song, i) => (
                <SortableItem
                  key={song.id}
                  song={song}
                  index={i}
                  editMode={editMode && !isAll}
                  accent={accent}
                  onRemove={handleRemove}
                  onNavigate={(id) => navigate(`/list/${listId}/song/${id}`)}
                />
              ))}
            </SongList>
          </SortableContext>
        </DndContext>
      )}

      {/* Dialog picker */}
      <StyledDialog
        visible={pickerOpen}
        onHide={() => setPickerOpen(false)}
        header="Ajouter des songs"
        style={{ width: "min(480px, 95vw)" }}
        footer={
          <DialogFooter>
            <Btn onClick={() => setPickerOpen(false)}>Annuler</Btn>
            <Btn $primary onClick={confirmPicker}>
              Confirmer
            </Btn>
          </DialogFooter>
        }
      >
        <DialogList>
          {allSongs.map((song) => {
            const alreadyIn = existingIds.has(song.id);
            const isChecked = selected.has(song.id);
            return (
              <li key={song.id}>
                <SongPickerRow
                  $checked={isChecked}
                  $disabled={alreadyIn}
                  onClick={() => togglePick(song.id, alreadyIn)}
                >
                  <CheckIcon $checked={isChecked}>
                    {isChecked && <i className="pi pi-check" />}
                  </CheckIcon>
                  <PickerInfo>
                    <PickerTitle>{song.title}</PickerTitle>
                    {song.artist && <PickerArtist>{song.artist}</PickerArtist>}
                  </PickerInfo>
                </SongPickerRow>
              </li>
            );
          })}
        </DialogList>
      </StyledDialog>
    </ScreenRoot>
  );
}
