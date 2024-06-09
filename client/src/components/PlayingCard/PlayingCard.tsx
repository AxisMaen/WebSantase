import "./PlayingCard.css";
import { MouseEventHandler } from "react";
// @ts-ignore
import Card from "@heruka_urgyen/react-playing-cards/lib/TcN";

const deckType = "basic";

interface PlayingCardProps {
  rank: string;
  suit: string;
  height: string;
  isFaceUp: boolean;
  selected: boolean;
  handleClick?: MouseEventHandler<HTMLDivElement>;
}

const PlayingCard = (props: PlayingCardProps) => {
  return (
    <div
      className={props.selected ? "selected" : ""}
      data-key={props.rank + props.suit}
      onClick={props.handleClick}
    >
      <Card
        key={props.rank + props.suit}
        card={props.rank + props.suit}
        deckType={deckType}
        height={props.height}
        back={!props.isFaceUp}
      />
    </div>
  );
};

export default PlayingCard;
