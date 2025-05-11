// app/store/product/[id]/page.js
import AddToCart from '@/components/AddToCart';
import './product-detail.css';
import Image from 'next/image';
import { fetchAPI } from '@/utils/api';

async function getProduct(id) {
  const product = await fetchAPI(`/api/products/${id}/`);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
}

export default async function ProductDetailPage({ params }) {
  const paramsawaiter = await params;
  const product = await getProduct(paramsawaiter.id);
  return (
    <main className="product-detail-page">
      <div className="product-container">
        <div className="product-gallery">
          <Image 
            src={`http://backend:8000${product.image_url}`} 
            alt={product.name}
            className="main-image"
            width={500}
            height={500}
          />
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="badges">
            <span className="sustainability-badge">
              Sustainability: {product.sustainability_score}/100
            </span>
            {product.solar_powered && (
              <span className="solar-badge">☀️ Solar Powered</span>
            )}
          </div>
          
          <p className="price">{product.price} THB</p>
          <p className="description">{product.description}</p>
          
          <AddToCart product={product} />
          
          <div className="impact-section">
            <h3>Environmental Impact</h3>
            <ul className="impact-list">
              <li>Reduces CO2 emissions by X kg/year</li>
              <li>Saves Y kWh of energy annually</li>
              <li>Equivalent to planting Z trees</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
