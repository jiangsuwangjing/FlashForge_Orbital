/**
 * This is a Zustand Store that keeps track of the library information.
 * This enables global access of the list of decks. 
 * 
 */

import { create } from 'zustand';
import useGetDeckList from '../hooks/useGetDeckList';

const useLibraryStore = create((set) => ({
  deckList: [],
  setDeckList: (newDeckList) => set({ deckList: newDeckList }),
  addDeck: (newDeck) => set((state) => ({
    deckList: [...state.deckList, newDeck],
  })),
}));

export default useLibraryStore;
