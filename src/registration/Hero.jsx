import React from 'react'
import CreateDeck from '../flashcards/CreateDeck'
import CreateCard from '../flashcards/CreateCard'
import Deck from '../flashcards/Deck'

export const Hero = ({handleLogout}) => {
  return (
    <div className="hero">
      <nav>
        <h2>Welcome</h2>
        <button onClick={handleLogout}>Logout</button>
        <div>
          <CreateDeck />
          <CreateCard />
          <Deck />
        </div>
      </nav>
    </div>
  )
}
