import React from 'react';
import { Link } from 'react-router-dom';

const MaestroMaterialesHomePage: React.FC = () => {
  return (
    <div className="module-home">
      <div className="module-welcome">
        <div className="welcome-icon" style={{ backgroundColor: '#3498db' }}>📦</div>
        <h1>Maestro de Materiales</h1>
        <p className="welcome-description">
          Gestión de materiales, categorías y unidades de medida del inventario.
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Materiales</h3>
          <p>Gestionar el catálogo de materiales del inventario</p>
          <Link to="/maestro-materiales/lista" className="btn btn-primary">
            Ver Materiales
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏷️</div>
          <h3>Categorías</h3>
          <p>Administrar categorías para clasificar materiales</p>
          <Link to="/maestro-materiales/categories" className="btn btn-primary">
            Ver Categorías
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📐</div>
          <h3>Unidades de Medida</h3>
          <p>Configurar unidades de medida para los materiales</p>
          <Link to="/maestro-materiales/units" className="btn btn-primary">
            Ver Unidades
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Logs</h3>
          <p>Historial de cambios y actividades del sistema</p>
          <Link to="/maestro-materiales/logs" className="btn btn-primary">
            Ver Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MaestroMaterialesHomePage;

