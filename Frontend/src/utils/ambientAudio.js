/**
 * Ambient Audio generator for the Dairy Yatra scrollytelling experience.
 * Uses Web Audio API to synthesize a calming, immersive train travel soundscape.
 */

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let intervalId = null;

export function toggleAmbientAudio(onStateChange) {
  if (isPlaying) {
    stopAmbientAudio();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startAmbientAudio();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startAmbientAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm peaceful drone (chords representing dawn and journey)
    const baseFreqs = [110, 164.81, 220, 329.63]; // A major 9th warm chord
    baseFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const oscGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.025 / (idx + 1), audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
    });

    // Subtle rhythmic train click-clack simulation
    const playClick = () => {
      if (!isPlaying || !audioCtx) return;
      
      const now = audioCtx.currentTime;
      // Double tap rhythm (da-dum ... da-dum)
      [0, 0.12].forEach((offset, i) => {
        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let j = 0; j < noiseBuffer.length; j++) {
          output[j] = (Math.random() * 2 - 1) * Math.exp(-j / (audioCtx.sampleRate * 0.015));
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(320 + i * 80, now + offset);
        noiseFilter.Q.setValueAtTime(3, now + offset);

        const clickGain = audioCtx.createGain();
        clickGain.gain.setValueAtTime(0.018, now + offset);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.05);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(clickGain);
        clickGain.connect(masterGain);

        whiteNoise.start(now + offset);
      });
    };

    intervalId = setInterval(playClick, 1600);
    isPlaying = true;
    return true;
  } catch (err) {
    console.warn('Ambient audio could not start:', err);
    return false;
  }
}

export function stopAmbientAudio() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (audioCtx) {
    try {
      audioCtx.suspend();
    } catch (e) {}
  }
  isPlaying = false;
}

export function isAmbientAudioPlaying() {
  return isPlaying;
}
