import ProductGrid from '@/components/ProductGrid';
import './products.css';

export default function ProductsPage() {
  return (
    <main className="products-page">
      <div className="products-header">
        <h1>Solar Products Collection</h1>
        <p>Browse our eco-friendly solar-powered solutions</p>
      </div>
      <ProductGrid />
    </main>
  );
}