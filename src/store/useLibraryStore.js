/**
 * This is a Zustand Store that keeps track of the library information.
 * This enables global access of the list of decks. 
 * 
 */

import { create } from 'zustand';

const useLibraryStore = create((set, get) => ({
  deckList: [],
  setDeckList: (newDeckList) => set({ deckList: newDeckList }),
  addDeck: (newDeck) => set((state) => ({
    deckList: [...state.deckList, newDeck],
  })),
  // Selector function to get the deckName by deckId
  getDeckNameById: (deckId) => {
    return get().deckList.find((deck) => deck.deckId === deckId)?.deckName;
  },
}));

export default useLibraryStore;
