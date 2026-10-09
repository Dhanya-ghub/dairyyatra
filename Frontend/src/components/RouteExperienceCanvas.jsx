import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CANVAS_CITIES } from '../data/yatraData';
import journeyMapSvg from '../assets/journey-india-map.svg';

const NATIVE_W = 1612;
const NATIVE_H = 1620;

// Preload SVG asset image
let staticIndiaImg = null;
if (typeof window !== 'undefined') {
  staticIndiaImg = new Image();
  staticIndiaImg.src = journeyMapSvg;
}

// 3D globe continent silhouettes for intro sequence
const northAmerica = [[70,-165],[70,-140],[60,-95],[49,-95],[30,-100],[25,-97],[16,-92],[15,-83],[9,-78],[8,-82],[18,-88],[21,-87],[30,-81],[35,-76],[40,-74],[45,-67],[47,-60],[52,-56],[60,-65],[70,-100],[70,-165]];
const southAmerica = [[12,-72],[10,-65],[5,-60],[5,-52],[-2,-44],[-8,-35],[-15,-39],[-23,-43],[-34,-54],[-38,-62],[-45,-67],[-53,-70],[-55,-68],[-50,-73],[-40,-73],[-30,-71],[-18,-70],[-5,-81],[2,-80],[8,-77],[12,-72]];
const europe = [[71,25],[70,30],[65,40],[55,40],[45,38],[42,28],[40,20],[38,15],[41,9],[43,3],[44,-2],[43,-9],[38,-9],[36,-6],[43,4],[47,7],[50,4],[52,4],[54,8],[55,12],[58,10],[60,5],[63,10],[66,14],[70,20],[71,25]];
const africa = [[37,10],[35,25],[31,32],[22,38],[12,43],[5,48],[-2,45],[-12,40],[-18,35],[-25,33],[-34,25],[-34,19],[-29,17],[-17,12],[-5,12],[4,9],[6,3],[6,-8],[12,-17],[21,-17],[28,-13],[33,-9],[36,-6],[35,-1],[37,10]];
const asia = [[45,35],[40,45],[35,50],[25,60],[24,67],[20,70],[10,78],[6,80],[8,98],[10,105],[22,108],[30,122],[40,128],[45,135],[55,163],[65,178],[70,160],[73,140],[75,100],[73,80],[70,60],[60,50],[55,40],[45,35]];
const australia = [[-11,131],[-12,142],[-17,146],[-20,149],[-25,153],[-33,151],[-38,147],[-38,140],[-34,135],[-32,127],[-25,113],[-18,122],[-14,127],[-11,131]];
const continents = [northAmerica, southAmerica, europe, africa, asia, australia];

function pointInPoly(lat, lon, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [lai, loi] = poly[i], [laj, loj] = poly[j];
    const denom = (loj - loi) || 1e-9;
    const intersect = ((loi > lon) !== (loj > lon)) &&
      (lat < (laj - lai) * (lon - loi) / denom + lai);
    if (intersect) inside = !inside;
  }
  return inside;
}

function buildGrid(poly, step) {
  const lats = poly.map(p => p[0]), lons = poly.map(p => p[1]);
  const latMin = Math.min(...lats), latMax = Math.max(...lats);
  const lonMin = Math.min(...lons), lonMax = Math.max(...lons);
  const pts = [];
  for (let la = latMin; la <= latMax; la += step) {
    for (let lo = lonMin; lo <= lonMax; lo += step) {
      if (pointInPoly(la, lo, poly)) pts.push([la, lo]);
    }
  }
  return pts;
}

const worldGrids = continents.map(c => buildGrid(c, 3));
const ROUTE_CONNECT_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];

function sphereProject(lat, lon, rotLon, R, cx, cy, tilt) {
  const latR = lat * Math.PI / 180;
  const lonR = (lon - rotLon) * Math.PI / 180;
  let x = Math.cos(latR) * Math.sin(lonR);
  let y = Math.sin(latR);
  let z = Math.cos(latR) * Math.cos(lonR);
  const t = tilt * Math.PI / 180;
  const y2 = y * Math.cos(t) - z * Math.sin(t);
  const z2 = y * Math.sin(t) + z * Math.cos(t);
  return { x: cx + x * R, y: cy - y2 * R, z: z2 };
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

// Universal cross-browser rounded rectangle helper
function drawSafeRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * RouteExperienceCanvas
 * High-DPI Canvas Rendering Engine:
 * 1. Starts strictly from 3D rotating globe (NO India map visible initially).
 * 2. Settles on Indian subcontinent, zooms in, and transitions/fades into the vector India map.
 * 3. Draws the dynamic connecting route path & pulsing city markers.
 * 4. Automatically restarts sequence from the 3D globe whenever the user visits the page/section.
 */
export default function RouteExperienceCanvas({
  activeStopIndex = 0,
  onSelectStop = () => {},
  isPlaying = false,
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(-1);
  const [headerVisible, setHeaderVisible] = useState(false);

  const activeStopIndexRef = useRef(activeStopIndex);
  useEffect(() => {
    activeStopIndexRef.current = activeStopIndex;
  }, [activeStopIndex]);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    let indiaFit = { scale: 1, offsetX: 0, offsetY: 0 };

    function calculateFit() {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || canvas.parentElement?.clientWidth || 560;
      const height = rect.height || canvas.parentElement?.clientHeight || 560;

      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = width;
      H = height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const padTop = H * 0.14, padBottom = H * 0.08, padSide = W * 0.08;
      const box = { x: padSide, y: padTop, w: Math.max(W - 2 * padSide, 10), h: Math.max(H - padTop - padBottom, 10) };
      const scale = Math.min(box.w / NATIVE_W, box.h / NATIVE_H);
      const offsetX = box.x + (box.w - NATIVE_W * scale) / 2;
      const offsetY = box.y + (box.h - NATIVE_H * scale) / 2;
      indiaFit = { scale, offsetX, offsetY };
    }

    calculateFit();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateFit();
      });
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', calculateFit);

    const INDIA_CENTER_LON = 80.5;
    const INDIA_CENTER_LAT = 21.5;
    const T1_END = 1400;        // Free globe rotation
    const SETTLE = 600;         // Settle on India
    const ZOOM_START = T1_END + SETTLE + 100;
    const ZOOM_DUR = 950;
    const ZOOM_END = ZOOM_START + ZOOM_DUR;

    let startTime = performance.now();
    let animId = null;

    // Viewport Intersection Observer: Restarts animation from the globe every time the section is visited
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          startTime = performance.now();
          setHeaderVisible(false);
        }
      }, { threshold: 0.2 });
      observer.observe(containerRef.current);
    }

    function getCityPos(ci) {
      const c = CANVAS_CITIES[ci];
      if (!c) return [0, 0];
      return [indiaFit.offsetX + c.nx * indiaFit.scale, indiaFit.offsetY + c.ny * indiaFit.scale];
    }

    function render(now) {
      if (canvas.clientWidth > 0 && Math.abs(W - canvas.clientWidth) > 2) {
        calculateFit();
      }

      const t = now - startTime;
      ctx.clearRect(0, 0, W, H);

      // 1. Globe Rotation & Fade In/Out
      let rotLon;
      const baseSpeed = 34; // deg/sec
      if (t < T1_END) {
        rotLon = (t / 1000) * baseSpeed;
      } else if (t < T1_END + SETTLE) {
        const at1 = (T1_END / 1000) * baseSpeed;
        const targetRot = INDIA_CENTER_LON;
        let diff = ((targetRot - (at1 % 360)) + 540) % 360 - 180;
        const p = easeInOutCubic(clamp01((t - T1_END) / SETTLE));
        rotLon = at1 + diff * p;
      } else {
        rotLon = INDIA_CENTER_LON;
      }

      let globeAlpha = 1, globeScale = 1;
      if (t < ZOOM_START) {
        globeAlpha = 1;
        globeScale = 1;
      } else if (t < ZOOM_END) {
        const p = easeInOutCubic(clamp01((t - ZOOM_START) / ZOOM_DUR));
        globeScale = 1 + p * 6.2;
        globeAlpha = 1 - clamp01(p / 0.8);
      } else {
        globeAlpha = 0;
      }

      // India Map Alpha (Strictly 0 during globe phase, then smoothly fades in)
      let indiaAlpha = 0;
      if (t < ZOOM_START) {
        indiaAlpha = 0;
      } else if (t < ZOOM_END) {
        const p = clamp01((t - ZOOM_START) / ZOOM_DUR);
        indiaAlpha = easeInOutCubic(p);
      } else {
        indiaAlpha = 1;
      }

      if (t > ZOOM_START + 300 && !headerVisible) {
        setHeaderVisible(true);
      }

      const R = Math.min(W, H) * 0.31;
      const cx = W / 2, cy = H * 0.52;
      const tilt = 14;

      // 2. Draw 3D Ambient Globe during intro
      if (globeAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = globeAlpha;

        const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R * 1.05);
        grad.addColorStop(0, '#1a2936');
        grad.addColorStop(1, '#070b10');

        ctx.beginPath();
        const sx = cx, sy = cy;
        ctx.translate(sx, sy);
        ctx.scale(globeScale, globeScale);
        ctx.translate(-sx, -sy);
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(242, 177, 52, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(200, 223, 219, 0.65)';
        for (const grid of worldGrids) {
          for (const [la, lo] of grid) {
            const p = sphereProject(la, lo, rotLon, R, cx, cy, tilt);
            if (p.z > 0.03) {
              const a = Math.min(1, p.z * 1.3);
              ctx.globalAlpha = globeAlpha * a;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        if (t >= T1_END) {
          const settleP = clamp01((t - T1_END) / SETTLE);
          const p = sphereProject(INDIA_CENTER_LAT, INDIA_CENTER_LON, rotLon, R, cx, cy, tilt);
          if (p.z > 0.03) {
            const pulse = (t % 1400) / 1400;
            ctx.globalAlpha = globeAlpha * settleP;
            ctx.strokeStyle = 'rgba(242, 177, 52, 0.7)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4 + pulse * 10, 0, Math.PI * 2);
            ctx.globalAlpha = globeAlpha * settleP * (1 - pulse);
            ctx.stroke();

            ctx.globalAlpha = globeAlpha * settleP;
            ctx.fillStyle = '#f2b134';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 3. Draw Vector India Map & Route Elements
      if (indiaAlpha > 0.005) {
        // Draw the vector India map asset on canvas
        if (staticIndiaImg && staticIndiaImg.complete && staticIndiaImg.naturalWidth !== 0) {
          ctx.save();
          ctx.globalAlpha = indiaAlpha * 0.42;
          ctx.drawImage(
            staticIndiaImg,
            indiaFit.offsetX,
            indiaFit.offsetY,
            NATIVE_W * indiaFit.scale,
            NATIVE_H * indiaFit.scale
          );
          ctx.restore();
        }

        // Draw connecting route path with progressive drawing
        const pathProgress = clamp01((t - (ZOOM_START + 250)) / 750);
        if (pathProgress > 0.01) {
          ctx.save();
          ctx.globalAlpha = indiaAlpha * pathProgress * 0.95;
          ctx.strokeStyle = '#f2b134';
          ctx.lineWidth = 2.0;
          ctx.setLineDash([4, 6]);

          ctx.beginPath();
          ROUTE_CONNECT_ORDER.forEach((ci, idx) => {
            const [rx, ry] = getCityPos(ci);
            if (idx === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          });
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        const currentActive = activeStopIndexRef.current >= 0 ? (activeStopIndexRef.current % 9) : 0;

        // Draw All 9 City Markers
        CANVAS_CITIES.forEach((city, i) => {
          const [x, y] = getCityPos(i);
          const isActive = i === currentActive;
          const pulse = ((t + i * 200) % 1600) / 1600;

          ctx.save();
          ctx.globalAlpha = indiaAlpha;

          // Ambient Pulse Ring
          ctx.strokeStyle = isActive ? 'rgba(255, 214, 138, 0.95)' : 'rgba(242, 177, 52, 0.45)';
          ctx.lineWidth = isActive ? 2.4 : 1.4;
          ctx.beginPath();
          ctx.arc(x, y, 4.5 + pulse * (isActive ? 16 : 9), 0, Math.PI * 2);
          ctx.globalAlpha = indiaAlpha * (1 - pulse) * (isActive ? 0.95 : 0.6);
          ctx.stroke();

          // Outer Dark Rim for High Contrast
          ctx.globalAlpha = indiaAlpha;
          ctx.strokeStyle = 'rgba(11, 20, 29, 0.95)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(x, y, isActive ? 7.5 : 4.8, 0, Math.PI * 2);
          ctx.stroke();

          // Core Glowing Dot
          ctx.fillStyle = isActive ? '#ffd68a' : '#f2b134';
          ctx.shadowColor = 'rgba(242, 177, 52, 1)';
          ctx.shadowBlur = isActive ? 22 : 8;
          ctx.beginPath();
          ctx.arc(x, y, isActive ? 6.8 : 4.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // 4. Floating Dynamic Tooltip over Active City
        if (currentActive >= 0 && currentActive < CANVAS_CITIES.length) {
          const [ax, ay] = getCityPos(currentActive);
          const activeCity = CANVAS_CITIES[currentActive];

          ctx.save();
          ctx.globalAlpha = indiaAlpha;
          const labelText = `${activeCity.name} (${activeCity.day})`;
          ctx.font = 'bold 12px Inter, system-ui, sans-serif';
          const textMetrics = ctx.measureText(labelText);
          const paddingX = 11, paddingY = 6;
          const boxW = textMetrics.width + paddingX * 2;
          const boxH = 25;
          const boxX = ax - boxW / 2;
          const boxY = ay - 35;

          // Tooltip Background Box
          ctx.fillStyle = 'rgba(11, 20, 29, 0.95)';
          ctx.strokeStyle = '#ffd68a';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = 'rgba(242, 177, 52, 0.6)';
          ctx.shadowBlur = 14;

          drawSafeRoundedRect(ctx, boxX, boxY, boxW, boxH, 7);
          ctx.fill();
          ctx.stroke();

          // Tooltip Text
          ctx.fillStyle = '#ffd68a';
          ctx.shadowBlur = 0;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, ax, boxY + boxH / 2);

          // Indicator Pointer
          ctx.fillStyle = '#ffd68a';
          ctx.beginPath();
          ctx.moveTo(ax - 4, boxY + boxH);
          ctx.lineTo(ax + 4, boxY + boxH);
          ctx.lineTo(ax, boxY + boxH + 4);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', calculateFit);
      if (resizeObserver) resizeObserver.disconnect();
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Handle Canvas Marker Clicks
  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const padTop = rect.height * 0.14, padBottom = rect.height * 0.08, padSide = rect.width * 0.08;
    const box = { x: padSide, y: padTop, w: rect.width - 2 * padSide, h: rect.height - padTop - padBottom };
    const scale = Math.min(box.w / NATIVE_W, box.h / NATIVE_H);
    const offsetX = box.x + (box.w - NATIVE_W * scale) / 2;
    const offsetY = box.y + (box.h - NATIVE_H * scale) / 2;

    let clickedIdx = -1;
    let minDistance = 28;

    CANVAS_CITIES.forEach((city, idx) => {
      const cx = offsetX + city.nx * scale;
      const cy = offsetY + city.ny * scale;
      const dist = Math.hypot(clickX - cx, clickY - cy);
      if (dist < minDistance) {
        minDistance = dist;
        clickedIdx = idx;
      }
    });

    if (clickedIdx !== -1) {
      onSelectStop(clickedIdx);
    }
  }, [onSelectStop]);

  // Handle Hover State
  const handleCanvasMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const padTop = rect.height * 0.14, padBottom = rect.height * 0.08, padSide = rect.width * 0.08;
    const box = { x: padSide, y: padTop, w: rect.width - 2 * padSide, h: rect.height - padTop - padBottom };
    const scale = Math.min(box.w / NATIVE_W, box.h / NATIVE_H);
    const offsetX = box.x + (box.w - NATIVE_W * scale) / 2;
    const offsetY = box.y + (box.h - NATIVE_H * scale) / 2;

    let hoveredIdx = -1;
    CANVAS_CITIES.forEach((city, idx) => {
      const cx = offsetX + city.nx * scale;
      const cy = offsetY + city.ny * scale;
      if (Math.hypot(mouseX - cx, mouseY - cy) < 22) {
        hoveredIdx = idx;
      }
    });

    setHoveredCityIndex(hoveredIdx);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[620px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#0b141d] to-[#070b10] border border-[#f2b134]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] select-none ${className}`}
    >
      {/* Top Embedded Title & Subtitle Header (fades in when India reveals) */}
      <div className={`absolute top-4 left-0 right-0 text-center pointer-events-none z-10 transition-opacity duration-700 ${headerVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f3e8cf] tracking-wide drop-shadow-sm">
          Dairy Yatra
        </h3>
        <p className="text-[11px] sm:text-xs text-[#8ea0ac] tracking-wider mt-0.5">
          Nine stops across India's dairy belt
        </p>
      </div>

      {/* Interactive High-DPI Canvas Layer */}
      <canvas
        id="route-map-canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredCityIndex(-1)}
        className={`relative z-20 w-full h-full block ${hoveredCityIndex !== -1 ? 'cursor-pointer' : 'cursor-default'}`}
      />

      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#f2b134]/40 rounded-tl-lg pointer-events-none z-30" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#f2b134]/40 rounded-tr-lg pointer-events-none z-30" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#f2b134]/40 rounded-bl-lg pointer-events-none z-30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#f2b134]/40 rounded-br-lg pointer-events-none z-30" />
    </div>
  );
}
