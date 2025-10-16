
import React, { useState } from 'react';
import Court from './components/Court';
import ChartingPanel from './components/ChartingPanel';
import ShotTable from './components/ShotTable';

export default function App(){
  const [currentParams, setCurrentParams] = useState({
    serve: '',
    doubleFault: false,
    shotType: 'Forehand',
    outcome: 'Unforced Error',
    height: 'Medium',
    missedReturn: false
  });
  const [rallyLength, setRallyLength] = useState(1);
  const [currentRally, setCurrentRally] = useState([]); // shots in current point
  const [points, setPoints] = useState([]); // saved points (each point = shots[])
  const [showTable, setShowTable] = useState(false);
  const [showHeat, setShowHeat] = useState(true);

  const setParam = (key, value) => {
    setCurrentParams(p=>({...p, [key]: value}));
  };

  const incRally = ()=> setRallyLength(r=>r+1);
  const decRally = ()=> setRallyLength(r=> Math.max(1, r-1));

  const addShotAtPos = (pos) => {
    const shot = {
      id: Date.now() + Math.random(),
      x: Math.max(0, Math.min(1, pos.x)),
      y: Math.max(0, Math.min(1, pos.y)),
      serve: currentParams.serve,
      doubleFault: currentParams.doubleFault,
      shotType: currentParams.shotType,
      outcome: currentParams.outcome,
      height: currentParams.height,
      missedReturn: currentParams.missedReturn,
      rallyLength
    };
    setCurrentRally(r=>[...r, shot]);
  };

  const undoShot = ()=> setCurrentRally(r=> r.slice(0,-1));

  const savePoint = ()=>{
    if(currentRally.length===0){ alert('No shots to save for this point'); return; }
    const point = { id: Date.now(), shots: currentRally };
    setPoints(p=>[...p, point]);
    setCurrentRally([]);
    setRallyLength(1);
    setCurrentParams({
      serve: '',
      doubleFault: false,
      shotType: 'Forehand',
      outcome: 'Unforced Error',
      height: 'Medium',
      missedReturn: false
    });
    setShowTable(true);
  };

  const allShots = points.flatMap(p=>p.shots).concat(currentRally);

  return (
    <div className="app">
      <div className="header">
        <div>
          <div className="logo">BRC Tennis Charting v4</div>
          <div className="small">Responsive • Accurate court • Heatmap overlay</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="big-btn" onClick={()=>setShowTable(true)}>View Data</button>
          <button className="big-btn" onClick={()=>{ setPoints([]); setCurrentRally([]); }}>Clear All</button>
        </div>
      </div>

      <div className="main">
        <div className="left card">
          <Court shots={allShots} onCourtClick={addShotAtPos} lastShotIndex={allShots.length-1} showHeat={showHeat} />
          <div style={{marginTop:8, display:'flex', gap:8, justifyContent:'space-between'}}>
            <div className="small">Current Rally: {currentRally.length} shots</div>
            <div className="small">Rally len: {rallyLength}</div>
          </div>
        </div>

        <div className="right">
          <ChartingPanel currentParams={currentParams} setParam={setParam} rallyLength={rallyLength} incRally={incRally} decRally={decRally} addShotAtPos={addShotAtPos} undoShot={undoShot} savePoint={savePoint} toggleHeat={()=>setShowHeat(s=>!s)} showHeat={showHeat} />
        </div>
      </div>

      {showTable && <ShotTable points={points} onClose={()=>setShowTable(false)} />}
    </div>
  );
}
