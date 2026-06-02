'use client';

import { useState } from 'react';
import SolutionModal from '@/components/solutions/SolutionModal';

const solutions = [
  { key: 'afforestation', icon: 'fas fa-tree', title: 'Afforestation', desc: 'Strategic tree planting to restore forest ecosystems and capture carbon.' },
  { key: 'urban', icon: 'fas fa-city', title: 'Urban Planning', desc: 'Sustainable development models to reduce environmental impact in growing urban areas.' },
  { key: 'glacier', icon: 'fas fa-snowflake', title: 'Glacier Protection', desc: 'Measures to slow glacier melting and manage water resources in affected regions.' },
  { key: 'flood', icon: 'fas fa-water', title: 'Flood Management', desc: 'Strategies to mitigate flood risks in vulnerable coastal and river basin areas.' },
  { key: 'energy', icon: 'fas fa-solar-panel', title: 'Clean Energy', desc: 'Transition to renewable energy sources to reduce pollution and greenhouse gas emissions.' },
  { key: 'waste', icon: 'fas fa-recycle', title: 'Waste Management', desc: 'Improved waste collection, recycling, and disposal systems to reduce environmental contamination.' },
  { key: 'water', icon: 'fas fa-tint', title: 'Water Conservation', desc: 'Techniques and policies to preserve water resources and ensure sustainable use.' },
  { key: 'agriculture', icon: 'fas fa-leaf', title: 'Sustainable Agriculture', desc: 'Farming practices that maintain soil health, conserve water, and reduce pollution.' },
];

export default function SolutionsPage() {
  const [modalSolution, setModalSolution] = useState<string | null>(null);

  return (
    <>
      <div className="section-header">
        <h1>Environmental Solutions</h1>
        <p>Explore strategies to address environmental challenges</p>
      </div>

      <div className="solutions-grid">
        {solutions.map((sol) => (
          <div className="solution-card" key={sol.key}>
            <div className="solution-icon"><i className={sol.icon}></i></div>
            <h3>{sol.title}</h3>
            <p>{sol.desc}</p>
            <button className="view-details-btn" onClick={() => setModalSolution(sol.key)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <SolutionModal
        isOpen={!!modalSolution}
        solutionKey={modalSolution}
        onClose={() => setModalSolution(null)}
      />
    </>
  );
}
