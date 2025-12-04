import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { materialsAPI, Material, MaterialImportResponse } from '../api/materials';
import { categoriesAPI, Category } from '../api/categories';

const MaterialsListPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('nombre');

  // Estados para importación/exportación
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<MaterialImportResponse | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await materialsAPI.list({ 
        page, 
        limit: 10,
        sort: sortBy,
        categoria: selectedCategory || undefined,
        activo: filterActivo,
        search: debouncedSearchTerm || undefined
      });
      setMaterials(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar materiales');
      console.error('Error loading materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.list();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [page, selectedCategory, filterActivo, sortBy, debouncedSearchTerm]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de desactivar este material?')) {
      return;
    }

    try {
      await materialsAPI.delete(id);
      loadMaterials();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al desactivar material');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await materialsAPI.activate(id);
      loadMaterials();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al activar material');
    }
  };

  const handleSearch = () => {
    setPage(0);
    setDebouncedSearchTerm(searchTerm); // Forzar búsqueda inmediata
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('');
    setFilterActivo(undefined);
    setSortBy('nombre');
    setPage(0);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Por favor seleccione un archivo CSV válido');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const result = await materialsAPI.importMaterials(file);
      setImportResult(result);
      setShowImportModal(true);

      // Recargar materiales si hubo éxitos
      if (result.exitosos > 0) {
        loadMaterials();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al importar materiales');
      console.error('Error importing materials:', err);
    } finally {
      setImporting(false);
      // Resetear el input para permitir seleccionar el mismo archivo nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      const blob = await materialsAPI.exportMaterials({
        sort: sortBy,
        categoria: selectedCategory || undefined,
        activo: filterActivo,
        search: debouncedSearchTerm || undefined,
      });

      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `materiales_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al exportar materiales');
      console.error('Error exporting materials:', err);
    } finally {
      setExporting(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportResult(null);
  };

  if (loading) {
    return <div className="loading">Cargando materiales...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Materiales</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-success" 
            onClick={handleImportClick}
            disabled={importing}
            title="Importar materiales desde archivo CSV"
          >
            {importing ? '⏳ Importando...' : '📥 Importar CSV'}
          </button>
          <button 
            className="btn btn-info" 
            onClick={handleExport}
            disabled={exporting}
            title="Exportar materiales a archivo CSV"
            style={{ background: '#17a2b8', color: 'white' }}
          >
            {exporting ? '⏳ Exportando...' : '📤 Exportar CSV'}
          </button>
          <Link to="/materials/new">
            <button className="btn btn-primary">➕ Crear Nuevo Material</button>
          </Link>
        </div>
      </div>

      {/* Input oculto para selección de archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {error && <div className="error">{error}</div>}

      {/* Modal de resultado de importación */}
      {showImportModal && importResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginTop: 0 }}>Resultado de Importación</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{importResult.totalProcesados}</div>
                  <div style={{ color: '#666' }}>Total Procesados</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#d4edda', borderRadius: '4px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>{importResult.exitosos}</div>
                  <div style={{ color: '#155724' }}>✅ Exitosos</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8d7da', borderRadius: '4px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#721c24' }}>{importResult.fallidos}</div>
                  <div style={{ color: '#721c24' }}>❌ Fallidos</div>
                </div>
              </div>

              {importResult.errores.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{ color: '#721c24' }}>Errores Encontrados:</h3>
                  <div style={{ 
                    maxHeight: '200px', 
                    overflow: 'auto', 
                    background: '#f8d7da', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb'
                  }}>
                    {importResult.errores.map((error, index) => (
                      <div key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.exitosos > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#d4edda', borderRadius: '4px' }}>
                  <strong style={{ color: '#155724' }}>
                    ✅ Se importaron {importResult.exitosos} material(es) correctamente.
                  </strong>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={closeImportModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {/* Panel de Filtros */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '1.5rem' 
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Filtros de Búsqueda</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Búsqueda por texto */}
          <div>
            <label htmlFor="search" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Buscar por Código/Nombre
            </label>
            <input
              id="search"
              type="text"
              className="form-control"
              placeholder="Ej: RED-AP-WIFI6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Categoría
            </label>
            <select
              id="category"
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.categoriaId} value={cat.categoriaId}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Estado
            </label>
            <select
              id="status"
              className="form-control"
              value={filterActivo === undefined ? '' : filterActivo ? 'true' : 'false'}
              onChange={(e) => setFilterActivo(e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <label htmlFor="sort" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Ordenar por
            </label>
            <select
              id="sort"
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nombre">Nombre</option>
              <option value="codigo">Código</option>
              <option value="fechaCreacion">Fecha de Creación</option>
              <option value="fechaModificacion">Última Modificación</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleSearch}>
            🔍 Buscar
          </button>
          <button className="btn" onClick={handleResetFilters} style={{ background: '#6c757d', color: 'white' }}>
            🔄 Limpiar Filtros
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Unidad</th>
            <th>Stock Total</th>
            <th>Estado</th>
            <th>Alerta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.materialId}>
              <td>{material.codigo}</td>
              <td>{material.nombre}</td>
              <td>{material.categoriaNombre}</td>
              <td>{material.unidadBaseSimbolo}</td>
              <td>{material.stockTotal || 0}</td>
              <td>
                <span style={{ color: material.activo ? 'green' : 'red' }}>
                  {material.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                {material.alertaReorden && (
                  <span style={{ color: 'orange' }}>⚠ Reorden</span>
                )}
              </td>
              <td>
                <Link to={`/materials/${material.materialId}/edit`}>
                  <button className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
                    Editar
                  </button>
                </Link>
                {material.activo ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(material.materialId)}
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => handleActivate(material.materialId)}
                  >
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Anterior
        </button>
        <span style={{ padding: '0.5rem 1rem' }}>
          Página {page + 1} de {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MaterialsListPage;
