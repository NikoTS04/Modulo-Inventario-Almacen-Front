import React from 'react';
import { Link } from 'react-router-dom';

const DespachosHomePage: React.FC = () => {
  return (
    <div className="module-home">
      <div className="module-welcome">
        <div className="welcome-icon" style={{ backgroundColor: '#27ae60' }}>🚚</div>
        <h1>Salida de Productos</h1>
        <p className="welcome-description">
          Módulo para la gestión de despachos y salidas de inventario.
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Órdenes de Despacho</h3>
          <p>Crear y gestionar órdenes de salida de productos</p>
          <Link to="/despachos/ordenes" className="btn btn-primary">
            Ir a Órdenes
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Preparación</h3>
          <p>Preparar productos para su despacho</p>
          <Link to="/despachos/preparacion" className="btn btn-primary">
            Ir a Preparación
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚛</div>
          <h3>Entregas</h3>
          <p>Seguimiento de entregas realizadas</p>
          <Link to="/despachos/entregas" className="btn btn-primary">
            Ir a Entregas
          </Link>
        </div>
      </div>

      <div className="dev-notice">
        <h3>🚧 Módulo en Desarrollo</h3>
        <p>Este módulo está siendo desarrollado. Las funcionalidades estarán disponibles próximamente.</p>
      </div>
    </div>
  );
};

export default DespachosHomePage;

