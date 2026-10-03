/**
 * BRAHMA Privacy-First Sovereign Telemetry & Analytics Engine
 * Compliant with GDPR, CCPA, and Indian Digital Personal Data Protection (DPDP) Act.
 * Respects User Consent state stored in localStorage ('brahma_cookie_consent').
 */

class TelemetryManager {
  constructor() {
    this.enabled = false;
    this.sessionStartTime = Date.now();
    this.eventQueue = [];
    this.checkConsent();
  }

  checkConsent() {
    try {
      const consent = localStorage.getItem('brahma_cookie_consent');
      // Enabled only if explicitly accepted
      this.enabled = consent === 'accepted' || consent === 'all';
    } catch {
      this.enabled = false;
    }
  }

  setConsent(status) {
    try {
      localStorage.setItem('brahma_cookie_consent', status);
      this.enabled = status === 'accepted' || status === 'all';
      if (this.enabled) {
        this.flushQueue();
      } else {
        this.eventQueue = [];
      }
    } catch (e) {
      console.warn('[Telemetry] Storage error:', e);
    }
  }

  hasConsentDecision() {
    try {
      return localStorage.getItem('brahma_cookie_consent') !== null;
    } catch {
      return false;
    }
  }

  track(eventName, properties = {}) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        theme: document.documentElement.getAttribute('data-theme') || 'dark',
      }
    };

    if (!this.enabled) {
      // Keep lightweight transient buffer (max 20) until decision is rendered
      if (!this.hasConsentDecision() && this.eventQueue.length < 20) {
        this.eventQueue.push(payload);
      }
      return;
    }

    this.send(payload);
  }

  trackPageView(pageName) {
    this.track('page_view', { page: pageName, url: window.location.pathname + window.location.hash });
  }

  trackStudioLaunch(studioId) {
    this.track('studio_launch', { studio: studioId });
  }

  trackError(errorDetails) {
    this.track('app_error', {
      message: errorDetails.message || String(errorDetails),
      stack: errorDetails.stack ? errorDetails.stack.substring(0, 300) : null
    });
  }

  flushQueue() {
    if (!this.enabled) return;
    while (this.eventQueue.length > 0) {
      const item = this.eventQueue.shift();
      this.send(item);
    }
  }

  send(data) {
    // If backend or analytics endpoint exists, dispatch beacon or post
    if (navigator.sendBeacon && window.BRAHMA_ANALYTICS_ENDPOINT) {
      try {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(window.BRAHMA_ANALYTICS_ENDPOINT, blob);
      } catch {
        // Fallback or silent fail
      }
    }
  }
}

export const telemetry = new TelemetryManager();
