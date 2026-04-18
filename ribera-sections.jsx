// Ribera — section components (collapsible cards, specialized widgets)

// Generic collapsible section card
window.Section = function Section({ id, title, subtitle, icon, children, palette, density, collapsed, onToggle, compact: alwaysCompact }) {
  const p = palette;
  const pad = density === 'compact' ? 14 : 18;
  return (
    <div style={{
      background: p.card,
      border: `1px solid ${p.border}`,
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      <button onClick={() => onToggle(id)} style={{
        width:'100%', display:'flex', alignItems:'center',
        gap: 12, padding: `${pad}px ${pad+2}px ${collapsed ? pad : pad-2}px`,
        background:'transparent', border:0,
        color: p.ink, cursor:'pointer', textAlign:'left',
        fontFamily: 'var(--font-sans)',
      }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20, lineHeight: 1.1,
          }}>{title}</div>
          {subtitle && <div style={{
            fontSize: 11, fontFamily: 'var(--font-mono)',
            color: p.inkSoft, letterSpacing: '0.1em', marginTop: 2,
          }}>{subtitle}</div>}
        </div>
        <span style={{
          fontSize: 11, color: p.inkSoft,
          fontFamily: 'var(--font-mono)',
          transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 0.2s',
        }}>▾</span>
      </button>
      {!collapsed && (
        <div style={{
          padding: `0 ${pad+2}px ${pad}px`,
          animation: 'expandIn 0.22s ease-out',
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Río card (big — always open on top, not collapsible)
window.RioCard = function RioCard({ data, palette, density, onTap }) {
  const p = palette;
  const compact = density === 'compact';
  return (
    <div onClick={onTap} style={{
      background: p.card,
      border: `1px solid ${p.border}`,
      borderRadius: 22,
      padding: compact ? 18 : 22,
      cursor: 'pointer',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 14,
      }}>
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: p.inkSoft,
            fontFamily: 'var(--font-mono)',
            marginBottom: 4,
          }}>🌊 Río Uruguay · {data.rio.puerto}</div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 52, lineHeight: 1,
            letterSpacing: '-0.02em',
            color: p.ink,
            fontFeatureSettings: "'tnum' 1",
          }}>
            {data.rio.nivel.toFixed(2)}<span style={{ fontSize: 24, color: p.inkSoft, marginLeft: 4 }}>m</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 11, color: p.inkSoft, marginBottom: 4,
            fontFamily: 'var(--font-mono)',
          }}>Δ 24h</div>
          <div style={{
            fontSize: 18, color: 'oklch(0.60 0.14 150)',
            fontWeight: 500, fontFeatureSettings: "'tnum' 1",
          }}>
            {data.rio.tendencia}m
          </div>
        </div>
      </div>

      <window.RiverSpark data={data.rio.historial} palette={p} height={60}/>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 14, paddingTop: 14,
        borderTop: `1px solid ${p.border}`,
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        color: p.inkSoft,
      }}>
        <span>mín 7d · {data.rio.min7d}m</span>
        <span>estado · <span style={{color: 'oklch(0.60 0.14 150)'}}>{data.rio.estado.toLowerCase()}</span></span>
        <span>máx 7d · {data.rio.max7d}m</span>
      </div>
    </div>
  );
};

// Expanded river detail (30-day)
window.RioExpanded = function RioExpanded({ data, palette, onClose }) {
  const p = palette;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position:'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding: 20,
    }}>
      <div style={{
        background: p.card,
        borderRadius: 24, border: `1px solid ${p.border}`,
        padding: 24, maxWidth: 520, width:'100%',
        color: p.ink,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{
              fontSize: 11, fontFamily:'var(--font-mono)',
              letterSpacing: '0.16em', color: p.inkSoft,
              textTransform: 'uppercase', marginBottom: 4,
            }}>🌊 Río Uruguay · últimos 30 días</div>
            <div style={{
              fontFamily:'var(--font-serif)', fontSize: 28, lineHeight:1,
            }}>Historial extendido</div>
          </div>
          <button onClick={onClose} style={{
            background:'transparent', border:0, fontSize: 20,
            color: p.inkSoft, cursor:'pointer', padding: 4,
          }}>✕</button>
        </div>
        <window.RiverSpark data={data.rio.historial30d} palette={p} height={120}/>
        <div style={{
          marginTop: 20,
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: p.inkSoft, letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>Estaciones del Río Uruguay · Norte → Sur</div>
        <div style={{ marginTop: 10 }}>
          {data.rio.estaciones.map((e, i) => (
            <div key={e.nombre} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize: 16 }}>{e.nombre}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 13,
                color: p.ink, fontFeatureSettings: "'tnum' 1",
              }}>
                {e.nivel.toFixed(2)}m <span style={{ color: p.inkSoft, marginLeft: 6 }}>{e.estado.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Alert banner
window.AlertBanner = function AlertBanner({ alert, palette }) {
  return (
    <div style={{
      background: `oklch(0.96 0.06 85)`,
      border: `1px solid oklch(0.85 0.10 85)`,
      borderRadius: 20,
      padding: 18,
      color: 'oklch(0.30 0.06 50)',
    }}>
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        marginBottom: 6, color: 'oklch(0.45 0.12 60)',
        display:'flex', alignItems:'center', gap: 6,
      }}>⚠ Alerta amarilla · SMN</div>
      <div style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 20, lineHeight: 1.2, marginBottom: 4,
      }}>{alert.titulo}</div>
      <div style={{ fontSize: 13, color: 'oklch(0.40 0.04 50)' }}>
        {alert.desc} · {alert.vigencia}
      </div>
    </div>
  );
};

// 3-day forecast with swipe
window.ForecastSwiper = function ForecastSwiper({ data, palette }) {
  const [idx, setIdx] = React.useState(0);
  const touchStart = React.useRef(null);
  const all = [...data.diario, ...data.extendido];
  const visible = all.slice(idx, idx + 3);
  const canPrev = idx > 0;
  const canNext = idx < all.length - 3;

  const onTouchStart = (e) => touchStart.current = e.touches[0].clientX;
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx < -40 && canNext) setIdx(i => Math.min(all.length - 3, i + 1));
    if (dx > 40 && canPrev) setIdx(i => Math.max(0, i - 1));
    touchStart.current = null;
  };

  return (
    <div>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em', color: palette.inkSoft,
        }}>
          {idx+1}–{idx+3} de {all.length} · swipe
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <button disabled={!canPrev} onClick={() => setIdx(i => Math.max(0, i-1))}
            style={navBtn(palette, !canPrev)}>←</button>
          <button disabled={!canNext} onClick={() => setIdx(i => Math.min(all.length-3, i+1))}
            style={navBtn(palette, !canNext)}>→</button>
        </div>
      </div>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {visible.map((d,i) => (
          <div key={idx + '-' + d.dia} style={{
            display:'grid',
            gridTemplateColumns: '62px 32px 1fr 90px',
            alignItems:'center',
            padding: '12px 4px',
            borderTop: i > 0 ? `1px solid ${palette.border}` : 'none',
            gap: 10,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 18, lineHeight: 1,
              }}>{d.dia}</div>
              <div style={{ fontSize: 11, color: palette.inkSoft, fontFamily: 'var(--font-mono)' }}>{d.fecha}</div>
            </div>
            <div style={{ fontSize: 22 }}>{d.icon}</div>
            <window.TempBar min={d.min} max={d.max} globalMin={12} globalMax={30} palette={palette}/>
            <div style={{
              fontSize: 13, textAlign:'right',
              fontFamily: 'var(--font-mono)',
              color: palette.inkSoft, fontFeatureSettings: "'tnum' 1",
            }}>
              {d.min}° — {d.max}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const navBtn = (palette, disabled) => ({
  width: 28, height: 28, borderRadius: 8,
  background: 'transparent',
  border: `1px solid ${palette.border}`,
  color: disabled ? palette.border : palette.inkSoft,
  cursor: disabled ? 'default' : 'pointer',
  fontFamily: 'inherit', fontSize: 14,
  opacity: disabled ? 0.4 : 1,
});

// Pull-to-refresh indicator
window.PullToRefresh = function PullToRefresh({ pull, refreshing, palette }) {
  const progress = Math.min(1, pull / 80);
  return (
    <div style={{
      position:'absolute', top: 0, left:0, right:0,
      display:'flex', justifyContent:'center', alignItems:'center',
      height: Math.max(0, pull),
      pointerEvents:'none', zIndex: 10,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius:'50%',
        border: `2px solid ${palette.inkSoft}`,
        borderTopColor: 'transparent',
        opacity: progress,
        transform: refreshing ? 'none' : `rotate(${progress * 360}deg)`,
        animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
      }}/>
    </div>
  );
};
