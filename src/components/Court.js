
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Court = ({ shots, onCourtClick, lastShotIndex, showHeat }) => {
  const courtWidth = 340;
  const courtHeight = 680;
  const margin = 20;

  const baselineTop = margin;
  const baselineBottom = courtHeight - margin;
  const singlesLeft = margin + 28;
  const singlesRight = courtWidth - (margin + 28);
  const doublesLeft = margin;
  const doublesRight = courtWidth - margin;
  const netY = courtHeight / 2;
  const serviceLineDistance = courtHeight / 4;

  const grid = {};
  shots.forEach(s => {
    const px = Math.round((margin + s.x * (courtWidth - margin*2))/10)*10;
    const py = Math.round((margin + s.y * (courtHeight - margin*2))/10)*10;
    const key = px + ',' + py;
    grid[key] = (grid[key] || 0) + 1;
  });
  const heatPoints = Object.entries(grid).map(([k,v])=>{ const [px,py]=k.split(',').map(Number); return {x:px,y:py,count:v}; }).sort((a,b)=>b.count-a.count);

  return (
    <div className="court-wrapper card" style={{padding:12}}>
      <svg className="court-svg" viewBox={`0 0 ${courtWidth} ${courtHeight}`} width={courtWidth} height={courtHeight}
        onClick={(e)=>{
          const rect = e.target.closest('svg').getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * courtWidth;
          const y = ((e.clientY - rect.top) / rect.height) * courtHeight;
          onCourtClick({ x: (x - margin) / (courtWidth - margin*2), y: (y - margin) / (courtHeight - margin*2) });
        }}
        role="img" aria-label="Tennis court" style={{cursor:'crosshair'}}>
        <rect x="0" y="0" width={courtWidth} height={courtHeight} fill="#2f9b37" rx="10" />
        <rect x={margin} y={margin} width={courtWidth-margin*2} height={courtHeight-margin*2} fill="#005BBB" rx="8" />
        <g stroke="#fff" strokeWidth="2.2">
          <line x1={doublesLeft} y1={baselineTop} x2={doublesRight} y2={baselineTop} />
          <line x1={doublesLeft} y1={baselineBottom} x2={doublesRight} y2={baselineBottom} />
          <line x1={singlesLeft} y1={baselineTop} x2={singlesLeft} y2={baselineBottom} />
          <line x1={singlesRight} y1={baselineTop} x2={singlesRight} y2={baselineBottom} />
          <line x1={singlesLeft} y1={netY - serviceLineDistance} x2={singlesRight} y2={netY - serviceLineDistance} />
          <line x1={singlesLeft} y1={netY + serviceLineDistance} x2={singlesRight} y2={netY + serviceLineDistance} />
          <line x1={courtWidth/2} y1={netY - serviceLineDistance} x2={courtWidth/2} y2={netY + serviceLineDistance} />
          <line x1={courtWidth/2} y1={baselineTop-5} x2={courtWidth/2} y2={baselineTop+5} strokeWidth="1.6" />
          <line x1={courtWidth/2} y1={baselineBottom-5} x2={courtWidth/2} y2={baselineBottom+5} strokeWidth="1.6" />
          <line x1={singlesLeft} y1={netY} x2={singlesRight} y2={netY} stroke="#ffffffcc" strokeWidth="3" strokeDasharray="6,4" />
          <line x1={doublesLeft} y1={baselineTop} x2={doublesLeft} y2={baselineBottom} strokeWidth="1.6" />
          <line x1={doublesRight} y1={baselineTop} x2={doublesRight} y2={baselineBottom} strokeWidth="1.6" />
        </g>

        {showHeat && heatPoints.map((h,i)=>{
          const radius = Math.min(28, 6 + h.count*4);
          const opacity = Math.min(0.6, 0.12 + h.count*0.12);
          return <circle key={i} cx={h.x} cy={h.y} r={radius} fill={`rgba(255,0,0,${opacity})`} />;
        })}

        <AnimatePresence>
          {shots.map((s,i)=>{
            const px = margin + s.x * (courtWidth - margin*2);
            const py = margin + s.y * (courtHeight - margin*2);
            const color = s.outcome === 'Winner' ? '#00FF88' : s.outcome === 'Forced Error' ? '#FFD700' : '#FF4C4C';
            return (
              <motion.g key={s.id || i} initial={{opacity:0, scale:0.3}} animate={{opacity:1, scale:1}} exit={{opacity:0}} transition={{duration:0.25}}>
                <motion.circle cx={px} cy={py} r={7} fill={color} stroke="#fff" strokeWidth={1.2} />
              </motion.g>
            );
          })}
        </AnimatePresence>

        {shots.length>0 && (()=>{
          const last = shots[shots.length-1];
          const px = margin + last.x * (courtWidth - margin*2);
          const py = margin + last.y * (courtHeight - margin*2);
          return <motion.circle cx={px} cy={py} r={18} fill="none" stroke="#ffffff88" strokeWidth={3} initial={{scale:0}} animate={{scale:[0.8,1.4,1], opacity:[1,0.2,0]}} transition={{duration:1.2}} />;
        })()}

      </svg>
    </div>
  );
};

export default Court;
