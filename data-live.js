// Live data fetcher — replaces window.CLIMA_DATA with real values
// Falls back to mock if fetch fails

(function(){
  const LAT = -32.4846;
  const LON = -58.2372;
  const CITY = 'Concepción del Uruguay';
  const PROV = 'Entre Ríos';

  // keep mock as fallback
  const mock = window.CLIMA_DATA;

  // --- helpers ---
  const DAYS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  const WMO = {
    0:['☀️','Despejado'], 1:['🌤️','Mayormente despejado'], 2:['⛅','Parcialmente nublado'], 3:['☁️','Nublado'],
    45:['🌫️','Niebla'], 48:['🌫️','Niebla'],
    51:['🌦️','Llovizna'], 53:['🌦️','Llovizna'], 55:['🌦️','Llovizna intensa'],
    56:['🌧️','Llovizna helada'], 57:['🌧️','Llovizna helada'],
    61:['🌧️','Lluvia leve'], 63:['🌧️','Lluvia'], 65:['🌧️','Lluvia fuerte'],
    66:['🌧️','Lluvia helada'], 67:['🌧️','Lluvia helada'],
    71:['🌨️','Nieve'], 73:['🌨️','Nieve'], 75:['🌨️','Nieve fuerte'],
    80:['🌦️','Chubascos'], 81:['🌧️','Chubascos'], 82:['⛈️','Chubascos fuertes'],
    95:['⛈️','Tormenta'], 96:['⛈️','Tormenta c/ granizo'], 99:['⛈️','Tormenta severa'],
  };
  const wmoIcon = (c) => (WMO[c] || ['⛅','Variable'])[0];
  const wmoText = (c) => (WMO[c] || ['⛅','Variable'])[1];

  const hourIcon = (code, isDay) => {
    if (code === 0 || code === 1) return isDay ? '☀️' : '🌙';
    if (code === 2) return isDay ? '⛅' : '☁️';
    return wmoIcon(code);
  };

  const dirFromDeg = (d) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return dirs[Math.round(((d % 360) / 22.5)) % 16];
  };

  const beaufort = (kmh) => {
    const ms = kmh / 3.6;
    const scale = [[0.3,0,'Calma'],[1.5,1,'Aire ligero'],[3.3,2,'Brisa muy débil'],[5.5,3,'Brisa suave'],
      [7.9,4,'Brisa moderada'],[10.7,5,'Brisa fresca'],[13.8,6,'Brisa fuerte'],[17.1,7,'Viento fuerte'],
      [20.7,8,'Viento duro'],[24.4,9,'Muy duro'],[28.4,10,'Temporal'],[32.6,11,'Borrasca'],[99,12,'Huracán']];
    for (const [lim,n,name] of scale) if (ms <= lim) return { num: n, nombre: name };
    return { num: 12, nombre: 'Huracán' };
  };

  const hhmm = (iso) => {
    const d = new Date(iso);
    return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  };

  const moonPhase = (date) => {
    // Conway's algorithm — returns illumination fraction & name
    const y = date.getFullYear(), m = date.getMonth()+1, d = date.getDate();
    let r = y % 100;
    r %= 19; if (r > 9) r -= 19;
    r = ((r*11) % 30) + m + d;
    if (m < 3) r += 2;
    r -= (y < 2000 ? 4 : 8.3);
    r = Math.floor(r + 0.5) % 30;
    const age = r < 0 ? r + 30 : r; // 0-29
    const illumination = Math.round((1 - Math.cos((age / 29.53) * 2 * Math.PI)) / 2 * 100);
    let fase;
    if (age < 1.84) fase = 'Luna nueva';
    else if (age < 5.53) fase = 'Creciente';
    else if (age < 9.22) fase = 'Cuarto creciente';
    else if (age < 12.91) fase = 'Gibosa creciente';
    else if (age < 16.61) fase = 'Luna llena';
    else if (age < 20.30) fase = 'Gibosa menguante';
    else if (age < 23.99) fase = 'Cuarto menguante';
    else if (age < 27.68) fase = 'Menguante';
    else fase = 'Luna nueva';
    return { fase, iluminacion: illumination, age };
  };

  const pescaIndice = (temp, viento, presion, fase) => {
    let s = 5;
    if (temp >= 18 && temp <= 26) s += 1.5; else if (temp >= 14 && temp <= 30) s += 0.5;
    if (viento <= 15) s += 1; else if (viento <= 25) s += 0.2; else s -= 1;
    if (presion >= 1012 && presion <= 1020) s += 1;
    if (fase.includes('llena') || fase.includes('nueva')) s += 1.5;
    else if (fase.includes('creciente') || fase.includes('menguante')) s += 0.5;
    s = Math.max(0, Math.min(10, s));
    const etiqueta = s >= 8 ? 'Excelente' : s >= 6.5 ? 'Bueno' : s >= 5 ? 'Regular' : s >= 3 ? 'Malo' : 'Muy malo';
    return { indice: Number(s.toFixed(1)), etiqueta };
  };

  // --- fetchers ---

  async function fetchClima() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
      + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,`
      + `pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index`
      + `&hourly=temperature_2m,precipitation_probability,weather_code,is_day,visibility`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max`
      + `&past_days=7&forecast_days=10&timezone=America%2FArgentina%2FBuenos_Aires`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('open-meteo failed');
    return r.json();
  }

  async function fetchDolar() {
    try {
      const r = await fetch('https://dolarapi.com/v1/dolares');
      if (!r.ok) throw 0;
      return r.json();
    } catch (e) { return null; }
  }

  async function fetchBtc() {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      if (!r.ok) throw 0;
      const j = await r.json();
      return j.bitcoin?.usd;
    } catch (e) { return null; }
  }

  async function fetchFeriados() {
    try {
      const y = new Date().getFullYear();
      const r = await fetch(`https://api.argentinadatos.com/v1/feriados/${y}`);
      if (!r.ok) throw 0;
      return r.json();
    } catch (e) { return null; }
  }

  // --- assemble ---

  function buildFromMeteo(m) {
    const cur = m.current;
    const hourly = m.hourly;
    const daily = m.daily;
    const now = new Date();

    // next 12 hourly starting from current hour
    const nowIdx = hourly.time.findIndex(t => new Date(t) >= now) - 1;
    const startIdx = Math.max(0, nowIdx);
    const horario = [];
    for (let i = 0; i < 12; i++) {
      const idx = startIdx + i;
      if (!hourly.time[idx]) break;
      const t = new Date(hourly.time[idx]);
      horario.push({
        hora: String(t.getHours()).padStart(2,'0')+'h',
        temp: Math.round(hourly.temperature_2m[idx]),
        icon: hourIcon(hourly.weather_code[idx], hourly.is_day[idx] === 1),
        prob: hourly.precipitation_probability[idx] || 0,
      });
    }

    // split daily into diario (first 3) and extendido (next 7)
    const allDaily = daily.time.map((iso,i) => {
      const d = new Date(iso + 'T12:00:00');
      return {
        dia: DAYS_ES[d.getDay()],
        fecha: String(d.getDate()),
        icon: wmoIcon(daily.weather_code[i]),
        max: Math.round(daily.temperature_2m_max[i]),
        min: Math.round(daily.temperature_2m_min[i]),
        prob: daily.precipitation_probability_max[i] || 0,
        cond: wmoText(daily.weather_code[i]),
      };
    });
    // find today
    const todayStr = now.toISOString().slice(0,10);
    const todayIdx = daily.time.indexOf(todayStr);
    const fromIdx = todayIdx >= 0 ? todayIdx : 0;
    const diario = allDaily.slice(fromIdx, fromIdx+3);
    const extendido = allDaily.slice(fromIdx+3, fromIdx+10);

    // sun / moon
    const sunrise = hhmm(daily.sunrise[fromIdx]);
    const sunset = hhmm(daily.sunset[fromIdx]);
    const moon = moonPhase(now);

    // wind
    const bf = beaufort(cur.wind_speed_10m);

    // visibility avg today (km)
    const visIdx = hourly.time.findIndex(t => t.startsWith(todayStr));
    const vis = visIdx >= 0 ? Math.round((hourly.visibility[visIdx] || 15000) / 1000) : 15;

    // condition
    const ico = hourIcon(cur.weather_code, cur.is_day === 1);
    const condTxt = wmoText(cur.weather_code);
    // map cur condition to weather tweak key
    let weatherKey = 'parcial';
    const wc = cur.weather_code;
    if (wc === 0 || wc === 1) weatherKey = 'despejado';
    else if (wc === 2) weatherKey = 'parcial';
    else if (wc === 3 || wc === 45 || wc === 48) weatherKey = 'nublado';
    else if (wc >= 95) weatherKey = 'tormenta';
    else if (wc >= 51) weatherKey = 'lluvia';

    // fecha legible
    const dayName = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][now.getDay()];
    const fechaStr = `${now.getDate()} ${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`;

    // pesca
    const pesca = pescaIndice(cur.temperature_2m, cur.wind_speed_10m, cur.pressure_msl, moon.fase);

    return {
      ciudad: CITY,
      provincia: PROV,
      fecha: fechaStr,
      diaSemana: dayName,
      temp: Math.round(cur.temperature_2m),
      tempAparente: Math.round(cur.apparent_temperature),
      tempMin: Math.round(daily.temperature_2m_min[fromIdx]),
      tempMax: Math.round(daily.temperature_2m_max[fromIdx]),
      condicion: condTxt,
      condicionIcon: ico,
      humedad: Math.round(cur.relative_humidity_2m),
      presion: Math.round(cur.pressure_msl),
      uv: Math.round(cur.uv_index ?? 0),
      visibilidad: vis,
      nubosidad: Math.round(cur.cloud_cover ?? 0),
      puntoRocio: Math.round(cur.temperature_2m - ((100 - cur.relative_humidity_2m)/5)),
      viento: {
        velocidad: Math.round(cur.wind_speed_10m),
        rafaga: Math.round(cur.wind_gusts_10m ?? cur.wind_speed_10m),
        direccion: dirFromDeg(cur.wind_direction_10m),
        direccionDeg: Math.round(cur.wind_direction_10m),
        beaufort: bf.num, beaufortNombre: bf.nombre,
      },
      horario, diario, extendido,
      sol: { salida: sunrise, puesta: sunset },
      luna: {
        fase: moon.fase,
        iluminacion: moon.iluminacion,
        salida: mock.luna.salida, puesta: mock.luna.puesta, // no free API for moon rise/set
      },
      pesca: {
        ...pesca,
        factores: [
          { icon: '🌗', name: moon.fase, status: (moon.fase.includes('llena')||moon.fase.includes('nueva')) ? 'good' : 'neutral' },
          { icon: '💨', name: `Viento ${Math.round(cur.wind_speed_10m)}km/h`, status: cur.wind_speed_10m<=15?'good':cur.wind_speed_10m<=25?'neutral':'bad' },
          { icon: '🌡️', name: `Temp ${Math.round(cur.temperature_2m)}°`, status: (cur.temperature_2m>=18&&cur.temperature_2m<=26)?'good':'neutral' },
          { icon: '📉', name: `Presión ${Math.round(cur.pressure_msl)}`, status: (cur.pressure_msl>=1012&&cur.pressure_msl<=1020)?'good':'neutral' },
        ],
      },
      uvDetalle: {
        valor: Math.round(cur.uv_index ?? 0),
        etiqueta: (cur.uv_index ?? 0) < 3 ? 'Bajo' : (cur.uv_index ?? 0) < 6 ? 'Moderado' : (cur.uv_index ?? 0) < 8 ? 'Alto' : 'Muy alto',
        recomendacion: (cur.uv_index ?? 0) < 3 ? 'Sin protección' : (cur.uv_index ?? 0) < 6 ? 'Protección recomendada' : 'Protección obligatoria',
      },
      // --- fields without real source: keep mock ---
      rio: mock.rio,
      alertas: mock.alertas,
      deportes: mock.deportes,
      telefonos: mock.telefonos,
      camara: mock.camara,
      radar: { estado: cur.precipitation > 0 ? 'Lluvia activa' : 'Sin precipitación cercana' },
      feriados: mock.feriados,
      cotizaciones: mock.cotizaciones,
      actualizado: 'recién',
      _weatherKey: weatherKey,
    };
  }

  function mergeDolar(data, dolar, btc) {
    if (!dolar) return data;
    const map = { oficial: 'Oficial', blue: 'Blue', bolsa: 'MEP', contadoconliqui: 'CCL' };
    const cotiz = dolar
      .filter(d => map[d.casa])
      .map(d => ({ nombre: map[d.casa], compra: Math.round(d.compra), venta: Math.round(d.venta) }));
    if (btc) cotiz.push({ nombre: 'Bitcoin', venta: Math.round(btc), unidad: 'USD' });
    data.cotizaciones = cotiz;
    return data;
  }

  function mergeFeriados(data, feriados) {
    if (!feriados) return data;
    const now = new Date();
    const prox = feriados
      .map(f => {
        const [y,m,d] = f.fecha.split('-').map(Number);
        const dt = new Date(y, m-1, d);
        const dias = Math.ceil((dt - now) / 86400000);
        return { ...f, dt, dias };
      })
      .filter(f => f.dias >= 0)
      .sort((a,b) => a.dias - b.dias)
      .slice(0, 4)
      .map(f => ({
        nombre: f.nombre,
        fecha: `${f.dt.getDate()} ${MONTHS_ES[f.dt.getMonth()]}`,
        dias: f.dias,
        tipo: f.tipo === 'inamovible' ? 'Inamovible' : f.tipo === 'trasladable' ? 'Trasladable' : (f.tipo||'Feriado'),
        pais: '🇦🇷',
      }));
    if (prox.length) data.feriados = prox;
    return data;
  }

  // --- bootstrap ---
  async function boot() {
    // set a visible "loading" marker on the updated chip
    window.CLIMA_DATA = { ...mock, actualizado: 'cargando…' };

    try {
      const [meteo, dolar, btc, feriados] = await Promise.all([
        fetchClima(),
        fetchDolar(),
        fetchBtc(),
        fetchFeriados(),
      ]);

      let data = buildFromMeteo(meteo);
      data = mergeDolar(data, dolar, btc);
      data = mergeFeriados(data, feriados);

      window.CLIMA_DATA = data;
      window.__liveDataReady = true;
      window.dispatchEvent(new CustomEvent('clima-data-updated', { detail: data }));
      console.log('[Climapp] Datos reales cargados');
    } catch (e) {
      console.warn('[Climapp] Fallback a datos mock:', e);
      window.CLIMA_DATA = { ...mock, actualizado: 'sin conexión' };
      window.dispatchEvent(new CustomEvent('clima-data-updated', { detail: window.CLIMA_DATA }));
    }
  }

  // run after DOM ready so ribera.jsx listens first
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
