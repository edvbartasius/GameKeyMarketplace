import React from 'react';
import { SearchResult } from '../../utils/types';
import './SearchResultCard.css';

interface SearchResultCardProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onClick }) => {
  const discountPercent = result.has_discount ? result.discount_percentage : 0;
  const displayName = `${result.title} ${result.platform} Key ${result.region}`;

  return (
    <div className="search-result-card" onClick={() => onClick(result)}>
      <div className="search-result-image-wrapper">
        <img
          src={`images/${result.image_url}`}
          // src={result.image_url}
          alt={result.title}
          className="search-result-image"
        />
      </div>

      <div className="search-result-info">
        <div className="search-result-name">{displayName}</div>
        <div className="search-result-platform-region">
        </div>
      </div>

      <div className="search-result-price">
        {!result.has_keys ? (
          <div className="sold-out-badge-small">Sold Out</div>
        ) : (
          <>
            {result.has_discount ? (
              <div className="price-section">
                <div className="base-price-row">
                  <span className="from-text-small">From</span>
                  <span className="base-price-small">€{result.from_price.toFixed(2)}</span>
                </div>
                <div className="discounted-price-container">
                  <span className="discounted-price-small">
                    €{(result.from_price * (1 - discountPercent / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="price-section">
                <div className="regular-price-row">
                  <span className="from-text-small">From</span>
                </div>
                <div className="regular-price-container">
                  <span className="regular-price-small">€{result.from_price.toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
