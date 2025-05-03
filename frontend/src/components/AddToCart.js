'use client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`add-to-cart-btn ${added ? 'added' : ''}`}
    >
      <ShoppingCart size={20} />
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
