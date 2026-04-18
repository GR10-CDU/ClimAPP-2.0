// VARIANTE A — "RIBERA"
// Editorial, minimalista tipo Apple Weather pero con alma local.
// Tipografía serif grande (Instrument Serif) mezclada con Inter Tight.
// Hero: temperatura gigante arriba, línea del río abajo como metáfora.

const Ribera = ({ palette, density, data, darkSky }) => {
  const p = palette;
  const compact = density === 'compact';
  const pad = compact ? 16 : 20;
  const gap = compact ? 12 : 18;

  // Gradient sky covers top half, river wave at midpoint
  const skyBg = `linear-gradient(180deg, ${p.sky[0]} 0%, ${p.sky[1]} 45%, ${p.sky[2]} 80%, ${p.bg} 100%)`;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: p.bg,
      color: p.ink,
      overflow: 'auto',
      position: 'relative',
      fontFamily: "'Inter Tight', sans-serif",
    }}>
      {/* Sky hero */}
      <div style={{
        position: 'relative',
        height: 440,
        background: skyBg,
        padding: `${compact ? 56 : 62}px ${pad}px 0`,
        overflow: 'hidden',
      }}>
        {/* animated sun/moon */}
        <div style={{
          position: 'absolute',
          top: darkSky ? 60 : 90,
          right: darkSky ? 60 : 50,
          width: darkSky ? 70 : 110,
          height: darkSky ? 70 : 110,
          borderRadius: '50%',
          background: darkSky
            ? 'radial-gradient(circle at 35% 35%, #f1e9d8, #d4c9a8 60%, #a89a72)'
            : 'radial-gradient(circle, oklch(0.92 0.10 85) 0%, oklch(0.85 0.14 70) 70%, transparent 100%)',
          boxShadow: darkSky ? 'none' : `0 0 60px oklch(0.85 0.14 70 / 0.4)`,
          opacity: 0.92,
        }} />

        {/* subtle clouds */}
        {!darkSky && (
          <>
            <div style={cloudStyle(20, 180, 70)}/>
            <div style={cloudStyle(240, 120, 50)}/>
          </>
        )}
        {/* stars when night */}
        {darkSky && (
          <>
            {[[40,90,1],[90,60,1.5],[150,100,1],[210,50,1.2],[280,120,1],[320,80,1.8],[120,40,1]].map((s,i)=>(
              <div key={i} style={{
                position:'absolute', left:s[0], top:s[1],
                width:s[2]*2, height:s[2]*2, borderRadius:'50%',
                background:'oklch(0.95 0.01 230)', opacity:0.8,
              }}/>
            ))}
          </>
        )}

        {/* Location */}
        <div style={{
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: p.inkSoft,
          marginBottom: 6,
        }}>
          {data.provincia} · Argentina
        </div>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 32,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: p.ink,
          marginBottom: 28,
        }}>
          {data.ciudad}
        </div>

        {/* Giant temp */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 180,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: p.ink,
            fontFeatureSettings: "'tnum' 1",
          }}>
            {data.temp}
          </div>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 54,
            lineHeight: 1,
            marginTop: 8,
            color: p.inkSoft,
          }}>°</div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingRight: 8,
        }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontSize: 22,
            color: p.ink,
          }}>{data.condicion}</div>
          <div style={{
            fontSize: 13,
            color: p.inkSoft,
            fontFeatureSettings: "'tnum' 1",
          }}>
            máx {data.tempMax}° · mín {data.tempMin}°
          </div>
        </div>
      </div>

      {/* River wave — the signature element */}
      <RiverWave palette={p} />

      {/* Stack */}
      <div style={{ padding: `0 ${pad}px ${pad+60}px`, display: 'flex', flexDirection: 'column', gap }}>
        {/* Río Uruguay card — editorial */}
        <div style={{
          background: p.card,
          border: `1px solid ${p.border}`,
          borderRadius: 20,
          padding: compact ? 18 : 22,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <div>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: p.inkSoft,
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 4,
              }}>Río Uruguay · {data.rio.puerto}</div>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 52,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: p.ink,
                fontFeatureSettings: "'tnum' 1",
              }}>
                {data.rio.nivel.toFixed(2)}<span style={{ fontSize: 24, color: p.inkSoft, marginLeft: 4 }}>m</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 11,
                color: p.inkSoft,
                marginBottom: 4,
                fontFamily: "'JetBrains Mono', monospace",
              }}>24h</div>
              <div style={{
                fontSize: 18,
                color: 'oklch(0.55 0.14 150)',
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 500,
                fontFeatureSettings: "'tnum' 1",
              }}>
                {data.rio.tendencia}m
              </div>
            </div>
          </div>

          {/* 7-day spark */}
          <RiverSpark data={data.rio.historial} palette={p} height={60}/>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${p.border}`,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: p.inkSoft,
          }}>
            <span>mín 7d · {data.rio.min7d}m</span>
            <span>estado · <span style={{color: 'oklch(0.55 0.14 150)'}}>{data.rio.estado.toLowerCase()}</span></span>
            <span>máx 7d · {data.rio.max7d}m</span>
          </div>
        </div>

        {/* Viento + Sol — two inline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>
          <div style={{
            background: p.card,
            border: `1px solid ${p.border}`,
            borderRadius: 20,
            padding: compact ? 16 : 20,
          }}>
            <div style={labelStyle(p)}>Viento</div>
            <div style={{
              display:'flex', alignItems:'baseline', gap: 4, marginBottom: 8,
            }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 40, lineHeight: 1,
                fontFeatureSettings: "'tnum' 1",
              }}>{data.viento.velocidad}</div>
              <div style={{ fontSize: 13, color: p.inkSoft }}>km/h</div>
            </div>
            <Compass deg={data.viento.direccionDeg} palette={p} size={compact ? 60 : 70}/>
            <div style={{ fontSize: 11, color: p.inkSoft, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>
              {data.viento.direccion} · ráf {data.viento.rafaga}
            </div>
          </div>

          <div style={{
            background: p.card,
            border: `1px solid ${p.border}`,
            borderRadius: 20,
            padding: compact ? 16 : 20,
          }}>
            <div style={labelStyle(p)}>Sol</div>
            <SunArc sol={data.sol} palette={p}/>
          </div>
        </div>

        {/* Hourly */}
        <div style={{
          background: p.card,
          border: `1px solid ${p.border}`,
          borderRadius: 20,
          padding: compact ? 16 : 20,
        }}>
          <div style={{...labelStyle(p), marginBottom: 14}}>Próximas horas</div>
          <HourlyScroller horario={data.horario} palette={p} serif/>
        </div>

        {/* 3-day */}
        <div style={{
          background: p.card,
          border: `1px solid ${p.border}`,
          borderRadius: 20,
          padding: compact ? 14 : 18,
        }}>
          <div style={{...labelStyle(p), marginBottom: 10, marginLeft: 4}}>Próximos 3 días</div>
          {data.diario.map((d,i) => (
            <div key={d.dia} style={{
              display:'grid',
              gridTemplateColumns: '60px 40px 1fr 90px',
              alignItems:'center',
              padding: '12px 4px',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
              gap: 8,
            }}>
              <div>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 18,
                  lineHeight: 1,
                }}>{d.dia}</div>
                <div style={{ fontSize: 11, color: p.inkSoft, fontFamily: "'JetBrains Mono', monospace" }}>{d.fecha}</div>
              </div>
              <div style={{ fontSize: 22 }}>{d.icon}</div>
              <TempBar min={d.min} max={d.max} globalMin={13} globalMax={27} current={null} palette={p}/>
              <div style={{
                fontSize: 13,
                textAlign:'right',
                fontFamily: "'JetBrains Mono', monospace",
                color: p.inkSoft,
                fontFeatureSettings: "'tnum' 1",
              }}>
                {d.min}° — {d.max}°
              </div>
            </div>
          ))}
        </div>

        {/* Alerta */}
        {data.alertas[0] && (
          <div style={{
            background: `oklch(0.96 0.06 85)`,
            border: `1px solid oklch(0.85 0.10 85)`,
            borderRadius: 20,
            padding: 18,
            color: 'oklch(0.30 0.06 50)',
          }}>
            <div style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: 6,
              color: 'oklch(0.45 0.12 60)',
            }}>⚠ Alerta amarilla</div>
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 20,
              lineHeight: 1.2,
              marginBottom: 4,
            }}>{data.alertas[0].titulo}</div>
            <div style={{ fontSize: 13, color: 'oklch(0.40 0.04 50)' }}>{data.alertas[0].desc}</div>
          </div>
        )}

        {/* Feriados */}
        <div style={{
          background: p.card,
          border: `1px solid ${p.border}`,
          borderRadius: 20,
          padding: compact ? 16 : 20,
        }}>
          <div style={{...labelStyle(p), marginBottom: 14}}>Próximos feriados</div>
          {data.feriados.map((f, i) => (
            <div key={f.nombre} style={{
              display:'flex', justifyContent:'space-between', alignItems:'baseline',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 18, lineHeight: 1.2,
                }}>{f.nombre}</div>
                <div style={{
                  fontSize: 11, color: p.inkSoft,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 2,
                }}>{f.tipo}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 16,
                }}>{f.fecha}</div>
                <div style={{
                  fontSize: 11, color: p.inkSoft,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>en {f.dias} días</div>
              </div>
            </div>
          ))}
        </div>

        {/* Deportes */}
        <div style={{
          background: p.card,
          border: `1px solid ${p.border}`,
          borderRadius: 20,
          padding: compact ? 16 : 20,
        }}>
          <div style={{...labelStyle(p), marginBottom: 14}}>Fútbol · próximos</div>
          {data.deportes.map((dp,i) => (
            <div key={i} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14 }}>
                  {dp.local} <span style={{ color: p.inkSoft }}>vs</span> {dp.visitante}
                </div>
                <div style={{
                  fontSize: 11,
                  color: p.inkSoft,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 2,
                }}>{dp.liga}</div>
              </div>
              <div style={{
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                color: p.inkSoft,
              }}>{dp.hora}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: p.inkSoft,
          padding: '8px 0',
          letterSpacing: '0.1em',
        }}>
          actualizado {data.actualizado}
        </div>
      </div>
    </div>
  );
};

// Helpers
const labelStyle = (p) => ({
  fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: p.inkSoft,
  marginBottom: 8,
});

const cloudStyle = (x, y, w) => ({
  position: 'absolute',
  left: x,
  top: y,
  width: w,
  height: w * 0.4,
  borderRadius: w,
  background: 'rgba(255,255,255,0.5)',
  filter: 'blur(8px)',
  pointerEvents: 'none',
});

// Decorative river wave between sky and content
const RiverWave = ({ palette }) => {
  const [shift, setShift] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (t) => {
      setShift(((t - start) / 40) % 390);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      position: 'relative',
      height: 46,
      marginTop: -24,
      overflow: 'hidden',
    }}>
      <svg width="780" height="46" viewBox="0 0 780 46" preserveAspectRatio="none"
        style={{ position: 'absolute', left: -shift, top: 0 }}>
        <defs>
          <linearGradient id="rw1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.river[0]} stopOpacity="0.6"/>
            <stop offset="1" stopColor={palette.bg} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`
          M0 20
          C 60 8, 120 32, 195 20
          S 330 8, 390 20
          S 525 32, 585 20
          S 720 8, 780 20
          L 780 46 L 0 46 Z
        `} fill="url(#rw1)"/>
      </svg>
    </div>
  );
};

// Sparkline for river
const RiverSpark = ({ data, palette, height = 60 }) => {
  const w = 330;
  const h = height;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
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
        <linearGradient id="sp1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.river[0]} stopOpacity="0.4"/>
          <stop offset="1" stopColor={palette.river[0]} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp1)"/>
      <path d={path} fill="none" stroke={palette.river[0]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r={i === pts.length - 1 ? 4 : 0} fill={palette.accent}/>
      ))}
    </svg>
  );
};

// Compass
const Compass = ({ deg, palette, size = 70 }) => {
  const r = size / 2;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={r} cy={r} r={r - 1} fill="none" stroke={palette.border} strokeWidth="1"/>
        <text x={r} y="10" textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily="'JetBrains Mono', monospace">N</text>
        <text x={r} y={size - 3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily="'JetBrains Mono', monospace">S</text>
        <text x="7" y={r+3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily="'JetBrains Mono', monospace">O</text>
        <text x={size-7} y={r+3} textAnchor="middle" fontSize="9" fill={palette.inkSoft} fontFamily="'JetBrains Mono', monospace">E</text>
        <g transform={`rotate(${deg} ${r} ${r})`}>
          <path d={`M ${r} ${r - (r-8)} L ${r-5} ${r} L ${r+5} ${r} Z`} fill={palette.accent}/>
          <circle cx={r} cy={r} r="2" fill={palette.ink}/>
        </g>
      </svg>
    </div>
  );
};

// Sun arc
const SunArc = ({ sol, palette }) => {
  // now is roughly at 65% of arc (e.g. 14:00 between 07:18 and 18:42)
  const progress = 0.62;
  const w = 160, h = 78;
  const cx = w / 2, cy = h - 6;
  const r = 65;
  const startAngle = Math.PI;
  const endAngle = 0;
  const ang = startAngle + (endAngle - startAngle) * progress;
  const sx = cx + Math.cos(ang) * r;
  const sy = cy + Math.sin(ang) * r;

  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="sa1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palette.border}/>
            <stop offset={progress} stopColor={palette.accent}/>
            <stop offset={progress+0.001} stopColor={palette.border}/>
          </linearGradient>
        </defs>
        {/* dashed track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={palette.border} strokeWidth="1" strokeDasharray="3 4"/>
        {/* progress */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sx} ${sy}`}
          fill="none" stroke={palette.accent} strokeWidth="1.5"/>
        {/* sun */}
        <circle cx={sx} cy={sy} r="7" fill={palette.accent}/>
        <circle cx={sx} cy={sy} r="10" fill={palette.accent} opacity="0.2"/>
      </svg>
      <div style={{
        display:'flex', justifyContent:'space-between',
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        color: palette.inkSoft, marginTop: -4,
      }}>
        <span>{sol.salida}</span>
        <span>{sol.puesta}</span>
      </div>
    </div>
  );
};

// Hourly horizontal scroller
const HourlyScroller = ({ horario, palette, serif }) => {
  const temps = horario.map(h => h.temp);
  const min = Math.min(...temps), max = Math.max(...temps);
  const range = (max - min) || 1;
  return (
    <div style={{
      display:'flex', gap: 16, overflowX:'auto',
      paddingBottom: 4, marginRight: -20,
    }}>
      {horario.map((h,i) => {
        const h2 = 54;
        const y = h2 - ((h.temp - min) / range) * (h2 - 8) - 4;
        return (
          <div key={i} style={{
            flexShrink: 0, display:'flex', flexDirection:'column',
            alignItems:'center', gap: 6, minWidth: 38,
          }}>
            <div style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: palette.inkSoft,
            }}>{h.hora}</div>
            <div style={{ fontSize: 18 }}>{h.icon}</div>
            <div style={{
              fontFamily: serif ? "'Instrument Serif', serif" : "'Inter Tight', sans-serif",
              fontSize: serif ? 20 : 15,
              fontWeight: serif ? 400 : 500,
              fontFeatureSettings: "'tnum' 1",
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
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: h.prob > 30 ? palette.accent : palette.inkSoft,
            }}>{h.prob}%</div>
          </div>
        );
      })}
    </div>
  );
};

// Temp bar for 3-day
const TempBar = ({ min, max, globalMin, globalMax, palette }) => {
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

window.Ribera = Ribera;
window.HourlyScroller = HourlyScroller;
window.RiverSpark = RiverSpark;
window.Compass = Compass;
window.SunArc = SunArc;
window.TempBar = TempBar;
window.labelStyle = labelStyle;
