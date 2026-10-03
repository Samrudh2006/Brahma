import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, FastForward, Sparkles } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayFallback, setShowPlayFallback] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Autoplay attempt
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setShowPlayFallback(false))
        .catch((err) => {
          console.warn('Autoplay blocked by browser. Showing enter button:', err);
          setShowPlayFallback(true);
        });
    }

    const handleTimeUpdate = () => {
      if (videoEl.duration) {
        setProgress((videoEl.currentTime / videoEl.duration) * 100);
      }
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoEl.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const handleEnded = () => {
    finishSplash();
  };

  const finishSplash = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayFallback(false);
    }
  };

  return (
    <div className={`splash-container ${isFading ? 'fading-out' : ''}`} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#02040a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <video
        ref={videoRef}
        src="/assets/splash_video.mp4"
        className="splash-video"
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={handleEnded}
        style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
      />

      {/* Video Playback Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        zIndex: 10000
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
          boxShadow: '0 0 10px #fbbf24',
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* Control Overlay Buttons */}
      <div className="splash-overlay-controls" style={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 10001
      }}>
        {showPlayFallback && (
          <button
            onClick={handleManualPlay}
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)'
            }}
          >
            <Play size={16} /> Enter Sanctuary
          </button>
        )}

        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: '#fbbf24',
            padding: '10px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            fontWeight: 700
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isMuted ? 'Unmute' : 'Muted'}
        </button>

        <button
          onClick={finishSplash}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#f8fafc',
            padding: '10px 18px',
            borderRadius: 10,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.82rem',
            fontWeight: 800,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fbbf24';
            e.currentTarget.style.color = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#f8fafc';
          }}
        >
          <FastForward size={16} /> Skip Intro ⏭️
        </button>
      </div>
    </div>
  );
}
