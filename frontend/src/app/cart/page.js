'use client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation'; // ✅ Import router
import './cart.css';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter(); // ✅ Initialize router
  const { items, removeItem, updateQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const goToCheckout = () => {
    router.push('/checkout'); // ✅ Redirect to checkout
  };

  return (
    <main className="cart-page">
      <h1>Your Solar Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/store/products" className="shop-link">
            Browse Solar Products
          </a>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Image 
                  src={`http://backend:8000${item.image_url}`} 
                  alt={item.name}
                  className="item-image"
                  width={500}
                  height={500}
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <button className="checkout-btn" onClick={goToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
