import { Outlet } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";

export default function ProtectedLayout() {
  return (
    <>
      <Outlet />
      <AudioPlayer />
    </>
  );
}
