import React, { useRef, useState, useEffect } from 'react';
import GameCards, { Game } from '../GameCards/GameCards';
import './HorizontalScrollContainer.css';

interface HorizontalScrollContainerProps {
  games: Game[];
}

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  games,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current?.querySelector('.row');
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current?.querySelector('.row');
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [games]);

  const getCardWidth = () => {
    const container = scrollContainerRef.current?.querySelector('.row');
    if (container) {
      const firstCard = container.querySelector('.col');
      if (firstCard) {
        return firstCard.getBoundingClientRect().width;
      }
    }
    return 0;
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current?.querySelector('.row');
    if (container) {
      const cardWidth = getCardWidth();
      const scrollAmount = cardWidth > 0 ? cardWidth : container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="horizontal-scroll-wrapper px-0 mx-0">
      {canScrollLeft && (
        <button
          className="scroll-arrow scroll-arrow-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          &#8249;
        </button>
      )}
      {canScrollRight && (
        <button
          className="scroll-arrow scroll-arrow-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          &#8250;
        </button>
      )}
      <div className="horizontal-scroll-content" ref={scrollContainerRef}>
        <GameCards games={games} />
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;