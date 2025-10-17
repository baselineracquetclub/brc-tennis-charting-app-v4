
import React, { useEffect, useState } from 'react';
import Court from './components/Court';
import ButtonsPanel from './components/ButtonsPanel';
import PointTable from './components/PointTable';
import { exportCSV } from './utils/dataHandler';

const LS_KEY = 'brc_v4_points';
const LS_SCORE = 'brc_v4_score';

function makeEmptyParams() {
  return {
    serve: '',
    doubleFault: false,
    shotType: 'Forehand',
    outcome: 'Unforced Error',
    height: 'Medium',
    missedReturn: false
  };
}

function defaultScore() {
  return {
    players: [
      { name: 'Player A', points: 0, games: 0, sets: 0 },
      { name: 'Player B', points: 0, games: 0, sets: 0 }
    ],
    pointState: { a: 0, b: 0 }
  };
}

export default function App() {
  const [currentParams, setCurrentParams] = useState(makeEmptyParams());
  const [rallyLength, setRallyLength] = useState(1);
  const [currentRally, setCurrentRally] = useState([]);
  const [points, setPoints] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showHeat, setShowHeat] = useState(true);
  const [score, setScore] = useState(defaultScore());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPoints(JSON.parse(raw));
      const rawScore = localStorage.getItem(LS_SCORE);
      if (rawScore) setScore(JSON.parse(rawScore));
    } catch (e) { console.warn('load error', e); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(points)); } catch(e){}
  }, [points]);

  useEffect(() => {
    try { localStorage.setItem(LS_SCORE, JSON.stringify(score)); } catch(e){}
  }, [score]);

  const setParam = (key, value) => setCurrentParams(p => ({ ...p, [key]: value }));

  const incRally = () => setRallyLength(r => r + 1);
  const decRally = () => setRallyLength(r => Math.max(1, r - 1));

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
    setCurrentRally(r => [...r, shot]);
  };

  const undoShot = () => setCurrentRally(r => r.slice(0, -1));

  const winGame = (scoreObj, winnerIndex) => {
    scoreObj.players[winnerIndex].games = (scoreObj.players[winnerIndex].games || 0) + 1;
    scoreObj.pointState.a = 0;
    scoreObj.pointState.b = 0;
    const aGames = scoreObj.players[0].games;
    const bGames = scoreObj.players[1].games;
    if ((aGames >= 6 || bGames >= 6) && Math.abs(aGames - bGames) >= 2) {
      scoreObj.players[winnerIndex].sets = (scoreObj.players[winnerIndex].sets || 0) + 1;
      scoreObj.players[0].games = 0;
      scoreObj.players[1].games = 0;
    }
  };

  const completePointAndScore = (winnerIndex) => {
    const pointObj = { id: Date.now(), winner: winnerIndex, shots: currentRally, scoreBefore: score };
    setPoints(prev => [...prev, pointObj]);

    setScore(prev => {
      const s = JSON.parse(JSON.stringify(prev));
      const aPts = s.pointState.a;
      const bPts = s.pointState.b;
      if (aPts >= 3 && bPts >= 3) {
        if (winnerIndex === 0) {
          if (aPts === 4) winGame(s, 0);
          else if (bPts === 4) s.pointState.b = 3;
          else if (aPts === 3 && bPts === 3) s.pointState.a = 4;
          else s.pointState.a = Math.min(4, s.pointState.a + 1);
        } else {
          if (bPts === 4) winGame(s, 1);
          else if (aPts === 4) s.pointState.a = 3;
          else if (aPts === 3 && bPts === 3) s.pointState.b = 4;
          else s.pointState.b = Math.min(4, s.pointState.b + 1);
        }
      } else {
        if (winnerIndex === 0) s.pointState.a = Math.min(4, s.pointState.a + 1);
        else s.pointState.b = Math.min(4, s.pointState.b + 1);
        if (s.pointState.a >= 4 && s.pointState.a - s.pointState.b >= 1) winGame(s, 0);
        else if (s.pointState.b >= 4 && s.pointState.b - s.pointState.a >= 1) winGame(s, 1);
      }
      return s;
    });

    setCurrentRally([]);
    setRallyLength(1);
    setCurrentParams(makeEmptyParams());
    setShowTable(true);
  };

  const handleExport = () => {
    const csv = exportCSV(points);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'brc_points.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (!window.confirm('Clear ALL saved data (points & score)?')) return;
    setPoints([]); setCurrentRally([]); setRallyLength(1); setCurrentParams(makeEmptyParams()); setScore(defaultScore());
    localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_SCORE);
  };

  const pointToLabel = (pt) => {
    if (pt === 0) return '0';
    if (pt === 1) return '15';
    if (pt === 2) return '30';
    if (pt === 3) return '40';
    if (pt === 4) return 'Ad';
    return String(pt);
  };

  return (
    <div className="app">
      <div className="header">
        <div>
          <div className="logo">BRC Tennis Charting v4.1</div>
          <div className="small">Score + Charting • Heatmap overlay • Auto-save to localStorage</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ textAlign: 'right', marginRight: 8 }}>
            <div style={{ fontWeight: 700 }}>{score.players[0].name} — {score.players[1].name}</div>
            <div className="small">
              Points: {pointToLabel(score.pointState.a)} - {pointToLabel(score.pointState.b)} &nbsp; | &nbsp;
              Games: {score.players[0].games} - {score.players[1].games} &nbsp; | &nbsp;
              Sets: {score.players[0].sets} - {score.players[1].sets}
            </div>
          </div>

          <button className="big-btn" onClick={() => setShowTable(true)}>View Data</button>
          <button className="big-btn" onClick={handleExport}>Export CSV</button>
          <button className="big-btn" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <div className="main">
        <div className="left card">
          <Court
            shots={points.flatMap(p => p.shots).concat(currentRally)}
            onCourtClick={addShotAtPos}
            lastShotIndex={points.flatMap(p => p.shots).concat(currentRally).length-1}
            showHeat={showHeat}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            <div className="small">Current Rally: {currentRally.length} shots</div>
            <div className="small">Rally len: {rallyLength}</div>
          </div>
        </div>

        <div className="right">
          <ButtonsPanel
            currentParams={currentParams}
            setParam={setParam}
            rallyLength={rallyLength}
            incRally={incRally}
            decRally={decRally}
            undoShot={undoShot}
            savePoint={() => {}}
            toggleHeat={() => setShowHeat(s => !s)}
            showHeat={showHeat}
          />

          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Mark Point Winner</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="big-btn btn-primary" onClick={() => completePointAndScore(0)}>{score.players[0].name} Wins Point</button>
              <button className="big-btn btn-primary" onClick={() => completePointAndScore(1)}>{score.players[1].name} Wins Point</button>
            </div>
            <div style={{ marginTop: 8 }} className="small">Tapping a player will auto-save the current rally as a point and update the score.</div>
          </div>
        </div>
      </div>

      {showTable && <PointTable points={points} onClose={() => setShowTable(false)} onExport={handleExport} />}
    </div>
  );
}
