import React from 'react';
import { X, ZoomIn } from 'lucide-react';

const ImageLightbox = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 6, 4, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      {/* Top Bar with Close */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1110
      }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.imageUrl}
          alt={image.title}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(197, 155, 39, 0.4)'
          }}
        />

        {/* Caption */}
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          color: '#FAF7F2',
          maxWidth: '600px'
        }}>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            color: '#FFD166',
            marginBottom: '4px'
          }}>
            {image.title}
          </h4>
          {image.description && (
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {image.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
