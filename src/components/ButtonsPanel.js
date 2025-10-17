
import React from 'react';
import { Button } from './ui/Button';

const ButtonsPanel = ({ currentParams, setParam, rallyLength, incRally, decRally, undoShot, savePoint, toggleHeat, showHeat }) => {

  const Btn = ({ label, onClick, active, className }) => <Button onClick={onClick} active={active} className={className}>{label}</Button>;

  return (
    <div className="card controls-section">
      <h3 style={{ marginTop: 0 }}>Controls</h3>

      <div style={{ marginBottom: 8 }}>
        <div className="small">Serve</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 6 }}>
          <Btn label="1st Serve" onClick={() => setParam('serve', '1st')} active={currentParams.serve === '1st'} className="btn-serve" />
          <Btn label="2nd Serve" onClick={() => setParam('serve', '2nd')} active={currentParams.serve === '2nd'} className="btn-serve" />
          <Btn label="Double Fault" onClick={() => setParam('doubleFault', !currentParams.doubleFault)} active={currentParams.doubleFault} className="btn-warning" />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small">Shot Type</div>
        <div className="controls-grid" style={{ marginTop: 6 }}>
          <Btn label="Forehand" onClick={() => setParam('shotType', 'Forehand')} active={currentParams.shotType === 'Forehand'} />
          <Btn label="Backhand" onClick={() => setParam('shotType', 'Backhand')} active={currentParams.shotType === 'Backhand'} />
          <Btn label="Volley" onClick={() => setParam('shotType', 'Volley')} active={currentParams.shotType === 'Volley'} />
          <Btn label="Overhead" onClick={() => setParam('shotType', 'Overhead')} active={currentParams.shotType === 'Overhead'} />
          <Btn label="Missed Return" onClick={() => setParam('missedReturn', !currentParams.missedReturn)} active={currentParams.missedReturn} className="btn-warning" />
          <div />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small">Outcome</div>
        <div className="controls-grid" style={{ marginTop: 6 }}>
          <Btn label="Winner" onClick={() => setParam('outcome', 'Winner')} active={currentParams.outcome === 'Winner'} className="btn-primary" />
          <Btn label="Forced Error" onClick={() => setParam('outcome', 'Forced Error')} active={currentParams.outcome === 'Forced Error'} className="btn-secondary" />
          <Btn label="Unforced Error" onClick={() => setParam('outcome', 'Unforced Error')} active={currentParams.outcome === 'Unforced Error'} className="btn-secondary" />
          <div /><div /><div />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small">Contact Height</div>
        <div className="controls-grid" style={{ marginTop: 6 }}>
          <Btn label="Low" onClick={() => setParam('height', 'Low')} active={currentParams.height === 'Low'} />
          <Btn label="Medium" onClick={() => setParam('height', 'Medium')} active={currentParams.height === 'Medium'} />
          <Btn label="High" onClick={() => setParam('height', 'High')} active={currentParams.height === 'High'} />
          <div /><div /><div />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="small">Rally Length</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{rallyLength}</div>
            <Button onClick={incRally}>+1</Button>
            <Button onClick={decRally}>-1</Button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button onClick={undoShot} className="btn-secondary">Undo Last Shot</Button>
        <Button onClick={savePoint} className="btn-primary">Save Point</Button>
      </div>

      <div className="stat-row" style={{ marginTop: 10 }}>
        <div className="small">Heatmap</div>
        <Button onClick={toggleHeat} className="btn-warning">{showHeat ? 'Hide Heat' : 'Show Heat'}</Button>
      </div>
    </div>
  );
};

export default ButtonsPanel;
