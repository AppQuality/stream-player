import styled from "styled-components";
import { useVideoContext } from ".";

type i18nTexts = {
  on?: React.ReactNode;
  off?: React.ReactNode;
};

const i18nDefault: i18nTexts = {
  on: "Mute On",
  off: "Mute Off",
};

const MuteButton = styled.div`
  user-select: none;
  cursor: pointer;
`;

const Mute = ({
  i18n,
  className,
}: {
  i18n?: i18nTexts;
  className?: string;
}) => {
  const { isMuted, setMuted } = useVideoContext();
  const texts = {
    ...i18nDefault,
    ...i18n,
  };

  return (
    <MuteButton className={className} onClick={() => setMuted(!isMuted)}>
      {isMuted ? texts.on : texts.off}
    </MuteButton>
  );
};

export default Mute;
