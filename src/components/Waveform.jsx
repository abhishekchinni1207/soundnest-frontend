import { useEffect, useRef } from "react";
import { usePlayer } from "../context/player/usePlayer";

const MAX_BAR_HEIGHT = 32;
const BAR_GAP = 1.5;
const SMOOTHING = 0.12;

export default function Waveform({ track }) {
  const canvasRef = useRef(null);
  const animatedPeaksRef = useRef([]);
  const rafRef = useRef(null);

  const { currentTime, duration, seekTo, currentTrack } = usePlayer();

  useEffect(() => {
    // ✅ SAFE GUARD INSIDE EFFECT
    if (!currentTrack || !track?.waveform_peaks?.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const peaks = track.waveform_peaks;
    const max = Math.max(...peaks, 1);
    const normalized = peaks.map((p) => p / max);

    if (animatedPeaksRef.current.length !== normalized.length) {
      animatedPeaksRef.current = [...normalized];
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const progress = duration ? currentTime / duration : 0;
      const progressX = width * progress;
      const barWidth = width / normalized.length;

      normalized.forEach((target, i) => {
        animatedPeaksRef.current[i] +=
          (target - animatedPeaksRef.current[i]) * SMOOTHING;

        const value = animatedPeaksRef.current[i];
        const barHeight = Math.max(6, value * MAX_BAR_HEIGHT);
        const x = i * barWidth;
        const y = centerY - barHeight / 2;

        ctx.fillStyle = "rgba(34,197,94,0.25)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - BAR_GAP, barHeight, 6);
        ctx.fill();

        if (x < progressX) {
          ctx.fillStyle = "#facc15";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - BAR_GAP, barHeight, 6);
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [track, currentTrack, currentTime, duration]);

  /* ✅ CONDITIONAL RENDER HERE (SAFE) */
  if (!currentTrack || !track?.waveform_peaks?.length) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[48px] cursor-pointer select-none"
      onClick={(e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        seekTo((x / rect.width) * duration);
      }}
    />
  );
}
