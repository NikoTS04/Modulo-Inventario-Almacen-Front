import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const modules = [
    {
      id: 'maestro-materiales',
      title: 'Maestro de Materiales',
      description: 'Gestión de materiales, categorías y unidades de medida',
      icon: '📦',
      path: '/maestro-materiales',
      color: '#3498db'
    },
    {
      id: 'salida-productos',
      title: 'Salida de Productos',
      description: 'Gestión de despachos y salidas de inventario',
      icon: '🚚',
      path: '/despachos',
      color: '#27ae60'
    },
    {
      id: 'proceso-garantia',
      title: 'Proceso de Garantía',
      description: 'Gestión de devoluciones: reintegración, reparación o eliminación',
      icon: '🛡️',
      path: '/garantias',
      color: '#9b59b6'
    }
  ];

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">Módulo de Inventario y Almacén</h1>
        <p className="home-subtitle">Selecciona un componente para comenzar</p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.id} className="module-card">
            <Link to={module.path} className="module-link">
              <div className="module-icon" style={{ backgroundColor: module.color }}>
                <span>{module.icon}</span>
              </div>
              <div className="module-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>
              <div className="module-arrow">→</div>
            </Link>
          </div>
        ))}
      </div>

      <div className="home-footer">
        <p>MAI - Módulo de Inventario y Almacén</p>
      </div>
    </div>
  );
};

export default HomePage;
