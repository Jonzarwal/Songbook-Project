import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./shared/styles";
import Home from "./screens/Home";
import ListScreen from "./screens/ListScreen";
import SongScreen from "./screens/SongScreen";
import OrphanScreen from "./screens/OrphanScreen";

export default function App() {
  // L'état editMode vit ici pour être partagé entre Home et ListScreen
  const [editMode, setEditMode] = useState(false);

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={<Home editMode={editMode} setEditMode={setEditMode} />}
        />
        <Route
          path="/list/:listId"
          element={<ListScreen editMode={editMode} />}
        />
        <Route path="/list/:listId/song/:songId" element={<SongScreen />} />
        <Route path="/orphans" element={<OrphanScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
