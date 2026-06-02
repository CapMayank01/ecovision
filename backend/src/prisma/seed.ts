import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (order matters for FK constraints)
  await prisma.landPricePrediction.deleteMany();
  await prisma.landMarketData.deleteMany();
  await prisma.environmentalCause.deleteMany();
  await prisma.regionSolution.deleteMany();
  await prisma.predictionData.deleteMany();
  await prisma.historicalData.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.region.deleteMany();

  // ─── Original Regions ───
  const regions = await Promise.all([
    prisma.region.create({
      data: { name: 'Amazon Basin', type: 'forest', latitude: -3.4653, longitude: -62.2159, areaSqkm: 5500000, description: 'Largest rainforest in the world' },
    }),
    prisma.region.create({
      data: { name: 'Congo Basin', type: 'forest', latitude: 0.2636, longitude: 15.2832, areaSqkm: 2200000, description: 'Second largest rainforest in the world' },
    }),
    prisma.region.create({
      data: { name: 'Borneo', type: 'forest', latitude: 0.9619, longitude: 114.5548, areaSqkm: 750000, description: 'Third largest island in the world with significant rainforest' },
    }),
    prisma.region.create({
      data: { name: 'Himalayas', type: 'glacier', latitude: 28.5983, longitude: 83.9311, areaSqkm: 30000, description: 'Mountain range with the highest peaks in the world' },
    }),
    prisma.region.create({
      data: { name: 'Alps', type: 'glacier', latitude: 46.4983, longitude: 9.8382, areaSqkm: 3000, description: 'Mountain range in Europe with significant glaciers' },
    }),
    prisma.region.create({
      data: { name: 'Andes', type: 'glacier', latitude: -32.6536, longitude: -70.0114, areaSqkm: 25000, description: 'Longest continental mountain range in the world' },
    }),
  ]);

  const [amazon, , , himalayas] = regions;

  // ─── Meerut-Area Urban Regions ───
  const urbanRegions = await Promise.all([
    prisma.region.create({
      data: { name: 'Meerut', type: 'urban', latitude: 28.9845, longitude: 77.7064, areaSqkm: 142, description: 'Historic city in western UP known for sports goods and sugar industry' },
    }),
    prisma.region.create({
      data: { name: 'Delhi NCR', type: 'urban', latitude: 28.6139, longitude: 77.2090, areaSqkm: 1484, description: 'National Capital Region — India\'s largest urban agglomeration' },
    }),
    prisma.region.create({
      data: { name: 'Ghaziabad', type: 'urban', latitude: 28.6692, longitude: 77.4538, areaSqkm: 210, description: 'Industrial satellite city east of Delhi, rapid urbanization hub' },
    }),
    prisma.region.create({
      data: { name: 'Noida', type: 'urban', latitude: 28.5355, longitude: 77.3910, areaSqkm: 203, description: 'Planned industrial city, IT/ITES hub in Gautam Buddh Nagar' },
    }),
    prisma.region.create({
      data: { name: 'Muzaffarnagar', type: 'urban', latitude: 29.4727, longitude: 77.7085, areaSqkm: 128, description: 'Sugar bowl of India with paper mills and agro-processing industry' },
    }),
    prisma.region.create({
      data: { name: 'Haridwar', type: 'urban', latitude: 29.9457, longitude: 78.1642, areaSqkm: 2360, description: 'Holy city on the Ganga with SIDCUL industrial estate and pilgrimage tourism' },
    }),
    // ─── New Meerut District Cities ───
    prisma.region.create({
      data: { name: 'Modinagar', type: 'urban', latitude: 28.8330, longitude: 77.5770, areaSqkm: 18, description: 'Industrial town on Delhi–Meerut corridor, home to Modi Industries group; rapid expressway-driven growth' },
    }),
    prisma.region.create({
      data: { name: 'Sardhana', type: 'urban', latitude: 29.0450, longitude: 77.6150, areaSqkm: 12, description: 'Historic town with Basilica of Our Lady of Graces; emerging affordable residential suburb of Meerut' },
    }),
    prisma.region.create({
      data: { name: 'Hastinapur', type: 'urban', latitude: 29.1604, longitude: 78.0200, areaSqkm: 2073, description: 'Ancient Mahabharata capital with Wildlife Sanctuary and Jain pilgrimage; eco-tourism hub on Ganga floodplain' },
    }),
    prisma.region.create({
      data: { name: 'Kithor', type: 'urban', latitude: 28.9500, longitude: 77.6300, areaSqkm: 8, description: 'Peri-urban area experiencing rapid residential sprawl from Meerut; agricultural land being converted' },
    }),
    prisma.region.create({
      data: { name: 'Daurala', type: 'urban', latitude: 29.1000, longitude: 77.6800, areaSqkm: 10, description: 'Industrial town with sugar mills, chemical plants, and paper units; significant pollution but strong employment' },
    }),
    prisma.region.create({
      data: { name: 'Mawana', type: 'urban', latitude: 29.1000, longitude: 77.9200, areaSqkm: 15, description: 'Historic agro-industrial town famous for Mawana Sugar Works; transitioning from rural to semi-urban' },
    }),
    prisma.region.create({
      data: { name: 'Parikshitgarh', type: 'urban', latitude: 29.1800, longitude: 77.9500, areaSqkm: 9, description: 'Small town on the road to Hastinapur; gateway for pilgrimage tourism with rural land under development pressure' },
    }),
    prisma.region.create({
      data: { name: 'Modipuram', type: 'urban', latitude: 29.0400, longitude: 77.7000, areaSqkm: 6, description: 'Institutional hub with ICAR-IARI campus and Sardar Vallabhbhai Patel University; planned, clean residential zone' },
    }),
  ]);

  const [meerut, delhi, ghaziabad, noida, muzaffarnagar, haridwar, modinagar, sardhana, hastinapur, kithor, daurala, mawana, parikshitgarh, modipuram] = urbanRegions;

  // ─── Original Historical Data ───
  await prisma.historicalData.createMany({
    data: [
      { regionId: amazon.regionId, year: 2000, forestCoverSqkm: 5500000, temperatureCelsius: 25.8, precipitationMm: 2400 },
      { regionId: amazon.regionId, year: 2005, forestCoverSqkm: 5300000, temperatureCelsius: 26.1, precipitationMm: 2350 },
      { regionId: amazon.regionId, year: 2010, forestCoverSqkm: 5100000, temperatureCelsius: 26.5, precipitationMm: 2300 },
      { regionId: amazon.regionId, year: 2015, forestCoverSqkm: 4900000, temperatureCelsius: 26.9, precipitationMm: 2250 },
      { regionId: amazon.regionId, year: 2020, forestCoverSqkm: 4700000, temperatureCelsius: 27.2, precipitationMm: 2200 },
    ],
  });

  // ─── Meerut-Area Historical Environmental Data (2010–2024) ───
  const meerutHistorical = [
    { r: meerut, data: [
      { year: 2010, temperatureCelsius: 25.1, precipitationMm: 870 },
      { year: 2012, temperatureCelsius: 25.4, precipitationMm: 860 },
      { year: 2014, temperatureCelsius: 25.7, precipitationMm: 840 },
      { year: 2016, temperatureCelsius: 26.0, precipitationMm: 830 },
      { year: 2018, temperatureCelsius: 26.3, precipitationMm: 810 },
      { year: 2020, temperatureCelsius: 26.6, precipitationMm: 800 },
      { year: 2022, temperatureCelsius: 26.9, precipitationMm: 790 },
      { year: 2024, temperatureCelsius: 27.1, precipitationMm: 780 },
    ]},
    { r: delhi, data: [
      { year: 2010, temperatureCelsius: 25.8, precipitationMm: 790 },
      { year: 2012, temperatureCelsius: 26.1, precipitationMm: 780 },
      { year: 2014, temperatureCelsius: 26.5, precipitationMm: 760 },
      { year: 2016, temperatureCelsius: 26.8, precipitationMm: 750 },
      { year: 2018, temperatureCelsius: 27.2, precipitationMm: 730 },
      { year: 2020, temperatureCelsius: 27.5, precipitationMm: 720 },
      { year: 2022, temperatureCelsius: 27.8, precipitationMm: 710 },
      { year: 2024, temperatureCelsius: 28.1, precipitationMm: 700 },
    ]},
    { r: ghaziabad, data: [
      { year: 2010, temperatureCelsius: 25.6, precipitationMm: 800 },
      { year: 2012, temperatureCelsius: 25.9, precipitationMm: 790 },
      { year: 2014, temperatureCelsius: 26.2, precipitationMm: 770 },
      { year: 2016, temperatureCelsius: 26.5, precipitationMm: 755 },
      { year: 2018, temperatureCelsius: 26.9, precipitationMm: 740 },
      { year: 2020, temperatureCelsius: 27.2, precipitationMm: 725 },
      { year: 2022, temperatureCelsius: 27.5, precipitationMm: 715 },
      { year: 2024, temperatureCelsius: 27.8, precipitationMm: 705 },
    ]},
    { r: noida, data: [
      { year: 2010, temperatureCelsius: 25.7, precipitationMm: 810 },
      { year: 2012, temperatureCelsius: 26.0, precipitationMm: 795 },
      { year: 2014, temperatureCelsius: 26.3, precipitationMm: 775 },
      { year: 2016, temperatureCelsius: 26.6, precipitationMm: 760 },
      { year: 2018, temperatureCelsius: 27.0, precipitationMm: 745 },
      { year: 2020, temperatureCelsius: 27.3, precipitationMm: 730 },
      { year: 2022, temperatureCelsius: 27.6, precipitationMm: 720 },
      { year: 2024, temperatureCelsius: 27.9, precipitationMm: 710 },
    ]},
    { r: muzaffarnagar, data: [
      { year: 2010, temperatureCelsius: 24.8, precipitationMm: 900 },
      { year: 2012, temperatureCelsius: 25.0, precipitationMm: 890 },
      { year: 2014, temperatureCelsius: 25.3, precipitationMm: 875 },
      { year: 2016, temperatureCelsius: 25.5, precipitationMm: 860 },
      { year: 2018, temperatureCelsius: 25.8, precipitationMm: 845 },
      { year: 2020, temperatureCelsius: 26.1, precipitationMm: 830 },
      { year: 2022, temperatureCelsius: 26.4, precipitationMm: 820 },
      { year: 2024, temperatureCelsius: 26.6, precipitationMm: 810 },
    ]},
    { r: haridwar, data: [
      { year: 2010, temperatureCelsius: 23.5, precipitationMm: 1200 },
      { year: 2012, temperatureCelsius: 23.7, precipitationMm: 1190 },
      { year: 2014, temperatureCelsius: 24.0, precipitationMm: 1170 },
      { year: 2016, temperatureCelsius: 24.2, precipitationMm: 1155 },
      { year: 2018, temperatureCelsius: 24.5, precipitationMm: 1140 },
      { year: 2020, temperatureCelsius: 24.8, precipitationMm: 1125 },
      { year: 2022, temperatureCelsius: 25.0, precipitationMm: 1110 },
      { year: 2024, temperatureCelsius: 25.3, precipitationMm: 1100 },
    ]},
    // ─── New Meerut District Cities ───
    { r: modinagar, data: [
      { year: 2010, temperatureCelsius: 25.3, precipitationMm: 850 },
      { year: 2014, temperatureCelsius: 25.9, precipitationMm: 820 },
      { year: 2018, temperatureCelsius: 26.5, precipitationMm: 790 },
      { year: 2024, temperatureCelsius: 27.3, precipitationMm: 760 },
    ]},
    { r: sardhana, data: [
      { year: 2010, temperatureCelsius: 25.0, precipitationMm: 880 },
      { year: 2014, temperatureCelsius: 25.5, precipitationMm: 855 },
      { year: 2018, temperatureCelsius: 26.1, precipitationMm: 830 },
      { year: 2024, temperatureCelsius: 26.8, precipitationMm: 800 },
    ]},
    { r: hastinapur, data: [
      { year: 2010, temperatureCelsius: 24.6, precipitationMm: 950 },
      { year: 2014, temperatureCelsius: 25.0, precipitationMm: 930 },
      { year: 2018, temperatureCelsius: 25.5, precipitationMm: 910 },
      { year: 2024, temperatureCelsius: 26.1, precipitationMm: 885 },
    ]},
    { r: kithor, data: [
      { year: 2010, temperatureCelsius: 25.1, precipitationMm: 870 },
      { year: 2014, temperatureCelsius: 25.6, precipitationMm: 845 },
      { year: 2018, temperatureCelsius: 26.2, precipitationMm: 815 },
      { year: 2024, temperatureCelsius: 26.9, precipitationMm: 785 },
    ]},
    { r: daurala, data: [
      { year: 2010, temperatureCelsius: 25.2, precipitationMm: 860 },
      { year: 2014, temperatureCelsius: 25.8, precipitationMm: 835 },
      { year: 2018, temperatureCelsius: 26.4, precipitationMm: 805 },
      { year: 2024, temperatureCelsius: 27.1, precipitationMm: 775 },
    ]},
    { r: mawana, data: [
      { year: 2010, temperatureCelsius: 24.9, precipitationMm: 890 },
      { year: 2014, temperatureCelsius: 25.3, precipitationMm: 865 },
      { year: 2018, temperatureCelsius: 25.8, precipitationMm: 840 },
      { year: 2024, temperatureCelsius: 26.5, precipitationMm: 810 },
    ]},
    { r: parikshitgarh, data: [
      { year: 2010, temperatureCelsius: 24.7, precipitationMm: 940 },
      { year: 2014, temperatureCelsius: 25.1, precipitationMm: 920 },
      { year: 2018, temperatureCelsius: 25.6, precipitationMm: 900 },
      { year: 2024, temperatureCelsius: 26.2, precipitationMm: 875 },
    ]},
    { r: modipuram, data: [
      { year: 2010, temperatureCelsius: 25.0, precipitationMm: 875 },
      { year: 2014, temperatureCelsius: 25.5, precipitationMm: 850 },
      { year: 2018, temperatureCelsius: 26.0, precipitationMm: 825 },
      { year: 2024, temperatureCelsius: 26.7, precipitationMm: 795 },
    ]},
  ];

  for (const { r, data } of meerutHistorical) {
    await prisma.historicalData.createMany({
      data: data.map((d) => ({ regionId: r.regionId, ...d })),
    });
  }

  // ─── Original Prediction Data ───
  await prisma.predictionData.createMany({
    data: [
      { regionId: amazon.regionId, year: 2025, forestCoverSqkm: 4500000, temperatureCelsius: 27.5, precipitationMm: 2150, confidenceLevel: 0.95, calculationMethod: 'linear_extrapolation' },
      { regionId: amazon.regionId, year: 2030, forestCoverSqkm: 4300000, temperatureCelsius: 27.8, precipitationMm: 2100, confidenceLevel: 0.90, calculationMethod: 'linear_extrapolation' },
      { regionId: amazon.regionId, year: 2035, forestCoverSqkm: 4100000, temperatureCelsius: 28.1, precipitationMm: 2050, confidenceLevel: 0.85, calculationMethod: 'linear_extrapolation' },
      { regionId: amazon.regionId, year: 2040, forestCoverSqkm: 3900000, temperatureCelsius: 28.4, precipitationMm: 2000, confidenceLevel: 0.80, calculationMethod: 'linear_extrapolation' },
      { regionId: amazon.regionId, year: 2045, forestCoverSqkm: 3700000, temperatureCelsius: 28.7, precipitationMm: 1950, confidenceLevel: 0.75, calculationMethod: 'linear_extrapolation' },
      { regionId: amazon.regionId, year: 2050, forestCoverSqkm: 3500000, temperatureCelsius: 29.0, precipitationMm: 1900, confidenceLevel: 0.70, calculationMethod: 'linear_extrapolation' },
    ],
  });

  // ─── Original Solutions ───
  const solutions = await Promise.all([
    prisma.solution.create({
      data: { name: 'Amazon Reforestation Initiative', type: 'afforestation', description: 'Comprehensive reforestation program for the Amazon Basin', implementationSteps: 'Step 1: Identify priority areas\nStep 2: Engage local communities\nStep 3: Plant native species\nStep 4: Monitor progress', expectedImpact: 'Recovery of up to 15% of lost forest cover by 2050' },
    }),
    prisma.solution.create({
      data: { name: 'Sustainable Urban Development Plan', type: 'urban_planning', description: 'Green infrastructure integration in expanding urban areas', implementationSteps: 'Step 1: Develop green belts\nStep 2: Implement permeable surfaces\nStep 3: Increase urban tree canopy\nStep 4: Create wildlife corridors', expectedImpact: 'Reduce urban heat island effect by 2-3°C and decrease stormwater runoff by up to 40%' },
    }),
    prisma.solution.create({
      data: { name: 'Himalayan Glacier Protection Program', type: 'glacier_protection', description: 'Conservation approaches for critical Himalayan glaciers', implementationSteps: 'Step 1: Identify critical glaciers\nStep 2: Implement pilot projects\nStep 3: Develop early warning systems\nStep 4: Create water storage alternatives', expectedImpact: 'Slow glacier retreat by 10-15% in targeted areas and reduce flood risks' },
    }),
  ]);

  await prisma.regionSolution.createMany({
    data: [
      { regionId: amazon.regionId, solutionId: solutions[0].solutionId, priorityLevel: 'critical', estimatedCostUsd: 5000000000, estimatedImpactPercentage: 15.00 },
      { regionId: himalayas.regionId, solutionId: solutions[2].solutionId, priorityLevel: 'high', estimatedCostUsd: 2000000000, estimatedImpactPercentage: 12.50 },
    ],
  });

  // ─── Original Data Sources ───
  await prisma.dataSource.createMany({
    data: [
      { name: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov/', description: 'Satellite imagery and climate data from NASA', dataType: 'satellite' },
      { name: 'IPCC Data Distribution Centre', url: 'https://www.ipcc-data.org/', description: 'Climate data and projections from the IPCC', dataType: 'climate' },
      { name: 'USGS Earth Explorer', url: 'https://earthexplorer.usgs.gov/', description: 'Geological and land cover data from USGS', dataType: 'geological' },
      { name: 'Global Forest Watch', url: 'https://www.globalforestwatch.org/', description: 'Forest monitoring and alerts', dataType: 'satellite' },
    ],
  });

  // ─── Original Environmental Causes ───
  const originalCauses = [
    { regionId: himalayas.regionId, factorType: 'local', title: 'Vehicular Traffic & Congestion', description: 'Rapid increase in private vehicles and diesel trucks in northern India contributes heavy PM2.5 and NOx emissions, especially in the Indo-Gangetic Plain corridor.', impactScore: 75 },
    { regionId: himalayas.regionId, factorType: 'local', title: 'Industrial Emissions', description: 'Brick kilns, thermal power plants, and small-scale manufacturing units in Uttar Pradesh, Bihar, and Punjab release sulfur dioxide and particulate matter year-round.', impactScore: 68 },
    { regionId: himalayas.regionId, factorType: 'local', title: 'Rapid Urbanization', description: 'Construction dust, land-use change, and removal of green cover in expanding cities like Delhi NCR, Lucknow, and Patna degrade local air quality and reduce carbon sinks.', impactScore: 52 },
    { regionId: amazon.regionId, factorType: 'local', title: 'Illegal Logging Operations', description: 'Unregulated timber extraction accelerates deforestation and fragments critical habitat corridors across the Amazon basin.', impactScore: 80 },
    { regionId: amazon.regionId, factorType: 'local', title: 'Cattle Ranching Expansion', description: 'Conversion of forest to pastureland for beef production is the single largest driver of Amazon deforestation.', impactScore: 85 },
    { regionId: himalayas.regionId, factorType: 'seasonal', title: 'Stubble Burning (Oct–Nov)', description: 'Post-harvest rice stubble burning in Punjab and Haryana generates massive smoke plumes that drift across northern India, spiking AQI above 400+ in Delhi every winter.', impactScore: 88 },
    { regionId: himalayas.regionId, factorType: 'seasonal', title: 'Monsoon & Post-Monsoon Patterns', description: 'Pre-monsoon dust storms carry Rajasthan desert particulates eastward, while post-monsoon temperature inversions trap pollutants near the surface for weeks.', impactScore: 45 },
    { regionId: amazon.regionId, factorType: 'seasonal', title: 'Dry Season Fires (Jul–Oct)', description: 'Agricultural fires set during the dry season frequently escape into surrounding forests, burning thousands of hectares annually.', impactScore: 72 },
    { regionId: himalayas.regionId, factorType: 'global', title: 'Rising Global CO₂ Emissions', description: 'Global greenhouse gas concentrations surpassing 420 ppm accelerate Himalayan glacier retreat and alter monsoon precipitation patterns affecting 1.5 billion people.', impactScore: 62 },
    { regionId: himalayas.regionId, factorType: 'global', title: 'Oil Price Volatility', description: 'Fluctuating crude oil prices drive India toward cheaper, dirtier coal-based energy, increasing emissions intensity during price spikes.', impactScore: 35 },
    { regionId: himalayas.regionId, factorType: 'global', title: 'Geopolitical Conflicts & Supply Chains', description: 'Wars and trade disruptions divert resources from climate programmes and push nations to prioritize energy security over clean energy transitions.', impactScore: 28 },
    { regionId: amazon.regionId, factorType: 'global', title: 'Global Commodity Demand', description: 'International demand for soy, beef, and palm oil incentivizes large-scale forest clearing for export agriculture.', impactScore: 70 },
  ];

  // ─── Meerut-Area Environmental Causes ───
  const meerutCauses = [
    // Meerut
    { regionId: meerut.regionId, factorType: 'local', title: 'Sugar Mill & Industrial Pollution', description: 'Meerut\'s sugar mills, steel rolling units, and small-scale industries release particulate matter and effluents year-round, degrading air and groundwater quality.', impactScore: 72 },
    { regionId: meerut.regionId, factorType: 'local', title: 'Hindon River Contamination', description: 'The Hindon river flowing through Meerut is heavily polluted with industrial and domestic sewage, affecting groundwater and soil health in nearby areas.', impactScore: 65 },
    { regionId: meerut.regionId, factorType: 'seasonal', title: 'Stubble Burning Drift (Oct–Nov)', description: 'Smoke from Punjab/Haryana stubble burning drifts across the entire western UP belt including Meerut, pushing winter AQI above 350.', impactScore: 80 },
    { regionId: meerut.regionId, factorType: 'global', title: 'Urban Heat Island Effect', description: 'Concrete expansion and loss of agricultural land around Meerut increases surface temperatures by 2-4°C compared to surrounding rural areas.', impactScore: 55 },
    // Delhi NCR
    { regionId: delhi.regionId, factorType: 'local', title: 'Vehicular Emissions Crisis', description: 'Over 12 million registered vehicles in Delhi NCR make transportation the largest contributor to PM2.5, accounting for 28% of total emissions.', impactScore: 90 },
    { regionId: delhi.regionId, factorType: 'local', title: 'Construction Dust', description: 'Massive ongoing construction projects across Noida, Gurugram, and Delhi generate fine dust particles that compound the existing pollution load.', impactScore: 70 },
    { regionId: delhi.regionId, factorType: 'seasonal', title: 'Winter Inversion Layer', description: 'Cold-weather temperature inversions from November to February trap pollutants close to the ground, creating hazardous smog episodes lasting weeks.', impactScore: 85 },
    { regionId: delhi.regionId, factorType: 'global', title: 'Climate-Driven Extreme Weather', description: 'Increasing frequency of heatwaves (48°C+) and erratic monsoons stress urban infrastructure and water supply systems.', impactScore: 60 },
    // Ghaziabad
    { regionId: ghaziabad.regionId, factorType: 'local', title: 'Industrial Belt Emissions', description: 'Ghaziabad\'s Sahibabad and Loni industrial areas house thousands of small factories releasing unfiltered emissions into the air.', impactScore: 75 },
    { regionId: ghaziabad.regionId, factorType: 'seasonal', title: 'Stubble Burning Impact', description: 'As the eastern gateway to Delhi NCR, Ghaziabad receives the full brunt of seasonal stubble burning smoke from western UP and Haryana.', impactScore: 82 },
    // Noida
    { regionId: noida.regionId, factorType: 'local', title: 'Rapid Wetland Loss', description: 'Drainage of floodplain wetlands along the Yamuna for real estate development has destroyed natural air and water filtration systems.', impactScore: 68 },
    { regionId: noida.regionId, factorType: 'local', title: 'IT Corridor Heat Load', description: 'Dense high-rise construction in sectors 62-142 creates urban heat canyons with limited green breaks, raising micro-climate temperatures.', impactScore: 50 },
    // Muzaffarnagar
    { regionId: muzaffarnagar.regionId, factorType: 'local', title: 'Paper & Sugar Mill Effluents', description: 'Muzaffarnagar is known as the sugar bowl of India; its paper and sugar mills discharge untreated effluents into local water bodies, contaminating the Kali and Hindon rivers.', impactScore: 78 },
    { regionId: muzaffarnagar.regionId, factorType: 'seasonal', title: 'Sugarcane Burning Season', description: 'Pre- and post-harvest sugarcane leaf burning adds to the regional smoke load from October through March.', impactScore: 70 },
    // Haridwar
    { regionId: haridwar.regionId, factorType: 'local', title: 'SIDCUL Industrial Pollution', description: 'The State Infrastructure and Industrial Development Corporation (SIDCUL) estate houses 500+ industries whose emissions affect the otherwise cleaner Haridwar air basin.', impactScore: 58 },
    { regionId: haridwar.regionId, factorType: 'local', title: 'Ganga Floodplain Vulnerability', description: 'Haridwar sits at the Ganga\'s exit from the Himalayas; flash floods and changing river morphology threaten low-lying settlements and infrastructure.', impactScore: 72 },
    { regionId: haridwar.regionId, factorType: 'seasonal', title: 'Monsoon Flooding (Jul–Sep)', description: 'Heavy monsoon rainfall combined with glacial melt from upstream Gangotri causes annual flooding episodes, damaging property and infrastructure.', impactScore: 75 },
    // ─── New Meerut District Cities ───
    // Modinagar
    { regionId: modinagar.regionId, factorType: 'local', title: 'Delhi–Meerut Expressway Connectivity', description: 'The 14-lane Delhi–Meerut Expressway reduces travel time to Delhi to 45 minutes, making Modinagar viable for NCR commuters and driving rapid price appreciation.', impactScore: 85 },
    { regionId: modinagar.regionId, factorType: 'local', title: 'Modi Industries Legacy Pollution', description: 'Decades of steel, chemical, and textile manufacturing by the Modi group has left soil and groundwater contamination, depressing residential desirability in older zones.', impactScore: 72 },
    { regionId: modinagar.regionId, factorType: 'local', title: 'Groundwater Depletion', description: 'Over-extraction by industries has lowered the water table by 15m in 20 years, increasing bore-well costs and threatening long-term water security.', impactScore: 60 },
    { regionId: modinagar.regionId, factorType: 'seasonal', title: 'Winter Smog Corridor', description: 'Located on the Indo-Gangetic Plain corridor, Modinagar experiences severe winter smog (AQI 300+) from November to February due to trapped industrial and vehicular emissions.', impactScore: 68 },
    // Sardhana
    { regionId: sardhana.regionId, factorType: 'local', title: 'Heritage Tourism Potential', description: 'The Basilica of Our Lady of Graces (built 1822) and Begum Samru\'s palace attract domestic tourists, creating hospitality and retail employment opportunities.', impactScore: 55 },
    { regionId: sardhana.regionId, factorType: 'local', title: 'Affordable Meerut Suburb Status', description: 'Property prices 40-50% lower than central Meerut attract first-time homebuyers, driving steady residential demand and new colony development.', impactScore: 65 },
    { regionId: sardhana.regionId, factorType: 'local', title: 'Agricultural Land Conversion', description: 'Fertile sugarcane and wheat farmland is being rapidly converted to residential plots, reducing green cover and increasing local temperatures.', impactScore: 48 },
    // Hastinapur
    { regionId: hastinapur.regionId, factorType: 'local', title: 'Wildlife Sanctuary Premium', description: 'Proximity to Hastinapur Wildlife Sanctuary (2,073 sq km) with gharials, swamp deer, and migratory birds attracts eco-tourism investment and nature-conscious buyers.', impactScore: 70 },
    { regionId: hastinapur.regionId, factorType: 'local', title: 'Ganga Floodplain Risk', description: 'Annual monsoon flooding of the Ganga floodplain destroys crops and infrastructure; insurance premiums are 3x higher than non-flood areas, capping price growth.', impactScore: 80 },
    { regionId: hastinapur.regionId, factorType: 'local', title: 'Jain Pilgrimage Economy', description: 'As one of Jainism\'s holiest sites (Jambudweep complex), Hastinapur receives steady pilgrim footfall that sustains local hospitality and retail businesses.', impactScore: 65 },
    { regionId: hastinapur.regionId, factorType: 'local', title: 'Poor Road Connectivity', description: 'Narrow single-lane rural roads and limited public transport deter residential and commercial investment; travel to Meerut takes 90+ minutes.', impactScore: 58 },
    // Kithor
    { regionId: kithor.regionId, factorType: 'local', title: 'Meerut Spillover Demand', description: 'As Meerut city expands westward, Kithor receives spillover demand from buyers priced out of central Meerut, driving rapid colony development.', impactScore: 75 },
    { regionId: kithor.regionId, factorType: 'local', title: 'Loss of Agricultural Buffer', description: 'Conversion of surrounding farmland removes the green buffer that kept temperatures moderate, increasing urban heat island effect by 2-3°C.', impactScore: 55 },
    { regionId: kithor.regionId, factorType: 'seasonal', title: 'Monsoon Waterlogging', description: 'Poor drainage infrastructure in newly developed colonies causes severe waterlogging during July-September monsoons, damaging property and road access.', impactScore: 62 },
    // Daurala
    { regionId: daurala.regionId, factorType: 'local', title: 'Sugar & Chemical Industry Employment', description: 'Daurala Sugar Works and nearby chemical plants provide stable employment for 10,000+ workers, creating consistent housing demand despite pollution.', impactScore: 68 },
    { regionId: daurala.regionId, factorType: 'local', title: 'Industrial Effluent Contamination', description: 'Untreated discharge from sugar processing and chemical units has contaminated the Kali Nadi river and surrounding groundwater, making tap water unsafe.', impactScore: 78 },
    { regionId: daurala.regionId, factorType: 'local', title: 'Air Quality Degradation from Bagasse Burning', description: 'Burning of sugarcane bagasse at the mill releases fine particulate matter year-round, pushing AQI above 250 in surrounding residential areas.', impactScore: 65 },
    // Mawana
    { regionId: mawana.regionId, factorType: 'local', title: 'Mawana Sugar Works Legacy', description: 'One of India\'s oldest sugar mills (est. 1893) provides economic stability but associated pollution keeps residential land prices below potential.', impactScore: 60 },
    { regionId: mawana.regionId, factorType: 'local', title: 'Rural-to-Urban Transition', description: 'Gradual shift from agricultural to mixed-use land is creating new commercial markets, driving slow but steady price appreciation.', impactScore: 52 },
    { regionId: mawana.regionId, factorType: 'seasonal', title: 'Crushing Season Pollution (Nov–Apr)', description: 'During the 6-month sugar crushing season, the mill releases molasses odor, fly ash, and wastewater, temporarily depressing nearby property values.', impactScore: 70 },
    // Parikshitgarh
    { regionId: parikshitgarh.regionId, factorType: 'local', title: 'Hastinapur Gateway Location', description: 'As the primary access point to Hastinapur pilgrimage sites, Parikshitgarh benefits from through-traffic tourism and roadside commercial development.', impactScore: 50 },
    { regionId: parikshitgarh.regionId, factorType: 'local', title: 'Land Acquisition for Development', description: 'State government land acquisition for highway widening and tourism infrastructure has created speculative price increases in adjacent plots.', impactScore: 62 },
    { regionId: parikshitgarh.regionId, factorType: 'local', title: 'Limited Urban Infrastructure', description: 'Absence of piped water, sewage systems, and reliable electricity supply keeps the area in rural classification, limiting mortgage availability.', impactScore: 58 },
    // Modipuram
    { regionId: modipuram.regionId, factorType: 'local', title: 'ICAR Research Campus Effect', description: 'The Indian Council of Agricultural Research (ICAR-IARI) campus provides institutional stability, educated workforce, and well-maintained green spaces.', impactScore: 72 },
    { regionId: modipuram.regionId, factorType: 'local', title: 'Planned Development Advantage', description: 'Unlike organic urban sprawl, Modipuram\'s institutional planning ensures proper roads, drainage, and green cover, maintaining higher environmental quality.', impactScore: 65 },
    { regionId: modipuram.regionId, factorType: 'local', title: 'University Student Rental Market', description: 'SVP University and ICAR hostels create consistent rental demand, making real estate attractive for investors seeking 4-6% rental yields.', impactScore: 55 },
  ];

  await prisma.environmentalCause.createMany({ data: [...originalCauses, ...meerutCauses] });

  // ─── Land Market Historical Data (2015–2024) ───
  // Prices in ₹ per sq ft — realistic ranges for the Meerut belt
  const landMarketRows = [
    // Meerut: ₹2,500 → ₹4,200
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: meerut.regionId, year: y,
      avgPricePerSqft: 2500 + i * 190,
      aqi: 220 - i * 3, greenCoverPercent: 18 - i * 0.6, waterQualityIndex: 42 + i * 1.5,
      floodRiskScore: 35 + i * 1.2, industrialProximity: 8 - i * 0.3,
    })),
    // Delhi NCR: ₹8,000 → ₹15,000
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: delhi.regionId, year: y,
      avgPricePerSqft: 8000 + i * 780,
      aqi: 280 - i * 5, greenCoverPercent: 12 - i * 0.5, waterQualityIndex: 35 + i * 1.0,
      floodRiskScore: 45 + i * 1.5, industrialProximity: 5 - i * 0.2,
    })),
    // Ghaziabad: ₹3,200 → ₹5,800
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: ghaziabad.regionId, year: y,
      avgPricePerSqft: 3200 + i * 290,
      aqi: 260 - i * 4, greenCoverPercent: 14 - i * 0.5, waterQualityIndex: 38 + i * 1.2,
      floodRiskScore: 40 + i * 1.3, industrialProximity: 4 - i * 0.15,
    })),
    // Noida: ₹4,500 → ₹9,500
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: noida.regionId, year: y,
      avgPricePerSqft: 4500 + i * 556,
      aqi: 240 - i * 4, greenCoverPercent: 15 - i * 0.6, waterQualityIndex: 40 + i * 1.3,
      floodRiskScore: 38 + i * 1.0, industrialProximity: 6 - i * 0.25,
    })),
    // Muzaffarnagar: ₹1,800 → ₹3,000
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: muzaffarnagar.regionId, year: y,
      avgPricePerSqft: 1800 + i * 133,
      aqi: 200 - i * 2, greenCoverPercent: 22 - i * 0.7, waterQualityIndex: 45 + i * 1.0,
      floodRiskScore: 30 + i * 1.0, industrialProximity: 10 - i * 0.4,
    })),
    // Haridwar: ₹2,200 → ₹4,800
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: haridwar.regionId, year: y,
      avgPricePerSqft: 2200 + i * 289,
      aqi: 120 - i * 2, greenCoverPercent: 35 - i * 0.8, waterQualityIndex: 65 + i * 1.5,
      floodRiskScore: 55 + i * 2.0, industrialProximity: 12 - i * 0.5,
    })),
    // ─── New Meerut District Cities ───
    // Modinagar: ₹2,800 → ₹5,500
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: modinagar.regionId, year: y,
      avgPricePerSqft: 2800 + i * 300,
      aqi: 250 - i * 4, greenCoverPercent: 10 - i * 0.4, waterQualityIndex: 36 + i * 1.2,
      floodRiskScore: 25 + i * 0.8, industrialProximity: 2 + i * 0.1,
    })),
    // Sardhana: ₹1,200 → ₹2,100
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: sardhana.regionId, year: y,
      avgPricePerSqft: 1200 + i * 100,
      aqi: 180 - i * 2, greenCoverPercent: 28 - i * 0.8, waterQualityIndex: 52 + i * 1.0,
      floodRiskScore: 20 + i * 0.5, industrialProximity: 15 - i * 0.3,
    })),
    // Hastinapur: ₹800 → ₹1,400
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: hastinapur.regionId, year: y,
      avgPricePerSqft: 800 + i * 67,
      aqi: 110 - i * 1, greenCoverPercent: 45 - i * 0.5, waterQualityIndex: 60 + i * 1.5,
      floodRiskScore: 65 + i * 1.5, industrialProximity: 25 - i * 0.5,
    })),
    // Kithor: ₹1,500 → ₹2,800
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: kithor.regionId, year: y,
      avgPricePerSqft: 1500 + i * 144,
      aqi: 200 - i * 3, greenCoverPercent: 25 - i * 1.0, waterQualityIndex: 48 + i * 1.2,
      floodRiskScore: 30 + i * 1.5, industrialProximity: 12 - i * 0.4,
    })),
    // Daurala: ₹1,800 → ₹3,200
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: daurala.regionId, year: y,
      avgPricePerSqft: 1800 + i * 156,
      aqi: 240 - i * 3, greenCoverPercent: 12 - i * 0.5, waterQualityIndex: 30 + i * 1.0,
      floodRiskScore: 22 + i * 0.8, industrialProximity: 1.5 + i * 0.1,
    })),
    // Mawana: ₹1,000 → ₹1,900
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: mawana.regionId, year: y,
      avgPricePerSqft: 1000 + i * 100,
      aqi: 190 - i * 2, greenCoverPercent: 30 - i * 0.8, waterQualityIndex: 44 + i * 1.0,
      floodRiskScore: 28 + i * 1.0, industrialProximity: 3 + i * 0.2,
    })),
    // Parikshitgarh: ₹600 → ₹1,100
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: parikshitgarh.regionId, year: y,
      avgPricePerSqft: 600 + i * 56,
      aqi: 120 - i * 1, greenCoverPercent: 40 - i * 0.6, waterQualityIndex: 55 + i * 1.2,
      floodRiskScore: 50 + i * 1.5, industrialProximity: 20 - i * 0.5,
    })),
    // Modipuram: ₹2,000 → ₹3,600
    ...[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((y,i) => ({
      regionId: modipuram.regionId, year: y,
      avgPricePerSqft: 2000 + i * 178,
      aqi: 160 - i * 2, greenCoverPercent: 32 - i * 0.5, waterQualityIndex: 58 + i * 1.5,
      floodRiskScore: 18 + i * 0.5, industrialProximity: 10 - i * 0.3,
    })),
  ];

  await prisma.landMarketData.createMany({ data: landMarketRows });

  // ─── Land Price Predictions (2025–2035) ───
  const predRows = [
    // Meerut
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: meerut.regionId, year: y,
      predictedPricePerSqft: 4400 + i * 250,
      environmentalScore: 52 - i * 1.2,
      priceChangePercent: 5.5 + i * 0.3,
      confidenceLevel: 0.92 - i * 0.02,
    })),
    // Delhi NCR
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: delhi.regionId, year: y,
      predictedPricePerSqft: 15800 + i * 900,
      environmentalScore: 38 - i * 1.5,
      priceChangePercent: 6.0 + i * 0.2,
      confidenceLevel: 0.90 - i * 0.02,
    })),
    // Ghaziabad
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: ghaziabad.regionId, year: y,
      predictedPricePerSqft: 6100 + i * 350,
      environmentalScore: 45 - i * 1.3,
      priceChangePercent: 5.8 + i * 0.25,
      confidenceLevel: 0.91 - i * 0.02,
    })),
    // Noida
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: noida.regionId, year: y,
      predictedPricePerSqft: 10000 + i * 600,
      environmentalScore: 48 - i * 1.4,
      priceChangePercent: 6.2 + i * 0.3,
      confidenceLevel: 0.91 - i * 0.02,
    })),
    // Muzaffarnagar
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: muzaffarnagar.regionId, year: y,
      predictedPricePerSqft: 3200 + i * 180,
      environmentalScore: 56 - i * 1.0,
      priceChangePercent: 4.8 + i * 0.2,
      confidenceLevel: 0.93 - i * 0.02,
    })),
    // Haridwar
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: haridwar.regionId, year: y,
      predictedPricePerSqft: 5100 + i * 320,
      environmentalScore: 62 - i * 1.0,
      priceChangePercent: 5.0 + i * 0.35,
      confidenceLevel: 0.94 - i * 0.02,
    })),
    // ─── New Meerut District Cities ───
    // Modinagar
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: modinagar.regionId, year: y,
      predictedPricePerSqft: 5800 + i * 340,
      environmentalScore: 38 - i * 1.5,
      priceChangePercent: 6.5 + i * 0.3,
      confidenceLevel: 0.90 - i * 0.02,
    })),
    // Sardhana
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: sardhana.regionId, year: y,
      predictedPricePerSqft: 2200 + i * 160,
      environmentalScore: 60 - i * 0.8,
      priceChangePercent: 4.5 + i * 0.2,
      confidenceLevel: 0.91 - i * 0.02,
    })),
    // Hastinapur
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: hastinapur.regionId, year: y,
      predictedPricePerSqft: 1500 + i * 110,
      environmentalScore: 72 - i * 0.6,
      priceChangePercent: 3.8 + i * 0.25,
      confidenceLevel: 0.88 - i * 0.02,
    })),
    // Kithor
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: kithor.regionId, year: y,
      predictedPricePerSqft: 3000 + i * 200,
      environmentalScore: 50 - i * 1.2,
      priceChangePercent: 5.5 + i * 0.3,
      confidenceLevel: 0.89 - i * 0.02,
    })),
    // Daurala
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: daurala.regionId, year: y,
      predictedPricePerSqft: 3400 + i * 200,
      environmentalScore: 35 - i * 1.3,
      priceChangePercent: 5.0 + i * 0.25,
      confidenceLevel: 0.89 - i * 0.02,
    })),
    // Mawana
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: mawana.regionId, year: y,
      predictedPricePerSqft: 2000 + i * 120,
      environmentalScore: 55 - i * 0.9,
      priceChangePercent: 4.2 + i * 0.2,
      confidenceLevel: 0.90 - i * 0.02,
    })),
    // Parikshitgarh
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: parikshitgarh.regionId, year: y,
      predictedPricePerSqft: 1200 + i * 90,
      environmentalScore: 65 - i * 0.7,
      priceChangePercent: 3.5 + i * 0.3,
      confidenceLevel: 0.87 - i * 0.02,
    })),
    // Modipuram
    ...[2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map((y,i) => ({
      regionId: modipuram.regionId, year: y,
      predictedPricePerSqft: 3800 + i * 220,
      environmentalScore: 68 - i * 0.8,
      priceChangePercent: 5.2 + i * 0.25,
      confidenceLevel: 0.92 - i * 0.02,
    })),
  ];

  await prisma.landPricePrediction.createMany({ data: predRows });

  console.log('Seeding complete!');
  console.log(`  - ${regions.length + urbanRegions.length} regions (${urbanRegions.length} Meerut-area)`);
  console.log(`  - Historical data rows inserted`);
  console.log(`  - ${solutions.length} solutions`);
  console.log(`  - ${originalCauses.length + meerutCauses.length} environmental causes`);
  console.log(`  - ${landMarketRows.length} land market data rows`);
  console.log(`  - ${predRows.length} land price prediction rows`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
