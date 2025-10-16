
import React from 'react';

export default function ShotTable({ points, onClose }) {
  return (
    <div className="card" style={{marginTop:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>Saved Points ({points.length})</h3>
        <button onClick={onClose} className="big-btn">Close</button>
      </div>
      <div style={{overflow:'auto', maxHeight:420, marginTop:8}}>
        <table className="table">
          <thead><tr><th>#</th><th>Shots</th><th>Details</th></tr></thead>
          <tbody>
            {points.map((p,idx)=>(
              <tr key={p.id}>
                <td>{idx+1}</td>
                <td>{p.shots.length}</td>
                <td>
                  {p.shots.map((s,i)=>(
                    <div key={i} style={{marginBottom:6}}>
                      <strong>{s.shotType}</strong> • {s.outcome} • {s.serve || '-'} • {s.height} • {s.missedReturn? 'Missed':''} • Rally {s.rallyLength} • ({Math.round(s.x*100)}%, {Math.round(s.y*100)}%)
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
