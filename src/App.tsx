import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PlayingCard } from './components/PlayingCard';

function App() {

  const suits = ["h", "d", "c", "s"];
  const ranks = ["9", "T", "J", "Q", "K", "A"];

  // create deck of card components for the game
  let deck: React.JSX.Element[] = [];
  for(const suit of suits) {
    for(const rank of ranks) {
      deck.push(<PlayingCard key={rank+suit} suit={suit} rank={rank} height="150px"/>)
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
