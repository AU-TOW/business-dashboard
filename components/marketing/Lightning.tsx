'use client';

import { useEffect, useRef, useState } from 'react';

interface LightningBolt {
  id: number;
  startX: number;
  startY: number;
  segments: Array<{ x: number; y: number }>;
  progress: number;
  fadeStart: number;
  totalLength: number;
}

export default function Lightning() {
  const [bolts, setBolts] = useState<LightningBolt[]>([]);
  const nextId = useRef(0);
  const gridSize = 50;

  useEffect(() => {
    const createBolt = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Snap to grid
      const gridX = Math.floor(Math.random() * (windowWidth / gridSize)) * gridSize;
      const gridY = Math.floor(Math.random() * (windowHeight / gridSize)) * gridSize;

      // Create path segments along grid lines
      const segments: Array<{ x: number; y: number }> = [];
      let currentX = gridX;
      let currentY = gridY;
      const numSegments = Math.floor(Math.random() * 6) + 4; // 4-9 segments
      let totalLength = 0;

      for (let i = 0; i < numSegments; i++) {
        const horizontal = Math.random() > 0.5;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const steps = Math.floor(Math.random() * 4) + 1; // 1-4 grid cells
        const length = steps * gridSize * direction;

        const prevX = currentX;
        const prevY = currentY;

        if (horizontal) {
          currentX = Math.max(0, Math.min(windowWidth, currentX + length));
        } else {
          currentY = Math.max(0, Math.min(windowHeight, currentY + length));
        }

        totalLength += Math.abs(horizontal ? currentX - prevX : currentY - prevY);
        segments.push({ x: currentX, y: currentY });
      }

      const newBolt: LightningBolt = {
        id: nextId.current++,
        startX: gridX,
        startY: gridY,
        segments,
        progress: 0,
        fadeStart: 0,
        totalLength,
      };

      setBolts(prev => [...prev, newBolt]);

      // Animate the bolt - head moves forward, tail follows
      let headProgress = 0;
      let tailProgress = 0;
      const tailDelay = 0.3; // Tail starts fading after head is 30% ahead

      const animateInterval = setInterval(() => {
        headProgress += 0.02; // Half speed
        tailProgress = Math.max(0, headProgress - tailDelay);

        if (tailProgress >= 1) {
          clearInterval(animateInterval);
          setBolts(prev => prev.filter(b => b.id !== newBolt.id));
        } else {
          setBolts(prev => prev.map(b =>
            b.id === newBolt.id ? { ...b, progress: Math.min(headProgress, 1), fadeStart: tailProgress } : b
          ));
        }
      }, 25);
    };

    // More frequent bolts - random interval between 0.8-2.5 seconds
    const scheduleNextBolt = () => {
      const delay = Math.random() * 1700 + 800;
      return setTimeout(() => {
        createBolt();
        timeoutRef.current = scheduleNextBolt();
      }, delay);
    };

    const timeoutRef = { current: scheduleNextBolt() };

    // Create multiple initial bolts with staggered timing
    const initialTimeouts = [
      setTimeout(() => createBolt(), 500),
      setTimeout(() => createBolt(), 1200),
      setTimeout(() => createBolt(), 2000),
    ];

    return () => {
      clearTimeout(timeoutRef.current);
      initialTimeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  const renderBolt = (bolt: LightningBolt) => {
    // Calculate visible portion (between fadeStart and progress)
    const totalSegments = bolt.segments.length;
    const headIndex = Math.min(Math.floor(bolt.progress * totalSegments), totalSegments);
    const tailIndex = Math.floor(bolt.fadeStart * totalSegments);

    // Build the visible path
    const points: Array<{ x: number; y: number }> = [];

    // Add starting point if tail hasn't passed it
    if (tailIndex === 0) {
      const startProgress = bolt.fadeStart * totalSegments;
      if (startProgress < 1) {
        // Interpolate start position
        const firstSeg = bolt.segments[0];
        const interpX = bolt.startX + (firstSeg.x - bolt.startX) * startProgress;
        const interpY = bolt.startY + (firstSeg.y - bolt.startY) * startProgress;
        points.push({ x: interpX, y: interpY });
      }
    } else {
      // Start from interpolated tail position
      const tailFrac = (bolt.fadeStart * totalSegments) - tailIndex;
      const prevPoint = tailIndex === 0
        ? { x: bolt.startX, y: bolt.startY }
        : bolt.segments[tailIndex - 1];
      const currPoint = bolt.segments[tailIndex];
      if (currPoint) {
        const interpX = prevPoint.x + (currPoint.x - prevPoint.x) * tailFrac;
        const interpY = prevPoint.y + (currPoint.y - prevPoint.y) * tailFrac;
        points.push({ x: interpX, y: interpY });
      }
    }

    // Add middle segments
    for (let i = Math.max(tailIndex, 0); i < headIndex; i++) {
      points.push(bolt.segments[i]);
    }

    // Add head position (interpolated)
    if (bolt.progress < 1 && headIndex < totalSegments) {
      const headFrac = (bolt.progress * totalSegments) - headIndex;
      const prevPoint = headIndex === 0
        ? { x: bolt.startX, y: bolt.startY }
        : bolt.segments[headIndex - 1];
      const currPoint = bolt.segments[headIndex];
      if (currPoint) {
        const interpX = prevPoint.x + (currPoint.x - prevPoint.x) * headFrac;
        const interpY = prevPoint.y + (currPoint.y - prevPoint.y) * headFrac;
        points.push({ x: interpX, y: interpY });
      }
    }

    if (points.length < 2) return null;

    // Create path
    const pathD = `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    // Calculate gradient for head-to-tail fade
    const gradientId = `lightning-grad-${bolt.id}`;
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    return (
      <g key={bolt.id}>
        <defs>
          <linearGradient
            id={gradientId}
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(100, 180, 255, 0)" />
            <stop offset="30%" stopColor="rgba(100, 180, 255, 0.4)" />
            <stop offset="70%" stopColor="rgba(100, 180, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(180, 220, 255, 1)" />
          </linearGradient>
        </defs>

        {/* Wide glow */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(8px)' }}
        />

        {/* Medium glow */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(4px)' }}
        />

        {/* Core line */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bright head dot */}
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="4"
          fill="rgba(255, 255, 255, 0.9)"
          style={{ filter: 'blur(2px)' }}
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="2"
          fill="white"
        />
      </g>
    );
  };

  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {bolts.map(renderBolt)}
    </svg>
  );
}
