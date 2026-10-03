import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'sportshop_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product._id && i.size === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          size,
          quantity,
        },
      ];
    });
  };

  const removeItem = (productId, size) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
