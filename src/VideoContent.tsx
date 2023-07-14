import styled from "styled-components";
import { useVideoContext } from ".";

const Content = styled.div<{
  isFullScreen?: boolean;
}>`
  position: relative;
  display: flex;

  ${({ isFullScreen }) =>
    isFullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    `}
`;

export const VideoContent = ({
  children,
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { isFullScreen } = useVideoContext();

  return <Content isFullScreen={isFullScreen}>{children}</Content>;
};
