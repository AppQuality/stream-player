import { useRef } from "react";
import styled from "styled-components";
import { useVideoContext } from ".";

const ProgressBar = styled.div<{ progress?: number }>`
  height: 10px;
  width: 100%;
  background-color: #ccc;
  position: relative;
  overflow: hidden;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #f00;
    width: ${({ progress }) => progress}%;
  }
`;

const ProgressBarComponent = ({ className }: { className?: string }) => {
  const { context } = useVideoContext();
  const progressRef = useRef<HTMLDivElement>(null);
  const { part } = context;

  const getVideoPositionFromEvent = (clientX: number) => {
    if (
      progressRef &&
      progressRef.current &&
      context.player &&
      context.player.totalTime
    ) {
      const bounds = progressRef.current.getBoundingClientRect();
      const x = clientX - bounds.left;
      const videoPositionSecs =
        context.part.start +
        (x / progressRef.current.clientWidth) * context.part.duration;
      return videoPositionSecs;
    }

    return 0;
  };

  const progress = (part.time / part.duration) * 100;
  return (
    <ProgressBar
      onClick={(event) => {
        if (context.player && context.player.ref.current) {
          const time = getVideoPositionFromEvent(event.clientX);
          context.player.ref.current.currentTime = time;
        }
      }}
      ref={progressRef}
      className={className}
      progress={progress}
    />
  );
};

export default ProgressBarComponent;
