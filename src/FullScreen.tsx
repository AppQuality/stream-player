import styled from "styled-components";
import { useVideoContext } from ".";

type i18nTexts = {
  enter?: React.ReactNode;
  exit?: React.ReactNode;
};

const i18nDefault: i18nTexts = {
  enter: "Enter Fullscreen",
  exit: "Exit Fullscreen",
};

interface FullScreenDocument extends Document {
  documentElement: FullScreenDocumentElement;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface FullScreenDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

const FullScreenButton = styled.div`
  user-select: none;
  cursor: pointer;
`;

const FullScreen = ({
  i18n,
  className,
}: {
  i18n?: i18nTexts;
  className?: string;
}) => {
  const { isFullScreen, setFullScreen } = useVideoContext();
  const doc = document as FullScreenDocument;
  const docEl = doc.documentElement as FullScreenDocumentElement;
  const texts = {
    ...i18nDefault,
    ...i18n,
  };

  const requestFullScreen = () => {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
      setFullScreen(true);
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
      setFullScreen(true);
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
      setFullScreen(true);
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
      setFullScreen(true);
    } else {
      console.error("Fullscreen API is not supported.");
    }
  };

  const exitFullScreen = () => {
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
      setFullScreen(false);
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
      setFullScreen(false);
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
      setFullScreen(false);
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
      setFullScreen(false);
    } else {
      console.error("Fullscreen API is not supported.");
    }
  };

  const fullScreenChanged = () => {
    if (
      doc.fullscreenElement ||
      doc.mozFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement
    ) {
      setFullScreen(true);
    } else {
      setFullScreen(false);
    }
  };

  document.addEventListener("fullscreenchange", fullScreenChanged);

  return (
    <FullScreenButton
      className={className}
      onClick={() => (isFullScreen ? exitFullScreen() : requestFullScreen())}
    >
      {isFullScreen ? texts.exit : texts.enter}
    </FullScreenButton>
  );
};

export default FullScreen;
