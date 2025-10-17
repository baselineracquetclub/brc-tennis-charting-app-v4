
export function exportCSV(points) {
  const rows = [['Point #','Shot #','ShotType','Outcome','Serve','Height','MissedReturn','RallyLength','X','Y','Winner','ScoreBefore']];
  points.forEach((p,pi)=>{
    p.shots.forEach((s,si)=> rows.push([pi+1, si+1, s.shotType, s.outcome, s.serve, s.height, s.missedReturn?'Yes':'No', s.rallyLength, s.x.toFixed(3), s.y.toFixed(3), p.winner, JSON.stringify(p.scoreBefore)]));
  });
  return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
}
