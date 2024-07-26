import { create } from 'zustand';
import useGetDeckList from '../hooks/useGetDeckList';

/**
 * This is a store that keeps track of the shared decks from 
 * other users
 */
const useSharedDeckStore = create((set) => ({
  viewOnlyDecksList: [],
  editableDecksList: [],
  setViewOnlyDecksList: (newDeckList) => set({ viewOnlyDecksList: newDeckList }),
  setEditableDecksList: (newDeckList) => set({ editableDecksList: newDeckList })
}));

export default useSharedDeckStore;
