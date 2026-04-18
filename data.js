// Extended mock data — Concepción del Uruguay

window.CLIMA_DATA = {
  ciudad: 'Concepción del Uruguay',
  provincia: 'Entre Ríos',
  fecha: '17 abr 2026',
  diaSemana: 'viernes',

  temp: 23, tempAparente: 24, tempMin: 17, tempMax: 27,
  condicion: 'Parcialmente nublado', condicionIcon: '⛅',
  humedad: 68, presion: 1014, uv: 4, visibilidad: 18, nubosidad: 45,
  puntoRocio: 17,

  rio: {
    nivel: 2.84, tendencia: '+0.08',
    estado: 'Normal', estadoColor: 'calm',
    alerta: 4.50, evacuacion: 5.50, puerto: 'Puerto CdU',
    min7d: 2.62, max7d: 2.91,
    historial: [2.62, 2.68, 2.71, 2.74, 2.78, 2.80, 2.84],
    historial30d: [2.45,2.48,2.50,2.52,2.55,2.58,2.60,2.61,2.59,2.57,2.55,2.54,2.56,2.58,2.60,2.62,2.65,2.68,2.70,2.71,2.73,2.72,2.70,2.68,2.66,2.68,2.71,2.74,2.78,2.84],
    estaciones: [
      { nombre: 'Salto Grande', nivel: 8.42, estado: 'Normal' },
      { nombre: 'Concordia', nivel: 5.21, estado: 'Normal' },
      { nombre: 'Colón', nivel: 3.65, estado: 'Normal' },
      { nombre: 'Concepción del U.', nivel: 2.84, estado: 'Normal' },
      { nombre: 'Gualeguaychú', nivel: 1.92, estado: 'Normal' },
    ],
  },

  viento: {
    velocidad: 14, rafaga: 26,
    direccion: 'ENE', direccionDeg: 67,
    beaufort: 3, beaufortNombre: 'Brisa suave',
  },

  horario: [
    { hora: '15h', temp: 23, icon: '⛅', prob: 10 },
    { hora: '16h', temp: 24, icon: '⛅', prob: 10 },
    { hora: '17h', temp: 24, icon: '☀️', prob: 5 },
    { hora: '18h', temp: 23, icon: '☀️', prob: 0 },
    { hora: '19h', temp: 21, icon: '🌤️', prob: 0 },
    { hora: '20h', temp: 19, icon: '🌙', prob: 0 },
    { hora: '21h', temp: 18, icon: '🌙', prob: 5 },
    { hora: '22h', temp: 17, icon: '🌙', prob: 10 },
    { hora: '23h', temp: 17, icon: '☁️', prob: 20 },
    { hora: '00h', temp: 16, icon: '☁️', prob: 25 },
    { hora: '01h', temp: 16, icon: '🌧️', prob: 40 },
    { hora: '02h', temp: 15, icon: '🌧️', prob: 55 },
  ],

  diario: [
    { dia: 'Sáb', fecha: '18', icon: '🌧️', max: 22, min: 14, prob: 65, cond: 'Lluvia' },
    { dia: 'Dom', fecha: '19', icon: '⛅', max: 24, min: 13, prob: 20, cond: 'Parcial' },
    { dia: 'Lun', fecha: '20', icon: '☀️', max: 26, min: 14, prob: 5, cond: 'Soleado' },
  ],

  extendido: [
    { dia: 'Mar', fecha: '21', icon: '☀️', max: 27, min: 15, prob: 0 },
    { dia: 'Mié', fecha: '22', icon: '⛅', max: 26, min: 16, prob: 10 },
    { dia: 'Jue', fecha: '23', icon: '🌧️', max: 23, min: 15, prob: 70 },
    { dia: 'Vie', fecha: '24', icon: '🌧️', max: 21, min: 13, prob: 80 },
    { dia: 'Sáb', fecha: '25', icon: '⛅', max: 24, min: 14, prob: 30 },
    { dia: 'Dom', fecha: '26', icon: '☀️', max: 26, min: 15, prob: 5 },
    { dia: 'Lun', fecha: '27', icon: '☀️', max: 28, min: 16, prob: 0 },
  ],

  feriados: [
    { nombre: 'Día del Trabajador', fecha: '1 may', dias: 14, tipo: 'Inamovible', pais: '🇦🇷' },
    { nombre: 'Revolución de Mayo', fecha: '25 may', dias: 38, tipo: 'Inamovible', pais: '🇦🇷' },
    { nombre: 'Güemes', fecha: '15 jun', dias: 59, tipo: 'Trasladable', pais: '🇦🇷' },
    { nombre: 'Belgrano', fecha: '20 jun', dias: 64, tipo: 'Inamovible', pais: '🇦🇷' },
  ],

  deportes: [
    { liga: 'Primera', local: 'Boca', visitante: 'River', hora: 'Dom 17:00', estado: 'Próximo' },
    { liga: 'Sudamericana', local: 'Rosario C.', visitante: 'Cruzeiro', hora: 'Mar 21:30', estado: 'Próximo' },
    { liga: 'Primera', local: 'Independiente', visitante: 'Racing', hora: 'Sáb 19:00', estado: 'Próximo' },
    { liga: 'Copa AR', local: 'Patronato', visitante: 'Colón', hora: 'Jue 20:00', estado: 'Próximo' },
  ],

  alertas: [
    { nivel: 'amarillo', titulo: 'Tormentas aisladas', desc: 'Posibilidad de lluvia esta madrugada', vigencia: 'Hasta mañana 06:00' },
  ],

  sol: { salida: '07:18', puesta: '18:42' },
  luna: { fase: 'Cuarto creciente', iluminacion: 62, salida: '12:04', puesta: '00:31' },

  pesca: {
    indice: 7.2, etiqueta: 'Bueno',
    factores: [
      { icon: '🌗', name: 'Cuarto creciente', status: 'good' },
      { icon: '💨', name: 'Viento 14km/h', status: 'neutral' },
      { icon: '🌡️', name: 'Temp 23°', status: 'good' },
      { icon: '📉', name: 'Presión estable', status: 'good' },
    ],
  },

  uvDetalle: { valor: 4, etiqueta: 'Moderado', recomendacion: 'Protección recomendada' },

  cotizaciones: [
    { nombre: 'Oficial', compra: 1085, venta: 1105 },
    { nombre: 'Blue', compra: 1220, venta: 1240 },
    { nombre: 'MEP', compra: 1165, venta: 1175 },
    { nombre: 'Bitcoin', venta: 94320, unidad: 'USD' },
  ],

  telefonos: [
    { nombre: 'Emergencias', num: '911', icon: '🚨' },
    { nombre: 'Bomberos', num: '100', icon: '🚒' },
    { nombre: 'Hospital J.J. Urquiza', num: '03442 425-050', icon: '🏥' },
    { nombre: 'Defensa Civil', num: '103', icon: '⚠️' },
    { nombre: 'Prefectura', num: '106', icon: '⚓' },
  ],

  camara: { ubicacion: 'Río Uruguay · Colón', estado: 'En vivo' },
  radar: { estado: 'Sin precipitación cercana' },

  actualizado: 'hace 3 min',
};
