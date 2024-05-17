import React from 'react';
import logo from './logo.svg';
import './App.css';
// @ts-ignore
import Card from "@heruka_urgyen/react-playing-cards/lib/TcN"

function App() {

  const deckType = 'basic'

  const suits = ["h", "d", "c", "s"];
  const ranks = ["9", "T", "J", "Q", "K", "A"];

  // create deck of card components for the game
  let deck: React.JSX.Element[] = [];
  for(const suit of suits) {
    for(const rank of ranks) {
      deck.push(<Card key={rank+suit} card={rank+suit} deckType={deckType} height="200px" />)
    }
  }

  // TODO: we need to shuffle the deck
  return (
    <div className="App">
      {deck}
    </div>
  );
}

export default App;
