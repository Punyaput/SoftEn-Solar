import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <main className="main-content">
      <section className="hero-section">
        <h1>☀️ Solar Powered Goods for a Brighter Future</h1>
        <p>
          Empower your life with clean, affordable solar products. <br></br> 🌿 Earn Sun Points by checking in every morning!
        </p>
      </section>

      <section className="featured-products">
        <h2>🌟 Featured Products</h2>
        <ProductGrid />
      </section>
    </main>
  );
}