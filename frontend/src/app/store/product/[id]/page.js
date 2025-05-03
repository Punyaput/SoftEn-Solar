import AddToCart from '@/components/AddToCart';
import './product-detail.css';
import Image from 'next/image';

async function getProduct(id) {
  const res = await fetch(`http://localhost:8000/api/products/${id}/`);
  return res.json();
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  return (
    <main className="product-detail-page">
      <div className="product-container">
        <div className="product-gallery">
          <Image 
            src={product.image_url} 
            alt={product.name}
            className="main-image"
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
          
          <p className="price">${product.price}</p>
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