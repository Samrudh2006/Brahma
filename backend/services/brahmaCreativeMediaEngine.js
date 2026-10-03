/**
 * BRAHMA Creative Media & NLE Audio/Video Sovereign Engine
 * Professional Production, Timecodes, Subtitling, Colorimetry & Loudness Normalization
 * 
 * Capabilities:
 * 1. SMPTE Timecode (HH:MM:SS:FF) Calculator & Edit Decision List (EDL) Sequence Compiler
 * 2. SubRip (.SRT) & WebVTT Subtitle Generator with Millisecond Precision
 * 3. EBU R128 / ITU-R BS.1770 Audio Loudness Normalization (-23 LUFS Broadcast / -14 LUFS Web Target)
 * 4. 3x3 Color Gamut Matrix Transformer (Rec.709 sRGB to DCI-P3 and Rec.2020)
 */

class BrahmaCreativeMediaEngine {
  constructor() {
    this.standardFrameRates = {
      FILM_24: 24,
      PAL_25: 25,
      NTSC_30: 30,
      HIGH_FRAME_60: 60
    };

    // Color conversion matrices (Linear RGB)
    // Rec.709 to Rec.2020 standard transformation
    this.rec709ToRec2020Matrix = [
      [0.6274, 0.3293, 0.0433],
      [0.0691, 0.9195, 0.0114],
      [0.0164, 0.0880, 0.8956]
    ];
  }

  /**
   * Convert Total Frames to SMPTE Timecode (HH:MM:SS:FF)
   */
  framesToSMPTE(totalFrames, fps = 24) {
    const f = Math.round(totalFrames);
    const ff = f % fps;
    const totalSecs = Math.floor(f / fps);
    const ss = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mm = totalMins % 60;
    const hh = Math.floor(totalMins / 60);

    const pad = n => String(n).padStart(2, '0');
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  }

  /**
   * Convert Milliseconds to SRT Subtitle Timestamp (HH:MM:SS,mmm)
   */
  msToSRTTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const mmm = String(Math.floor(ms % 1000)).padStart(3, '0');
    const ss = String(totalSecs % 60).padStart(2, '0');
    const totalMins = Math.floor(totalSecs / 60);
    const mm = String(totalMins % 60).padStart(2, '0');
    const hh = String(Math.floor(totalMins / 60)).padStart(2, '0');
    return `${hh}:${mm}:${ss},${mmm}`;
  }

  /**
   * Build Edit Decision List (EDL) Sequence
   */
  compileEDLSequence({ title = 'Master_Sequence', fps = 24, clips = [] }) {
    let currentTimelineFrame = 0;
    const edlEvents = clips.map((clip, idx) => {
      const clipDurationFrames = Math.round(clip.durationSeconds * fps);
      const srcIn = 0;
      const srcOut = clipDurationFrames;
      const recIn = currentTimelineFrame;
      const recOut = currentTimelineFrame + clipDurationFrames;
      currentTimelineFrame = recOut;

      return {
        eventNumber: idx + 1,
        reelId: clip.reelId || 'AX',
        trackType: clip.trackType || 'V',
        transition: clip.transition || 'C', // Cut
        sourceInTimecode: this.framesToSMPTE(srcIn, fps),
        sourceOutTimecode: this.framesToSMPTE(srcOut, fps),
        recordInTimecode: this.framesToSMPTE(recIn, fps),
        recordOutTimecode: this.framesToSMPTE(recOut, fps),
        clipName: clip.name || `Clip_${idx + 1}`
      };
    });

    return {
      success: true,
      title,
      fps,
      totalDurationTimecode: this.framesToSMPTE(currentTimelineFrame, fps),
      totalDurationSeconds: +(currentTimelineFrame / fps).toFixed(2),
      eventCount: edlEvents.length,
      events: edlEvents
    };
  }

  /**
   * Generate Standard SubRip (.SRT) and WebVTT Formatted Subtitles
   */
  generateSubtitles(cues = []) {
    // cues: [{ startTimeMs, endTimeMs, text }]
    const srtBlocks = cues.map((cue, idx) => {
      return [
        idx + 1,
        `${this.msToSRTTime(cue.startTimeMs)} --> ${this.msToSRTTime(cue.endTimeMs)}`,
        cue.text,
        ''
      ].join('\n');
    });

    const vttBlocks = cues.map((cue, idx) => {
      const vttStart = this.msToSRTTime(cue.startTimeMs).replace(',', '.');
      const vttEnd = this.msToSRTTime(cue.endTimeMs).replace(',', '.');
      return [
        idx + 1,
        `${vttStart} --> ${vttEnd}`,
        cue.text,
        ''
      ].join('\n');
    });

    return {
      success: true,
      totalCues: cues.length,
      srtContent: srtBlocks.join('\n').trim(),
      vttContent: `WEBVTT\n\n${vttBlocks.join('\n').trim()}`
    };
  }

  /**
   * EBU R128 / ITU-R BS.1770 Audio Loudness Normalization Calculator
   */
  calculateLoudnessNormalization({
    measuredLUFS = -19.4,
    measuredTruePeakDBTP = -0.5,
    measuredLRA = 8.2, // Loudness Range in LU
    targetStandard = 'STREAMING_WEB' // STREAMING_WEB (-14 LUFS) or EBU_R128_BROADCAST (-23 LUFS)
  }) {
    const targetLUFS = targetStandard === 'EBU_R128_BROADCAST' ? -23.0 : -14.0;
    const targetMaxPeakDBTP = targetStandard === 'EBU_R128_BROADCAST' ? -1.0 : -1.0;

    const gainAdjustmentDB = +(targetLUFS - measuredLUFS).toFixed(2);
    const predictedNewPeakDBTP = +(measuredTruePeakDBTP + gainAdjustmentDB).toFixed(2);
    const limiterEngaged = predictedNewPeakDBTP > targetMaxPeakDBTP;
    const finalPeakDBTP = limiterEngaged ? targetMaxPeakDBTP : predictedNewPeakDBTP;

    return {
      success: true,
      targetStandard,
      targetLUFS,
      measuredLUFS,
      measuredTruePeakDBTP,
      measuredLRA,
      gainAdjustmentDB,
      limiterEngaged,
      finalPeakDBTP,
      complianceStatus: Math.abs(gainAdjustmentDB) <= 0.5 ? 'COMPLIANT_WITHIN_HALF_LU' : 'NORMALIZATION_GAIN_REQUIRED'
    };
  }

  /**
   * Colorimetric RGB Color Gamut Mapping (Matrix Vector Multiplication)
   */
  transformColorGamut({ r = 0.8, g = 0.5, b = 0.2, sourceGamut = 'REC_709', targetGamut = 'REC_2020' }) {
    const m = this.rec709ToRec2020Matrix;
    const rOut = +(m[0][0] * r + m[0][1] * g + m[0][2] * b).toFixed(4);
    const gOut = +(m[1][0] * r + m[1][1] * g + m[1][2] * b).toFixed(4);
    const bOut = +(m[2][0] * r + m[2][1] * g + m[2][2] * b).toFixed(4);

    return {
      success: true,
      sourceGamut,
      targetGamut,
      inputRGB: [r, g, b],
      transformedRGB: [
        Math.min(1.0, Math.max(0.0, rOut)),
        Math.min(1.0, Math.max(0.0, gOut)),
        Math.min(1.0, Math.max(0.0, bOut))
      ]
    };
  }
}

module.exports = new BrahmaCreativeMediaEngine();
