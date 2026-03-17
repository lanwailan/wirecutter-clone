import React from 'react';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  rating: number;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  tags?: string[];
  isFeatured?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  excerpt,
  category,
  rating,
  author,
  date,
  readTime,
  image,
  tags = [],
  isFeatured = false,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article
      className={`card-hover overflow-hidden ${isFeatured ? 'border-2 border-primary-200' : ''} ${className}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {image && (
          <div className="md:w-1/3">
            <div className="relative h-48 md:h-full">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              {isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="badge-primary px-3 py-1 text-sm font-semibold">
                    Featured Review
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-6 ${image ? 'md:w-2/3' : 'w-full'}`}>
          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="badge bg-gray-100 text-gray-800">{category}</span>
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="badge bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
            <RatingStars rating={rating} size="sm" />
          </div>

          {/* Title */}
          <h3 className="heading-3 mb-3 line-clamp-2">
            <a href="#" className="hover:text-primary-600 transition-colors">
              {title}
            </a>
          </h3>

          {/* Excerpt */}
          <p className="text-body mb-4 line-clamp-3">{excerpt}</p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{author}</span>
              <span>{formatDate(date)}</span>
              <span>• {readTime} read</span>
            </div>
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Read Review →
            </a>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Helpful:</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Comments:</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Shares:</span>
                <span className="font-semibold">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;