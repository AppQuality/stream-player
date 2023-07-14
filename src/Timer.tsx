import { useVideoContext } from ".";

const secondsToTime = (secs: number) => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = Math.ceil((secs % 3600) % 60);

  let result = [];
  if (hours) {
    result.push(`${hours < 10 ? "0" : ""}${hours}`);
  }
  if (minutes) {
    result.push(`${minutes < 10 ? "0" : ""}${minutes}`);
  } else {
    result.push("00");
  }
  if (seconds) {
    result.push(`${seconds < 10 ? "0" : ""}${seconds}`);
  } else {
    result.push("00");
  }
  return result.join(":");
};

const Timer = ({
  className,
  pattern = "%current% / %total%",
}: {
  className?: string;
  /**
   * How to template the timer string.
   *
   * You can use %current% for current time and %total% for total time.
   *
   * Both values refer the part time */
  pattern?: string;
}) => {
  const { context } = useVideoContext();
  const { part } = context;

  return (
    <div className={className}>
      {pattern
        .replace("%current%", secondsToTime(Math.floor(part.time)))
        .replace("%total%", secondsToTime(Math.floor(part.duration)))}
    </div>
  );
};

export default Timer;
