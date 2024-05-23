import { MouseEventHandler } from "react";
// @ts-ignore
import Card from "@heruka_urgyen/react-playing-cards/lib/TcN";

const deckType = "basic";

interface PlayingCardProps {
  rank: string;
  suit: string;
  height: string;
  handleClick?: MouseEventHandler<HTMLDivElement>;
}

export const PlayingCard = (props: PlayingCardProps) => {
  return (
    <div data-key={props.rank + props.suit} onClick={props.handleClick}>
      <Card
        key={props.rank + props.suit}
        card={props.rank + props.suit}
        deckType={deckType}
        height={props.height}
      />
    </div>
  );
};
