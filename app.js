/* ============================================
   Bitcoin Sidechains Dashboard — app.js
   ============================================ */

let activeFilter = 'all';
let activeCategory = 'all';
let searchQuery = '';

const SIDECHAINS_DATA = [
  {
    "id": "liquid",
    "name": "Liquid Network",
    "year": 2018,
    "month": "Sep",
    "status": "active",
    "community": 5,
    "peg": "Federación (Blockstream)",
    "category": "Privacidad / Trading",
    "description": "Sidechain de Blockstream enfocada en transferencias rápidas y confidenciales entre exchanges. Usa una federación de custodios para el peg.",
    "pros": ["Transacciones confidenciales", "Liquidaciones rápidas (2 min)", "Soporte de activos múltiples (Issued Assets)"],
    "cons": ["Peg centralizado en federación", "No es compatible con EVM", "Requiere hardware HSM de Blockstream"],
    "url": "https://liquid.net",
    "highlight": true
  },
  {
    "id": "rsk",
    "name": "Rootstock (RSK)",
    "year": 2018,
    "month": "Ene",
    "status": "active",
    "community": 5,
    "peg": "Federación + Merged Mining",
    "category": "Smart Contracts / DeFi",
    "description": "La primera sidechain EVM-compatible de Bitcoin. Permite ejecutar contratos inteligentes con la seguridad de los mineros de BTC mediante merged mining.",
    "pros": ["Compatible con Ethereum (EVM)", "Merged mining con BTC (~50% hashrate)", "Ecosistema DeFi maduro (Sovryn, Money on Chain)"],
    "cons": ["Peg aún parcialmente federado", "Velocidad menor que otras EVM chains", "Menor TVL que soluciones Ethereum"],
    "url": "https://rootstock.io",
    "highlight": true
  },
  {
    "id": "stacks",
    "name": "Stacks",
    "year": 2021,
    "month": "Jan",
    "status": "active",
    "community": 5,
    "peg": "Proof of Transfer (PoX)",
    "category": "Smart Contracts / NFTs",
    "description": "Capa de smart contracts que se ancla a Bitcoin mediante PoX. Los mineros queman BTC para minar STX, y los holders de STX ganan BTC como recompensa.",
    "pros": ["STX holders ganan BTC real", "Lenguaje Clarity (sin reentrancy bugs)", "Contratos Bitcoin-aware (lee estado de BTC)"],
    "cons": ["No es técnicamente un two-way peg clásico", "Token STX propio puede ser controvertido", "Finalidad depende de bloques de Bitcoin"],
    "url": "https://stacks.co",
    "highlight": true
  },
  {
    "id": "drivechain",
    "name": "Drivechain (BIP300/301)",
    "year": 2023,
    "month": "Testnet",
    "status": "debate",
    "community": 3,
    "peg": "Hashrate Escrows (BIP300)",
    "category": "Protocolo / Propuesta",
    "description": "Propuesta de Paul Sztorc para crear sidechains activadas por soft fork en Bitcoin. Los mineros controlarían los fondos mediante votos de hashrate durante semanas.",
    "pros": ["Totalmente descentralizado (sin federación)", "Permite experimentar sin cambiar Bitcoin base", "Potencial para absorber casos de uso de altcoins"],
    "cons": ["Sin consenso en la comunidad de Bitcoin Core", "Riesgos de ataque por mineros deshonestos", "Introduce complejidad al protocolo base"],
    "url": "https://www.drivechain.info",
    "highlight": true
  },
  {
    "id": "merlin",
    "name": "Merlin Chain",
    "year": 2024,
    "month": "Feb",
    "status": "active",
    "community": 3,
    "peg": "ZK-Rollup + Bridge centralizado",
    "category": "ZK / DeFi",
    "description": "L2 de Bitcoin con ZK-Rollup, oráculos descentralizados y módulo anti-fraude on-chain. Lanzó mainnet en 2024 y realizó actualizaciones de arquitectura en 2025-2026.",
    "pros": ["Alto TPS con ZK proofs", "Ecosistema DeFi activo (100+ apps)", "Integración con LayerZero/Polyhedra"],
    "cons": ["Bridge parcialmente centralizado", "Seguridad depende de custodios", "Token MERL con volatilidad alta"],
    "url": "https://merlinchain.io",
    "highlight": false
  },
  {
    "id": "botanix",
    "name": "Botanix",
    "year": 2024,
    "month": "Testnet",
    "status": "development",
    "community": 3,
    "peg": "Spider Chain (PoS multisig)",
    "category": "EVM / PoS",
    "description": "Sidechain EVM sobre Bitcoin con un diseño innovador llamado Spider Chain: un sistema de multisig rotativo y descentralizado entre stakers de BTC.",
    "pros": ["Totalmente EVM compatible", "Peg más descentralizado que federaciones clásicas", "Sin token propio (usa BTC nativo)"],
    "cons": ["Aún en testnet/desarrollo", "Spider Chain no probado en producción a gran escala", "Menor ecosistema de dApps"],
    "url": "https://botanixlabs.xyz",
    "highlight": false
  },
  {
    "id": "fractal",
    "name": "Fractal Bitcoin",
    "year": 2024,
    "month": "Sep",
    "status": "active",
    "community": 3,
    "peg": "Recursivo (código BTC Core)",
    "category": "Escalabilidad",
    "description": "Replica el código de Bitcoin Core para crear capas de expansión recursiva infinita. Tiempo de bloque de ~30 segundos, 20x el throughput de BTC mainnet.",
    "pros": ["Compatible 100% con el código BTC", "Alta velocidad de confirmación (30s)", "Sin cambios al protocolo base"],
    "cons": ["No es un two-way peg real", "Seguridad separada de BTC mainnet", "Modelo económico cuestionado"],
    "url": "https://fractalbitcoin.io",
    "highlight": false
  },
  {
    "id": "bevm",
    "name": "BEVM",
    "year": 2024,
    "month": "Mar",
    "status": "active",
    "community": 2,
    "peg": "Taproot multisig",
    "category": "EVM / DeFi",
    "description": "Sidechain EVM de Bitcoin que usa Taproot para el two-way peg. Orientada a DeFi con BTC como gas token.",
    "pros": ["EVM compatible", "Usa Taproot (tecnología nativa BTC)", "BTC como gas token nativo"],
    "cons": ["Comunidad pequeña", "Peg con custodios centralizados", "Competencia intensa de otros EVMs"],
    "url": "https://bevm.io",
    "highlight": false
  },
  {
    "id": "core",
    "name": "Core Chain",
    "year": 2023,
    "month": "Jan",
    "status": "active",
    "community": 3,
    "peg": "Satoshi Plus Consensus",
    "category": "Smart Contracts / DeFi",
    "description": "Blockchain EVM que combina PoW de Bitcoin (delegated mining) con PoS propio. Los mineros de BTC delegan hashrate a Core para obtener recompensas en CORE.",
    "pros": ["Delegación de hashrate de mineros BTC", "EVM compatible con DeFi activo", "Alta velocidad (~2s por bloque)"],
    "cons": ["Token CORE propio", "No es un two-way peg clásico", "Seguridad del peg depende de custodios"],
    "url": "https://coredao.org",
    "highlight": false
  },
  {
    "id": "babylon",
    "name": "Babylon",
    "year": 2024,
    "month": "Mainnet 2025",
    "status": "development",
    "community": 4,
    "peg": "Bitcoin Staking Protocol",
    "category": "Staking / Seguridad",
    "description": "Protocolo que permite usar BTC como colateral para asegurar otras cadenas PoS. No mueve BTC fuera de la cadena — el staking ocurre on-chain en Bitcoin mediante scripts de tiempo.",
    "pros": ["BTC permanece on-chain (sin bridge)", "Asegura otras cadenas PoS con hashrate BTC", "Respaldo de a16z y otros VCs top"],
    "cons": ["No es una sidechain DeFi tradicional", "Modelo económico complejo", "Aún en fases tempranas de adopción"],
    "url": "https://babylonlabs.io",
    "highlight": true
  },
  {
    "id": "citrea",
    "name": "Citrea",
    "year": 2025,
    "month": "Testnet",
    "status": "development",
    "community": 3,
    "peg": "BitVM ZK-Rollup",
    "category": "ZK / Rollup",
    "description": "Primer ZK-Rollup verificado on-chain en Bitcoin usando BitVM. Permite ejecución de contratos inteligentes con liquidaciones verificadas matemáticamente en BTC.",
    "pros": ["Verificación on-chain real en Bitcoin", "Sin confianza en federación (trustless)", "Basado en BitVM (innovación 2023)"],
    "cons": ["Aún en testnet", "BitVM es muy nuevo y experimental", "Alto costo computacional de ZK proofs"],
    "url": "https://citrea.xyz",
    "highlight": false
  },
  {
    "id": "bouncebit",
    "name": "BounceBit",
    "year": 2024,
    "month": "May",
    "status": "active",
    "community": 2,
    "peg": "CeDeFi híbrido",
    "category": "CeDeFi / Yield",
    "description": "Cadena de PoS que combina custodia centralizada con DeFi on-chain. Los usuarios depositan BTC en custodios que generan yield en CeFi y DeFi simultáneamente.",
    "pros": ["Yield atractivo en BTC", "Fácil onboarding para usuarios CeFi", "Integración con exchanges regulados"],
    "cons": ["Alta centralización (custodios)", "Modelo híbrido controversial en comunidad BTC", "Riesgo de contraparte en la capa CeFi"],
    "url": "https://bouncebit.io",
    "highlight": false
  },
  {
    "id": "namecoin",
    "name": "Namecoin",
    "year": 2011,
    "month": "Apr",
    "status": "historical",
    "community": 1,
    "peg": "Merged Mining (sin peg real)",
    "category": "DNS / Identidad",
    "description": "La primera altcoin en usar merged mining con Bitcoin. Diseñada para DNS descentralizado (.bit). Pionera en el concepto de cadenas auxiliares minadas con Bitcoin.",
    "pros": ["Primera implementación de merged mining", "Referencia histórica fundamental", "DNS descentralizado sin censura"],
    "cons": ["Inactiva en su propósito principal", "Sin two-way peg real con Bitcoin", "Comunidad prácticamente inexistente"],
    "url": "https://namecoin.org",
    "highlight": false
  },
  {
    "id": "counterparty",
    "name": "Counterparty",
    "year": 2014,
    "month": "Jan",
    "status": "historical",
    "community": 1,
    "peg": "OP_RETURN en BTC",
    "category": "Activos / Tokens",
    "description": "Protocolo que embebe datos en transacciones OP_RETURN de Bitcoin para crear activos digitales, tokens y contratos. Pionero en tokens sobre Bitcoin.",
    "pros": ["Primeros tokens sobre BTC (XCP)", "Sin cadena separada (usa Bitcoin directamente)", "Pionero en NFTs sobre Bitcoin (2014)"],
    "cons": ["Actividad muy reducida", "Dependiente de OP_RETURN (limitado)", "Superado por Ordinals/BRC-20 en 2023"],
    "url": "https://counterparty.io",
    "highlight": false
  },
  {
    "id": "ailayer",
    "name": "AILayer",
    "year": 2024,
    "month": "Q3",
    "status": "development",
    "community": 2,
    "peg": "EVM + Bitcoin bridge",
    "category": "AI / EVM",
    "description": "Sidechain EVM de Bitcoin orientada a casos de uso de inteligencia artificial on-chain. Combina infraestructura de cómputo descentralizado con DeFi sobre BTC.",
    "pros": ["Nicho diferenciado (AI + Bitcoin)", "EVM compatible", "Integración con infraestructura de IA Web3"],
    "cons": ["Proyecto muy nuevo y sin tracción probada", "Propuesta de valor compleja", "Comunidad aún emergente"],
    "url": "https://ailayer.xyz",
    "highlight": false
  },
  {
    "id": "mintlayer",
    "name": "Mintlayer",
    "year": 2023,
    "month": "Mainnet",
    "status": "active",
    "community": 3,
    "peg": "Atomic Swaps (sin bridge)",
    "category": "DeFi / Tokenización",
    "description": "Sidechain de Bitcoin para DeFi y tokenización de activos. Usa atomic swaps para mover BTC sin bridges ni wrapped tokens, manteniendo la custodia nativa.",
    "pros": ["Sin wrapped tokens: BTC nativo vía atomic swaps", "Tokenización de RWA (valores, stablecoins)", "ZK Thunder Network para escalabilidad (2025)"],
    "cons": ["Menor ecosistema que RSK o Stacks", "Token ML propio", "Atomic swaps tienen fricciones de UX"],
    "url": "https://mintlayer.org",
    "highlight": false
  },
  {
    "id": "bitlayer",
    "name": "Bitlayer",
    "year": 2024,
    "month": "Mainnet",
    "status": "active",
    "community": 3,
    "peg": "BitVM + fraud proofs",
    "category": "BitVM / Multi-VM",
    "description": "L2 de Bitcoin basado en BitVM con soporte para múltiples VMs (EVM, SolVM, MoveVM, CairoVM). Cada cambio de estado se liquida en Bitcoin mediante pruebas de fraude verificables.",
    "pros": ["Soporte multi-VM único en el ecosistema", "Seguridad anclada en Bitcoin via BitVM", "$50M programa de incentivos para developers"],
    "cons": ["BitVM aún experimental y costoso computacionalmente", "Complejidad técnica alta", "Ecosistema aún en construcción"],
    "url": "https://bitlayer.org",
    "highlight": false
  },
  {
    "id": "b2network",
    "name": "B² Network",
    "year": 2024,
    "month": "Mainnet",
    "status": "active",
    "community": 3,
    "peg": "zkEVM + Optimistic fallback",
    "category": "ZK / Rollup",
    "description": "Diseño híbrido: zkEVM para validez de transacciones + sistema de fraud proofs optimista como fallback. Compensa la incapacidad de Bitcoin de verificar ZKPs nativamente.",
    "pros": ["Diseño híbrido ZK + Optimistic robusto", "EVM compatible", "Seguridad anclada en Bitcoin L1"],
    "cons": ["Arquitectura compleja de auditar", "Menor comunidad que soluciones más antiguas", "Dependencia de Bitcoin para finalidad añade latencia"],
    "url": "https://bsquared.network",
    "highlight": false
  },
  {
    "id": "ark",
    "name": "Ark Protocol",
    "year": 2024,
    "month": "Testnet",
    "status": "development",
    "community": 3,
    "peg": "Virtual UTXOs (vTXOs)",
    "category": "Pagos / Privacidad",
    "description": "Protocolo de pagos L2 que usa UTXOs virtuales efímeros (vTXOs) para transacciones off-chain no custodiales. Alternativa a Lightning Network sin necesidad de gestionar canales.",
    "pros": ["Sin gestión de canales (vs. Lightning)", "No custodial — el usuario controla sus BTC", "Ark Labs recaudó $2.5M en pre-seed (2024)"],
    "cons": ["Requiere liquidez de ASP (Ark Service Providers)", "Aún en testnet, sin uso real probado", "Modelo de confianza en el ASP durante la transición"],
    "url": "https://ark-protocol.org",
    "highlight": false
  },
  {
    "id": "rgb",
    "name": "RGB Protocol",
    "year": 2019,
    "month": "v0.10 2023",
    "status": "active",
    "community": 3,
    "peg": "Client-side validation (sin peg)",
    "category": "Smart Contracts / Activos",
    "description": "Sistema de smart contracts sobre Bitcoin y Lightning usando validación del lado del cliente. Los contratos y activos viven off-chain; Bitcoin solo actúa como capa de sellado (single-use seals).",
    "pros": ["Máxima privacidad (estado off-chain, invisible en blockchain)", "Compatible con Lightning Network", "Sin cambios al protocolo base de Bitcoin"],
    "cons": ["No es una sidechain tradicional (sin peg bidireccional)", "Modelo mental complejo para developers", "Tooling y documentación aún maduros en 2025"],
    "url": "https://rgb.tech",
    "highlight": false
  },
  {
    "id": "bob",
    "name": "BOB (Build on Bitcoin)",
    "year": 2024,
    "month": "Mainnet",
    "status": "active",
    "community": 3,
    "peg": "EVM + Bitcoin bridge",
    "category": "EVM / Híbrido",
    "description": "L2 EVM-compatible que conecta Bitcoin y Ethereum. Permite usar BTC en aplicaciones DeFi de Ethereum y acceder al ecosistema EVM directamente desde Bitcoin.",
    "pros": ["Puente nativo Bitcoin ↔ Ethereum", "EVM compatible — reutiliza todo el tooling de Ethereum", "Orientado a onboarding de usuarios BTC a DeFi"],
    "cons": ["Dependencia de dos ecosistemas aumenta superficie de ataque", "Bridge centralizado en etapas iniciales", "Posicionamiento confuso entre BTC y ETH ecosystems"],
    "url": "https://gobob.xyz",
    "highlight": false
  }
];

// Ordinals y BRC-20 añadidos por relevancia en el ecosistema
SIDECHAINS_DATA.push(
  {
    "id": "ordinals",
    "name": "Ordinals",
    "year": 2023,
    "month": "Ene",
    "status": "active",
    "community": 5,
    "peg": "Inscriptions en satoshis (on-chain)",
    "category": "NFTs / Inscripciones",
    "description": "Protocolo que asigna números de serie a cada satoshi y permite inscribir datos arbitrarios (imágenes, texto, código) directamente en la blockchain de Bitcoin. No es una sidechain — todo vive on-chain en Bitcoin.",
    "pros": ["Datos 100% on-chain en Bitcoin (máxima inmutabilidad)", "Sin token propio ni bridge necesario", "Generó el mayor boom de actividad en Bitcoin desde 2017"],
    "cons": ["Incrementa el tamaño de los bloques y las fees de Bitcoin", "Controvertido: puristas BTC lo ven como spam en la cadena", "No es una sidechain ni L2 — no escala, al contrario"],
    "url": "https://ordinals.com",
    "highlight": false
  },
  {
    "id": "brc20",
    "name": "BRC-20",
    "year": 2023,
    "month": "Mar",
    "status": "active",
    "community": 4,
    "peg": "Inscriptions JSON en satoshis",
    "category": "Tokens / Fungibles",
    "description": "Estándar experimental para crear tokens fungibles sobre Bitcoin usando inscripciones Ordinals con JSON. Inspirado en ERC-20 de Ethereum pero implementado de forma mucho más rudimentaria. No es una sidechain.",
    "pros": ["Primer estándar de tokens fungibles nativos en Bitcoin", "Enorme liquidez y volumen en 2023-2024", "Compatible con cualquier wallet que soporte Ordinals"],
    "cons": ["Extremadamente ineficiente: cada transferencia requiere 3 inscripciones", "Sin lógica de contrato real (solo texto JSON)", "Fuerte debate sobre si debería existir en Bitcoin"],
    "url": "https://domo-2.gitbook.io/brc-20-experiment",
    "highlight": false
  }
);

// Lightning Network insertada al inicio por relevancia
SIDECHAINS_DATA.unshift({
  "id": "lightning",
  "name": "Lightning Network",
  "year": 2018,
  "month": "Mar",
  "status": "active",
  "community": 5,
  "peg": "Payment channels (HTLC)",
  "category": "Pagos / L2",
  "description": "La red de canales de pago más usada de Bitcoin. Permite transacciones instantáneas y de bajo costo entre nodos conectados mediante canales bidireccionales asegurados on-chain. No es una sidechain clásica, sino un protocolo L2 sobre Bitcoin.",
  "pros": ["Mayor adopción de cualquier L2 de Bitcoin", "Transacciones en milisegundos sin esperar bloques", "Sin custodia — los fondos están en contratos on-chain de Bitcoin"],
  "cons": ["Gestión de canales y liquidez compleja para usuarios", "No soporta smart contracts generales (solo pagos)", "Routing de pagos grandes puede fallar por falta de liquidez"],
  "url": "https://lightning.network",
  "highlight": true
});

let allSidechains = SIDECHAINS_DATA;

const STATUS_LABELS = {
  active: 'Activa',
  development: 'En desarrollo',
  debate: 'En debate',
  historical: 'Histórica'
};

const COMMUNITY_LABELS = {
  5: 'Muy alto',
  4: 'Alto',
  3: 'Moderado',
  2: 'Emergente',
  1: 'Reducido'
};

/* ---- LOAD DATA ---- */
function loadData() {
  renderCategoryFilters();
  renderCards(allSidechains);
  renderSpotlight(allSidechains.filter(s => s.highlight));
}

/* ---- CATEGORY FILTERS ---- */
function renderCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const categories = ['all', ...new Set(allSidechains.map(s => s.category).sort())];

  container.innerHTML = categories.map(cat => `
    <button class="filter-btn cat ${cat === 'all' ? 'active' : ''}" data-cat="${cat}">
      ${cat === 'all' ? 'Todas las categorías' : cat}
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn.cat').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn.cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      applyFilters();
    });
  });
}

/* ---- CARDS ---- */
function renderCards(sidechains) {
  const grid = document.getElementById('cards-grid');
  const empty = document.getElementById('empty-state');

  if (sidechains.length === 0) {
    grid.innerHTML = '';
    empty.classList.add('visible');
    return;
  }

  empty.classList.remove('visible');
  grid.innerHTML = sidechains.map(s => cardHTML(s)).join('');

  // attach click events
  grid.querySelectorAll('.sidechain-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const sc = allSidechains.find(s => s.id === id);
      if (sc) openModal(sc);
    });
  });

  // animate cards on scroll
  requestAnimationFrame(() => requestAnimationFrame(observeNewCards));
}

function cardHTML(s) {
  const community = Array.from({length: 5}, (_, i) =>
    `<div class="comm-dot ${i < s.community ? 'filled' : ''}"></div>`
  ).join('');

  return `
    <div class="sidechain-card reveal" data-id="${s.id}">
      <div class="category-tag">${s.category}</div>
      <div class="card-header">
        <div>
          <div class="card-name">${s.name}</div>
          <div class="card-year">${s.month ? s.month + ' ' : ''}${s.year}</div>
        </div>
        <span class="status-badge ${s.status}">${STATUS_LABELS[s.status]}</span>
      </div>
      <p class="card-description">${s.description}</p>
      <div class="card-meta">
        <div class="meta-row">
          <span class="meta-label">Peg:</span>
          <span class="meta-value">${s.peg}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Comunidad:</span>
          <span class="meta-value">
            <div class="community-bar">${community}</div>
          </span>
        </div>
      </div>
      <a href="${s.url}" target="_blank" rel="noopener" class="card-link" onclick="event.stopPropagation()">
        Ver proyecto ↗
      </a>
    </div>
  `;
}

/* ---- FILTERS ---- */
function applyFilters() {
  const q = searchQuery.toLowerCase();
  const filtered = allSidechains.filter(s => {
    const matchesStatus   = activeFilter === 'all' || s.status === activeFilter;
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch   = !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.peg.toLowerCase().includes(q);
    return matchesStatus && matchesCategory && matchesSearch;
  });
  renderCards(filtered);
}

document.querySelectorAll('.filter-btn[data-type="status"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-type="status"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    applyFilters();
  });
}

/* ---- SPOTLIGHT ---- */
function renderSpotlight(highlights) {
  const nav = document.getElementById('spotlight-nav');
  const panel = document.getElementById('spotlight-panel');
  if (!nav || !panel) return;

  nav.innerHTML = highlights.map((s, i) => `
    <button class="spotlight-tab ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <span class="status-badge ${s.status}" style="margin-right:0.4rem">${STATUS_LABELS[s.status]}</span>
      ${s.name}
    </button>
  `).join('');

  panel.innerHTML = highlights.map((s, i) => `
    <div class="spotlight-content ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <div class="spotlight-header">
        <div>
          <div class="spotlight-name">${s.name}</div>
          <div style="color:var(--text-muted);font-size:0.75rem;margin-top:0.2rem">${s.category} · ${s.month ? s.month + ' ' : ''}${s.year}</div>
        </div>
        <span class="status-badge ${s.status}">${STATUS_LABELS[s.status]}</span>
      </div>
      <p class="spotlight-desc">${s.description}</p>
      <div class="pros-cons">
        <div class="pros-cons-box pros">
          <h4>Ventajas</h4>
          <ul>${s.pros.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="pros-cons-box cons">
          <h4>Desventajas</h4>
          <ul>${s.cons.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
        <div class="meta-row">
          <span class="meta-label">Soporte:</span>
          <span class="meta-value">${COMMUNITY_LABELS[s.community]}</span>
        </div>
        <span style="color:var(--border)">·</span>
        <div class="meta-row">
          <span class="meta-label">Peg:</span>
          <span class="meta-value">${s.peg}</span>
        </div>
        <a href="${s.url}" target="_blank" rel="noopener" class="card-link" style="margin-left:auto">
          Sitio oficial ↗
        </a>
      </div>
    </div>
  `).join('');

  nav.querySelectorAll('.spotlight-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      nav.querySelectorAll('.spotlight-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.spotlight-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelector(`[data-idx="${tab.dataset.idx}"]`).classList.add('active');
    });
  });
}

/* ---- MODAL ---- */
function openModal(s) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const community = Array.from({length: 5}, (_, i) =>
    `<div class="comm-dot ${i < s.community ? 'filled' : ''}"></div>`
  ).join('');

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem">
      <div>
        <div style="font-size:1.2rem;font-weight:800">${s.name}</div>
        <div style="color:var(--text-muted);font-size:0.75rem;margin-top:0.15rem">${s.category} · ${s.month ? s.month + ' ' : ''}${s.year}</div>
      </div>
      <span class="status-badge ${s.status}">${STATUS_LABELS[s.status]}</span>
    </div>
    <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.6;margin-bottom:1.25rem">${s.description}</p>
    <div class="card-meta" style="margin-bottom:1.25rem">
      <div class="meta-row">
        <span class="meta-label">Peg:</span>
        <span class="meta-value">${s.peg}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Comunidad:</span>
        <span class="meta-value"><div class="community-bar" style="display:inline-flex">${community}</div> ${COMMUNITY_LABELS[s.community]}</span>
      </div>
    </div>
    <div class="pros-cons">
      <div class="pros-cons-box pros">
        <h4>Ventajas</h4>
        <ul>${s.pros.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div class="pros-cons-box cons">
        <h4>Desventajas</h4>
        <ul>${s.cons.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>
    </div>
    <div style="margin-top:1.25rem">
      <a href="${s.url}" target="_blank" rel="noopener" class="card-link">
        Visitar ${s.name} ↗
      </a>
    </div>
  `;

  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('modal-close').addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el, target, suffix = '') {
  const duration = 1200;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = (isDecimal ? value.toFixed(0) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));

/* ---- SHARE / EXPORT ---- */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

(function initShare() {
  const btn = document.getElementById('share-btn');
  const dropdown = document.getElementById('share-dropdown');
  const optCopy = document.getElementById('opt-copy');
  const optNative = document.getElementById('opt-native');
  const optPdf = document.getElementById('opt-pdf');

  // show native share if supported
  if (navigator.share) optNative.style.display = 'flex';

  btn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => dropdown.classList.remove('open'));
  dropdown.addEventListener('click', e => e.stopPropagation());

  optCopy.addEventListener('click', () => {
    const url = location.href;
    navigator.clipboard.writeText(url)
      .then(() => showToast('✅ Enlace copiado al portapapeles'))
      .catch(() => {
        // fallback for file:// protocol
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('✅ Enlace copiado al portapapeles');
      });
    dropdown.classList.remove('open');
  });

  optNative.addEventListener('click', () => {
    navigator.share({
      title: 'Bitcoin Sidechains — Ecosistema completo',
      text: 'Explora todas las sidechains de Bitcoin: históricas, activas, en desarrollo y en debate.',
      url: location.href
    }).catch(() => {});
    dropdown.classList.remove('open');
  });

  optPdf.addEventListener('click', () => {
    dropdown.classList.remove('open');
    showToast('📄 Abriendo diálogo de impresión…');
    setTimeout(() => window.print(), 400);
  });
})();

/* ---- SCROLL REVEAL ---- */
function setupScrollReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  ).forEach(el => revealObserver.observe(el));
}

// Re-observe cards after they're injected by renderCards
function observeNewCards() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.sidechain-card:not(.visible)').forEach((card, i) => {
    card.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    revealObserver.observe(card);
  });
}

/* ---- INIT ---- */
setupScrollReveal();
loadData();
