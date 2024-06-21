import React from 'react'
import CreateCard from '../flashcards/CreateCard'
import CreateDeck from '../flashcards/CreateDeck'
import Library from '../flashcards/Library'
import Deck from '../flashcards/Deck'
import useShowToast from '../hooks/useShowToast'

export const Hero = ({handleLogout}) => {
  const showToast = useShowToast();
  showToast("Welcome", "you are logged in", "success")

  return (
    <div className="hero">
      <nav>
        <h2>Welcome</h2>
        <button onClick={handleLogout}>Logout</button>
        <div>
          <CreateDeck />
          {/* this is a demo: create cards into the deck called 'first deck' */}
          <CreateCard deckName={'first deck'}/>
          <Library />
          {/* this is a demo: list all cards in the deck called 'first deck' */}
          <Deck deckName={'first deck'}/>
        </div>
      </nav>
    </div>
  )
}
