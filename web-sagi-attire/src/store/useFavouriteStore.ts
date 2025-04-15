import { create } from "zustand";
import { CartItem } from "../types/Product";

interface itemsState {
  items: CartItem[];
  addFav: (item: CartItem) => void;
  removeFav: (id: string) => void;
  clearFav: () => void;
}

const getInitialCart = () => {
  try {
    const cart = localStorage.getItem("fav");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

export const useFavouriteStore = create<itemsState>((set) => ({
  items: getInitialCart(),
  addFav: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        const removedItem = state.items.filter(
          (item) => item.id !== existingItem.id
        );
        localStorage.setItem("fav", JSON.stringify(removedItem));
        return {
          items: removedItem,
        };
      }
      const result = { items: [...state.items, item] };
      localStorage.setItem("fav", JSON.stringify(result));
      return result;
    }),
  removeFav: (id) =>
    set((state) => {
      const removedItem = state.items.filter((item) => item.id !== id);
      localStorage.setItem("fav", JSON.stringify(removedItem));
      return {
        items: removedItem,
      };
    }),
  clearFav: () =>
    set(() => {
      localStorage.removeItem("fav");
      return { items: [] };
    }),
}));

useFavouriteStore.subscribe((state) => {
  localStorage.setItem("fav", JSON.stringify(state.items));
});
