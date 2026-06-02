'use client';

import { useEffect, useRef } from 'react';

export default function MethodologyPage() {
  const flowchartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        flowchart: { useMaxWidth: true, htmlLabels: true },
      });

      if (flowchartRef.current) {
        flowchartRef.current.innerHTML = '';
        const { svg } = await mermaid.render('methodology-flowchart', `
          graph TD
            A[Define Goals] --> B[Fetch Pre-Processed Data]
            B --> C[Apply Rule-Based Calculations]
            C --> D[Generate Predictions]
            D --> E[Visualize Results]
            E --> F[Propose Solutions]
            B --> G[Satellite Data]
            B --> H[Climate Records]
            B --> I[Ground Surveys]
            C --> J[Linear Extrapolation]
            C --> K[Degree-Day Models]
            C --> L[Empirical Relationships]
        `);
        flowchartRef.current.innerHTML = svg;
      }
    };

    renderMermaid();
  }, []);

  return (
    <>
      <div className="section-header">
        <h1>Our Methodology</h1>
        <p>Learn about our approach to environmental prediction</p>
      </div>

      <div className="card">
        <h3>Rule-Based Environmental Prediction</h3>
        <p>
          Our system uses rule-based calculations on pre-processed data to predict
          environmental changes without complex machine learning models. This approach
          ensures transparency, reliability, and accessibility.
        </p>

        <div style={{ margin: '2rem 0' }}>
          <h3>System Workflow</h3>
          <div ref={flowchartRef} className="detailed-flowchart"></div>
        </div>

        <div className="methodology-steps">
          {[
            { num: 1, title: 'Define Goals', desc: 'Clearly identify the environmental parameters to be predicted and the geographic scope of analysis.' },
            { num: 2, title: 'Fetch Pre-Processed Data', desc: 'Collect data from reliable sources such as NASA, NOAA, IPCC, and other environmental monitoring organizations.' },
            {
              num: 3,
              title: 'Apply Rule-Based Calculations',
              desc: 'Use established formulas and algorithms to process the data and generate predictions.',
              list: ['Linear extrapolation for trend analysis', 'Degree-day models for glacier melt', 'Empirical relationships between environmental variables'],
            },
            { num: 4, title: 'Visualize Results', desc: 'Present the predictions through interactive maps, charts, and tables for easy interpretation.' },
            { num: 5, title: 'Propose Solutions', desc: 'Based on the predictions, suggest targeted interventions to address environmental challenges.' },
          ].map((step) => (
            <div className="step" key={step.num}>
              <div className="step-number">{step.num}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {step.list && (
                  <ul>
                    {step.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources — from index.html lines 1062-1098 */}
      <div className="card">
        <h3>Data Sources</h3>
        <div className="sources-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            { title: 'Satellite Imagery', items: ['NASA Earth Observatory', 'Sentinel-2 (European Space Agency)', 'Landsat (USGS)'] },
            { title: 'Climate Data', items: ['IPCC Data Distribution Centre', 'NOAA Climate Data Online', 'World Meteorological Organization'] },
            { title: 'Forest Cover', items: ['Global Forest Watch', 'FAO Forest Resources Assessment', 'Hansen Global Forest Change dataset'] },
            { title: 'Water Resources', items: ['Global Surface Water Explorer', 'GRACE satellite data', 'World Resources Institute Aqueduct'] },
          ].map((source) => (
            <div key={source.title}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>{source.title}</h4>
              <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                {source.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
