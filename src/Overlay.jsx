import React from 'react';

const overlayBase = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function GreenOverlay() {
  return (
    <div
      style={{
        ...overlayBase,
        background: 'linear-gradient(to bottom, rgba(34, 139, 34, 0.9) 0%, rgba(34, 139, 34, 0.85) 30%, transparent 55%)',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: 'min(10vw, 48px)',
      }}
    >
      <span
        style={{
          fontSize: 'clamp(1.5rem, 6vw, 2rem)',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}
      >
        Hotdog
      </span>
      <div
        style={{
          width: 'clamp(56px, 18vw, 80px)',
          height: 'clamp(56px, 18vw, 80px)',
          borderRadius: '50%',
          border: '4px solid #fff',
          background: 'rgba(34, 139, 34, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 8,
          color: '#fff',
          fontSize: 'clamp(1.75rem, 8vw, 2.5rem)',
        }}
      >
        ✓
      </div>
    </div>
  );
}

export function RedOverlay() {
  return (
    <div
      style={{
        ...overlayBase,
        background: 'linear-gradient(to top, rgba(180, 0, 0, 0.9) 0%, rgba(180, 0, 0, 0.9) 35%, transparent 55%)',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 'min(10vw, 48px)',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 'clamp(56px, 18vw, 80px)',
          height: 'clamp(56px, 18vw, 80px)',
          borderRadius: '50%',
          border: '4px solid #fff',
          background: 'rgba(180, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 'clamp(1.75rem, 8vw, 2.5rem)',
        }}
      >
        ✕
      </div>
      <span
        style={{
          fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}
      >
        Not hotdog
      </span>
    </div>
  );
}
