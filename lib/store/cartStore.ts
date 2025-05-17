import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Product = {
  id: string;
  name: string;
  price: string; // Stored as string per Firestore schema
  quantity: number; // Quantity in cart (number)
  category: string;
  imageUrl?: string;
  desc?: string;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cart.find((item) => item.id === product.id);
          if (existingProduct) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: 1, // Initialize cart quantity as 1
                price: product.price, // Keep as string for consistency
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "beehive-cart-storage", // Unique key for localStorage, updated for beehive context
      storage: createJSONStorage(() => localStorage),
    }
  )
);