import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { PlayerProvider } from "./context/player/PlayerProvider";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import AdminUpload from "./pages/AdminUpload";
import AdminRoute from "./components/AdminRoute";
import Analytics from "./pages/Analytics";

import AuthLayout from "./layouts/AuthLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>

            {/* AUTH PAGES (NO PLAYER) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* PROTECTED PAGES (WITH PLAYER) */}
            <Route
              element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
              <Route path="/analytics" element={<Analytics />} />

              <Route
                path="/admin/upload"
                element={
                  <AdminRoute>
                    <AdminUpload />
                  </AdminRoute>
                }
              />
            </Route>

          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
