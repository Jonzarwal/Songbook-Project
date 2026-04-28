import { useEffect, useState, useRef } from "react";

import type { Song } from "./types/song";
import type { List } from "./types/list";

import ListGrid from "./components/ListGrid";
import SongList from "./components/SongList";
import SongDetail from "./components/SongDetail";

import { getSongs, getSongsByList } from "./services/songs";
import { getLists } from "./services/lists";

type View = "lists" | "songs" | "detail";

// Chaque vue a un index de profondeur : lists=0, songs=1, detail=2
const VIEW_INDEX: Record<View, number> = { lists: 0, songs: 1, detail: 2 };

function App() {
  const [view, setView] = useState<View>("lists");
  const [prevView, setPrevView] = useState<View | null>(null);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [songs, setSongs] = useState<Song[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);

  const pendingView = useRef<View | null>(null);

  useEffect(() => {
    getLists().then(setLists);
  }, []);

  useEffect(() => {
    if (view !== "songs") return;
    setLoading(true);
    const fetch = selectedList === null ? getSongs() : getSongsByList(selectedList.id);
    fetch.then((data) => { setSongs(data); setLoading(false); });
  }, [view, selectedList]);

  // Lance une transition vers une nouvelle vue
  function navigateTo(next: View) {
    const isForward = VIEW_INDEX[next] > VIEW_INDEX[view];
    setDirection(isForward ? "forward" : "back");
    setPrevView(view);
    pendingView.current = next;
    setSliding(true);

    // Après la durée de l'animation, on commit la nouvelle vue
    setTimeout(() => {
      setView(next);
      setSliding(false);
      setPrevView(null);
    }, 320);
  }

  function handleSelectList(list: List | null) {
    setSelectedList(list);
    navigateTo("songs");
  }

  function handleSelectSong(song: Song) {
    setSelectedSong(song);
    navigateTo("detail");
  }

  function handleBack() {
    if (view === "detail") navigateTo("songs");
    else if (view === "songs") navigateTo("lists");
  }

  // Pendant le slide on affiche l'écran courant + le suivant côte à côte
  const activeView = sliding && pendingView.current ? pendingView.current : view;
  const showPrev = sliding && prevView !== null;

  return (
    <div className="app-root">
      <div
        className={[
          "slide-container",
          sliding ? `slide-${direction}` : "",
        ].join(" ")}
      >
        {/* Écran sortant (visible uniquement pendant la transition) */}
        {showPrev && (
          <div className="slide-pane slide-pane--out">
            {prevView === "lists" && (
              <ListGrid lists={lists} onSelectList={handleSelectList} />
            )}
            {prevView === "songs" && (
              <SongList
                songs={songs}
                listName={selectedList ? selectedList.name : "All songs"}
                loading={loading}
                onSelectSong={handleSelectSong}
                onBack={handleBack}
              />
            )}
            {prevView === "detail" && selectedSong && (
              <SongDetail song={selectedSong} onBack={handleBack} />
            )}
          </div>
        )}

        {/* Écran entrant (toujours présent, animé) */}
        <div className={["slide-pane", showPrev ? "slide-pane--in" : ""].join(" ")}>
          {activeView === "lists" && (
            <ListGrid lists={lists} onSelectList={handleSelectList} />
          )}
          {activeView === "songs" && (
            <SongList
              songs={songs}
              listName={selectedList ? selectedList.name : "All songs"}
              loading={loading}
              onSelectSong={handleSelectSong}
              onBack={handleBack}
            />
          )}
          {activeView === "detail" && selectedSong && (
            <SongDetail song={selectedSong} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
