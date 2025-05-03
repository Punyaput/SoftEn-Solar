import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import './styles.css';

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body>
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </CartProvider>
  );
}