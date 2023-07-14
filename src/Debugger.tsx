import { useVideoContext } from ".";

const Debugger = () => {
  const { context } = useVideoContext();

  const { player, ...contextData } = context;

  let playerData: Omit<NonNullable<typeof player>, "ref"> & { player: string } =
    {
      totalTime: 0,
      currentTime: 0,
      player: "none",
    };
  if (player && player.ref.current) {
    playerData = {
      player: player.ref.current.toString(),
      totalTime: player.totalTime,
      currentTime: player.currentTime,
    };
  }

  return (
    <div>
      <h1>Debugger</h1>
      <pre>
        Player: <br />
        {JSON.stringify(playerData, null, 2)}
      </pre>
      <pre>{JSON.stringify(contextData, null, 2)}</pre>
    </div>
  );
};

export default Debugger;
