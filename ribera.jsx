// Ribera — main screen (full-bleed, all sections, collapsible)

const { useState, useRef, useEffect } = React;
const darkSkyBg = (p) => `linear-gradient(180deg, ${p.card}, ${p.bg})`;

const SECTIONS_CONFIG = [
  { id: 'horario',    title: 'Próximas horas',   icon: '🕐', subtitle: '12 horas' },
  { id: 'pronostico', title: 'Pronóstico',       icon: '📆', subtitle: '10 días · swipe' },
  { id: 'viento',     title: 'Viento',            icon: '💨', subtitle: 'Tiempo real' },
  { id: 'sol',        title: 'Sol & Luna',        icon: '🌅', subtitle: 'Hoy' },
  { id: 'estaciones', title: 'Estaciones del río', icon: '📊', subtitle: 'CARU · N→S' },
  { id: 'pesca',      title: 'Índice de pesca',  icon: '🎣', subtitle: 'Calculado en vivo' },
  { id: 'camara',     title: 'Cámara en vivo',   icon: '📹', subtitle: 'Río Uruguay · Colón' },
  { id: 'radar',      title: 'Radar de lluvia',  icon: '🌧️', subtitle: 'Tiempo real' },
  { id: 'feriados',   title: 'Próximos feriados', icon: '🎉', subtitle: 'Argentina' },
  { id: 'deportes',   title: 'Fútbol argentino', icon: '⚽', subtitle: 'Próximos partidos' },
  { id: 'cotizaciones', title: 'Cotizaciones',    icon: '💵', subtitle: 'USD · BTC' },
  { id: 'telefonos',  title: 'Teléfonos útiles', icon: '📞', subtitle: 'Concepción del Uruguay' },
];

function Ribera() {
  const defaults = window.__tweakDefaults || {};
  const [timeOfDay, setTimeOfDay] = useState(defaults.timeOfDay || 'day');
  const [density, setDensity] = useState(defaults.density || 'spacious');
  const [theme, setTheme] = useState(defaults.theme || 'auto');
  const [weather, setWeather] = useState(defaults.weather || 'parcial');
  const [font, setFont] = useState(defaults.font || 'editorial');
  const [dataTick, setDataTick] = useState(0);
  const [userOverrodeWeather, setUserOverrodeWeather] = useState(false);

  // Re-render when live data arrives; auto-sync weather key (until user overrides)
  useEffect(() => {
    const onUpdate = (e) => {
      setDataTick(t => t + 1);
      const key = e.detail?._weatherKey;
      if (key && !userOverrodeWeather) setWeather(key);
    };
    window.addEventListener('clima-data-updated', onUpdate);
    // also trigger once in case data is already there
    if (window.__liveDataReady) setDataTick(t => t + 1);
    return () => window.removeEventListener('clima-data-updated', onUpdate);
  }, [userOverrodeWeather]);

  const [collapsed, setCollapsed] = useState({
    estaciones: true, camara: true, radar: true, cotizaciones: true, telefonos: true,
  });
  const [rioExpanded, setRioExpanded] = useState(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);
  const touchStart = useRef(null);

  const effectiveTod = theme === 'dark' ? 'night' : theme === 'light' ? 'day' : timeOfDay;
  const palette = window.PALETTES[effectiveTod];
  const data = window.CLIMA_DATA;
  const darkSky = effectiveTod === 'night';

  // Override condition based on weather tweak
  const condMap = {
    despejado: { icon: '☀️', text: 'Despejado' },
    parcial: { icon: '⛅', text: 'Parcialmente nublado' },
    nublado: { icon: '☁️', text: 'Nublado' },
    lluvia: { icon: '🌧️', text: 'Lluvia' },
    tormenta: { icon: '⛈️', text: 'Tormenta' },
  };
  const condDisplay = condMap[weather] || condMap.parcial;
  const displayData = {
    ...data,
    condicion: condDisplay.text,
    condicionIcon: condDisplay.icon,
  };

  const updateKey = (key, val) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  const toggle = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));

  // Pull-to-refresh
  const onTouchStart = (e) => {
    if (scrollRef.current?.scrollTop === 0) {
      touchStart.current = e.touches[0].clientY;
    }
  };
  const onTouchMove = (e) => {
    if (touchStart.current == null || refreshing) return;
    const dy = e.touches[0].clientY - touchStart.current;
    if (dy > 0 && scrollRef.current?.scrollTop === 0) {
      setPull(Math.min(120, dy * 0.5));
    }
  };
  const onTouchEnd = () => {
    if (pull > 60 && !refreshing) {
      setRefreshing(true);
      setTimeout(() => { setRefreshing(false); setPull(0); }, 1200);
    } else {
      setPull(0);
    }
    touchStart.current = null;
  };

  const padX = density === 'compact' ? 18 : 22;
  const gap = density === 'compact' ? 12 : 16;

  const heroH = 460;

  return (
    <div style={{
      width:'100%', height:'100%',
      background: palette.bg,
      color: palette.ink,
      position:'relative',
      overflow:'hidden',
      fontFamily: 'var(--font-sans)',
    }} data-font={font}>
      {/* Animated sky backdrop — covers hero area */}
      <window.SkyBackdrop palette={palette} darkSky={darkSky} weather={weather} height={heroH + 50}/>

      <window.PullToRefresh pull={pull} refreshing={refreshing} palette={palette}/>

      {/* Scrollable content */}
      <div ref={scrollRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
        position:'relative', zIndex: 5,
        width:'100%', height:'100%',
        overflowY:'auto',
        transform: `translateY(${pull}px)`,
        transition: touchStart.current ? 'none' : 'transform 0.3s',
      }}>
        {/* Hero */}
        <div style={{
          padding: `58px ${padX}px 0`,
          minHeight: heroH,
          position:'relative',
        }}>
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: palette.inkSoft,
            marginBottom: 6,
            display:'flex', alignItems:'center', gap: 8,
          }}>
            📍 {data.provincia} · Argentina
            <span style={{ flex: 1 }}/>
            <span style={{
              width: 6, height: 6, borderRadius:'50%',
              background: 'oklch(0.70 0.18 140)',
              boxShadow:'0 0 8px oklch(0.70 0.18 140)',
            }}/>
            en vivo
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 34, lineHeight: 1,
            letterSpacing: '-0.01em',
            color: palette.ink,
            marginBottom: 32,
          }}>
            {data.ciudad}
          </div>

          <div style={{ display:'flex', alignItems:'flex-start', gap: 4 }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 180, lineHeight: 0.85,
              letterSpacing: '-0.04em',
              color: palette.ink,
              fontFeatureSettings: "'tnum' 1",
            }}>
              {displayData.temp}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 54, lineHeight: 1,
              marginTop: 8, color: palette.inkSoft,
            }}>°</div>
          </div>

          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            marginTop: 12, paddingRight: 4,
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 22, color: palette.ink,
              display:'flex', alignItems:'center', gap: 10,
            }}>
              <span style={{ fontStyle: 'normal', fontSize: 24 }}>{condDisplay.icon}</span>
              {condDisplay.text}
            </div>
            <div style={{
              fontSize: 13, color: palette.inkSoft,
              fontFeatureSettings: "'tnum' 1",
              fontFamily: 'var(--font-mono)',
            }}>
              ↑{displayData.tempMax}° ↓{displayData.tempMin}°
            </div>
          </div>

          {/* extra chips */}
          <div style={{
            display:'flex', flexWrap:'wrap', gap: 10,
            marginTop: 18, fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: palette.inkSoft,
            letterSpacing: '0.08em',
          }}>
            <Chip palette={palette}>ST {displayData.tempAparente}°</Chip>
            <Chip palette={palette}>HR {displayData.humedad}%</Chip>
            <Chip palette={palette}>P {displayData.presion}</Chip>
            <Chip palette={palette}>UV {displayData.uv}</Chip>
            <Chip palette={palette}>VIS {displayData.visibilidad}km</Chip>
          </div>
        </div>

        {/* Wave */}
        <window.RiverWave palette={palette}/>

        {/* Content stack */}
        <div style={{
          padding: `0 ${padX}px ${padX + 80}px`,
          display:'flex', flexDirection:'column', gap,
        }}>
          {/* Alert first if present */}
          {data.alertas[0] && <window.AlertBanner alert={data.alertas[0]} palette={palette}/>}

          {/* Río as hero-card (not collapsible) */}
          <window.RioCard data={data} palette={palette} density={density} onTap={() => setRioExpanded(true)}/>

          {/* Collapsible sections */}
          {SECTIONS_CONFIG.map(sc => (
            <window.Section
              key={sc.id} id={sc.id}
              title={sc.title} icon={sc.icon} subtitle={sc.subtitle}
              palette={palette} density={density}
              collapsed={!!collapsed[sc.id]} onToggle={toggle}>
              <SectionContent id={sc.id} data={data} displayData={displayData} palette={palette} density={density}/>
            </window.Section>
          ))}

          <div style={{
            textAlign:'center', fontSize: 11,
            fontFamily:'var(--font-mono)',
            color: palette.inkSoft, padding: '8px 0',
            letterSpacing:'0.1em',
          }}>
            actualizado {data.actualizado} · SMN · CARU · Open-Meteo
          </div>
        </div>
      </div>

      {/* Expanded river modal */}
      {rioExpanded && <window.RioExpanded data={data} palette={palette} onClose={() => setRioExpanded(false)}/>}

      {/* Tweaks */}
      <div className="tweaks-panel">
        <div className="tweaks-title">Tweaks</div>

        <div className="tweak-row">
          <div className="tweak-label">Hora del día <span>{palette.name}</span></div>
          <div className="seg">
            {[['dawn','Amanec'],['day','Día'],['dusk','Atardec'],['night','Noche']].map(([t,lbl]) => (
              <button key={t}
                className={theme==='auto' && timeOfDay===t ? 'active' : ''}
                onClick={() => { setTimeOfDay(t); updateKey('timeOfDay', t); setTheme('auto'); updateKey('theme','auto'); }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <div className="tweak-label">Tema</div>
          <div className="seg">
            {['auto','light','dark'].map(t => (
              <button key={t}
                className={theme === t ? 'active' : ''}
                onClick={() => { setTheme(t); updateKey('theme', t); }}>
                {t === 'auto' ? 'Auto' : t === 'light' ? 'Claro' : 'Oscuro'}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <div className="tweak-label">Densidad</div>
          <div className="seg">
            <button className={density === 'spacious' ? 'active' : ''}
              onClick={() => { setDensity('spacious'); updateKey('density','spacious'); }}>Espacioso</button>
            <button className={density === 'compact' ? 'active' : ''}
              onClick={() => { setDensity('compact'); updateKey('density','compact'); }}>Compacto</button>
          </div>
        </div>

        <div className="tweak-row">
          <div className="tweak-label">Tipografía <span>{font === 'editorial' ? 'A' : font === 'tecnico' ? 'B' : 'C'}</span></div>
          <div className="seg">
            {[['editorial','A · Editorial'],['tecnico','B · Técnico'],['humanista','C · Humanista']].map(([f,lbl]) => (
              <button key={f}
                className={font === f ? 'active' : ''}
                onClick={() => { setFont(f); updateKey('font', f); }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <div className="tweak-label">Condición</div>
          <div className="seg">
            {[['despejado','☀️'],['parcial','⛅'],['nublado','☁️'],['lluvia','🌧️'],['tormenta','⛈️']].map(([w,ic]) => (
              <button key={w}
                className={weather === w ? 'active' : ''}
                onClick={() => { setWeather(w); setUserOverrodeWeather(true); updateKey('weather', w); }}
                title={w}>{ic}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, palette }) {
  return (
    <span style={{
      padding: '4px 9px',
      borderRadius: 999,
      border: `1px solid ${palette.border}`,
      background: palette.card,
      color: palette.inkSoft,
    }}>{children}</span>
  );
}

function SectionContent({ id, data, displayData, palette, density }) {
  const p = palette;
  switch(id) {
    case 'horario':
      return <window.HourlyScroller horario={data.horario} palette={p}/>;
    case 'pronostico':
      return <window.ForecastSwiper data={data} palette={p}/>;
    case 'viento':
      return (
        <div style={{ display:'flex', alignItems:'center', gap: 18, paddingTop: 4 }}>
          <window.Compass deg={data.viento.direccionDeg} palette={p} size={90}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily:'var(--font-serif)', fontSize: 42,
              lineHeight: 1, fontFeatureSettings: "'tnum' 1",
            }}>
              {data.viento.velocidad}<span style={{ fontSize: 18, color: p.inkSoft, marginLeft: 4 }}>km/h</span>
            </div>
            <div style={{
              fontSize: 11, color: p.inkSoft, marginTop: 6,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
            }}>
              {data.viento.direccion} · {data.viento.direccionDeg}°<br/>
              ráfagas {data.viento.rafaga}km/h<br/>
              Beaufort {data.viento.beaufort} · {data.viento.beaufortNombre.toLowerCase()}
            </div>
          </div>
        </div>
      );
    case 'sol':
      return (
        <div>
          <window.SunArc sol={data.sol} palette={p}/>
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 14,
            paddingTop: 14, borderTop: `1px solid ${p.border}`,
            fontSize: 12, fontFamily:'var(--font-mono)', color: p.inkSoft,
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing:'0.16em', marginBottom: 3 }}>🌙 LUNA</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize: 16, color: p.ink }}>{data.luna.fase}</div>
              <div style={{ marginTop: 2 }}>{data.luna.iluminacion}% iluminada</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize: 10, letterSpacing:'0.16em', marginBottom: 3 }}>HORARIOS</div>
              <div>↑ {data.luna.salida}</div>
              <div>↓ {data.luna.puesta}</div>
            </div>
          </div>
        </div>
      );
    case 'estaciones':
      return (
        <div>
          {data.rio.estaciones.map((e,i) => {
            const pct = (e.nivel / 10) * 100;
            return (
              <div key={e.nombre} style={{
                padding: '10px 0',
                borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize: 15 }}>{e.nombre}</div>
                  <div style={{
                    fontFamily:'var(--font-mono)', fontSize: 12,
                    color: p.ink, fontFeatureSettings: "'tnum' 1",
                  }}>{e.nivel.toFixed(2)}m</div>
                </div>
                <div style={{ height: 3, background: p.border, borderRadius: 2, position:'relative' }}>
                  <div style={{
                    position:'absolute', left:0, top:0, bottom:0, width:`${pct}%`,
                    background: p.river[0], borderRadius: 2,
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      );
    case 'pesca':
      return (
        <div>
          <div style={{ display:'flex', alignItems:'flex-end', gap: 12, marginBottom: 12 }}>
            <div style={{
              fontFamily:'var(--font-serif)', fontSize: 52,
              lineHeight: 0.9, fontFeatureSettings: "'tnum' 1",
            }}>{data.pesca.indice}<span style={{ fontSize: 20, color: p.inkSoft }}>/10</span></div>
            <div style={{
              fontFamily:'var(--font-serif)', fontStyle:'italic',
              fontSize: 20, color: 'oklch(0.55 0.14 150)', paddingBottom: 6,
            }}>{data.pesca.etiqueta}</div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
            {data.pesca.factores.map(f => (
              <div key={f.name} style={{
                display:'flex', alignItems:'center', gap: 6,
                padding: '6px 10px', borderRadius: 999,
                border: `1px solid ${p.border}`, fontSize: 12,
                color: f.status === 'good' ? 'oklch(0.55 0.14 150)' : f.status === 'bad' ? 'oklch(0.55 0.15 25)' : p.inkSoft,
              }}>
                <span>{f.icon}</span>{f.name}
              </div>
            ))}
          </div>
        </div>
      );
    case 'camara':
      return (
        <div style={{
          height: 180, borderRadius: 14, overflow:'hidden',
          background: `linear-gradient(180deg, ${p.sky[1]}, ${p.river[0]}, ${p.river[1]})`,
          position:'relative', border: `1px solid ${p.border}`,
        }}>
          {/* stripes placeholder */}
          <div style={{
            position:'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, transparent 0 8px, rgba(255,255,255,0.04) 8px 16px)',
          }}/>
          <div style={{
            position:'absolute', top: 10, left: 10,
            fontSize: 10, fontFamily:'var(--font-mono)',
            color: '#fff', letterSpacing:'0.16em',
            background:'rgba(0,0,0,0.45)', padding:'4px 8px', borderRadius: 4,
            display:'flex', alignItems:'center', gap: 6,
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff3b30', boxShadow:'0 0 6px #ff3b30' }}/>
            EN VIVO · COLÓN
          </div>
          <div style={{
            position:'absolute', bottom: 10, right: 10,
            fontSize: 10, fontFamily:'var(--font-mono)',
            color: 'rgba(255,255,255,0.7)',
          }}>drop cámara aquí</div>
        </div>
      );
    case 'radar':
      return (
        <div style={{
          height: 180, borderRadius: 14, overflow:'hidden',
          background: darkSkyBg(p),
          position:'relative', border: `1px solid ${p.border}`,
        }}>
          <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="none">
            <defs>
              <radialGradient id="rad" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor={p.river[0]} stopOpacity="0.4"/>
                <stop offset="1" stopColor={p.river[0]} stopOpacity="0"/>
              </radialGradient>
            </defs>
            {[60,100,140].map(r => (
              <circle key={r} cx="160" cy="90" r={r} fill="none" stroke={p.border} strokeWidth="0.5"/>
            ))}
            <line x1="160" y1="10" x2="160" y2="170" stroke={p.border} strokeWidth="0.5"/>
            <line x1="20" y1="90" x2="300" y2="90" stroke={p.border} strokeWidth="0.5"/>
            <circle cx="160" cy="90" r="3" fill={p.accent}/>
            <circle cx="160" cy="90" r="130" fill="url(#rad)"/>
          </svg>
          <div style={{
            position:'absolute', top:10, left:10,
            fontSize: 10, fontFamily:'var(--font-mono)', color: p.inkSoft,
            letterSpacing:'0.14em',
          }}>{data.radar.estado}</div>
        </div>
      );
    case 'feriados':
      return (
        <div>
          {data.feriados.map((f, i) => (
            <div key={f.nombre} style={{
              display:'flex', justifyContent:'space-between', alignItems:'baseline',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize: 18, lineHeight: 1.2 }}>{f.nombre}</div>
                <div style={{
                  fontSize: 11, color: p.inkSoft,
                  fontFamily:'var(--font-mono)', marginTop: 2,
                }}>{f.tipo}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize: 16 }}>{f.fecha}</div>
                <div style={{ fontSize: 11, color: p.inkSoft, fontFamily:'var(--font-mono)' }}>en {f.dias} días</div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'deportes':
      return (
        <div>
          {data.deportes.map((dp, i) => (
            <div key={i} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14 }}>{dp.local} <span style={{ color: p.inkSoft }}>vs</span> {dp.visitante}</div>
                <div style={{
                  fontSize: 11, color: p.inkSoft,
                  fontFamily:'var(--font-mono)', marginTop: 2,
                }}>{dp.liga}</div>
              </div>
              <div style={{ fontSize: 12, fontFamily:'var(--font-mono)', color: p.inkSoft }}>{dp.hora}</div>
            </div>
          ))}
        </div>
      );
    case 'cotizaciones':
      return (
        <div>
          {data.cotizaciones.map((c, i) => (
            <div key={c.nombre} style={{
              display:'flex', justifyContent:'space-between', alignItems:'baseline',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize: 16 }}>{c.nombre}</div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize: 13, color: p.ink,
                fontFeatureSettings: "'tnum' 1",
              }}>
                {c.compra ? <span style={{ color: p.inkSoft, marginRight: 8 }}>${c.compra}</span> : null}
                ${c.venta}{c.unidad ? ' '+c.unidad : ''}
              </div>
            </div>
          ))}
        </div>
      );
    case 'telefonos':
      return (
        <div>
          {data.telefonos.map((t, i) => (
            <div key={t.nombre} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${p.border}` : 'none',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontFamily:'var(--font-serif)', fontSize: 16 }}>{t.nombre}</span>
              </div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize: 13,
                color: p.accent, fontFeatureSettings: "'tnum' 1",
              }}>{t.num}</div>
            </div>
          ))}
        </div>
      );
    default: return null;
  }
}

// Mount
const tryMount = () => {
  if (window.CLIMA_DATA && window.PALETTES && window.SkyBackdrop && window.RioCard) {
    ReactDOM.createRoot(document.getElementById('root')).render(<Ribera/>);
  } else {
    setTimeout(tryMount, 50);
  }
};
tryMount();
