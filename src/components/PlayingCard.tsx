import { useState } from "react";
// @ts-ignore
import Card from "@heruka_urgyen/react-playing-cards/lib/TcN"

const deckType = 'basic'

interface PlayingCardProps {
    rank: string;
    suit: string;
    height: string;
}

export const PlayingCard = (props: PlayingCardProps) => {
    const [isFaceUp, setCardDirection] = useState(true);

    const toggleCardDirection = (e: any) => {
        setCardDirection(!isFaceUp);
    }

    return <div onClick={toggleCardDirection}><Card key={props.rank+props.suit} card={props.rank+props.suit} deckType={deckType} height={props.height} back={!isFaceUp}/></div>;
};