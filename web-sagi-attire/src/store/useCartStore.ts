import { create } from "zustand";
import { CartItem } from "../types/Product";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

const getInitialCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

export const useCartStore = create<CartState>((set) => ({
  items: getInitialCart(),
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.id === item.id && i.size === item.size
      );
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      const result = { items: [...state.items, item] };
      localStorage.setItem("cart", JSON.stringify(result));
      return result;
    }),
  removeItem: (id) =>
    set((state) => {
      const removedItem = state.items.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(removedItem));
      return {
        items: removedItem,
      };
    }),
  updateQuantity: (id, size, quantity) =>
    set((state) => {
      const udpatedItem = state.items.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(udpatedItem));
      return { items: udpatedItem };
    }),
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cart");
      return { items: [] };
    }),
}));

useCartStore.subscribe((state) => {
  localStorage.setItem("cart", JSON.stringify(state.items));
});
