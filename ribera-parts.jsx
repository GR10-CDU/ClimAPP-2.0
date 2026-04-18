// Ribera — shared atomic parts (sky, wave, compass, spark, etc)

window.labelStyle = (p) => ({
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: p.inkSoft,
  marginBottom: 8,
});

// Animated sky backdrop — handles weather conditions + time of day
window.SkyBackdrop = function SkyBackdrop({ palette, darkSky, weather, height }) {
  const p = palette;
  const skyBg = `linear-gradient(180deg, ${p.sky[0]} 0%, ${p.sky[1]} 45%, ${p.sky[2]} 80%, ${p.bg} 100%)`;

  return (
    <div style={{
      position:'absolute', left:0, right:0, top:0, height,
      background: skyBg,
      overflow:'hidden',
      pointerEvents: 'none',
    }}>
      {/* Sun or moon */}
      {weather !== 'tormenta' && (
        <div style={{
          position:'absolute',
          top: darkSky ? 60 : 70,
          right: darkSky ? 50 : 40,
          width: darkSky ? 70 : 110,
          height: darkSky ? 70 : 110,
          borderRadius:'50%',
          background: darkSky
            ? 'radial-gradient(circle at 35% 35%, #f1e9d8, #d4c9a8 60%, #a89a72)'
            : 'radial-gradient(circle, oklch(0.92 0.10 85) 0%, oklch(0.85 0.14 70) 70%, transparent 100%)',
          animation: darkSky ? 'none' : 'sunPulse 5s ease-in-out infinite',
          opacity: weather === 'nublado' || weather === 'lluvia' ? 0.4 : 0.95,
        }}/>
      )}

      {/* Stars */}
      {darkSky && (
        <>
          {Array.from({length: 25}).map((_, i) => {
            const x = (i * 37.3) % 100;
            const y = (i * 23.7) % 70;
            const size = 1 + (i % 3) * 0.4;
            return (
              <div key={i} style={{
                position:'absolute', left: `${x}%`, top: `${y}%`,
                width: size*2, height: size*2, borderRadius:'50%',
                background:'oklch(0.95 0.01 230)',
                animation: `twinkle ${2 + (i%3)}s ease-in-out ${i*0.2}s infinite`,
              }}/>
            );
          })}
        </>
      )}

      {/* Clouds — always some, more if nublado/lluvia/tormenta */}
      {weather !== 'despejado' && <Clouds weather={weather} darkSky={darkSky}/>}

      {/* Rain */}
      {(weather === 'lluvia' || weather === 'tormenta') && <Rain/>}

      {/* Fog (only at dawn) */}
      {palette.name === 'Amanecer' && <Fog/>}

      {/* Lightning (tormenta) */}
      {weather === 'tormenta' && <Lightning/>}
    </div>
  );
};

function Clouds({ weather, darkSky }) {
  const count = weather === 'nublado' || weather === 'lluvia' || weather === 'tormenta' ? 6 : 2;
  const opacity = weather === 'tormenta' ? 0.55 : weather === 'nublado' || weather === 'lluvia' ? 0.7 : 0.5;
  const color = darkSky
    ? (weather === 'tormenta' ? 'rgba(40,44,58,0.8)' : 'rgba(80,85,100,0.45)')
    : (weather === 'tormenta' ? 'rgba(95,100,115,0.7)' : 'rgba(255,255,255,0.7)');

  const clouds = Array.from({length: count}).map((_, i) => {
    const w = 90 + (i * 37) % 80;
    const y = 60 + (i * 43) % 150;
    const dur = 80 + (i * 7) % 50;
    const delay = -(i * 12) % dur;
    return (
      <div key={i} style={{
        position:'absolute', top: y,
        width: w, height: w * 0.38,
        borderRadius: w,
        background: color,
        filter: 'blur(10px)',
        opacity,
        animation: `drift ${dur}s linear ${delay}s infinite`,
      }}/>
    );
  });
  return <>{clouds}</>;
}

function Rain() {
  const drops = Array.from({length: 50}).map((_, i) => {
    const x = (i * 7.3) % 100;
    const dur = 0.6 + (i % 5) * 0.15;
    const delay = -(i * 0.13) % 1.5;
    return (
      <div key={i} style={{
        position:'absolute', left: `${x}%`, top: '-20vh',
        width: 1, height: 18,
        background: 'linear-gradient(to bottom, transparent, rgba(180,200,230,0.6))',
        animation: `rainFall ${dur}s linear ${delay}s infinite`,
      }}/>
    );
  });
  return <>{drops}</>;
}

function Fog() {
  return (
    <>
      {[0,1,2].map(i => (
        <div key={i} style={{
          position:'absolute',
          top: 120 + i*40, left: 0, right: 0, height: 60,
          background: 'radial-gradient(ellipse at center, rgba(255,250,240,0.55), transparent 70%)',
          filter: 'blur(12px)',
          animation: `fogDrift ${12 + i*3}s ease-in-out ${i*2}s infinite alternate`,
        }}/>
      ))}
    </>
  );
}

function Lightning() {
  return (
    <>
      <div style={{
        position:'absolute', inset:0,
        background:'rgba(255,255,255,0.9)',
        animation:'flashSky 7s ease-in-out infinite',
      }}/>
      <svg width="80" height="180" viewBox="0 0 80 180" style={{
        position:'absolute', top: 40, left: '30%',
        animation:'flashBolt 7s ease-in-out infinite',
      }}>
        <path d="M 38 0 L 20 90 L 42 88 L 18 180 L 58 70 L 36 72 Z"
          fill="oklch(0.95 0.08 85)" stroke="oklch(0.98 0.06 85)" strokeWidth="1"/>
      </svg>
    </>
  );
}

// Decorative river wave between sky and content
window.RiverWave = function RiverWave({ palette }) {
  return (
    <div style={{
      position: 'relative',
      height: 50,
      marginTop: -28,
      overflow: 'hidden',
      zIndex: 2,
    }}>
      <svg width="2400" height="50" viewBox="0 0 2400 50" preserveAspectRatio="none"
        style={{ animation: 'wave1 14s linear infinite' }}>
        <defs>
          <linearGradient id="rw1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.river[0]} stopOpacity="0.55"/>
            <stop offset="1" stopColor={palette.bg} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0 24 C 60 12, 120 36, 200 24 S 340 12, 400 24 S 540 36, 600 24 S 740 12, 800 24
          S 940 36, 1000 24 S 1140 12, 1200 24 S 1340 36, 1400 24 S 1540 12, 1600 24 S 1740 36, 1800 24
          S 1940 12, 2000 24 S 2140 36, 2200 24 S 2340 12, 2400 24 L 2400 50 L 0 50 Z"
          fill="url(#rw1)"/>
      </svg>
    </div>
  );
};

// Sparkline river (7d)
window.RiverSpark = function RiverSpark({ data, palette, height = 60, showDot = true }) {
  const w = 340, h = height, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const range = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = `${path} L${pts[pts.length-1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sp-${height}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.river[0]} stopOpacity="0.45"/>
          <stop offset="1" stopColor={palette.river[0]} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${height})`}/>
      <path d={path} fill="none" stroke={palette.river[0]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {showDot && (
        <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill={palette.accent}/>
      )}
    </svg>
  );
};

// Compass
window.Compass = function Compass({ deg, palette, size = 70 }) {
  const r = size / 2;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={r} cy={r} r={r - 1} fill="none" stroke={palette.border} strokeWidth="1"/>
        <text x={r} y="10" textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily='var(--font-mono)'>N</text>
        <text x={r} y={size - 3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily='var(--font-mono)'>S</text>
        <text x="7" y={r+3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily='var(--font-mono)'>O</text>
        <text x={size-7} y={r+3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily='var(--font-mono)'>E</text>
        <g transform={`rotate(${deg} ${r} ${r})`}>
          <path d={`M ${r} ${r - (r-8)} L ${r-5} ${r} L ${r+5} ${r} Z`} fill={palette.accent}/>
          <circle cx={r} cy={r} r="2" fill={palette.ink}/>
        </g>
      </svg>
    </div>
  );
};

// Sun arc
window.SunArc = function SunArc({ sol, palette }) {
  const progress = 0.62;
  const w = 180, h = 82;
  const cx = w / 2, cy = h - 6;
  const r = 72;
  const startAngle = Math.PI, endAngle = 0;
  const ang = startAngle + (endAngle - startAngle) * progress;
  const sx = cx + Math.cos(ang) * r;
  const sy = cy + Math.sin(ang) * r;

  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={palette.border} strokeWidth="1" strokeDasharray="3 4"/>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sx} ${sy}`}
          fill="none" stroke={palette.accent} strokeWidth="1.5"/>
        <circle cx={sx} cy={sy} r="7" fill={palette.accent}/>
        <circle cx={sx} cy={sy} r="10" fill={palette.accent} opacity="0.2"/>
      </svg>
      <div style={{
        display:'flex', justifyContent:'space-between',
        fontSize: 11, fontFamily: 'var(--font-mono)',
        color: palette.inkSoft, marginTop: -4,
      }}>
        <span>↑ {sol.salida}</span>
        <span>↓ {sol.puesta}</span>
      </div>
    </div>
  );
};

// Hourly horizontal scroller
window.HourlyScroller = function HourlyScroller({ horario, palette }) {
  const temps = horario.map(h => h.temp);
  const min = Math.min(...temps), max = Math.max(...temps);
  const range = (max - min) || 1;
  return (
    <div style={{
      display:'flex', gap: 16, overflowX:'auto',
      paddingBottom: 4, marginRight: -16, paddingRight: 16,
      WebkitOverflowScrolling: 'touch',
    }}>
      {horario.map((h,i) => {
        const h2 = 54;
        const y = h2 - ((h.temp - min) / range) * (h2 - 8) - 4;
        return (
          <div key={i} style={{
            flexShrink: 0, display:'flex', flexDirection:'column',
            alignItems:'center', gap: 6, minWidth: 40,
          }}>
            <div style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: palette.inkSoft,
            }}>{h.hora}</div>
            <div style={{ fontSize: 18 }}>{h.icon}</div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 20, fontFeatureSettings: "'tnum' 1", color: palette.ink,
            }}>{h.temp}°</div>
            <div style={{
              width: 3, height: h2, background: palette.border, borderRadius: 2,
              position: 'relative', marginTop: 2,
            }}>
              <div style={{
                position:'absolute', top: y, left:-1, width: 5, height: 5,
                background: palette.accent, borderRadius:'50%',
              }}/>
            </div>
            <div style={{
              fontSize: 10, fontFamily: 'var(--font-mono)',
              color: h.prob > 30 ? palette.accent : palette.inkSoft,
            }}>{h.prob}%</div>
          </div>
        );
      })}
    </div>
  );
};

window.TempBar = function TempBar({ min, max, globalMin, globalMax, palette }) {
  const range = globalMax - globalMin;
  const left = ((min - globalMin) / range) * 100;
  const width = ((max - min) / range) * 100;
  return (
    <div style={{
      position:'relative', height: 5, background: palette.border, borderRadius: 3,
    }}>
      <div style={{
        position:'absolute', left: `${left}%`, width: `${width}%`, top: 0, bottom: 0,
        background: `linear-gradient(90deg, oklch(0.70 0.12 220), oklch(0.65 0.14 60))`,
        borderRadius: 3,
      }}/>
    </div>
  );
};
