import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './InfoTooltip.css';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isHovered]);

  return (
    <>
      <div
        className="info-icon-wrapper"
        ref={iconRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="bi bi-info-circle info-icon"></span>
      </div>
      {isHovered && createPortal(
        <div
          className="info-tooltip info-tooltip-visible py-2 px-3"
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  );
};