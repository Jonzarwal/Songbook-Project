import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./shared/styles";
import Home from "./screens/Home";
import ListScreen from "./screens/ListScreen";
import SongScreen from "./screens/SongScreen";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list/:listId" element={<ListScreen />} />
        <Route path="/list/:listId/song/:songId" element={<SongScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
