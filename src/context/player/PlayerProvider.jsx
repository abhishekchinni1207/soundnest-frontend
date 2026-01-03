import { useEffect, useRef, useState, useCallback } from "react";
import { PlayerContext } from "./player.context";
import { supabase } from "../../services/supabase";
import { useAuth } from "../useAuth";
import api from "../../services/api";

const VOLUME_KEY = "soundnest_volume";

export function PlayerProvider({ children }) {
  /* 🎧 AUDIO */
  const audioRef = useRef(new Audio());

  /* 🔁 REFS */
  const queueRef = useRef([]);
  const indexRef = useRef(-1);
  const shuffleRef = useRef(false);
  const repeatRef = useRef("off");
  const lastReportedRef = useRef(0);

  /* 🎛 STATE */
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [source, setSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? Number(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState(false);

  const { user } = useAuth();

  /* 🔄 SYNC STATE → REFS */
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { indexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { shuffleRef.current = isShuffling; }, [isShuffling]);
  useEffect(() => { repeatRef.current = repeatMode; }, [repeatMode]);

  /* 🔊 VOLUME */
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume, isMuted]);

  /* ⏱ AUDIO EVENTS */
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  /* 📊 ANALYTICS (SAFE) */
  useEffect(() => {
    if (!currentTrack) return;
    if (isPlaying) return;
    if (currentTime < 15) return;

    if (lastReportedRef.current >= currentTime) return;
    lastReportedRef.current = currentTime;

    api.post("/analytics/listen", {
      trackId: currentTrack.id,
      playedSeconds: Math.floor(currentTime),
    }).catch(() => {});
  }, [isPlaying, currentTime, currentTrack]);

  /* 💾 RECENTLY PLAYED */
  const saveRecentlyPlayed = useCallback(async (track) => {
    if (!user || !track) return;

    await supabase
      .from("recently_played")
      .upsert(
        {
          user_id: user.id,
          track_id: track.id,
          played_at: new Date().toISOString(),
        },
        { onConflict: "user_id,track_id" }
      );
  }, [user]);

  /* 🚀 LOAD & PLAY */
  const loadTrackByIndex = useCallback((index, shouldPlay = true) => {
    const audio = audioRef.current;
    const track = queueRef.current[index];
    if (!track) return;

    setIsLoading(true);
    lastReportedRef.current = 0;

    audio.pause();
    audio.currentTime = 0;
    audio.src = track.audio_blob
      ? URL.createObjectURL(track.audio_blob)
      : track.audio_url;

    setCurrentTrack(track);
    setCurrentIndex(index);
    setCurrentTime(0);
    saveRecentlyPlayed(track);

    audio.oncanplay = () => {
      setIsLoading(false);
      if (shouldPlay) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };
  }, [saveRecentlyPlayed]);

  /* 🎶 PLAY HELPERS */
  const loadFromList = (list, index) => {
    setQueue(list);
    queueRef.current = list;
    loadTrackByIndex(index);
  };

  const playTrack = (track) => {
    setSource("single");
    loadFromList([track], 0);
  };

  const playQueue = (tracks, index = 0) => {
    setSource("playlist");
    loadFromList(tracks, index);
  };

  const playNext = () => {
    const q = queueRef.current;
    const i = indexRef.current;
    if (!q.length) return;

    if (shuffleRef.current) {
      let next;
      do {
        next = Math.floor(Math.random() * q.length);
      } while (next === i && q.length > 1);
      loadTrackByIndex(next);
      return;
    }

    if (i < q.length - 1) loadTrackByIndex(i + 1);
  };

  const playPrevious = () => {
    const i = indexRef.current;
    if (i > 0) loadTrackByIndex(i - 1);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seekTo = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleShuffle = () => setIsShuffling(p => !p);
  const toggleRepeat = () =>
    setRepeatMode(p => (p === "off" ? "all" : p === "all" ? "one" : "off"));

  const changeVolume = (v) => {
    const value = Math.min(1, Math.max(0, v));
    setVolume(value);
    if (value > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(p => !p);

  const resetPlayer = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.src = "";
    audio.currentTime = 0;

    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQueue([]);
    setCurrentIndex(-1);
    setSource(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        playQueue,
        playNext,
        playPrevious,
        togglePlay,
        seekTo,
        isShuffling,
        toggleShuffle,
        repeatMode,
        toggleRepeat,
        source,
        isLoading,
        audioRef,
        changeVolume,
        volume,
        toggleMute,
        isMuted,
        resetPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
