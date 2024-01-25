import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useVideoContext } from ".";

const ReactHlsPlayer = ({ className }: { className?: string }) => {
  const playerRef = useRef<HTMLVideoElement>(null);
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
    playerRef.current.addEventListener("loadedmetadata", () => {
      const player = playerRef?.current;
      if (!player) return;
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

      player.addEventListener("timeupdate", () => {
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
      });
    });
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
