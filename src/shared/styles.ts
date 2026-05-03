import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import { Card } from "primereact/card";

/* ============================================================
   TOKENS
   ============================================================ */
export const tokens = {
  bg: "#0a0a0a",
  bgCard: "#111111",
  bgHover: "#161616",
  border: "#1e1e1e",
  borderHover: "#2e2e2e",
  text: "#e0dcd4",
  textDim: "#666",
  textFaint: "#333",
  gold: "#c9a84c",
  goldGlow: "rgba(201,168,76,0.35)",
  goldFaint: "rgba(201,168,76,0.08)",
  red: "#ff3c3c",
  redGlow: "rgba(255,60,60,0.35)",
  mono: "'DM Mono', monospace",
  serif: "'Playfair Display', serif",
};

/* ============================================================
   NEON GLOW HELPERS
   ============================================================ */
export const neonGold = css`
  box-shadow:
    0 0 6px ${tokens.goldGlow},
    0 0 18px ${tokens.goldGlow},
    inset 0 0 6px rgba(201, 168, 76, 0.05);
`;

export const neonGoldText = css`
  text-shadow:
    0 0 6px ${tokens.goldGlow},
    0 0 16px ${tokens.goldGlow};
`;

export const neonColor = (hex: string) => css`
  box-shadow:
    0 0 6px ${hex}55,
    0 0 18px ${hex}33,
    inset 0 0 6px ${hex}11;
`;

export const neonRed = css`
  box-shadow:
    0 0 6px ${tokens.redGlow},
    0 0 18px ${tokens.redGlow};
`;

/* ============================================================
   GLOBAL STYLES
   ============================================================ */
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${tokens.bg};
    color: ${tokens.text};
    font-family: ${tokens.mono};
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    max-width: 680px;
    margin: 0 auto;
    min-height: 100dvh;
    overflow-x: hidden;
  }
`;

/* ============================================================
   BASE CARD
   ============================================================ */
export const BaseCard = styled(Card)`
  && {
    background: ${tokens.bgCard};
    border: 0.5px solid ${tokens.border};
    border-radius: 14px;
    cursor: pointer;
    transition:
      border-color 0.2s,
      transform 0.18s,
      box-shadow 0.2s;
    overflow: hidden;

    .p-card-body,
    .p-card-content {
      padding: 0;
    }

    &:hover {
      transform: translateY(-2px);
      border-color: ${tokens.borderHover};
    }

    &:focus-visible {
      outline: 2px solid ${tokens.gold};
      outline-offset: 2px;
    }
  }
`;

/* ============================================================
   SHARED UI ATOMS
   ============================================================ */
export const ScreenRoot = styled.div`
  padding: 1.75rem 1.25rem 4rem;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.textDim};
  font-family: ${tokens.mono};
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.15s;

  &:hover {
    color: ${tokens.gold};
    ${neonGoldText}
  }
`;

export const Label = styled.p`
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${tokens.textFaint};
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.5px solid ${tokens.border};
`;

export const AccentBar = styled.div<{ $color: string }>`
  height: 3px;
  width: 100%;
  background: ${({ $color }) => $color};
`;

/* ============================================================
   EDIT MODE — appui long
   ============================================================ */

// Animation de la barre de progression pendant l'appui long
const fillProgress = keyframes`
  from { width: 0%; }
  to   { width: 100%; }
`;

export const LongPressBar = styled.div<{ $active: boolean; $duration: number }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${tokens.border};
  z-index: 100;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.15s;

  &::after {
    content: "";
    display: block;
    height: 100%;
    background: ${tokens.gold};
    box-shadow:
      0 0 8px ${tokens.goldGlow},
      0 0 20px ${tokens.goldGlow};
    width: 0%;
    animation: ${({ $active, $duration }) =>
      $active
        ? css`
            ${fillProgress} ${$duration}ms linear forwards
          `
        : "none"};
  }
`;

export const EditBadge = styled.div`
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  background: ${tokens.bgCard};
  border: 1px solid ${tokens.gold}66;
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${tokens.gold};
  ${neonGold}
  z-index: 99;
  pointer-events: none;
`;

/* ============================================================
   DRAG & DROP
   ============================================================ */
export const DragHandle = styled.div`
  color: ${tokens.textFaint};
  font-size: 0.85rem;
  cursor: grab;
  padding: 0 0.25rem;
  flex-shrink: 0;
  touch-action: none;
  transition: color 0.15s;

  &:active {
    cursor: grabbing;
  }
  &:hover {
    color: ${tokens.gold};
  }
`;

export const DraggingCard = styled.div`
  background: ${tokens.bgCard};
  border: 1px solid ${tokens.gold}66;
  border-radius: 10px;
  opacity: 0.95;
  ${neonGold}
`;

/* ============================================================
   REMOVE BUTTON (retirer song d'une liste)
   ============================================================ */
export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.textFaint};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem 0.3rem;
  border-radius: 4px;
  flex-shrink: 0;
  transition:
    color 0.15s,
    box-shadow 0.15s;
  line-height: 1;

  &:hover {
    color: ${tokens.red};
    ${neonRed}
  }
`;

/* ============================================================
   ADD SONGS DIALOG
   ============================================================ */
export const SongPickerRow = styled.div<{
  $checked: boolean;
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 0.5rem;
  border-bottom: 0.5px solid ${tokens.border};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  border-radius: 6px;
  transition: background 0.15s;

  ${({ $checked, $disabled }) =>
    $checked &&
    !$disabled &&
    css`
      background: ${tokens.goldFaint};
    `}

  &:hover {
    ${({ $disabled }) =>
      !$disabled &&
      css`
        background: ${tokens.bgHover};
      `}
  }
`;

export const CheckIcon = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid
    ${({ $checked }) => ($checked ? tokens.gold : tokens.textFaint)};
  background: ${({ $checked }) => ($checked ? tokens.gold : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  ${({ $checked }) =>
    $checked &&
    css`
      ${neonGold}
    `}

  .pi {
    font-size: 0.6rem !important;
    color: ${tokens.bg};
  }
`;
