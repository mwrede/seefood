import React, { useRef, useState, useEffect } from 'react';
import { runWorkflow } from './api';
import { GreenOverlay, RedOverlay } from './Overlay';
import './App.css';

export default function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | true (hotdog) | false (not hotdog)
  const [photoDataUrl, setPhotoDataUrl] = useState('');

  useEffect(() => {
    let stream = null;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError('');
      } catch (e) {
        setError('Camera access is needed to take photos.');
      }
    }
    start();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || result !== null) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setLoading(true);
    setError('');
    setPhotoDataUrl(dataUrl);

    try {
      const { isHotdog } = await runWorkflow(dataUrl);
      setResult(isHotdog);
    } catch (e) {
      setError(e.message || 'Inference failed.');
      setPhotoDataUrl('');
    } finally {
      setLoading(false);
    }
  };

  const retake = () => {
    setResult(null);
    setPhotoDataUrl('');
    setError('');
  };

  const showingPhoto = result !== null || loading;

  return (
    <>
      <h1 className="app-title">SeeFood</h1>
      <div className="camera-wrap">
        {!showingPhoto && (
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
        )}
        {(loading || result !== null) && photoDataUrl && (
          <img
            src={photoDataUrl}
            alt="Captured"
            className="camera-photo"
          />
        )}
        {result === true && <GreenOverlay />}
        {result === false && <RedOverlay />}
        {loading && (
          <div className="overlay-loading">
            <span>Checking...</span>
          </div>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={capture}
          disabled={loading || !streamRef.current}
        >
          {loading ? 'Checking...' : 'Take photo'}
        </button>
        {showingPhoto && !loading && (
          <button type="button" className="btn btn-secondary" onClick={retake}>
            Retake
          </button>
        )}
      </div>
    </>
  );
}
