import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useVideoContext } from ".";

const ReactHlsPlayer = ({
  className,
  increaseTimePrecision,
}: {
  className?: string;
  increaseTimePrecision?: boolean;
}) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    context,
    setContext,
    setIsPlaying,
    setPlayer,
    setPart,
    togglePlay,
    isStreamable,
  } = useVideoContext();
  const { isPlaying, part } = context;
  const { start, end } = part;

  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    const handleTimeUpdate = () => {
      const endTime = end > 0 && end < player.duration ? end : player.duration;
      setPlayer((prev) =>
        prev
          ? {
              ...prev,
              currentTime: player.currentTime,
            }
          : undefined
      );

      if (player.currentTime > endTime) {
        player.pause();
        setIsPlaying(false);
      }
    };

    const startRegularUpdate = () => {
      intervalRef.current = setInterval(() => {
        setPlayer((prev) =>
          prev
            ? {
                ...prev,
                currentTime: player.currentTime,
              }
            : undefined
        );
      }, 100); // Update every 100 ms
    };

    const handleStopInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    player.addEventListener("loadedmetadata", () => {
      const endTime = end > 0 && end < player.duration ? end : player.duration;
      setPlayer({
        ref: playerRef,
        totalTime: player.duration,
        currentTime: player.currentTime,
      });
      setPart((prev) => ({
        ...prev,
        start: start < player.duration ? start : 0,
        end: endTime,
      }));

      player.addEventListener("timeupdate", () => handleTimeUpdate);
      if (increaseTimePrecision) {
        player.addEventListener("pause", () => handleStopInterval);
        player.addEventListener("play", () => startRegularUpdate);
        player.addEventListener("ended", () => handleStopInterval);
      }
    });

    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
      if (increaseTimePrecision) {
        player.removeEventListener("pause", handleStopInterval);
        player.removeEventListener("play", startRegularUpdate);
        player.removeEventListener("ended", handleStopInterval);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerRef, setPlayer, end, start, setPart, setIsPlaying]);

  useEffect(() => {
    const player = context.player?.ref?.current;
    if (!player) return;
  }, [context, setIsPlaying, end]);

  useEffect(() => {
    const mediaElement = context.player?.ref?.current;
    if (!mediaElement) return;
    mediaElement.currentTime = start;
  }, [context.player?.ref, start]);

  useEffect(() => {
    let hls: Hls;

    function _initPlayer() {
      if (!isStreamable) return;
      if (hls != null) {
        hls.destroy();
      }

      const newHls = new Hls({
        enableWorker: false,
        xhrSetup: function (xhr) {
          xhr.withCredentials = true; // do send cookies
        },
      });

      if (playerRef.current != null) {
        newHls.attachMedia(playerRef.current);
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(context.src);
      });
      newHls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls = newHls;
    }

    // Check for Media Source support
    if (Hls.isSupported()) {
      _initPlayer();
    }

    return () => {
      if (hls != null) {
        hls.destroy();
      }
    };
  }, [playerRef, context.src, setContext]);

  return (
    <div
      onClick={() => togglePlay()}
      className={`${className} ${isPlaying ? "playing" : "paused"}`}
    >
      {Hls.isSupported() && isStreamable ? (
        <video ref={playerRef} />
      ) : (
        <video ref={playerRef} src={context.src} />
      )}
    </div>
  );
};

export default ReactHlsPlayer;
