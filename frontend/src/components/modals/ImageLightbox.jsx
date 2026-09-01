import React from 'react';
import { X } from 'lucide-react';

const ImageLightbox = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 6, 4, 0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      {/* Top Bar with Close */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1110
      }}>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          aria-label="Close Lightbox"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        style={{
          maxWidth: '92vw',
          maxHeight: '84vh',
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
            maxHeight: '72vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            border: '1.5px solid rgba(197, 155, 39, 0.4)'
          }}
        />

        {/* Caption */}
        <div style={{
          marginTop: '0.75rem',
          textAlign: 'center',
          color: '#FAF7F2',
          maxWidth: '560px'
        }}>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            color: '#FFD166',
            marginBottom: '2px'
          }}>
            {image.title}
          </h4>
          {image.description && (
            <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
              {image.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
