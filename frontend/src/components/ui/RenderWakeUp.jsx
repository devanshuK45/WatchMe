import React, { useEffect, useState } from 'react';
import { APIUrl } from '../../utils';
import './RenderWakeUp.css';

const SARCASTIC_LINES = [
  "Poking Render's free server awake… 🫸",
  "Render went to sleep. Rude. Waking it up…",
  "Free tier moment. Hold tight. 😬",
  "The backend is doing its morning stretches… 🧘",
  "Render: 'Did someone say… free plan?' 💀",
  "Spinning up the hamster wheel… 🐹",
  "Your backend is basically a vampire — hates being woken up.",
  "Fun fact: this takes ~30s. Unfun fact: free tier. 🥲",
];

export default function RenderWakeUp({ onReady }) {
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState(SARCASTIC_LINES[0]);
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer;
    let dotTimer;
    let lineTimer;
    let elapsedTimer;
    let done = false;

    const startTime = Date.now();

    // Show the overlay only if BE takes > 1.2s (actual cold start)
    const showTimer = setTimeout(() => {
      if (!done) setVisible(true);
    }, 1200);

    // Rotating sarcastic lines every 4s
    lineTimer = setInterval(() => {
      setLine(SARCASTIC_LINES[Math.floor(Math.random() * SARCASTIC_LINES.length)]);
    }, 4000);

    // Animated dots
    dotTimer = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 500);

    // Elapsed seconds counter
    elapsedTimer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const ping = async () => {
      try {
        await fetch(`${APIUrl}/health`, { signal: AbortSignal.timeout(60000) });
      } catch (_) {
        // even on error, backend is at least responding — carry on
      }
      done = true;
      clearTimeout(showTimer);
      clearInterval(lineTimer);
      clearInterval(dotTimer);
      clearInterval(elapsedTimer);
      setVisible(false);
      onReady?.();
    };

    ping();

    return () => {
      clearTimeout(showTimer);
      clearInterval(lineTimer);
      clearInterval(dotTimer);
      clearInterval(elapsedTimer);
    };
  }, [onReady]);

  if (!visible) return null;

  return (
    <div className="rwu-overlay">
      <div className="rwu-card">
        {/* Popcorn / loader icon */}
        <div className="rwu-icon">🍿</div>

        <div className="rwu-spinner">
          <span /><span /><span /><span />
        </div>

        <h2 className="rwu-title">Backend Waking Up{dots}</h2>
        <p className="rwu-line">{line}</p>

        <div className="rwu-meta">
          <span className="rwu-badge">Render Free Tier</span>
          <span className="rwu-elapsed">{elapsed}s elapsed</span>
        </div>

        <p className="rwu-sub">
          Cold starts can take up to <strong>~50 seconds</strong>.<br />
          Grab a snack. We'll be right there. 🎬
        </p>
      </div>
    </div>
  );
}
