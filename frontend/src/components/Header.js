// components/Header.js
'use client';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useCart } from '@/context/CartContext';
import { Sun } from 'lucide-react';

export default function Header() {
  const { user, logout } = useUser(); // Destructure logout from useUser
  const { items } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <Sun className="sun-icon" />
          SoftEn Solar
        </Link>

        <nav className="nav-links">
          <Link href="/store/products" className="nav-link">
            Shop
          </Link>
          <Link href="/cart" className="nav-link cart-link">
            Cart
            {items.length > 0 && (
              <span className="cart-count">!</span>
            )}
          </Link>
          {user ? (
            <>
              <Link href="/account/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}