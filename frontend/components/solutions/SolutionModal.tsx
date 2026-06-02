'use client';

// removed useState import

// Exact data from getSolutionData() and getRegionData() in app.js
const solutionData: Record<string, { title: string; content: string }> = {
  afforestation: {
    title: 'Afforestation Solutions',
    content: `<div class="solution-details"><h3>Priority Regions</h3><ul><li>Amazon Basin: Focus on areas with >10% deforestation rate</li><li>Congo Basin: Target buffer zones around existing protected areas</li><li>Southeast Asia: Prioritize former plantation areas</li></ul><h3>Implementation Strategy</h3><ul><li>Community Involvement: Engage local communities in planting and maintenance</li><li>Species Selection: Use native species to enhance biodiversity</li><li>Monitoring: Track progress using satellite imagery and ground surveys</li></ul><h3>Expected Outcomes</h3><ul><li>Increased carbon sequestration</li><li>Improved soil health</li><li>Enhanced biodiversity</li></ul></div>`,
  },
  urban: {
    title: 'Urban Planning Solutions',
    content: `<div class="solution-details"><h3>Priority Regions</h3><ul><li>Coastal Cities: Focus on climate resilience and sea-level rise</li><li>Rapidly Growing Cities: Target sustainable development and infrastructure</li><li>Polluted Cities: Prioritize air and water quality improvements</li></ul><h3>Implementation Strategy</h3><ul><li>Green Infrastructure: Incorporate parks, green roofs, and urban forests</li><li>Public Transportation: Invest in efficient and accessible public transit</li><li>Energy Efficiency: Promote energy-efficient buildings and renewable energy</li></ul><h3>Expected Outcomes</h3><ul><li>Reduced carbon emissions</li><li>Improved air and water quality</li><li>Enhanced quality of life</li></ul></div>`,
  },
  glacier: {
    title: 'Glacier Protection Solutions',
    content: `<div class="solution-details"><h3>Priority Regions</h3><ul><li>Himalayas: Critical water source for 2 billion people</li><li>Alps: Rapid retreat affecting European water supply</li><li>Andes: Essential for South American freshwater</li></ul><h3>Implementation Strategy</h3><ul><li>Emission Reduction: Enforce stricter emission standards</li><li>Reflective Covers: Pilot programs using reflective materials</li><li>Water Management: Develop alternative water sources</li></ul><h3>Expected Outcomes</h3><ul><li>Slowed glacier retreat</li><li>Preserved water resources</li><li>Reduced flood risks</li></ul></div>`,
  },
  flood: {
    title: 'Flood Management Solutions',
    content: `<div class="solution-details"><h3>Priority Regions</h3><ul><li>Coastal Areas: Rising sea levels increasing flood frequency</li><li>River Basins: Deforestation worsening flood impacts</li><li>Urban Areas: Impermeable surfaces preventing water absorption</li></ul><h3>Implementation Strategy</h3><ul><li>Early Warning Systems: Deploy advanced monitoring and alert systems</li><li>Green Infrastructure: Restore wetlands and create flood plains</li><li>Urban Planning: Implement permeable surfaces and drainage systems</li></ul><h3>Expected Outcomes</h3><ul><li>Reduced flood damage</li><li>Better disaster preparedness</li><li>Protected communities</li></ul></div>`,
  },
  energy: {
    title: 'Clean Energy Solutions',
    content: `<div class="solution-details"><h3>Priority Areas</h3><ul><li>Solar Energy: Expanding capacity in sun-rich regions</li><li>Wind Energy: Offshore and onshore wind farm development</li><li>Hydropower: Sustainable hydroelectric projects</li></ul><h3>Implementation Strategy</h3><ul><li>Policy Incentives: Tax breaks and subsidies for renewable energy</li><li>Grid Modernization: Smart grid technology for better distribution</li><li>Research & Development: Investment in energy storage solutions</li></ul><h3>Expected Outcomes</h3><ul><li>Reduced greenhouse gas emissions</li><li>Energy independence</li><li>Job creation in green sector</li></ul></div>`,
  },
  waste: {
    title: 'Waste Management Solutions',
    content: `<div class="solution-details"><h3>Priority Areas</h3><ul><li>Plastic Pollution: Reduce single-use plastic consumption</li><li>Electronic Waste: Proper recycling of e-waste</li><li>Industrial Waste: Treatment before disposal</li></ul><h3>Implementation Strategy</h3><ul><li>Circular Economy: Design products for reuse and recycling</li><li>Extended Producer Responsibility: Manufacturers responsible for disposal</li><li>Community Programs: Local recycling and composting initiatives</li></ul><h3>Expected Outcomes</h3><ul><li>Reduced landfill waste</li><li>Cleaner oceans and waterways</li><li>Resource conservation</li></ul></div>`,
  },
  water: {
    title: 'Water Conservation Solutions',
    content: `<div class="solution-details"><h3>Priority Areas</h3><ul><li>Agriculture: Efficient irrigation systems</li><li>Urban: Reducing household water waste</li><li>Industry: Water recycling in manufacturing</li></ul><h3>Implementation Strategy</h3><ul><li>Drip Irrigation: Replacing flood irrigation in agriculture</li><li>Rainwater Harvesting: Collecting and storing rainwater</li><li>Wastewater Treatment: Treating and reusing wastewater</li></ul><h3>Expected Outcomes</h3><ul><li>Sustainable water supply</li><li>Reduced water stress</li><li>Improved water quality</li></ul></div>`,
  },
  agriculture: {
    title: 'Sustainable Agriculture Solutions',
    content: `<div class="solution-details"><h3>Priority Areas</h3><ul><li>Soil Health: Preventing erosion and degradation</li><li>Chemical Use: Reducing pesticide and fertilizer runoff</li><li>Biodiversity: Maintaining crop diversity</li></ul><h3>Implementation Strategy</h3><ul><li>Organic Farming: Transition to organic practices</li><li>Crop Rotation: Maintaining soil fertility naturally</li><li>Precision Agriculture: Using technology to optimize inputs</li></ul><h3>Expected Outcomes</h3><ul><li>Healthier soils</li><li>Reduced water pollution</li><li>Sustainable food production</li></ul></div>`,
  },
};

interface SolutionModalProps {
  isOpen: boolean;
  solutionKey: string | null;
  onClose: () => void;
}

export default function SolutionModal({ isOpen, solutionKey, onClose }: SolutionModalProps) {
  if (!isOpen || !solutionKey) return null;

  const data = solutionData[solutionKey];
  if (!data) return null;

  return (
    <div className="modal open" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{data.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </div>
  );
}
