'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './product-grid.css';
import { fetchAPI } from '@/utils/api';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI(`/api/products`)
      .then(data => {
        setProducts(data);
        setLoading(false);
        console.log(data);
      });
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <Link href={`/store/product/${product.id}`} key={product.id} className="product-card">
          <div className="image-container">
            {product.image_url ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.image_url}`}
                alt={product.name}
                width={500}
                height={500}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}
          </div>
          <div className="product-details">
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">{product.price} THB</p>
            <div className="product-tags">
              <span className="product-score">
                Eco Score: {product.sustainability_score}%
              </span>
              {product.solar_powered && (
                <span className="solar-powered-tag">☀️ Solar Power</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
