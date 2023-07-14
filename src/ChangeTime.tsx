import styled from "styled-components";
import { useVideoContext } from ".";

type i18nTexts = {
  icon?: React.ReactNode;
};

const Element = styled.div`
  user-select: none;
  cursor: pointer;
`;

const ChangeTime = ({
  value,
  i18n,
  className,
}: {
  value: number;
  i18n?: i18nTexts;
  className?: string;
}) => {
  const {
    context: { player, part },
    setCurrentTime,
  } = useVideoContext();

  if (!player) return null;

  return (
    <Element
      className={className}
      onClick={() => {
        if (player.currentTime + value < part.start) {
          setCurrentTime(part.start);
          return;
        }

        if (player.currentTime + value > part.end) {
          setCurrentTime(part.end);
          return;
        }

        setCurrentTime(player.currentTime + value);
      }}
    >
      {i18n?.icon ?? (
        <>
          {value > 0 ? "+" : ""}
          {value}
        </>
      )}
    </Element>
  );
};

export default ChangeTime;
