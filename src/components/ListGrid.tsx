import type { List } from "../types/list";
import { Button } from "primereact/button";

interface Props {
  lists: List[];
  onSelectList: (list: List | null) => void;
}

// Palette de couleurs pour les listes sans couleur définie
const FALLBACK_COLORS = ["#c9a84c", "#5a8a6a", "#6a5a8a", "#8a5a5a", "#5a6a8a"];

function getAccent(list: List, index: number): string {
  return (list as any).color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function ListGrid({ lists, onSelectList }: Props) {
  return (
    <div className="listgrid-root">
      {/* Header */}
      <div className="listgrid-header">
        <h1 className="listgrid-title">My<br />Songbook</h1>
        <p className="listgrid-sub">{lists.length} playlist{lists.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Grid */}
      <div className="listgrid-grid">

        {/* Carte "All" épinglée */}
        <div
          className="list-card list-card--all"
          onClick={() => onSelectList(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onSelectList(null)}
        >
          <div className="list-card__accent" style={{ background: "#c9a84c" }} />
          <div className="list-card__body">
            <span className="list-card__icon">★</span>
            <div>
              <div className="list-card__name">All songs</div>
              <div className="list-card__desc">Toute ta musique</div>
            </div>
          </div>
        </div>

        {/* Cartes des playlists */}
        {lists.map((list, i) => {
          const accent = getAccent(list, i);
          return (
            <div
              key={list.id}
              className="list-card"
              onClick={() => onSelectList(list)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectList(list)}
              style={{ "--accent": accent } as React.CSSProperties}
            >
              <div className="list-card__accent" style={{ background: accent }} />
              <div className="list-card__body">
                <span className="list-card__icon" style={{ color: accent }}>♪</span>
                <div>
                  <div className="list-card__name">{list.name}</div>
                  {list.description && (
                    <div className="list-card__desc">{list.description}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
