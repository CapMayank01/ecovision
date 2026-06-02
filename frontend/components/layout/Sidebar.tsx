'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
  { href: '/regions', icon: 'fas fa-globe-asia', label: 'Regions' },
  { href: '/forests', icon: 'fas fa-tree', label: 'Deforestation' },
  { href: '/glaciers', icon: 'fas fa-snowflake', label: 'Glaciers' },
  { href: '/water', icon: 'fas fa-water', label: 'Water Bodies' },
  { href: '/pollution', icon: 'fas fa-smog', label: 'Pollution' },
  { href: '/market', icon: 'fas fa-chart-area', label: 'Land Market' },
  { href: '/ml-predictions', icon: 'fas fa-brain', label: 'ML Predictions' },
  { href: '/search', icon: 'fas fa-search', label: 'Search Location' },
  { href: '/solutions', icon: 'fas fa-lightbulb', label: 'Solutions' },
  { href: '/methodology', icon: 'fas fa-cogs', label: 'Methodology' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <i className="fas fa-globe-americas logo-icon"></i>
        <h2>EcoVision</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>EcoVision v1.0</p>
        <p>Environmental Prediction</p>
      </div>
    </aside>
  );
}
