import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, FastForward, Sparkles } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const videoRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayFallback, setShowPlayFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Direct browser properties for rock-solid iOS/Android/Desktop autoplay
    videoEl.defaultMuted = true;
    videoEl.muted = true;

    const attemptPlay = () => {
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowPlayFallback(false);
          })
          .catch((err) => {
            console.warn('Autoplay waiting for user gesture:', err);
            setShowPlayFallback(true);
          });
      }
    };

    attemptPlay();

    // Fallback timer: if video paused after 2.5s, show enter button
    const fallbackTimer = setTimeout(() => {
      if (videoEl.paused) {
        setShowPlayFallback(true);
      }
    }, 2500);

    const handleTimeUpdate = () => {
      if (videoEl.duration) {
        const curProgress = (videoEl.currentTime / videoEl.duration) * 100;
        setProgress(curProgress);
        setIsPlaying(true);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayFallback(false);
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('playing', handlePlay);

    return () => {
      clearTimeout(fallbackTimer);
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('playing', handlePlay);
    };
  }, []);

  const handleEnded = () => {
    finishSplash();
  };

  const finishSplash = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleManualPlay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPlayFallback(false);
        if (ambientRef.current) ambientRef.current.play().catch(() => {});
      }).catch(() => {
        // If play still cannot execute, transition straight to app
        finishSplash();
      });
    } else {
      finishSplash();
    }
  };

  const handleVideoError = (e) => {
    console.warn('Splash video playback error on mobile:', e);
    setVideoError(true);
    setShowPlayFallback(true);
  };

  return (
    <div
      className={`splash-container ${isFading ? 'fading-out' : ''}`}
      onClick={showPlayFallback ? handleManualPlay : undefined}
    >
      {/* ── 1. Sacred Header Overlay with Crystal-Clear Typography ── */}
      <div className="splash-top-brand">
        <div className="splash-brand-badge">
          <span className="splash-trishula">🔱</span>
          <span className="splash-brand-name">BRAHMA</span>
          <span className="splash-brand-tag">SOVEREIGN AI</span>
        </div>
        <p className="splash-sanskrit-tagline">
          ॥ ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ॥
        </p>
      </div>

      {/* ── 2. Video Player Stage with Full Edge-to-Edge Fitting ── */}
      {!videoError ? (
        <div className="splash-video-stage">
          <video
            ref={videoRef}
            src="/assets/splash_video.mp4"
            className="splash-video-main"
            autoPlay
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            muted={isMuted}
            preload="auto"
            onEnded={handleEnded}
            onError={handleVideoError}
          />
        </div>
      ) : (
        /* Graceful fallback if video fails to decode on mobile */
        <div className="splash-fallback-stage">
          <div className="splash-fallback-mandala">
            <div className="splash-mandala-ring" />
            <img
              src="/assets/brahma_temple_bg.jpg"
              alt="Brahma Sanctuary"
              className="splash-fallback-art"
            />
          </div>
          <h2 className="splash-fallback-title">BRAHMA SOVEREIGN MATRIX</h2>
          <p className="splash-fallback-desc">13 Sacred Councils · 289 Swarm Intelligence Agents</p>
        </div>
      )}

      {/* ── 3. Subtle Vignette & Frame ── */}
      <div className="splash-vignette-overlay" pointerEvents="none" />

      {/* ── 4. Video Playback Progress Bar (Mobile Safe-Area Aligned) ── */}
      <div className="splash-progress-track">
        <div
          className="splash-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── 5. Mobile-Optimized Control Overlay ── */}
      <div className="splash-overlay-controls">
        {showPlayFallback && (
          <button
            onClick={handleManualPlay}
            className="splash-btn splash-btn-primary"
            title="Enter Sovereign Sanctuary"
          >
            <Play size={16} fill="currentColor" />
            <span>Enter Sanctuary</span>
          </button>
        )}

        {!videoError && (
          <button
            onClick={toggleMute}
            className="splash-btn splash-btn-secondary"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="splash-btn-text">{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>
        )}

        <button
          onClick={finishSplash}
          className="splash-btn splash-btn-skip"
          title="Skip Intro to Main Matrix"
        >
          <span>Skip</span>
          <FastForward size={16} />
        </button>
      </div>
    </div>
  );
}
