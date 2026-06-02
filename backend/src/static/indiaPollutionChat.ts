/**
 * Static responses for the EcoVision chatbot (India air & pollution focus).
 * No external AI — rule-based matching on normalized user text.
 */

export type ChatPayload = {
  details: string;
  sources: Array<{ name: string; percentage: number }>;
  solutions: {
    government: string[];
    community: string[];
    individual: string[];
  };
  /** When set, the client should navigate (e.g. Next.js `router.push`) */
  navigate?: string;
};

/** Pads to 3 items so the UI always has three bullets per tab. */
function sol(government: string[], community: string[], individual: string[]) {
  const pad = (arr: string[]): string[] => {
    const a = arr.filter((s) => s.length > 0);
    const last = () => a[a.length - 1] ?? '—';
    while (a.length < 3) a.push(last());
    return a.slice(0, 3);
  };
  return {
    government: pad([...government]),
    community: pad([...community]),
    individual: pad([...individual]),
  };
}

type Topic = {
  /** All tokens must appear (after normalization) for a match, OR use `anyOf` */
  allOf?: string[];
  anyOf?: string[];
  payload: ChatPayload;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesTopic(q: string, topic: Topic): boolean {
  const n = normalize(q);
  if (topic.allOf?.length) {
    for (const t of topic.allOf) {
      if (!n.includes(t)) return false;
    }
    return true;
  }
  if (topic.anyOf?.length) {
    return topic.anyOf.some((t) => n.includes(t));
  }
  return false;
}

const GREETING_WORDS = new Set([
  'hi',
  'hello',
  'hey',
  'howdy',
  'namaste',
  'namaskar',
  'greetings',
  'yo',
  'hii',
  'hlo',
]);

const GREETING_PHRASES = [
  'good morning',
  'good afternoon',
  'good evening',
  'good night',
  'good day',
  'whats up',
  "what's up",
  'sup',
];

function isGreeting(query: string): boolean {
  const n = normalize(query);
  if (!n) return false;
  if (GREETING_PHRASES.some((p) => n.includes(p))) return true;
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length > 6) return false;
  return words.some((w) => GREETING_WORDS.has(w));
}

/** Site routes: home first, then common pages (App Router paths). */
function matchNavigationPath(query: string): string | undefined {
  const n = normalize(query);
  if (!n) return undefined;

  const homeExact = new Set([
    'home',
    'home page',
    'homepage',
    'main page',
    'landing page',
    'front page',
    'go home',
    'go to home',
    'open home',
    'open homepage',
    'take me home',
    'go to homepage',
    'navigate home',
    'back to home',
  ]);
  if (homeExact.has(n)) return '/';

  const routePatterns: Array<{ re: RegExp; path: string }> = [
    { re: /^(go to )?dashboard$/, path: '/dashboard' },
    { re: /^(go to )?search$/, path: '/search' },
    { re: /^(go to )?pollution$/, path: '/pollution' },
    { re: /^(go to )?methodology$/, path: '/methodology' },
    { re: /^(go to )?forests?$/, path: '/forests' },
    { re: /^(go to )?glaciers?$/, path: '/glaciers' },
    { re: /^(go to )?water$/, path: '/water' },
    { re: /^(go to )?solutions$/, path: '/solutions' },
  ];
  for (const { re, path } of routePatterns) {
    if (re.test(n)) return path;
  }

  return undefined;
}

const GREETING_PAYLOAD: ChatPayload = {
  details: `<h4>Hello!</h4>
<p>Welcome to EcoVision’s <strong>India pollution guide</strong>. Ask about AQI, Delhi, PM2.5, crop burning, rivers, or health.</p>
<p>Say <strong>home</strong> to open the site home page, or <strong>dashboard</strong> / <strong>search</strong> to jump to those pages.</p>`,
  sources: [],
  solutions: sol(
    ['Ask about “Delhi” or “AQI” for focused answers'],
    ['Try the quick topic buttons when the chat is open'],
    ['Type “India pollution” for a national overview'],
  ),
};

function pathLabel(path: string): string {
  if (path === '/') return 'the home page';
  const s = path.replace(/^\//, '');
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

function navigationPayload(path: string): ChatPayload {
  const label = pathLabel(path);
  return {
    details: `<p><strong>Opening ${label}…</strong></p>`,
    sources: [],
    solutions: sol(
      ['Use the main menu if you need another section'],
      ['Ask the chat again from any page'],
      ['Bookmark EcoVision for air-quality learning'],
    ),
    navigate: path,
  };
}

/** Ordered: first matching topic wins (put specific before broad). */
const TOPICS: Topic[] = [
  {
    anyOf: ['delhi', 'ncr', 'gurgaon', 'gurugram', 'noida', 'faridabad'],
    payload: {
      details: `<h4>Air quality in Delhi &amp; NCR</h4>
<p>Delhi often records among the highest urban PM2.5 levels in India, especially in winter when temperature inversions trap smoke and dust.</p>
<ul>
<li><strong>Winter smog:</strong> Mix of crop-residue smoke from nearby states, local biomass burning, dust, and vehicle exhaust.</li>
<li><strong>Year-round:</strong> Heavy traffic, construction dust, and industrial plumes add to baseline pollution.</li>
</ul>
<p>EcoVision uses representative ranges for dashboards; for live AQI check official CPCB or SAFAR feeds.</p>`,
      sources: [
        { name: 'Vehicles &amp; congestion', percentage: 28 },
        { name: 'Dust &amp; construction', percentage: 22 },
        { name: 'Biomass &amp; crop burning (seasonal)', percentage: 25 },
        { name: 'Industries &amp; power', percentage: 15 },
        { name: 'Other / weather mixing', percentage: 10 },
      ],
      solutions: sol(
        [
          'Odd-even or low-emission zones during peak smog weeks',
          'Stricter BS-VI enforcement and public EV fleets',
          'Dust control norms on construction sites',
        ],
        [
          'Carpooling and metro use during high AQI days',
          'Community monitoring with low-cost sensors',
          'Avoid open waste burning in neighbourhoods',
        ],
        [
          'Wear N95 masks outdoors on severe days',
          'Keep windows closed during morning smog peaks',
          'Use air purifiers indoors if vulnerable groups are present',
        ]
      ),
    },
  },
  {
    anyOf: ['aqi', 'air quality index', 'national air quality'],
    payload: {
      details: `<h4>Air Quality Index (AQI) in India</h4>
<p>India’s National AQI (CPCB) runs from <strong>0–500+</strong> with colour bands: Good → Satisfactory → Moderate → Poor → Very Poor → Severe.</p>
<ul>
<li><strong>PM2.5</strong> and <strong>PM10</strong> are primary pollutants in many cities.</li>
<li>AQI is the worst sub-index among monitored pollutants at that station.</li>
</ul>`,
      sources: [
        { name: 'PM2.5 (fine particles)', percentage: 35 },
        { name: 'PM10 (coarse dust)', percentage: 28 },
        { name: 'NO₂ from traffic', percentage: 18 },
        { name: 'O₃ (summer photochemical)', percentage: 12 },
        { name: 'Other (SO₂, CO, etc.)', percentage: 7 },
      ],
      solutions: sol(
        [
          'Expand continuous monitoring and public AQI dashboards',
          'Align industrial stacks with emission standards',
          'City mobility plans prioritising buses and walking',
        ],
        [
          'Citizen science: report illegal dumping or burning',
          'School awareness on clean-fuel stoves',
        ],
        [
          'Check AQI before outdoor exercise',
          'Delay walks when AQI is Very Poor or worse',
        ]
      ),
    },
  },
  {
    anyOf: ['pm2', 'pm 2.5', 'fine particulate'],
    payload: {
      details: `<h4>PM2.5 in India</h4>
<p><strong>PM2.5</strong> particles are smaller than 2.5 microns — they penetrate deep into lungs and bloodstream. Indian metros often exceed WHO interim targets seasonally.</p>
<ul>
<li>Major sources: vehicles, coal/industry, biomass burning, dust.</li>
<li>Winter nights/stagnation raise concentrations in the Indo-Gangetic Plain.</li>
</ul>`,
      sources: [
        { name: 'Combustion (vehicles, power, biomass)', percentage: 40 },
        { name: 'Dust &amp; resuspended soil', percentage: 22 },
        { name: 'Industry', percentage: 18 },
        { name: 'Secondary particles (chemistry in air)', percentage: 12 },
        { name: 'Long-range transport', percentage: 8 },
      ],
      solutions: sol(
        [
          'Accelerate industrial scrubbers and fuel switching',
          'Expand public transport electrification',
        ],
        [
          'Reduce household coal/wood where alternatives exist',
          'Community drives against garbage burning',
        ],
        [
          'Prefer indoor workouts on high PM2.5 days',
          'Use HEPA filtration indoors for sensitive groups',
        ]
      ),
    },
  },
  {
    anyOf: ['pm10', 'dust'],
    payload: {
      details: `<h4>PM10 (dust &amp; coarse particles)</h4>
<p>PM10 comes from road dust, construction, crushing, and wind-blown soil. It spikes in dry seasons and near unpaved roads or building sites.</p>`,
      sources: [
        { name: 'Road &amp; construction dust', percentage: 45 },
        { name: 'Industrial processes', percentage: 25 },
        { name: 'Natural dust storms', percentage: 18 },
        { name: 'Other', percentage: 12 },
      ],
      solutions: sol(
        [
          'Mandatory water spraying on demolition and earthworks',
          'Paved haul roads for trucks',
        ],
        [
          'Neighbourhood reporting of open sand piles',
          'Tree buffers near dusty corridors',
        ],
        [
          'Close windows during dust storms',
          'Wet-mop floors instead of sweeping when air is dusty',
        ]
      ),
    },
  },
  {
    anyOf: ['stubble', 'crop burning', 'parali'],
    payload: {
      details: `<h4>Crop residue burning (North India)</h4>
<p>Short harvest-to-sowing windows and mechanised harvesting leave stubble; burning is a fast but polluting disposal route. Plumes contribute to regional haze reaching Delhi-NCR.</p>
<ul>
<li>Mitigation: Happy Seeders, baling, bio-enzymes, and purchase policies for straw.</li>
</ul>`,
      sources: [
        { name: 'Agricultural residue burning', percentage: 38 },
        { name: 'Meteorology (wind direction to cities)', percentage: 22 },
        { name: 'Other regional combustion', percentage: 40 },
      ],
      solutions: sol(
        [
          'Subsidise in-situ straw incorporation machinery',
          'Market linkages for straw as fuel or packaging',
        ],
        [
          'Farmer cooperatives for collective baling',
        ],
        [
          'Support local NGOs explaining alternatives to burning',
        ]
      ),
    },
  },
  {
    anyOf: ['vehicle', 'traffic', 'vehicular'],
    payload: {
      details: `<h4>Vehicle emissions in India</h4>
<p>Fleet growth and stop-go traffic raise NOx, PM, and CO in corridors. BS-VI fuel and norms reduced sulphur and particle emissions from new vehicles.</p>`,
      sources: [
        { name: 'Diesel &amp; petrol exhaust', percentage: 42 },
        { name: 'Resuspended road dust behind vehicles', percentage: 22 },
        { name: 'Two-wheelers (in many cities)', percentage: 20 },
        { name: 'Older trucks &amp; gensets', percentage: 16 },
      ],
      solutions: sol(
        [
          'Freight corridors and night truck rules to cut congestion',
          'Electric buses and last-mile EV subsidies',
        ],
        [
          'Employer shuttle programs',
          'Cycle lanes safe from heavy traffic',
        ],
        [
          'Combine trips; keep engines tuned',
          'Walk or metro for short hops',
        ]
      ),
    },
  },
  {
    anyOf: ['industrial', 'factory', 'stack'],
    payload: {
      details: `<h4>Industrial pollution in India</h4>
<p>Large plants are often monitored for stack emissions; SMEs and informal units can be harder to regulate. Chemical, metal, and brick sectors remain hotspots in several states.</p>`,
      sources: [
        { name: 'Point-source stacks', percentage: 35 },
        { name: 'Fugitive leaks &amp; storage', percentage: 25 },
        { name: 'Wastewater &amp; cooling releases', percentage: 22 },
        { name: 'Other', percentage: 18 },
      ],
      solutions: sol(
        [
          'Continuous emissions monitoring with public reporting',
          'Zoning: buffer industries away from dense housing',
        ],
        [
          'Local complaint lines with follow-up transparency',
        ],
        [
          'Buy from brands publishing supplier audits',
        ]
      ),
    },
  },
  {
    anyOf: ['ganga', 'yamuna', 'river', 'water pollution'],
    payload: {
      details: `<h4>Water pollution in India</h4>
<p>Rivers receive municipal sewage, industrial effluent, and solid waste. Ammonia and organic load remain challenges for stretches of the Ganga and Yamuna near urban centres.</p>
<ul>
<li>National Mission for Clean Ganga (Namami Gange) focuses on sewage treatment capacity and industrial compliance.</li>
</ul>`,
      sources: [
        { name: 'Untreated or partial sewage', percentage: 45 },
        { name: 'Industrial effluent', percentage: 28 },
        { name: 'Solid waste &amp; leachate', percentage: 18 },
        { name: 'Agricultural runoff', percentage: 9 },
      ],
      solutions: sol(
        [
          'Expand STP capacity and sewer connections',
          'Zero-liquid-discharge clusters for sensitive industries',
        ],
        [
          'Riverfront clean-up drives; ban idol immersion without sinks',
        ],
        [
          'Never pour paint/oil into drains',
          'Reduce single-use plastic near water bodies',
        ]
      ),
    },
  },
  {
    anyOf: ['cpcb', 'safar'],
    payload: {
      details: `<h4>Monitoring agencies</h4>
<p><strong>CPCB</strong> (Central Pollution Control Board) coordinates National AQI with state boards. <strong>SAFAR</strong> (IITM–MoES) provides metro forecasts including composition hints during campaigns.</p>
<p>Use official indices for health decisions; EcoVision summaries are educational, not real-time alerts.</p>`,
      sources: [
        { name: 'Regulatory monitoring network', percentage: 50 },
        { name: 'Research supersites', percentage: 25 },
        { name: 'Satellite &amp; model fusion', percentage: 25 },
      ],
      solutions: sol(
        [
          'Open data APIs for researchers and apps',
          'Calibration audits of sensors',
        ],
        [
          'Schools teaching how to read AQI',
        ],
        [
          'Bookmark CPCB/SAFAR pages for your city',
        ]
      ),
    },
  },
  {
    anyOf: ['health', 'respiratory', 'asthma'],
    payload: {
      details: `<h4>Health &amp; air pollution (India)</h4>
<p>Long-term exposure to PM2.5 raises risks for heart and lung disease; acute spikes worsen asthma and COPD. Children and the elderly are more vulnerable.</p>
<ul>
<li>On Severe AQI days, reduce strenuous outdoor activity.</li>
</ul>`,
      sources: [
        { name: 'Chronic exposure (years)', percentage: 40 },
        { name: 'Short spikes (hours–days)', percentage: 30 },
        { name: 'Indoor sources (stoves, incense)', percentage: 20 },
        { name: 'Individual susceptibility', percentage: 10 },
      ],
      solutions: sol(
        [
          'Health advisories tied to forecasted AQI bands',
          'Green buffers near schools and hospitals',
        ],
        [
          'Support groups for patients during smog season',
        ],
        [
          'Keep rescue inhalers accessible; follow doctor advice on bad-air days',
        ]
      ),
    },
  },
  {
    anyOf: ['smog', 'winter'],
    payload: {
      details: `<h4>Winter smog in North India</h4>
<p>Cool, calm nights reduce mixing height; emissions pool near the surface. Combined with crop-burning plumes and local combustion, cities see multi-day haze episodes.</p>`,
      sources: [
        { name: 'Meteorology (inversion, low wind)', percentage: 30 },
        { name: 'Regional smoke transport', percentage: 30 },
        { name: 'Local combustion &amp; dust', percentage: 28 },
        { name: 'Fog amplifying perceived pollution', percentage: 12 },
      ],
      solutions: sol(
        [
          'Graded Response Action Plans (GRAP) — stage-wise curbs',
          'Temporary construction bans at peak smog',
        ],
        [
          'Community wood-for-LPG swaps in hotspots',
        ],
        [
          'Plan travel outside morning smog peaks',
        ]
      ),
    },
  },
  {
    anyOf: ['india', 'indian', 'bharat'],
    payload: {
      details: `<h4>Pollution overview — India</h4>
<p>India faces mixed challenges: <strong>urban air</strong> (vehicles, dust, industry), <strong>seasonal crop burning</strong> in the northwest, and <strong>water stress</strong> with untreated sewage in many rivers.</p>
<ul>
<li>National Clean Air Programme (NCAP) targets city-specific reductions.</li>
<li>AQI helps compare cities — but always verify with current CPCB readings.</li>
</ul>`,
      sources: [
        { name: 'Transport', percentage: 28 },
        { name: 'Industries &amp; power', percentage: 24 },
        { name: 'Dust &amp; construction', percentage: 20 },
        { name: 'Residential biomass (rural)', percentage: 15 },
        { name: 'Waste burning &amp; misc.', percentage: 13 },
      ],
      solutions: sol(
        [
          'NCAP action plans with funded municipal measures',
          'Coal plant emission norms compliance',
        ],
        [
          'Urban tree cover and walking infrastructure',
          'Citizen air-quality clubs',
        ],
        [
          'Choose public transport when possible',
          'Conserve energy to reduce power-plant load',
        ]
      ),
    },
  },
  {
    anyOf: ['pollution', 'air quality', 'air'],
    payload: {
      details: `<h4>Air pollution (India context)</h4>
<p>Major concerns include PM2.5, PM10, NO₂, and ozone. Levels vary by city, season, and weather — northern plains often see the highest winter PM2.5.</p>
<p>Ask about <strong>Delhi</strong>, <strong>AQI</strong>, <strong>PM2.5</strong>, <strong>vehicles</strong>, <strong>stubble burning</strong>, or <strong>water pollution</strong> for more detail.</p>`,
      sources: [
        { name: 'Combustion sources', percentage: 38 },
        { name: 'Dust', percentage: 22 },
        { name: 'Industry', percentage: 22 },
        { name: 'Natural / secondary', percentage: 18 },
      ],
      solutions: sol(
        [
          'Integrated city transport and land-use planning',
          'Industrial inspection databases',
        ],
        [
          'Citizen reporting apps',
        ],
        [
          'Stay informed via official AQI',
        ]
      ),
    },
  },
];

const DEFAULT_REPLY: ChatPayload = {
  details: `<h4>India pollution — static assistant</h4>
<p>Say <strong>hi</strong> or <strong>hello</strong> for a welcome, or type <strong>home</strong> / <strong>dashboard</strong> / <strong>search</strong> to open a page.</p>
<p>I can answer <strong>fixed topics</strong> about air and pollution in India: AQI, PM2.5/PM10, Delhi, vehicles, stubble burning, winter smog, rivers, health, CPCB/SAFAR, and more.</p>
<p><strong>Try asking:</strong></p>
<ul>
<li>“What is AQI in India?”</li>
<li>“Delhi air quality”</li>
<li>“PM2.5 sources in India”</li>
<li>“Crop burning and pollution”</li>
<li>“Water pollution Ganga”</li>
</ul>`,
  sources: [
    { name: 'Topic not matched — use keywords above', percentage: 100 },
  ],
  solutions: sol(
    [
      'See EcoVision dashboard and methodology pages for project-specific data',
      'Review NCAP city action plans on official portals',
      'Cross-check live AQI on CPCB before health decisions',
    ],
    [
      'Share this bot with classmates learning about NCAP',
      'Try keyword searches: Delhi, PM2.5, stubble, Ganga',
      'Join local citizen science or clean-air groups',
    ],
    [
      'Rephrase with “India”, “pollution”, or a city name',
      'Include “AQI” or “PM2.5” for air-quality topics',
      'Try “water pollution” or “crop burning” for other themes',
    ]
  ),
};

export function matchIndiaPollutionReply(query: string): ChatPayload {
  const n = normalize(query);
  if (!n) return DEFAULT_REPLY;

  const path = matchNavigationPath(query);
  if (path) {
    return navigationPayload(path);
  }

  if (isGreeting(query)) return GREETING_PAYLOAD;

  for (const topic of TOPICS) {
    if (matchesTopic(query, topic)) return topic.payload;
  }

  return DEFAULT_REPLY;
}
