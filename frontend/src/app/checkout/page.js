'use client';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './checkout.css';
import Image from 'next/image';
import { fetchAPI } from '@/utils/api';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user, sunPoints, refetchUser } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    pointsUsed: 0,
  });

  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(subtotal);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const maxUsablePoints = Math.min(sunPoints || 0, subtotal);
    const appliedPoints = Math.min(formData.pointsUsed, maxUsablePoints);
    setDiscount(appliedPoints);
    setFinalTotal(subtotal - appliedPoints);
  }, [formData.pointsUsed, sunPoints, subtotal]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'pointsUsed' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('Authentication required');
  
      const orderData = {
        shipping_name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        sun_points_used: discount
      };
  
      const response = await fetchAPI('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
    
      // Verify successful response structure
      if (!response?.order_number) {
        throw new Error('Invalid order response from server');
      }
    
      // Success flow - clear cart before navigation
      clearCart();
      
      // Redirect to thankyou
      router.push(`/thankyou`);
      
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.data?.message || 
                          err.message || 
                          'Order failed. Please try again.';
      
      setError(errorMessage);
      
      console.error('Order submission failed:', {
        error: err,
        status: err.status,
        data: err.data
      });
      
      // Optionally re-fetch cart if error might have affected it
      // await refetchCart();
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <h1>Complete Your Solar Purchase</h1>
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <textarea id="address" value={formData.address} onChange={handleChange} rows="3" required></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input type="text" id="zip" value={formData.zip} onChange={handleChange} required />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input type="radio" name="payment" defaultChecked />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button type="submit" className="submit-order-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Your Order</h2>
          <div className="order-items">
            {items.map(item => (
              <div key={item.id} className="order-item">
                <Image 
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image_url}`} 
                alt={item.name}    
                className="item-image"
                width={500}
                height={500} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.price} THB × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span><span>{subtotal} THB</span></div>
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-row"><span>Sun Points</span><span>– {discount} THB</span></div>
            <div className="summary-row total"><span>Total</span><span>{finalTotal} THB</span></div>
          </div>

          <div className="sun-points-apply">
            <h3>Apply Sun Points</h3>
            <div className="points-input">
              <input
                type="number"
                id="pointsUsed"
                value={formData.pointsUsed}
                onChange={handleChange}
                min="0"
                max={Math.min(subtotal, sunPoints || 0)}
              />
              <button type="button" onClick={() => {}}>Apply</button>
            </div>
            <p className="points-info">
              You have {sunPoints ?? 0} sun points available ({sunPoints ?? 0} THB discount)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
