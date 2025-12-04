import React from 'react';
import { Link } from 'react-router-dom';

const GarantiasHomePage: React.FC = () => {
  return (
    <div className="module-home">
      <div className="module-welcome">
        <div className="welcome-icon" style={{ backgroundColor: '#9b59b6' }}>🛡️</div>
        <h1>Proceso de Garantía</h1>
        <p className="welcome-description">
          Gestión de productos devueltos: reintegración, reparación o eliminación del inventario.
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">↩️</div>
          <h3>Registrar Devolución</h3>
          <p>Registrar productos devueltos y decidir su destino</p>
          <Link to="/garantias/devoluciones" className="btn btn-primary">
            Nueva Devolución
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Devoluciones Pendientes</h3>
          <p>Ver y procesar devoluciones registradas</p>
          <Link to="/garantias/pendientes" className="btn btn-primary">
            Ver Pendientes
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <h3>En Reparación</h3>
          <p>Productos enviados a reparación (excluidos del stock)</p>
          <Link to="/garantias/reparacion" className="btn btn-primary">
            Ver Reparaciones
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Logs</h3>
          <p>Registro de todas las acciones realizadas</p>
          <Link to="/garantias/logs" className="btn btn-primary">
            Ver Logs
          </Link>
        </div>
      </div>

      <div className="actions-summary">
        <h3>Acciones disponibles para productos devueltos:</h3>
        <div className="action-list">
          <div className="action-item reintegrar">
            <span className="action-icon">✅</span>
            <div>
              <strong>Reintegrar</strong>
              <p>Producto apto, se devuelve al stock disponible</p>
            </div>
          </div>
          <div className="action-item reparar">
            <span className="action-icon">🔧</span>
            <div>
              <strong>Enviar a Reparación</strong>
              <p>Producto dañado, se excluye temporalmente del stock</p>
            </div>
          </div>
          <div className="action-item eliminar">
            <span className="action-icon">🗑️</span>
            <div>
              <strong>Eliminar</strong>
              <p>Producto no recuperable, se descuenta del inventario</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarantiasHomePage;
