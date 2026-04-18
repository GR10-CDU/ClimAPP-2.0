// Main app — combines variants into 3 phones + tweaks panel

const { useState, useEffect } = React;

function App() {
  const defaults = window.__tweakDefaults || { theme: 'auto', density: 'spacious', timeOfDay: 'day' };
  const [timeOfDay, setTimeOfDay] = useState(defaults.timeOfDay || 'day');
  const [density, setDensity] = useState(defaults.density || 'spacious');
  const [theme, setTheme] = useState(defaults.theme || 'auto');

  // When theme=auto, timeOfDay drives palette. Dark = night.
  const effectiveTod = theme === 'dark' ? 'night' : theme === 'light' ? 'day' : timeOfDay;
  const palette = window.PALETTES[effectiveTod];
  const data = window.CLIMA_DATA;
  const darkSky = effectiveTod === 'night';

  const updateKey = (key, val) => {
    const edits = { [key]: val };
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  const variants = [
    { name: 'A · RIBERA', Comp: window.Ribera, blurb: 'Editorial serif · minimal' },
    { name: 'B · BITÁCORA', Comp: window.Bitacora, blurb: 'Técnica · monospace · densa' },
    { name: 'C · HORIZONTE', Comp: window.Horizonte, blurb: 'Hero tipográfico · inmersivo' },
  ];

  return (
    <>
      <div className="stage">
        {variants.map(v => (
          <div key={v.name} className="phone">
            <div className="variant-label">
              <strong>{v.name}</strong> · {v.blurb}
            </div>
            <div className="phone-screen">
              <div className="phone-notch"/>
              <v.Comp palette={palette} density={density} data={data} darkSky={darkSky}/>
            </div>
          </div>
        ))}
      </div>

      {/* Tweaks panel */}
      <div className="tweaks-panel">
        <div className="tweaks-title">Tweaks</div>

        <div className="tweak-row">
          <div className="tweak-label">Hora del día <span>{palette.name}</span></div>
          <div className="seg">
            {['dawn','day','dusk','night'].map(t => (
              <button key={t}
                className={timeOfDay === t ? 'active' : ''}
                onClick={() => { setTimeOfDay(t); updateKey('timeOfDay', t); setTheme('auto'); updateKey('theme','auto'); }}>
                {t === 'dawn' ? 'Amanecer' : t === 'day' ? 'Día' : t === 'dusk' ? 'Atardecer' : 'Noche'}
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
          <div className="tweak-label">Densidad <span>{density === 'compact' ? 'compacto' : 'espacioso'}</span></div>
          <div className="seg">
            <button className={density === 'spacious' ? 'active' : ''}
              onClick={() => { setDensity('spacious'); updateKey('density','spacious'); }}>Espacioso</button>
            <button className={density === 'compact' ? 'active' : ''}
              onClick={() => { setDensity('compact'); updateKey('density','compact'); }}>Compacto</button>
          </div>
        </div>
      </div>
    </>
  );
}

// Mount when all scripts loaded
const tryMount = () => {
  if (window.Ribera && window.Bitacora && window.Horizonte && window.CLIMA_DATA && window.PALETTES) {
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
  } else {
    setTimeout(tryMount, 50);
  }
};
tryMount();
