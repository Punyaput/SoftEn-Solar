'use client';
import Link from 'next/link';
import { Leaf, Heart, Sun } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Sun className="footer-icon" />
          <span className="footer-text">CN334 Web Application Development ☀️</span>
        </div>

        <div className="footer-right">
          <p className="footer-description">
            Made with Django and NextJS <Heart className="heart-icon" /> <Leaf className="leaf-icon" />
          </p>
          <p className="footer-description">
            &copy; {new Date().getFullYear()} SoftEn Solar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

