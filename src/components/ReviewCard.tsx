import React from 'react';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  title: string;
  category: string;
  rating: number;
  pros: string[];
  cons: string[];
  slug: string;
  image?: string;
  lang?: string;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  category,
  rating,
  pros,
  cons,
  slug,
  image,
  lang = 'en',
  className = '',
}) => {
  return (
    <a 
      href={slug}
      className={`block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
            {category}
          </span>
          <div className="flex items-center">
            <RatingStars rating={rating} />
            <span className="ml-2 font-semibold">{rating}/5</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>
        
        {/* 优缺点摘要 */}
        <div className="space-y-2 mb-4">
          {pros.length > 0 && (
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              <span className="text-sm text-gray-700 line-clamp-2">{pros[0]}</span>
            </div>
          )}
          {pros.length > 1 && (
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              <span className="text-sm text-gray-700 line-clamp-2">{pros[1]}</span>
            </div>
          )}
          {cons.length > 0 && (
            <div className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">✗</span>
              <span className="text-sm text-gray-700 line-clamp-2">{cons[0]}</span>
            </div>
          )}
        </div>
        
        <div className="text-primary-600 font-medium text-sm">
          Read Review →
        </div>
      </div>
    </a>
  );
};

export default ReviewCard;