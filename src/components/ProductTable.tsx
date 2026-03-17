import React from 'react';
import RatingStars from './RatingStars';

interface Product {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  features: string[];
  pros: string[];
  cons: string[];
  link: string;
  image?: string;
}

interface ProductTableProps {
  products: Product[];
  columns?: string[];
  className?: string;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  columns = ['Product', 'Rating', 'Price', 'Key Features', 'Pros & Cons'],
  className = '',
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="product-table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="text-left py-4 px-4 bg-gray-50">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              {/* Product Column */}
              <td className="py-4 px-4">
                <div className="flex items-start space-x-4">
                  {product.image && (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      <a
                        href={product.link}
                        className="hover:text-primary-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {product.name}
                      </a>
                    </h3>
                    <span className="text-sm text-gray-600">{product.category}</span>
                    <div className="mt-2">
                      <RatingStars rating={product.rating} size="sm" />
                    </div>
                  </div>
                </div>
              </td>

              {/* Rating Column */}
              <td className="py-4 px-4">
                <div className="flex flex-col items-center">
                  <RatingStars rating={product.rating} size="md" showNumber={false} />
                  <span className="mt-1 text-lg font-bold text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">out of 5</span>
                </div>
              </td>

              {/* Price Column */}
              <td className="py-4 px-4">
                <div className="text-center">
                  <span className="price-tag text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <div className="mt-2">
                    <a
                      href={product.link}
                      className="btn-primary inline-block text-sm px-4 py-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Check Price
                    </a>
                  </div>
                </div>
              </td>

              {/* Features Column */}
              <td className="py-4 px-4">
                <ul className="space-y-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  {product.features.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{product.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </td>

              {/* Pros & Cons Column */}
              <td className="py-4 px-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-1">Pros</h4>
                    <ul className="space-y-1">
                      {product.pros.slice(0, 2).map((pro, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-1">Cons</h4>
                    <ul className="space-y-1">
                      {product.cons.slice(0, 2).map((con, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;