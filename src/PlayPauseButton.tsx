import React from "react";
import { useVideoContext } from ".";

type i18nTexts = {
  play?: React.ReactNode;
  pause?: React.ReactNode;
};

const i18nDefault: i18nTexts = {
  play: "Play",
  pause: "Pause",
};

const PlayPauseButton = ({
  i18n,
  className,
}: {
  i18n?: i18nTexts;
  className?: string;
}) => {
  const { context, togglePlay } = useVideoContext();
  const texts = {
    ...i18nDefault,
    ...i18n,
  };

  const { player, isPlaying } = context;

  if (!player || !player.ref.current) return null;

  return (
    <button
      className={`${className} ${isPlaying ? "play" : ""}`}
      onClick={() => togglePlay()}
    >
      {isPlaying ? texts.pause : texts.play}
    </button>
  );
};

export default PlayPauseButton;
