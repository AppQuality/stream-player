import { createContext, useContext, useMemo, useState } from "react";
import ChangeTime from "./ChangeTime";
import FullScreen from "./FullScreen";
import Mute from "./Mute";
import PlayPauseButton from "./PlayPauseButton";
import Player from "./Player";
import ProgressBar from "./ProgressBar";
import Timer from "./Timer";

type PlayerType = {
  ref: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  totalTime: number;
};

type VideoContextType = {
  src: string;
};

type VideoContextObject = {
  context: VideoContextType & {
    isPlaying: boolean;
    part: { start: number; end: number; duration: number; time: number };
    player?: PlayerType;
  };
  setContext: (
    context:
      | VideoContextType
      | ((context: VideoContextType) => VideoContextType)
  ) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  isFullScreen: boolean;
  setFullScreen: (enabled: boolean) => void;
  isMuted: boolean;
  setMuted: (enabled: boolean) => void;
  setPart: (
    part:
      | { start: number; end: number }
      | ((prev: { start: number; end: number }) => {
          start: number;
          end: number;
        })
  ) => void;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerType | undefined>>;
};

const VideoContext = createContext<VideoContextObject | null>(null);

const Video = ({
  src,
  start,
  end,
  children,
}: {
  src: string;
  start?: number;
  end?: number;
  children: React.ReactNode;
}) => {
  const [context, setContext] = useState<VideoContextType>({
    src,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [player, setPlayer] = useState<PlayerType>();
  const [part, setPart] = useState<{ start: number; end: number }>({
    start: start ?? 0,
    end: end ?? 0,
  });

  const contextValue = useMemo(
    () => ({
      context: {
        ...context,
        totalTime: player?.totalTime ?? 0,
        player,
        part: {
          ...part,
          duration: part.end - part.start,
          time: player?.currentTime ? player?.currentTime - part.start : 0,
        },
        isPlaying,
        togglePlay: () => {
          if (!player?.ref) return;
          const video = player.ref.current!;
          if (
            !!(
              video.currentTime > 0 &&
              !video.paused &&
              !video.ended &&
              video.readyState > 2
            )
          ) {
            video.pause();
            setIsPlaying(false);
          } else {
            if (video.currentTime >= part.end) {
              video.currentTime = part.start;
            }
            video.play();
            setIsPlaying(true);
          }
        },
      },
      togglePlay: () => {
        if (!player?.ref) return;
        const video = player.ref.current!;
        if (
          !!(
            video.currentTime > 0 &&
            !video.paused &&
            !video.ended &&
            video.readyState > 2
          )
        ) {
          video.pause();
          setIsPlaying(false);
        } else {
          if (video.currentTime >= part.end) {
            video.currentTime = part.start;
          }
          video.play();
          setIsPlaying(true);
        }
      },
      setCurrentTime: (time: number) => {
        if (!player?.ref) return;
        const video = player.ref.current!;
        video.currentTime = time;
      },
      isFullScreen,
      setFullScreen: (enabled: boolean) => {
        setIsFullScreen(enabled);
      },
      isMuted: player?.ref.current?.muted ?? false,
      setMuted: (enabled: boolean) => {
        if (!player?.ref) return;
        const video = player.ref.current!;
        video.muted = enabled;
      },
      setContext,
      setPlayer,
      setIsPlaying,
      setPart,
    }),
    [context, isPlaying, player, part, isFullScreen]
  );

  return (
    //@ts-ignore
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);

  if (!context) throw new Error("Provider not found for VideoContext");

  return context; // Now we can use the context in the component, SAFELY.
};

Video.Player = Player;
Video.ProgressBar = ProgressBar;
Video.PlayPauseButton = PlayPauseButton;
Video.Timer = Timer;
Video.Mute = Mute;
Video.FullScreen = FullScreen;
Video.ChangeTime = ChangeTime;

export default Video;
