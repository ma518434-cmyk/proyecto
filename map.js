'use strict';

/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const MAP_IMAGE_SRC = 'prepa.jpeg';
const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 4.0;
const ZOOM_STEP = 0.15;
const DRAG_UMBRAL = 5; // px mínimos para considerar "drag" y no "click"

/* ============================================================
   DATOS — Puntos de interés
   ============================================================ */
const PUNTOS_DE_INTERES = [
    { id:'computo',              nombre:'Centros de Cómputo',    descripcion:'Laboratorios de informática',  tipo:'building', icono:'💻', imagen: 'imgs/5.jpeg',  x:0.42, y:0.29 },
    { id:'CAI',                  nombre:'CAI',                   descripcion:'Centro de Autoaprendizaje de Idiomas', tipo:'building', icono:'🏫', imagen: 'imgs/8.jpeg',  x:0.40, y:0.20 },
    { id:'oficinas',             nombre:'Oficinas',              descripcion:'Administración y dirección',   tipo:'building', icono:'🏢', imagen: 'imgs/1.jpeg',  x:0.60, y:0.16 },
    { id:'audiovisual',          nombre:'Audiovisual',           descripcion:'Producción multimedia',        tipo:'building', icono:'🎥', imagen: 'imgs/12.jpeg', x:0.73, y:0.20 },
    { id:'Laboratorio-Quimica',  nombre:'Lab. de Química',       descripcion:'Prácticas de química',         tipo:'building', icono:'⚗️', imagen: 'imgs/13.jpeg', x:0.48, y:0.27 },
    { id:'Edificio-H',           nombre:'Edificio H',            descripcion:'Salones de Clase',             tipo:'building', icono:'🏫', imagen: 'imgs/10.jpeg', x:0.50, y:0.40 },
    { id:'biblioteca',           nombre:'Biblioteca',            descripcion:'Acervo y sala de lectura',     tipo:'service',  icono:'📚', imagen: 'imgs/9.jpeg',  x:0.28, y:0.43 },
    { id:'cafeteria',            nombre:'Cafetería',             descripcion:'Alimentos y bebidas',          tipo:'service',  icono:'🍽️', imagen: 'imgs/3.jpeg',  x:0.26, y:0.32 },
    { id:'Salon-Usos-Multiples', nombre:'Salón Usos Múltiples', descripcion:'Eventos y actividades',         tipo:'service',  icono:'🎭', imagen: 'imgs/6.jpeg',  x:0.45, y:0.85 },
    { id:'pista',                nombre:'Pista Atlética',        descripcion:'Pista 400m y fútbol',          tipo:'Deportes', icono:'🏃', imagen: 'imgs/7.jpeg',   x:0.81, y:0.45 },
    { id:'canchas',              nombre:'Canchas Deportivas',    descripcion:'Futbol 11',                    tipo:'Deportes', icono:'⚽',               x:0.72, y:0.70 },
    { id:'estacionamiento',      nombre:'Estacionamiento',       descripcion:'Docentes y alumnos',           tipo:'parking',  icono:'🅿️', imagen: 'imgs/2.jpeg',  x:0.25, y:0.22 },
    { id:'danza',                nombre:'Sala de Danza',         descripcion:'Prácticas de danza',           tipo:'service',  icono:'💃',      x:0.80, y:0.27 },
    { id:'explanada',            nombre:'Explanada',             descripcion:'Eventos al aire libre',        tipo:'Deportes', icono:'🌳', imagen: 'imgs/11.jpeg', x:0.63, y:0.25 },
    { id:'Oficinas-Deportes',    nombre:'Oficina de Deportes',   descripcion:'Administración deportiva',     tipo:'service',  icono:'👨‍⚖️', imagen: 'imgs/4.jpeg',  x:0.26, y:0.52 },
];

/* ============================================================
   LÍMITE DEL PLANTEL
   Polígono que define la zona válida para colocar pines.
   Los clics fuera de este polígono se rechazan.
   ============================================================ */
const LIMITE_PLANTEL = [
    { x:0.44, y:0.93 },
    { x:0.17, y:0.26 },
    { x:0.79, y:0.039 },
    { x:0.96, y:0.98 },
];

/**
 * Ray-casting: devuelve true si el punto (rx, ry) está
 * dentro del polígono LIMITE_PLANTEL.
 */
function dentroDeLimite(rx, ry) {
    const poly = LIMITE_PLANTEL;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y;
        const xj = poly[j].x, yj = poly[j].y;
        const intersecta = ((yi > ry) !== (yj > ry))
            && (rx < (xj - xi) * (ry - yi) / (yj - yi) + xi);
        if (intersecta) inside = !inside;
    }
    return inside;
}


const CAMINOS = [

   {x1:0.94 , y1:0.93 , x2:0.88 , y2: 0.93},
    {x1:0.88 , y1:0.93 , x2:0.78 , y2: 0.27},//
    {x1: 0.81 , y1: 0.5 , x2:0.72, y2:0.45},
    {x1: 0.72 , y1: 0.45 , x2:0.65, y2:0.46},
    {x1: 0.86, y1: 0.84, x2: 0.81, y2: 0.90},
    {x1 : 0.81 , y1: 0.9, x2:0.71 , y2:0.91},
    {x1: 0.71, y1: 0.91, x2:0.63 , y2:0.85},
    {x1: 0.63, y1: 0.85, x2:0.58, y2:0.55},
    {x1: 0.58, y1: 0.55, x2: 0.65, y2: 0.46},
    //ramas de la cancha
    {x1: .63 , y1 : 0.85, x2:.45 , y2: .85},
    {x1:0.45,y1:0.85, x2:0.3,y2:0.5},
    {x1:0.3,y1:0.5 ,x2:0.58, y2:0.55},
    {x1:0.78, y1:0.27, x2:0.62, y2:0.24},//
    {x1:0.62,y1:0.24, x2: 0.52 , y2: 0.24}, //55 40
    {x1: 0.52, y1: 0.24, x2: 0.55, y2: 0.4},
    {x1: 0.55, y1: 0.4, x2:0.47, y2:0.4},
    {x1: 0.47, y1: 0.4, x2: 0.45, y2: 0.25},//38 26
    {x1: 0.45, y1: 0.25, x2:0.38, y2: 0.26},
    {x1: 0.38 , y1: 0.26 , x2:0.29, y2:0.33},
    {x1: 0.29 , y1: 0.33 , x2:0.30, y2:0.5},
    {x1: 0.67 , y1: 0.25 , x2:0.65, y2:0.17},
    {x1: 0.66 , y1: 0.22 , x2:0.72, y2:0.2},
    {x1: 0.7 , y1: 0.26 , x2:0.71, y2:0.33},
    {x1: 0.71 , y1: 0.33 , x2:0.6, y2:0.35},
    {x1: 0.6 , y1: 0.35 , x2:0.65, y2:0.46},
    {x1: 0.34 , y1: 0.29 , x2:0.25, y2:0.25},
];

/* ============================================================
   ESTADO
   ============================================================ */
const estado = {
    imagen: null, imageLoaded: false,
    offsetX: 0, offsetY: 0, zoom: 1.0,
    dragging: false,
    dragStartX: 0, dragStartY: 0,
    dragStartOffsetX: 0, dragStartOffsetY: 0,
    dragDelta: 0,
    routeOrigin: null, routeDestino: null,
    routePhase: 'idle',   // 'idle' | 'picking-dest' | 'done'
    poiActivoId: null,
};

/* ============================================================
   REFS DOM
   ============================================================ */
const el = {
    canvas:        () => document.getElementById('js-map-canvas'),
    wrapper:       () => document.getElementById('js-map-wrapper'),
    tooltip:       () => document.getElementById('js-tooltip'),
    tooltipIcon:   () => document.getElementById('js-tooltip-icon'),
    tooltipName:   () => document.getElementById('js-tooltip-name'),
    tooltipDesc:   () => document.getElementById('js-tooltip-desc'),
    tooltipImg:    () => document.getElementById('js-tooltip-img'),
    poiList:       () => document.getElementById('js-poi-list'),
    routeHint:     () => document.getElementById('js-route-hint'),
    originLabel:   () => document.getElementById('js-origin-label'),
    destLabel:     () => document.getElementById('js-dest-label'),
    resetBtn:      () => document.getElementById('js-reset-btn'),
    clearRouteBtn: () => document.getElementById('js-clear-route-btn'),
    modeLabel:     () => document.getElementById('js-mode-label'),
    zoomIn:        () => document.getElementById('js-zoom-in'),
    zoomOut:       () => document.getElementById('js-zoom-out'),
    zoomReset:     () => document.getElementById('js-zoom-reset'),
};

/* ============================================================
   CARGA DE IMAGEN
   ============================================================ */
function cargarImagen(src, onLoad) {
    const img = new Image();
    img.onload  = () => { estado.imagen = img; estado.imageLoaded = true;  onLoad(); };
    img.onerror = () => {                       estado.imageLoaded = false; onLoad(); };
    img.src = src;
}

/* ============================================================
   CANVAS / TRANSFORMACIONES
   ============================================================ */
function redimensionarCanvas() {
    const c = el.canvas(), w = el.wrapper();
    c.width  = w.clientWidth;
    c.height = w.clientHeight;
}

function relativoACanvas(rx, ry) {
    const c  = el.canvas();
    const bW = estado.imagen ? estado.imagen.width  : c.width;
    const bH = estado.imagen ? estado.imagen.height : c.height;
    return {
        px: estado.offsetX + rx * bW * estado.zoom,
        py: estado.offsetY + ry * bH * estado.zoom,
    };
}

function canvasARelativo(px, py) {
    const c  = el.canvas();
    const bW = estado.imagen ? estado.imagen.width  : c.width;
    const bH = estado.imagen ? estado.imagen.height : c.height;
    return {
        rx: (px - estado.offsetX) / (bW * estado.zoom),
        ry: (py - estado.offsetY) / (bH * estado.zoom),
    };
}

function centrarMapa() {
    const c = el.canvas();
    if (!estado.imagen) return;
    const esc  = Math.min(c.width / estado.imagen.width, c.height / estado.imagen.height) * 0.92;
    estado.zoom    = esc;
    estado.offsetX = (c.width  - estado.imagen.width  * esc) / 2;
    estado.offsetY = (c.height - estado.imagen.height * esc) / 2;
}

/* ============================================================
   RENDERIZADO
   ============================================================ */
function renderizar() {
    const canvas = el.canvas();
    const ctx    = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo oscuro
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Imagen del mapa
    if (estado.imageLoaded && estado.imagen) {
        const w = estado.imagen.width  * estado.zoom;
        const h = estado.imagen.height * estado.zoom;
        ctx.drawImage(estado.imagen, estado.offsetX, estado.offsetY, w, h);
        // Overlay sutil para mejorar contraste de los POIs
        ctx.fillStyle = 'rgba(0,0,0,0.20)';
        ctx.fillRect(estado.offsetX, estado.offsetY, w, h);
    }


    dibujarPOIs(ctx);
    dibujarRuta(ctx);
}

function dibujarCaminos(ctx) {
    CAMINOS.forEach(c => {
        const o = relativoACanvas(c.x1, c.y1);
        const d = relativoACanvas(c.x2, c.y2);

        // Glow para que resalten sobre la imagen
        ctx.shadowColor = 'rgba(255, 200, 80, 0.45)';
        ctx.shadowBlur  = Math.max(2, 4 * estado.zoom);

        ctx.beginPath();
        ctx.moveTo(o.px, o.py);
        ctx.lineTo(d.px, d.py);
        ctx.strokeStyle = 'rgba(255, 210, 80, 0.88)';   // amarillo-naranja visible
        ctx.lineWidth   = Math.max(2, 3 * estado.zoom);
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.setLineDash([]);
        ctx.stroke();

        ctx.shadowBlur = 0;
    });
}

function colorPorTipo(tipo) {
    return {
        building: '#4da6ff',
        Deportes:  '#00e5a0',
        parking:  '#c084fc',
        service:  '#ff7a1a',
    }[tipo] || '#ffffff';
}

function dibujarPOIs(ctx) {
    PUNTOS_DE_INTERES.forEach(poi => {
        const { px, py } = relativoACanvas(poi.x, poi.y);
        const color  = colorPorTipo(poi.tipo);
        const radio  = Math.max(8, 11 * estado.zoom);
        const activo = poi.id === estado.poiActivoId;

        // Halo activo
        if (activo) {
            ctx.beginPath();
            ctx.arc(px, py, radio * 1.9, 0, Math.PI * 2);
            ctx.fillStyle = color + '28';
            ctx.fill();
        }

        // Círculo principal
        ctx.beginPath();
        ctx.arc(px, py, radio, 0, Math.PI * 2);
        ctx.fillStyle = color + (activo ? 'ff' : 'cc');
        ctx.fill();

        ctx.strokeStyle = activo ? '#ffffff' : 'rgba(255,255,255,0.25)';
        ctx.lineWidth   = activo ? 2 : 1;
        ctx.stroke();

        // Icono emoji
        if (estado.zoom > 0.7) {
            const fs = Math.max(10, 12 * estado.zoom);
            ctx.font          = `${fs}px serif`;
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'middle';
            ctx.fillText(poi.icono, px, py);
        }

        // Etiqueta con nombre
        if (estado.zoom > 1.2) {
            const fs = Math.max(8, 9 * estado.zoom);
            ctx.font          = `bold ${fs}px 'Space Grotesk', sans-serif`;
            ctx.textAlign     = 'center';
            ctx.textBaseline  = 'top';
            ctx.fillStyle     = '#ffffff';
            ctx.shadowColor   = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur    = 5;
            ctx.fillText(poi.nombre, px, py + radio + 3);
            ctx.shadowBlur    = 0;
        }
    });
}

/* ---- Ruta ---- */
function dibujarRuta(ctx) {
    if (!estado.routeOrigin) return;

    const canvas   = el.canvas();
    const dentroCV = p => p.px >= 0 && p.px <= canvas.width && p.py >= 0 && p.py <= canvas.height;

    const origen = relativoACanvas(estado.routeOrigin.x, estado.routeOrigin.y);
    if (dentroCV(origen)) dibujarMarcador(ctx, origen.px, origen.py, '#ff7a1a', '🚶');

    if (!estado.routeDestino) return;

    const destino = relativoACanvas(estado.routeDestino.x, estado.routeDestino.y);
    if (dentroCV(destino)) dibujarMarcador(ctx, destino.px, destino.py, '#ffd84d', '📍');

    const wps = calcularRuta(estado.routeOrigin, estado.routeDestino);
    if (wps.length < 2) return;

    ctx.beginPath();
    const ini = relativoACanvas(wps[0].x, wps[0].y);
    ctx.moveTo(ini.px, ini.py);
    for (let i = 1; i < wps.length; i++) {
        const p = relativoACanvas(wps[i].x, wps[i].y);
        ctx.lineTo(p.px, p.py);
    }

    ctx.strokeStyle = '#ffd84d';
    ctx.lineWidth   = Math.max(2, 3 * estado.zoom);
    ctx.setLineDash([10, 5]);
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    ctx.shadowColor = 'rgba(255,216,77,0.55)';
    ctx.shadowBlur  = 10;
    ctx.stroke();
    ctx.shadowBlur  = 0;
    ctx.setLineDash([]);
}

function dibujarMarcador(ctx, px, py, color, icono) {
    const radio = Math.max(10, 13 * estado.zoom);
    ctx.beginPath();
    ctx.arc(px, py, radio, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 2;
    ctx.stroke();

    const fs = Math.max(9, 11 * estado.zoom);
    ctx.font          = `bold ${fs}px sans-serif`;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillStyle     = '#0e0b08';
    ctx.fillText(icono, px, py);
}



const EPS_NODO = 0.005; // tolerancia para fusionar nodos cercanos

/** Construye el grafo una sola vez y lo cachea */
let _grafoCache = null;
function obtenerGrafo() {
    if (_grafoCache) return _grafoCache;

    // 1. Recopilar todos los extremos de segmentos
    const puntos = [];
    CAMINOS.forEach(c => {
        puntos.push({ x: c.x1, y: c.y1 });
        puntos.push({ x: c.x2, y: c.y2 });
    });

    // 2. Fusionar puntos muy cercanos en un único nodo
    const nodos = [];
    const idxDePunto = (p) => {
        for (let i = 0; i < nodos.length; i++) {
            if (dist(nodos[i], p) < EPS_NODO) return i;
        }
        nodos.push({ x: p.x, y: p.y, vecinos: [] });
        return nodos.length - 1;
    };

    // 3. Construir adyacencia bidireccional
    CAMINOS.forEach(c => {
        const a = idxDePunto({ x: c.x1, y: c.y1 });
        const b = idxDePunto({ x: c.x2, y: c.y2 });
        if (a === b) return;
        const peso = dist(nodos[a], nodos[b]);
        if (!nodos[a].vecinos.find(v => v.idx === b))
            nodos[a].vecinos.push({ idx: b, peso });
        if (!nodos[b].vecinos.find(v => v.idx === a))
            nodos[b].vecinos.push({ idx: a, peso });
    });

    _grafoCache = nodos;
    return nodos;
}
//jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj


// punto más cercano sobre un segmento AB
function puntoMasCercanoEnSegmento(p, a, b) {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const ap = { x: p.x - a.x, y: p.y - a.y };

    const ab2 = ab.x * ab.x + ab.y * ab.y;
    const t = ab2 === 0 ? 0 : Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / ab2));

    return {
        x: a.x + ab.x * t,
        y: a.y + ab.y * t
    };
}

// snap al camino más cercano
function snapACamino(punto) {
    let mejorPunto = null;
    let mejorDist = Infinity;

    CAMINOS.forEach(c => {
        const a = { x: c.x1, y: c.y1 };
        const b = { x: c.x2, y: c.y2 };

        const candidato = puntoMasCercanoEnSegmento(punto, a, b);
        const d = dist(punto, candidato);

        if (d < mejorDist) {
            mejorDist = d;
            mejorPunto = candidato;
        }
    });

    return mejorPunto;
}

/* ============================================================
   RUTA PRINCIPAL (CORREGIDA)
   ============================================================ */

function calcularRuta(origen, destino) {
    const nodos = obtenerGrafo();
    if (nodos.length === 0) return [origen, destino];

    const INF = Infinity;

    const origenSnap = snapACamino(origen);
    const destinoSnap = snapACamino(destino);

    let minO = Infinity, iO = 0;
    let minD = Infinity, iD = 0;

    nodos.forEach((n, i) => {
        const dO = dist(n, origenSnap);
        const dD = dist(n, destinoSnap);

        if (dO < minO) { minO = dO; iO = i; }
        if (dD < minD) { minD = dD; iD = i; }
    });


    const distancia = new Array(nodos.length).fill(INF);
    const anterior  = new Array(nodos.length).fill(-1);
    const visitado  = new Array(nodos.length).fill(false);

    distancia[iO] = 0;

    for (let iter = 0; iter < nodos.length; iter++) {
        let u = -1;

        for (let i = 0; i < nodos.length; i++) {
            if (!visitado[i] && (u === -1 || distancia[i] < distancia[u])) {
                u = i;
            }
        }

        if (u === -1 || distancia[u] === INF) break;

        visitado[u] = true;
        if (u === iD) break;

        nodos[u].vecinos.forEach(({ idx, peso }) => {
            const nueva = distancia[u] + peso;
            if (nueva < distancia[idx]) {
                distancia[idx] = nueva;
                anterior[idx] = u;
            }
        });
    }


    if (distancia[iD] === INF) {
        return [origen, destino];
    }


    const camino = [];
    for (let cur = iD; cur !== -1; cur = anterior[cur]) {
        camino.unshift(nodos[cur]);
    }

  
    return [origen, origenSnap, ...camino, destinoSnap, destino];
}

function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/* ============================================================
   INTERACCIÓN
   ============================================================ */
function detectarPOI(px, py) {
    const umbral = Math.max(14, 17 * estado.zoom);
    return PUNTOS_DE_INTERES.find(poi => {
        const pos = relativoACanvas(poi.x, poi.y);
        return dist({ x:pos.px, y:pos.py }, { x:px, y:py }) < umbral;
    }) || null;
}

function mostrarTooltip(poi, mx, my) {
    el.tooltipIcon().textContent = poi.icono;
    el.tooltipName().textContent = poi.nombre;
    el.tooltipDesc().textContent = poi.descripcion;

    // Imagen del POI
    const imgEl = el.tooltipImg();
    if (poi.imagen) {
        imgEl.src = poi.imagen;
        imgEl.style.display = 'block';
    } else {
        imgEl.src = '';
        imgEl.style.display = 'none';
    }

    const t = el.tooltip();
    t.style.left = `${mx + 16}px`;
    t.style.top  = `${my - 10}px`;
    t.classList.add('visible');
}

function ocultarTooltip() { el.tooltip().classList.remove('visible'); }

function aplicarZoom(factor, cx, cy) {
    const nz  = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, estado.zoom * factor));
    const esc = nz / estado.zoom;
    estado.offsetX = cx - esc * (cx - estado.offsetX);
    estado.offsetY = cy - esc * (cy - estado.offsetY);
    estado.zoom    = nz;
    renderizar();
}

/* ============================================================
   GESTIÓN DE RUTA
   ============================================================ */
function procesarClicRuta(rx, ry) {
    // Rechazar clics fuera del límite del plantel
    if (!dentroDeLimite(rx, ry)) {
        /* Feedback visual breve en el chip del header */
        const chip = el.modeLabel();
        const prev = chip.textContent;
        chip.textContent = '⚠ Fuera del plantel';
        chip.style.borderColor = 'rgba(255,80,80,0.7)';
        chip.style.color = '#ff6b6b';
        setTimeout(() => {
            chip.textContent = prev;
            chip.style.borderColor = '';
            chip.style.color = '';
        }, 1200);
        return;
    }

    if (estado.routePhase === 'idle' || estado.routePhase === 'picking-origin') {
        if (estado.routePhase === 'idle') {
            estado.routePhase = 'picking-origin';
            el.wrapper().classList.add('routing');
        }
        estado.routeOrigin = { x:rx, y:ry };
        estado.routePhase  = 'picking-dest';
        el.modeLabel().textContent = 'Selecciona destino';

    } else if (estado.routePhase === 'picking-dest') {
        estado.routeDestino = { x:rx, y:ry };
        estado.routePhase   = 'done';
        el.wrapper().classList.remove('routing');
        el.modeLabel().textContent = '¡Ruta lista!';
        el.resetBtn().classList.add('visible');
    }
    actualizarUIRuta();
    renderizar();
}

function limpiarRuta() {
    estado.routeOrigin  = null;
    estado.routeDestino = null;
    estado.routePhase   = 'idle';
    el.wrapper().classList.remove('routing');
    el.modeLabel().textContent = 'Explorar mapa';
    el.resetBtn().classList.remove('visible');
    actualizarUIRuta();
    renderizar();
}

function actualizarUIRuta() {
    const hints = {
        'idle':          'Haz clic en el mapa para marcar el <strong>origen</strong>.',
        'picking-origin':'Haz clic en el mapa para marcar el <strong>origen</strong>.',
        'picking-dest':  'Ahora clic para marcar el <strong>destino</strong>.',
        'done':          '¡Ya tienes ruta! Límpiala cuando quieras.',
    };
    el.routeHint().innerHTML = hints[estado.routePhase] || '';

    if (estado.routeOrigin) {
        el.originLabel().textContent = `(${estado.routeOrigin.x.toFixed(2)}, ${estado.routeOrigin.y.toFixed(2)})`;
        el.originLabel().classList.add('set');
    } else {
        el.originLabel().textContent = 'Sin seleccionar';
        el.originLabel().classList.remove('set');
    }

    if (estado.routeDestino) {
        el.destLabel().textContent = `(${estado.routeDestino.x.toFixed(2)}, ${estado.routeDestino.y.toFixed(2)})`;
        el.destLabel().classList.add('set');
    } else {
        el.destLabel().textContent = 'Sin seleccionar';
        el.destLabel().classList.remove('set');
    }
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function renderizarSidebar() {
    const lista = el.poiList();
    lista.innerHTML = '';
    const etiquetas = { building:'Edificio', Deportes:'Deporte', parking:'Estacionamiento', service:'Servicio' };
    PUNTOS_DE_INTERES.forEach(poi => {
        const li = document.createElement('li');
        li.className   = 'poi-item';
        li.dataset.id  = poi.id;
        li.innerHTML   = `
            <span class="poi-item__icon">${poi.icono}</span>
            <span class="poi-item__info">
                <span class="poi-item__name">${poi.nombre}</span>
                <span class="poi-item__type">${etiquetas[poi.tipo] || poi.tipo}</span>
            </span>`;
        li.addEventListener('click', () => enfocarPOI(poi));
        lista.appendChild(li);
    });
}

function enfocarPOI(poi) {
    estado.poiActivoId = poi.id;
    const c = el.canvas();
    estado.zoom    = 2.0;
    estado.offsetX = c.width  / 2 - poi.x * (estado.imagen?.width  ?? c.width)  * estado.zoom;
    estado.offsetY = c.height / 2 - poi.y * (estado.imagen?.height ?? c.height) * estado.zoom;
    document.querySelectorAll('.poi-item').forEach(e => {
        e.classList.toggle('active', e.dataset.id === poi.id);
    });
    renderizar();
}

/* ============================================================
   EVENTOS
   Drag y click siempre registrados.
   dragDelta decide si el mouseup fue un click o un arrastre.
   ============================================================ */
function registrarEventos() {
    const canvas  = el.canvas();
    const wrapper = el.wrapper();

    /* mousedown — inicio de posible drag */
    wrapper.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        estado.dragging         = true;
        estado.dragDelta        = 0;
        estado.dragStartX       = e.clientX;
        estado.dragStartY       = e.clientY;
        estado.dragStartOffsetX = estado.offsetX;
        estado.dragStartOffsetY = estado.offsetY;
        wrapper.classList.add('grabbing');
        ocultarTooltip();
    });

    /* mousemove — arrastre o hover */
    window.addEventListener('mousemove', e => {
        if (estado.dragging) {
            const dx = e.clientX - estado.dragStartX;
            const dy = e.clientY - estado.dragStartY;
            estado.dragDelta = Math.max(estado.dragDelta, Math.sqrt(dx * dx + dy * dy));
            estado.offsetX   = estado.dragStartOffsetX + dx;
            estado.offsetY   = estado.dragStartOffsetY + dy;
            renderizar();
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const mx   = e.clientX - rect.left;
        const my   = e.clientY - rect.top;

        // Mostrar coordenadas relativas en el indicador
        const { rx, ry } = canvasARelativo(mx, my);
        const coordEl = document.getElementById('js-coords');
        if (coordEl) {
            coordEl.textContent = `x: ${rx.toFixed(3)}  y: ${ry.toFixed(3)}`;
        }

        // Hover tooltip
        const poi = detectarPOI(mx, my);
        if (poi) {
            mostrarTooltip(poi, mx, my);
            canvas.style.cursor = 'pointer';
        } else {
            ocultarTooltip();
            canvas.style.cursor = '';
        }
    });

    /* mouseup — terminar drag */
    window.addEventListener('mouseup', () => {
        estado.dragging = false;
        wrapper.classList.remove('grabbing');
    });

    /* click — colocar punto de ruta SOLO si no hubo drag real */
    canvas.addEventListener('click', e => {
        if (estado.dragDelta > DRAG_UMBRAL) { estado.dragDelta = 0; return; }
        estado.dragDelta = 0;
        if (estado.routePhase === 'done') return;

        const rect       = canvas.getBoundingClientRect();
        const mx         = e.clientX - rect.left;
        const my         = e.clientY - rect.top;
        const { rx, ry } = canvasARelativo(mx, my);
        procesarClicRuta(rx, ry);
    });

    /* scroll zoom */
    wrapper.addEventListener('wheel', e => {
        e.preventDefault();
        const rect   = canvas.getBoundingClientRect();
        const factor = e.deltaY < 0 ? (1 + ZOOM_STEP) : (1 - ZOOM_STEP);
        aplicarZoom(factor, e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });

    /* botones zoom */
    el.zoomIn().addEventListener('click', () => {
        const c = el.canvas();
        aplicarZoom(1 + ZOOM_STEP, c.width / 2, c.height / 2);
    });
    el.zoomOut().addEventListener('click', () => {
        const c = el.canvas();
        aplicarZoom(1 - ZOOM_STEP, c.width / 2, c.height / 2);
    });
    el.zoomReset().addEventListener('click', () => { centrarMapa(); renderizar(); });

    /* limpiar ruta */
    el.resetBtn().addEventListener('click', limpiarRuta);
    el.clearRouteBtn().addEventListener('click', limpiarRuta);

    /* logout */
    document.getElementById('js-logout-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem('mapUser');
        window.location.href = 'login.html';
    });

    /* resize */
    window.addEventListener('resize', () => {
        redimensionarCanvas();
        centrarMapa();
        renderizar();
    });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
function inicializar() {
    // Verificar sesión activa
    const usuario = sessionStorage.getItem('mapUser');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    const display = document.getElementById('js-username-display');
    if (display) display.textContent = usuario;

    redimensionarCanvas();
    renderizarSidebar();
    actualizarUIRuta();
    registrarEventos();
    cargarImagen(MAP_IMAGE_SRC, () => {
        centrarMapa();
        renderizar();
    });
}

document.addEventListener('DOMContentLoaded', inicializar);
