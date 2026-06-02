interface StatCardProps {
  icon: string;
  title: string;
  value: string;
}

export default function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  );
}
