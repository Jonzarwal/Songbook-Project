import styled, { createGlobalStyle, css } from "styled-components";
import { Card } from "primereact/card";

/* ============================================================
   TOKENS
   ============================================================ */
export const tokens = {
  bg: "#0a0a0a",
  bgCard: "#1f1f1f",
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
   SLIDE TRANSITION
   ============================================================ */
export const SlideContainer = styled.div<{
  $sliding: boolean;
  $direction: "forward" | "back";
}>`
  display: flex;
  width: 100%;
  min-height: 100dvh;
  ${({ $sliding, $direction }) =>
    $sliding &&
    css`
      animation: ${$direction === "forward" ? "slideForward" : "slideBack"}
        320ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}

  @keyframes slideForward {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }
  @keyframes slideBack {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

export const SlidePane = styled.div<{ $isOut?: boolean; $isBack?: boolean }>`
  flex: 0 0 100%;
  width: 100%;
  min-height: 100dvh;
  overflow-y: auto;
  ${({ $isBack }) =>
    $isBack &&
    css`
      order: -1;
    `}
`;

/* ============================================================
   BASE CARD  (ListCard et SongCard en héritent)
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
