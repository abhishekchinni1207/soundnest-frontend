import { useContext } from "react";
import { PlayerContext } from "./player.context";

export function usePlayer() {
  return useContext(PlayerContext);
}
