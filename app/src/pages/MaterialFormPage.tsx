import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { materialsAPI, MaterialCreateDTO } from '../api/materials';
import { categoriesAPI, Category } from '../api/categories';
import { unitsAPI, Unit } from '../api/units';

const MaterialFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<MaterialCreateDTO>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoriaId: '',
    unidadBaseId: '',
    activo: true,
    stockInicial: 0,
  });

  const [originalStock, setOriginalStock] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStockConfirm, setShowStockConfirm] = useState(false);

  useEffect(() => {
    loadCategoriesAndUnits();
    if (isEdit && id) {
      loadMaterial(id);
    }
  }, [id]);

  const loadCategoriesAndUnits = async () => {
    try {
      const [categoriesData, unitsData] = await Promise.all([
        categoriesAPI.list(),
        unitsAPI.list(),
      ]);
      setCategories(categoriesData);
      setUnits(unitsData);
    } catch (err: any) {
      setError('Error al cargar categorías y unidades');
      console.error(err);
    }
  };

  const loadMaterial = async (materialId: string) => {
    try {
      const material = await materialsAPI.get(materialId);
      const currentStock = material.stockTotal || 0;
      setOriginalStock(currentStock);
      setFormData({
        codigo: material.codigo,
        nombre: material.nombre,
        descripcion: material.descripcion || '',
        categoriaId: material.categoriaId,
        unidadBaseId: material.unidadBaseId,
        activo: material.activo,
        reordenConfig: material.reordenConfig,
        stockInicial: currentStock,
      });
    } catch (err: any) {
      setError('Error al cargar el material');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'stockInicial') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReordenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      reordenConfig: {
        ...prev.reordenConfig,
        stockMinimo: prev.reordenConfig?.stockMinimo || 0,
        puntoReorden: prev.reordenConfig?.puntoReorden || 0,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si es edición y el stock cambió, mostrar confirmación
    if (isEdit && formData.stockInicial !== originalStock) {
      setShowStockConfirm(true);
      return;
    }
    
    await submitForm();
  };

  const submitForm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await materialsAPI.update(id, formData);
      } else {
        await materialsAPI.create(formData);
      }
      navigate('/maestro-materiales/lista');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el material');
      console.error(err);
    } finally {
      setLoading(false);
      setShowStockConfirm(false);
    }
  };

  const cancelStockChange = () => {
    setFormData(prev => ({ ...prev, stockInicial: originalStock }));
    setShowStockConfirm(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Editar Material' : 'Crear Nuevo Material'}
        </h1>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Modal de confirmación de cambio de stock */}
      {showStockConfirm && (
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
            maxWidth: '500px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginTop: 0, color: '#ff9800' }}>⚠️ Confirmar Cambio de Stock</h2>
            <p>Está a punto de cambiar el stock de:</p>
            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <div><strong>Stock actual:</strong> {originalStock}</div>
              <div><strong>Nuevo stock:</strong> {formData.stockInicial}</div>
              <div style={{ color: formData.stockInicial! > originalStock ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                Diferencia: {formData.stockInicial! > originalStock ? '+' : ''}{(formData.stockInicial || 0) - originalStock}
              </div>
            </div>
            <p><strong>¿Está seguro de realizar este ajuste de inventario?</strong></p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="btn"
                onClick={cancelStockChange}
                style={{ background: '#6c757d', color: 'white' }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={submitForm}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="codigo">
            Código * 
            {!isEdit && <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '0.5rem' }}>
              (Único, no modificable después)
            </span>}
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            className="form-control"
            value={formData.codigo}
            onChange={handleChange}
            required
            disabled={isEdit}
            placeholder="Ej: RED-AP-WIFI6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Access Point WiFi 6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción detallada del material (opcional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId">Categoría *</label>
          <select
            id="categoriaId"
            name="categoriaId"
            className="form-control"
            value={formData.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
              <option key={cat.categoriaId} value={cat.categoriaId}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="unidadBaseId">Unidad de Medida *</label>
          <select
            id="unidadBaseId"
            name="unidadBaseId"
            className="form-control"
            value={formData.unidadBaseId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una unidad</option>
            {units.map((unit) => (
              <option key={unit.unidadId} value={unit.unidadId}>
                {unit.nombre} ({unit.simbolo})
              </option>
            ))}
          </select>
        </div>

        {/* Campo de Stock Inicial/Ajuste */}
        <div className="form-group">
          <label htmlFor="stockInicial">
            {isEdit ? 'Ajuste de Stock' : 'Stock Inicial'}
            {isEdit && <span style={{ fontSize: '0.9em', color: '#ff9800', marginLeft: '0.5rem' }}>
              (Se solicitará confirmación)
            </span>}
          </label>
          <input
            type="number"
            id="stockInicial"
            name="stockInicial"
            className="form-control"
            value={formData.stockInicial || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0"
          />
          {isEdit && (
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Stock actual: {originalStock}
            </small>
          )}
        </div>

        <div className="form-group">
          <h3>Configuración de Reorden</h3>
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
            Configure los niveles de stock que generarán alertas automáticas
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="stockMinimo">
                Stock Mínimo
                <span style={{ fontSize: '0.9em', color: '#666', display: 'block' }}>
                  (Nivel crítico)
                </span>
              </label>
              <input
                type="number"
                id="stockMinimo"
                name="stockMinimo"
                className="form-control"
                value={formData.reordenConfig?.stockMinimo || ''}
                onChange={handleReordenChange}
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="puntoReorden">
                Punto de Reorden
                <span style={{ fontSize: '0.9em', color: '#666', display: 'block' }}>
                  (Alerta de reabastecimiento)
                </span>
              </label>
              <input
                type="number"
                id="puntoReorden"
                name="puntoReorden"
                className="form-control"
                value={formData.reordenConfig?.puntoReorden || ''}
                onChange={handleReordenChange}
                step="0.01"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              style={{ marginRight: '0.5rem', width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1.1em' }}>
              Material Activo
              <span style={{ fontSize: '0.9em', color: '#666', display: 'block' }}>
                {formData.activo 
                  ? '✓ El material estará disponible para operaciones' 
                  : '✗ El material estará inactivo'}
              </span>
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar Material' : 'Crear Material')}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/maestro-materiales/lista')}
            disabled={loading}
            style={{ background: '#6c757d', color: 'white' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialFormPage;
