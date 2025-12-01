import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MaterialsListPage from './pages/MaterialsListPage';
import MaterialFormPage from './pages/MaterialFormPage';
import CategoriesPage from './pages/CategoriesPage';
import UnitsPage from './pages/UnitsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Sistema de Inventario</h1>
            <ul className="nav-links">
              <li><Link to="/">Materiales</Link></li>
              <li><Link to="/categories">Categorías</Link></li>
              <li><Link to="/units">Unidades</Link></li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MaterialsListPage />} />
            <Route path="/materials/new" element={<MaterialFormPage />} />
            <Route path="/materials/:id/edit" element={<MaterialFormPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/units" element={<UnitsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
