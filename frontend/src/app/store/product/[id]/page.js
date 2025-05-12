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

export const metadata = {
  title: 'SoftEn Solar - Product',
  description: 'Empower your life with clean, affordable solar products.',
};

export default async function ProductDetailPage({ params }) {
  const paramsawaiter = await params;
  const product = await getProduct(paramsawaiter.id);
  return (
    <main className="product-detail-page">
      <div className="product-container">
        <div className="product-gallery">
          <Image 
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.image_url}`} 
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
              Sustainability: {product.sustainability_score}%
            </span>
            {product.solar_powered && (
              <span className="solar-badge">☀️ Solar Power</span>
            )}
          </div>
          
          <p className="price">{product.price} THB</p>
          <p className="description">{product.description}</p>
          
          <AddToCart product={product} />
          
          <div className="property-section">
            <h3>Product Properties</h3>
            <ul className="property-list">
              {Object.entries(product.property).map(([key, value]) => {
                return (
                  <li key={key}>
                    <strong>{key}:</strong>{" "}
                    {Array.isArray(value) ? (
                      <ul>
                        {value.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      value
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
