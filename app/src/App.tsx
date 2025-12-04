import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
// Maestro de Materiales
import MaestroMaterialesHomePage from './pages/maestro-materiales/MaestroMaterialesHomePage';
import MaterialsListPage from './pages/MaterialsListPage';
import MaterialFormPage from './pages/MaterialFormPage';
import CategoriesPage from './pages/CategoriesPage';
import UnitsPage from './pages/UnitsPage';
import LogsPage from './pages/LogsPage';
// Salida de Productos (Despachos)
import DespachosHomePage from './pages/despachos/DespachosHomePage';
// Proceso de Garantía
import GarantiasHomePage from './pages/garantias/GarantiasHomePage';

import NotificationBell from './components/NotificationBell';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMaestroMateriales = location.pathname.startsWith('/maestro-materiales');
  const isDespachos = location.pathname.startsWith('/despachos');
  const isGarantias = location.pathname.startsWith('/garantias');

  if (isHome) {
    return (
      <nav className="navbar navbar-home">
        <div className="nav-container">
          <h1 className="nav-title">Módulo de Inventario y Almacén</h1>
        </div>
      </nav>
    );
  }

  if (isMaestroMateriales) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="nav-back">← Inicio</Link>
            <h1 className="nav-title">Maestro de Materiales</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/maestro-materiales" className={location.pathname === '/maestro-materiales' ? 'active' : ''}>Inicio</Link></li>
            <li><Link to="/maestro-materiales/lista" className={location.pathname === '/maestro-materiales/lista' ? 'active' : ''}>Materiales</Link></li>
            <li><Link to="/maestro-materiales/categories" className={location.pathname === '/maestro-materiales/categories' ? 'active' : ''}>Categorías</Link></li>
            <li><Link to="/maestro-materiales/units" className={location.pathname === '/maestro-materiales/units' ? 'active' : ''}>Unidades</Link></li>
            <li><Link to="/maestro-materiales/logs" className={location.pathname === '/maestro-materiales/logs' ? 'active' : ''}>Logs</Link></li>
            <li style={{ marginLeft: 'auto' }}>
              <NotificationBell />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  if (isDespachos) {
    return (
      <nav className="navbar navbar-despachos">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="nav-back">← Inicio</Link>
            <h1 className="nav-title">Salida de Productos</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/despachos" className={location.pathname === '/despachos' ? 'active' : ''}>Inicio</Link></li>
            <li><Link to="/despachos/ordenes" className={location.pathname === '/despachos/ordenes' ? 'active' : ''}>Órdenes</Link></li>
            <li><Link to="/despachos/preparacion" className={location.pathname === '/despachos/preparacion' ? 'active' : ''}>Preparación</Link></li>
            <li><Link to="/despachos/entregas" className={location.pathname === '/despachos/entregas' ? 'active' : ''}>Entregas</Link></li>
          </ul>
        </div>
      </nav>
    );
  }

  if (isGarantias) {
    return (
      <nav className="navbar navbar-garantias">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="nav-back">← Inicio</Link>
            <h1 className="nav-title">Proceso de Garantía</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/garantias" className={location.pathname === '/garantias' ? 'active' : ''}>Inicio</Link></li>
            <li><Link to="/garantias/devoluciones" className={location.pathname === '/garantias/devoluciones' ? 'active' : ''}>Nueva Devolución</Link></li>
            <li><Link to="/garantias/pendientes" className={location.pathname === '/garantias/pendientes' ? 'active' : ''}>Pendientes</Link></li>
            <li><Link to="/garantias/reparacion" className={location.pathname === '/garantias/reparacion' ? 'active' : ''}>En Reparación</Link></li>
            <li><Link to="/garantias/historial" className={location.pathname === '/garantias/historial' ? 'active' : ''}>Historial</Link></li>
          </ul>
        </div>
      </nav>
    );
  }

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<HomePage />} />
            
            {/* Maestro de Materiales */}
            <Route path="/maestro-materiales" element={<MaestroMaterialesHomePage />} />
            <Route path="/maestro-materiales/lista" element={<MaterialsListPage />} />
            <Route path="/maestro-materiales/lista/new" element={<MaterialFormPage />} />
            <Route path="/maestro-materiales/lista/:id/edit" element={<MaterialFormPage />} />
            <Route path="/maestro-materiales/categories" element={<CategoriesPage />} />
            <Route path="/maestro-materiales/units" element={<UnitsPage />} />
            <Route path="/maestro-materiales/logs" element={<LogsPage />} />

            {/* Salida de Productos (Despachos) */}
            <Route path="/despachos" element={<DespachosHomePage />} />
            <Route path="/despachos/ordenes" element={<DespachosHomePage />} />
            <Route path="/despachos/preparacion" element={<DespachosHomePage />} />
            <Route path="/despachos/entregas" element={<DespachosHomePage />} />

            {/* Proceso de Garantía */}
            <Route path="/garantias" element={<GarantiasHomePage />} />
            <Route path="/garantias/devoluciones" element={<GarantiasHomePage />} />
            <Route path="/garantias/pendientes" element={<GarantiasHomePage />} />
            <Route path="/garantias/reparacion" element={<GarantiasHomePage />} />
            <Route path="/garantias/historial" element={<GarantiasHomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
