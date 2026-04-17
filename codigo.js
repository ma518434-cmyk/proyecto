/* ============================================================
   MAPA — PREPA 2 UAEH
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   CONFIGURACIÓN Y DATOS
   ------------------------------------------------------------ */

/** @type {string} Ruta a la imagen del mapa */
const MAP_IMAGE_SRC = 'prepa.jpeg';

/** Zoom mínimo y máximo permitido */
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4.0;
const ZOOM_STEP = 0.15;

/**
 * Puntos de interés del plantel.
 * x, y: posición (0.0 - 1.0) sobre la imagen original.
 * @type {Array<Object>}
 */
const PUNTOS_DE_INTERES = [
    {
        id: 'computo',
        nombre: 'Centros de Cómputo',
        descripcion: 'Laboratorios de informática para prácticas y proyectos',
        tipo: 'building',
        icono: '💻',
        x: 0.42,
        y: 0.29,
    },
    {
        id: 'CAI',
        nombre: 'CAI',
        descripcion: '',
        tipo: 'building',
        icono: '🏫',
        x: 0.40,
        y: 0.2,
    },
    {
        id: 'oficinas',
        nombre: 'Oficinas',
        descripcion: 'Administración, dirección y servicios escolares',
        tipo: 'building',
        icono: '🏢',
        x: 0.6,
        y: 0.16,
    },
    {
        id: 'audiovisual',
        nombre: 'Audiovisual',
        descripcion: 'Área de producción audiovisual y multimedia',
        tipo: 'building',
        icono: '🎥',
        x: 0.73,
        y: 0.2,
    },
    {
        id: 'Labotario-de-Quimica',
        nombre: 'Laboratorio de Química',
        descripcion: 'Área equipada para prácticas de química',
        tipo: 'building',
        icono: '⚗️',
        x: 0.48,
        y: 0.27,
    },
    {
        id: 'Edifico-H',
        nombre: 'Edificio H',
        descripcion: '',
        tipo: 'building',
        icono: '🏫',
        x: 0.5,
        y: 0.4,
    },
    {
        id: 'biblioteca',
        nombre: 'Biblioteca',
        descripcion: 'Acervo bibliográfico y sala de lectura',
        tipo: 'service',
        icono: '📚',
        x: 0.28,
        y: 0.43,
    },
    {
        id: 'cafeteria',
        nombre: 'Cafetería',
        descripcion: 'Servicio de alimentos y bebidas',
        tipo: 'service',
        icono: '🍽️',
        x: 0.26,
        y: 0.32,
    },
    {
        id: 'Salon-de-Usos-Multiples',
        nombre: 'Salon de Usos Múltiples',
        descripcion: 'Area de eventos, asambleas y actividades culturales',
        tipo: 'service',
        icono: '🎭',
        x: 0.45,
        y: 0.85,
    },
    {
        id: 'pista',
        nombre: 'Pista Atlética',
        descripcion: 'Pista de 400 m y campo de fútbol',
        tipo: 'Deportes',
        icono: '🏃',
        x: 0.60,
        y: 0.50,
    },
    {
        id: 'canchas',
        nombre: 'Canchas Deportivas',
        descripcion: 'Básquetbol y voleibol',
        tipo: 'Deportes',
        icono: '⚽',
        x: 0.72,
        y: 0.70,
    },
    {
        id: 'estacionamiento',
        nombre: 'Estacionamiento',
        descripcion: 'Estacionamiento principal docentes y alumnos',
        tipo: 'parking',
        icono: '🅿️',
        x: 0.25,
        y: 0.22,
    },
    {
        id: 'danza',
        nombre: 'Sala de Danza',
        descripcion: 'Área para prácticas de danza',
        tipo: 'service',
        icono: '💃',
        x: 0.80,
        y: 0.27,
    },
    {
        id: 'explanada',
        nombre: 'Explanada',
        descripcion: 'Espacio abierto para eventos y actividades al aire libre',
        tipo: 'Deportes',
        icono: '🌳',
        x: 0.63,
        y: 0.25,
    },
    {
        id: 'Oficinas-de-Deportes',
        nombre: 'Oficina de Deportes',
        descripcion: 'Administración de actividades deportivas',
        tipo: 'service',
        icono: '👨‍⚖️',
        x: 0.26,
        y: 0.52,
    },
];

/** Caminos del plantel como segmentos de línea (coordenadas relativas 0.0–1.0) */
const CAMINOS = [
    // Camino principal horizontal
    { x1: 0.12, y1: 0.50, x2: 0.85, y2: 0.50 },
    // Camino vertical izquierda
    { x1: 0.20, y1: 0.15, x2: 0.20, y2: 0.85 },
    // Camino vertical centro
    { x1: 0.45, y1: 0.15, x2: 0.45, y2: 0.85 },
    // Camino vertical derecha
    { x1: 0.70, y1: 0.15, x2: 0.70, y2: 0.85 },
    // Camino horizontal superior
    { x1: 0.12, y1: 0.25, x2: 0.85, y2: 0.25 },
    // Camino horizontal inferior
    { x1: 0.12, y1: 0.75, x2: 0.85, y2: 0.75 },
    // Conexiones diagonales internas
    { x1: 0.20, y1: 0.25, x2: 0.45, y2: 0.50 },
    { x1: 0.45, y1: 0.25, x2: 0.70, y2: 0.50 },
    { x1: 0.20, y1: 0.75, x2: 0.45, y2: 0.50 },
    { x1: 0.45, y1: 0.75, x2: 0.70, y2: 0.50 },
];

/* ------------------------------------------------------------
   ESTADO DE LA APLICACIÓN
   ------------------------------------------------------------ */

const estado = {
    /** @type {HTMLImageElement|null} */
    imagen: null,
    imageLoaded: false,

    // Transformación del mapa
    offsetX: 0,
    offsetY: 0,
    zoom: 1.0,

    // Interacción de arrastre
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartOffsetX: 0,
    dragStartOffsetY: 0,

    // Ruta
    routeOrigin: null,    // { x, y } en coordenadas relativas
    routeDestino: null,
    routePhase: 'idle',   // 'idle' | 'picking-origin' | 'picking-dest' | 'done'

    // POI activo en sidebar
    poiActivoId: null,
};

/* ------------------------------------------------------------
   REFERENCIAS AL DOM
   ------------------------------------------------------------ */

const elementos = {
    canvas:         () => document.getElementById('js-map-canvas'),
    wrapper:        () => document.getElementById('js-map-wrapper'),
    tooltip:        () => document.getElementById('js-tooltip'),
    tooltipIcon:    () => document.getElementById('js-tooltip-icon'),
    tooltipName:    () => document.getElementById('js-tooltip-name'),
    tooltipDesc:    () => document.getElementById('js-tooltip-desc'),
    poiList:        () => document.getElementById('js-poi-list'),
    routeHint:      () => document.getElementById('js-route-hint'),
    originLabel:    () => document.getElementById('js-origin-label'),
    destLabel:      () => document.getElementById('js-dest-label'),
    resetBtn:       () => document.getElementById('js-reset-btn'),
    clearRouteBtn:  () => document.getElementById('js-clear-route-btn'),
    modeLabel:      () => document.getElementById('js-mode-label'),
    zoomIn:         () => document.getElementById('js-zoom-in'),
    zoomOut:        () => document.getElementById('js-zoom-out'),
    zoomReset:      () => document.getElementById('js-zoom-reset'),
};

/* ------------------------------------------------------------
   MÓDULO: CARGA DE IMAGEN
   ------------------------------------------------------------ */

/**
 * Carga la imagen del mapa y llama al callback cuando esté lista.
 * @param {string} src
 * @param {function} onLoad
 */
function cargarImagen(src, onLoad) {
    const img = new Image();
    img.onload = () => {
        estado.imagen = img;
        estado.imageLoaded = true;
        onLoad();
    };
    img.onerror = () => {
        console.warn('No se pudo cargar la imagen del mapa:', src);
        estado.imageLoaded = false;
        onLoad();
    };
    img.src = src;
}

/* ------------------------------------------------------------
   MÓDULO: CANVAS Y TRANSFORMACIONES
   ------------------------------------------------------------ */

/**
 * Ajusta el canvas al tamaño del contenedor.
 */
function redimensionarCanvas() {
    const canvas = elementos.canvas();
    const wrapper = elementos.wrapper();
    canvas.width  = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
}

/**
 * Convierte coordenadas relativas (0–1) a píxeles en el canvas.
 * @param {number} rx - coordenada relativa X
 * @param {number} ry - coordenada relativa Y
 * @returns {{ px: number, py: number }}
 */
function relativoACanvas(rx, ry) {
    const canvas = elementos.canvas();
    const baseW = estado.imagen ? estado.imagen.width  : canvas.width;
    const baseH = estado.imagen ? estado.imagen.height : canvas.height;

    const px = estado.offsetX + rx * baseW * estado.zoom;
    const py = estado.offsetY + ry * baseH * estado.zoom;
    return { px, py };
}

/**
 * Convierte píxeles en canvas a coordenadas relativas (0–1).
 * @param {number} px
 * @param {number} py
 * @returns {{ rx: number, ry: number }}
 */
function canvasARelativo(px, py) {
    const canvas = elementos.canvas();
    const baseW = estado.imagen ? estado.imagen.width  : canvas.width;
    const baseH = estado.imagen ? estado.imagen.height : canvas.height;

    const rx = (px - estado.offsetX) / (baseW * estado.zoom);
    const ry = (py - estado.offsetY) / (baseH * estado.zoom);
    return { rx, ry };
}

/**
 * Centra el mapa en el canvas.
 */
function centrarMapa() {
    const canvas = elementos.canvas();
    if (!estado.imagen) return;

    const escalaFit = Math.min(
        canvas.width  / estado.imagen.width,
        canvas.height / estado.imagen.height
    ) * 0.92;

    estado.zoom    = escalaFit;
    estado.offsetX = (canvas.width  - estado.imagen.width  * escalaFit) / 2;
    estado.offsetY = (canvas.height - estado.imagen.height * escalaFit) / 2;
}

/* ------------------------------------------------------------
   MÓDULO: RENDERIZADO
   ------------------------------------------------------------ */

/**
 * Punto de entrada del renderizado. Dibuja todo el mapa en el canvas.
 */
function renderizar() {
    const canvas = elementos.canvas();
    const ctx    = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarFondo(ctx, canvas);

    if (estado.imageLoaded && estado.imagen) {
        dibujarImagen(ctx);
    }

    dibujarCaminos(ctx);
    dibujarPOIs(ctx);
    dibujarRuta(ctx);
}

/**
 * Dibuja el fondo del canvas.
 */
function dibujarFondo(ctx, canvas) {
    ctx.fillStyle = '#ff880094';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Dibuja la imagen del mapa con la transformación actual.
 */
function dibujarImagen(ctx) {
    const w = estado.imagen.width  * estado.zoom;
    const h = estado.imagen.height * estado.zoom;
    ctx.drawImage(estado.imagen, estado.offsetX, estado.offsetY, w, h);


    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(estado.offsetX, estado.offsetY, w, h);
}

/**
 * Dibuja los caminos del plantel sobre el mapa.
 */
function dibujarCaminos(ctx) {
    CAMINOS.forEach(camino => {
        const origen = relativoACanvas(camino.x1, camino.y1);
        const destino = relativoACanvas(camino.x2, camino.y2);

        ctx.beginPath();
        ctx.moveTo(origen.px, origen.py);
        ctx.lineTo(destino.px, destino.py);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = Math.max(1, 2 * estado.zoom);
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    });
}

/**
 * Devuelve el color asociado al tipo de edificio.
 * @param {string} tipo
 * @returns {string}
 */
function colorPorTipo(tipo) {
    const colores = {
        building: '#4da6ff',
        Deportes:    '#00e5a0',
        parking:  '#b57bee',
        service:  '#ff6b35',
    };
    return colores[tipo] || '#ffffff';
}

/**
 * Dibuja todos los puntos de interés en el canvas.
 */
function dibujarPOIs(ctx) {
    PUNTOS_DE_INTERES.forEach(poi => {
        const { px, py } = relativoACanvas(poi.x, poi.y);
        const color = colorPorTipo(poi.tipo);
        const radio = Math.max(8, 12 * estado.zoom);
        const esActivo = poi.id === estado.poiActivoId;

        // Halo exterior (si activo)
        if (esActivo) {
            ctx.beginPath();
            ctx.arc(px, py, radio * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = color + '22';
            ctx.fill();
        }

        // Círculo principal
        ctx.beginPath();
        ctx.arc(px, py, radio, 0, Math.PI * 2);
        ctx.fillStyle = color + (esActivo ? 'ff' : 'cc');
        ctx.fill();

        // Borde
        ctx.strokeStyle = esActivo ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = esActivo ? 2 : 1;
        ctx.stroke();

        // Icono emoji
        if (estado.zoom > 0.7) {
            const fontSize = Math.max(10, 13 * estado.zoom);
            ctx.font = `${fontSize}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(poi.icono, px, py);
        }

        // Etiqueta de nombre
        if (estado.zoom > 1.2) {
            const fontSize = Math.max(8, 10 * estado.zoom);
            ctx.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(poi.nombre, px, py + radio + 4);
            ctx.shadowBlur = 0;
        }
    });
}

/**
 * Dibuja la ruta entre origen y destino usando los caminos definidos.
 */
function dibujarRuta(ctx) {
    if (!estado.routeOrigin) return;

    const origen  = relativoACanvas(estado.routeOrigin.x, estado.routeOrigin.y);

    // Marcador de origen
    dibujarMarcadorRuta(ctx, origen.px, origen.py, '#920202', 'A');

    if (!estado.routeDestino) return;

    const destino = relativoACanvas(estado.routeDestino.x, estado.routeDestino.y);

    // Marcador de destino
    dibujarMarcadorRuta(ctx, destino.px, destino.py, '#ff6b35', 'B');

    // Línea de ruta (por los caminos, aproximada con waypoints)
    const waypoints = calcularRuta(estado.routeOrigin, estado.routeDestino);

    if (waypoints.length < 2) return;

    ctx.beginPath();
    const inicio = relativoACanvas(waypoints[0].x, waypoints[0].y);
    ctx.moveTo(inicio.px, inicio.py);

    for (let i = 1; i < waypoints.length; i++) {
        const p = relativoACanvas(waypoints[i].x, waypoints[i].y);
        ctx.lineTo(p.px, p.py);
    }

    ctx.strokeStyle = '#ffdd57';
    ctx.lineWidth   = Math.max(2, 3 * estado.zoom);
    ctx.setLineDash([10, 5]);
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    // Sombra de la ruta
    ctx.shadowColor = 'rgba(255, 221, 87, 0.5)';
    ctx.shadowBlur  = 8;
    ctx.stroke();
    ctx.shadowBlur  = 0;
    ctx.setLineDash([]);
}

/**
 * Dibuja un marcador circular con letra para la ruta.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} px
 * @param {number} py
 * @param {string} color
 * @param {string} letra
 */
function dibujarMarcadorRuta(ctx, px, py, color, letra) {
    const radio = Math.max(10, 14 * estado.zoom);

    ctx.beginPath();
    ctx.arc(px, py, radio, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 2;
    ctx.stroke();

    const fontSize = Math.max(9, 11 * estado.zoom);
    ctx.font = `bold ${fontSize}px 'Syne', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = '#0d0f14';
    ctx.fillText(letra, px, py);
}

/* ------------------------------------------------------------
   MÓDULO: CÁLCULO DE RUTA
   ------------------------------------------------------------ */

/**
 * Calcula una ruta aproximada entre dos puntos usando los nodos de caminos.

 * @param {{ x: number, y: number }} origen
 * @param {{ x: number, y: number }} destino
 * @returns {Array<{ x: number, y: number }>}
 */
function calcularRuta(origen, destino) {
    // Construir nodos del grafo a partir de los extremos de los caminos
    const nodos = extraerNodosDelGrafo();

    // Encontrar el nodo más cercano al origen y al destino
    const nodoOrigen  = nodoMasCercano(nodos, origen);
    const nodoDestino = nodoMasCercano(nodos, destino);

    if (!nodoOrigen || !nodoDestino) {
        return [origen, destino];
    }

    // A* sobre el grafo
    const camino = aEstrella(nodos, nodoOrigen, nodoDestino);

    if (!camino) {
        return [origen, nodoOrigen, nodoDestino, destino];
    }

    return [origen, ...camino, destino];
}

/**
 * Extrae los nodos únicos del grafo de caminos.
 * @returns {Array<{ x: number, y: number, id: string }>}
 */
function extraerNodosDelGrafo() {
    const nodosMap = new Map();

    CAMINOS.forEach(c => {
        const k1 = `${c.x1},${c.y1}`;
        const k2 = `${c.x2},${c.y2}`;
        if (!nodosMap.has(k1)) nodosMap.set(k1, { x: c.x1, y: c.y1, id: k1 });
        if (!nodosMap.has(k2)) nodosMap.set(k2, { x: c.x2, y: c.y2, id: k2 });
    });

    return Array.from(nodosMap.values());
}

/**
 * Retorna el nodo del grafo más cercano a un punto dado.
 * @param {Array} nodos
 * @param {{ x: number, y: number }} punto
 * @returns {Object}
 */
function nodoMasCercano(nodos, punto) {
    let minDist = Infinity;
    let cercano = null;

    nodos.forEach(nodo => {
        const dist = distanciaEuclidiana(nodo, punto);
        if (dist < minDist) {
            minDist = dist;
            cercano = nodo;
        }
    });

    return cercano;
}

/**
 * Distancia euclidiana entre dos puntos 2D.
 */
function distanciaEuclidiana(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Algoritmo A* sobre el grafo de caminos.
 * @param {Array} nodos
 * @param {Object} inicio
 * @param {Object} meta
 * @returns {Array|null}
 */
function aEstrella(nodos, inicio, meta) {
    const abiertos  = new Set([inicio.id]);
    const cerrados  = new Set();
    const gScore    = new Map([[inicio.id, 0]]);
    const fScore    = new Map([[inicio.id, distanciaEuclidiana(inicio, meta)]]);
    const cameFrom  = new Map();

    const nodoPorId = (id) => nodos.find(n => n.id === id);

    while (abiertos.size > 0) {
        // Nodo con menor fScore
        const actualId = [...abiertos].reduce((a, b) =>
            (fScore.get(a) ?? Infinity) < (fScore.get(b) ?? Infinity) ? a : b
        );
        const actual = nodoPorId(actualId);

        if (actualId === meta.id) {
            return reconstruirCamino(cameFrom, actualId, nodoPorId);
        }

        abiertos.delete(actualId);
        cerrados.add(actualId);

        // Vecinos: nodos conectados por un camino
        const vecinos = obtenerVecinos(actual, nodos);

        vecinos.forEach(vecino => {
            if (cerrados.has(vecino.id)) return;

            const gTentativo = (gScore.get(actualId) ?? Infinity)
                             + distanciaEuclidiana(actual, vecino);

            if (!abiertos.has(vecino.id)) abiertos.add(vecino.id);
            else if (gTentativo >= (gScore.get(vecino.id) ?? Infinity)) return;

            cameFrom.set(vecino.id, actualId);
            gScore.set(vecino.id, gTentativo);
            fScore.set(vecino.id, gTentativo + distanciaEuclidiana(vecino, meta));
        });
    }

    return null; // Sin ruta
}

/**
 * Retorna los nodos vecinos conectados al nodo dado por un camino.
 */
function obtenerVecinos(nodo, nodos) {
    const vecinos = [];
    const eps = 0.001;

    CAMINOS.forEach(c => {
        const esOrigen  = Math.abs(c.x1 - nodo.x) < eps && Math.abs(c.y1 - nodo.y) < eps;
        const esDestino = Math.abs(c.x2 - nodo.x) < eps && Math.abs(c.y2 - nodo.y) < eps;

        if (esOrigen) {
            const v = nodos.find(n => Math.abs(n.x - c.x2) < eps && Math.abs(n.y - c.y2) < eps);
            if (v) vecinos.push(v);
        }
        if (esDestino) {
            const v = nodos.find(n => Math.abs(n.x - c.x1) < eps && Math.abs(n.y - c.y1) < eps);
            if (v) vecinos.push(v);
        }
    });

    return vecinos;
}

/**
 * Reconstruye el camino desde el mapa cameFrom.
 */
function reconstruirCamino(cameFrom, actualId, nodoPorId) {
    const camino = [nodoPorId(actualId)];
    let current  = actualId;

    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        camino.unshift(nodoPorId(current));
    }

    return camino;
}

/* ------------------------------------------------------------
   MÓDULO: INTERACCIÓN CON EL MAPA
   ------------------------------------------------------------ */

/**
 * Detecta si un punto del canvas está sobre algún POI.
 * @param {number} px
 * @param {number} py
 * @returns {Object|null}
 */
function detectarPOI(px, py) {
    const umbral = Math.max(14, 18 * estado.zoom);

    return PUNTOS_DE_INTERES.find(poi => {
        const pos = relativoACanvas(poi.x, poi.y);
        return distanciaEuclidiana({ x: pos.px, y: pos.py }, { x: px, y: py }) < umbral;
    }) || null;
}

/**
 * Muestra el tooltip cerca del cursor.
 */
function mostrarTooltip(poi, mouseX, mouseY) {
    const tooltip = elementos.tooltip();
    elementos.tooltipIcon().textContent = poi.icono;
    elementos.tooltipName().textContent = poi.nombre;
    elementos.tooltipDesc().textContent = poi.descripcion;

    tooltip.style.left = `${mouseX + 16}px`;
    tooltip.style.top  = `${mouseY - 10}px`;
    tooltip.classList.add('visible');
}

/**
 * Oculta el tooltip.
 */
function ocultarTooltip() {
    elementos.tooltip().classList.remove('visible');
}

/**
 * Aplica zoom centrado en un punto del canvas.
 * @param {number} factor - multiplicador del zoom
 * @param {number} cx - punto central X en canvas
 * @param {number} cy - punto central Y en canvas
 */
function aplicarZoom(factor, cx, cy) {
    const nuevoZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, estado.zoom * factor));
    const escala    = nuevoZoom / estado.zoom;

    estado.offsetX = cx - escala * (cx - estado.offsetX);
    estado.offsetY = cy - escala * (cy - estado.offsetY);
    estado.zoom    = nuevoZoom;

    renderizar();
}

/* ------------------------------------------------------------
   MÓDULO: GESTIÓN DE RUTA
   ------------------------------------------------------------ */

/**
 * Inicia el flujo de selección de ruta.
 */
function iniciarSeleccionRuta() {
    estado.routePhase  = 'picking-origin';
    estado.routeOrigin = null;
    estado.routeDestino = null;

    actualizarUIRuta();
    elementos.wrapper().classList.add('routing');
    elementos.modeLabel().textContent = 'Selecciona origen';
}

/**
 * Procesa un clic en el mapa durante la selección de ruta.
 * @param {number} rx - coordenada relativa X
 * @param {number} ry - coordenada relativa Y
 */
function procesarClicRuta(rx, ry) {
    if (estado.routePhase === 'picking-origin') {
        estado.routeOrigin = { x: rx, y: ry };
        estado.routePhase  = 'picking-dest';
        actualizarUIRuta();
        elementos.modeLabel().textContent = 'Selecciona destino';

    } else if (estado.routePhase === 'picking-dest') {
        estado.routeDestino = { x: rx, y: ry };
        estado.routePhase   = 'done';
        actualizarUIRuta();
        elementos.wrapper().classList.remove('routing');
        elementos.modeLabel().textContent = 'Ruta calculada';
        elementos.resetBtn().classList.add('visible');
    }

    renderizar();
}

/**
 * Limpia la ruta actual y reinicia el estado.
 */
function limpiarRuta() {
    estado.routeOrigin  = null;
    estado.routeDestino = null;
    estado.routePhase   = 'idle';

    elementos.wrapper().classList.remove('routing');
    elementos.modeLabel().textContent = 'Modo exploración';
    elementos.resetBtn().classList.remove('visible');

    actualizarUIRuta();
    renderizar();
}

/**
 * Actualiza los textos del panel de ruta en el sidebar.
 */
function actualizarUIRuta() {
    const hints = {
        'idle':           'Haz clic en el mapa para marcar el <strong>origen</strong>.',
        'picking-origin': 'Haz clic en el mapa para marcar el <strong>origen</strong>.',
        'picking-dest':   'Ahora haz clic para marcar el <strong>destino</strong>.',
        'done':           'Ruta calculada. Puedes limpiarla cuando quieras.',
    };

    elementos.routeHint().innerHTML = hints[estado.routePhase] || '';

    const originLabel = elementos.originLabel();
    const destLabel   = elementos.destLabel();

    if (estado.routeOrigin) {
        originLabel.textContent = `(${estado.routeOrigin.x.toFixed(2)}, ${estado.routeOrigin.y.toFixed(2)})`;
        originLabel.classList.add('set');
    } else {
        originLabel.textContent = 'Sin seleccionar';
        originLabel.classList.remove('set');
    }

    if (estado.routeDestino) {
        destLabel.textContent = `(${estado.routeDestino.x.toFixed(2)}, ${estado.routeDestino.y.toFixed(2)})`;
        destLabel.classList.add('set');
    } else {
        destLabel.textContent = 'Sin seleccionar';
        destLabel.classList.remove('set');
    }
}

/* ------------------------------------------------------------
   MÓDULO: SIDEBAR (POIs)
   ------------------------------------------------------------ */

/**
 * Renderiza la lista de POIs en el sidebar.
 */
function renderizarSidebar() {
    const lista = elementos.poiList();
    lista.innerHTML = '';

    PUNTOS_DE_INTERES.forEach(poi => {
        const li = document.createElement('li');
        li.className = 'poi-item';
        li.dataset.id = poi.id;

        li.innerHTML = `
            <span class="poi-item__icon">${poi.icono}</span>
            <span class="poi-item__info">
                <span class="poi-item__name">${poi.nombre}</span>
                <span class="poi-item__type">${etiquetaTipo(poi.tipo)}</span>
            </span>
        `;

        li.addEventListener('click', () => enfocarPOI(poi));
        lista.appendChild(li);
    });
}

/**
 * Retorna la etiqueta legible del tipo de POI.
 * @param {string} tipo
 * @returns {string}
 */
function etiquetaTipo(tipo) {
    const etiquetas = {
        building: 'Edificio',
        Deportes:    'Área deportiva',
        parking:  'Estacionamiento',
        service:  'Servicio',
    };
    return etiquetas[tipo] || tipo;
}

/**
 * Centra el mapa en un POI y lo resalta.
 * @param {Object} poi
 */
function enfocarPOI(poi) {
    estado.poiActivoId = poi.id;

    // Centrar en el POI
    const canvas = elementos.canvas();
    estado.zoom    = 2.0;
    estado.offsetX = canvas.width  / 2 - poi.x * (estado.imagen?.width  ?? canvas.width)  * estado.zoom;
    estado.offsetY = canvas.height / 2 - poi.y * (estado.imagen?.height ?? canvas.height) * estado.zoom;

    // Actualizar sidebar
    document.querySelectorAll('.poi-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === poi.id);
    });

    renderizar();
}

/* ------------------------------------------------------------
   MÓDULO: EVENTOS
   ------------------------------------------------------------ */

/**
 * Registra todos los eventos de interacción.
 */
function registrarEventos() {
    const canvas  = elementos.canvas();
    const wrapper = elementos.wrapper();

    // ---- Arrastre ----
    wrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        estado.dragging       = true;
        estado.dragStartX     = e.clientX;
        estado.dragStartY     = e.clientY;
        estado.dragStartOffsetX = estado.offsetX;
        estado.dragStartOffsetY = estado.offsetY;
        wrapper.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
        if (estado.dragging) {
            estado.offsetX = estado.dragStartOffsetX + (e.clientX - estado.dragStartX);
            estado.offsetY = estado.dragStartOffsetY + (e.clientY - estado.dragStartY);
            renderizar();
            return;
        }

        // Hover: detectar POI
        const rect = canvas.getBoundingClientRect();
        const mx   = e.clientX - rect.left;
        const my   = e.clientY - rect.top;
        const poi  = detectarPOI(mx, my);

        if (poi) {
            mostrarTooltip(poi, mx, my);
            canvas.style.cursor = 'pointer';
        } else {
            ocultarTooltip();
            canvas.style.cursor = '';
        }
    });

    window.addEventListener('mouseup', () => {
        estado.dragging = false;
        wrapper.classList.remove('grabbing');
    });

    // ---- Clic (ruta) ----
    canvas.addEventListener('click', (e) => {
        if (estado.dragging) return;

        const rect    = canvas.getBoundingClientRect();
        const mx      = e.clientX - rect.left;
        const my      = e.clientY - rect.top;
        const { rx, ry } = canvasARelativo(mx, my);

        if (estado.routePhase === 'idle') {
            iniciarSeleccionRuta();
            procesarClicRuta(rx, ry);
        } else if (estado.routePhase !== 'done') {
            procesarClicRuta(rx, ry);
        }
    });

    // ---- Scroll / Zoom ----
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect   = canvas.getBoundingClientRect();
        const cx     = e.clientX - rect.left;
        const cy     = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? (1 + ZOOM_STEP) : (1 - ZOOM_STEP);
        aplicarZoom(factor, cx, cy);
    }, { passive: false });

    // ---- Botones de zoom ----
    elementos.zoomIn().addEventListener('click', () => {
        const c = elementos.canvas();
        aplicarZoom(1 + ZOOM_STEP, c.width / 2, c.height / 2);
    });

    elementos.zoomOut().addEventListener('click', () => {
        const c = elementos.canvas();
        aplicarZoom(1 - ZOOM_STEP, c.width / 2, c.height / 2);
    });

    elementos.zoomReset().addEventListener('click', () => {
        centrarMapa();
        renderizar();
    });

    // ---- Limpiar ruta ----
    elementos.resetBtn().addEventListener('click', limpiarRuta);
    elementos.clearRouteBtn().addEventListener('click', limpiarRuta);

    // ---- Redimensionar ventana ----
    window.addEventListener('resize', () => {
        redimensionarCanvas();
        centrarMapa();
        renderizar();
    });
}

/* ------------------------------------------------------------
   INICIALIZACIÓN
   ------------------------------------------------------------ */

/**
 * Punto de entrada principal de la aplicación.
 */
function inicializar() {
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