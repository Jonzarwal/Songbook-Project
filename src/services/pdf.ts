import jsPDF from "jspdf";
import type { ListSong, List } from "../shared/types";

/* ── Couleurs ────────────────────────────────────────────── */
// Résout n'importe quelle couleur CSS valide (hex, named, rgb...)
function cssColorToRgb(color: string): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/* ── Emojis & Unicode ────────────────────────────────────── */
const EMOJI_MAP: Record<string, string> = {
  "🎸": "[guitar]",
  "🎹": "[piano]",
  "🎷": "[sax]",
  "🎺": "[trumpet]",
  "🥁": "[drums]",
  "🎻": "[violin]",
  "🪗": "[accordeon]",
  "🎵": "[note]",
  "🎶": "[notes]",
  "⚠": "[!]",
  "★": "*",
  "♪": "~",
  "♩": "~",
  "◆": "-",
  "→": "->",
};

function sanitize(text: string): string {
  let out = text;
  for (const [emoji, replacement] of Object.entries(EMOJI_MAP)) {
    out = out.replaceAll(emoji, replacement);
  }
  // Retire tout caractère non-latin restant
  return out.replace(/[^\x00-\x7FÀ-ÿ]/g, "");
}

/* ── Wrap texte ──────────────────────────────────────────── */
function splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(sanitize(text), maxWidth);
}

/* ── Export principal ────────────────────────────────────── */
export function exportPlaylistToPdf(
  list: List | null,
  songs: ListSong[],
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const margin = 14;
  const contentWidth = W - margin * 2;
  const accent = list?.color || "#c9a84c";
  const [r, g, b] = cssColorToRgb(accent);

  let y = 0;

  /* ── Header playlist ─────────────────────────────────── */
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, W, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const title = sanitize(list ? list.name.toUpperCase() : "ALL SONGS");
  doc.text(title, margin, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${songs.length} songs`, W - margin, 14, { align: "right" });

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(dateStr, W - margin, 19, { align: "right" });

  y = 30;

  /* ── Songs ───────────────────────────────────────────── */
  songs.forEach((song, i) => {
    const index = String(i + 1).padStart(2, "0");

    const noteLines = song.notes
      ? splitText(doc, song.notes, contentWidth - 24)
      : [];

    const rowHeight =
      8 + (noteLines.length > 0 ? noteLines.length * 4.5 + 3 : 0) + 4;

    // Saut de page si nécessaire
    if (y + rowHeight > 280) {
      doc.addPage();

      // Mini header pages suivantes
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, W, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin, 5.5);

      y = 16;
    }

    // Pastille couleur de la song
    if (song.color) {
      const [sr, sg, sb] = cssColorToRgb(song.color);
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(margin, y - 3.5, 5, 5, 1, 1, "F");
    }

    // Index
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(index, margin + 7, y);

    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(sanitize(song.title), margin + 16, y);

    // Notes
    if (noteLines.length > 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(noteLines, margin + 16, y + 5.5);
      y += noteLines.length * 4.5 + 3;
    }

    // Séparateur
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 3, W - margin, y + 3);

    y += 9;
  });

  /* ── Pagination ──────────────────────────────────────── */
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(`${p} / ${pageCount}`, W / 2, 292, { align: "center" });
  }

  /* ── Save ────────────────────────────────────────────── */
  const filename = list
    ? `${sanitize(list.name).toLowerCase().replace(/\s+/g, "_")}_setlist.pdf`
    : "all_songs_setlist.pdf";
  doc.save(filename);
}
