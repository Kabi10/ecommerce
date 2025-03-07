import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          return set({
            items: currentItems.map((i) => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        }
        
        set({ items: [...currentItems, item] });
      },
      
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        
        if (quantity <= 0) {
          return set({
            items: currentItems.filter((item) => item.id !== id),
          });
        }
        
        set({
          items: currentItems.map((item) => 
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      get totalPrice() {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCart; 