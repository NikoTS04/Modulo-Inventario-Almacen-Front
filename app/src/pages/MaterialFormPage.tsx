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
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setFormData({
        codigo: material.codigo,
        nombre: material.nombre,
        descripcion: material.descripcion || '',
        categoriaId: material.categoriaId,
        unidadBaseId: material.unidadBaseId,
        activo: material.activo,
        reordenConfig: material.reordenConfig,
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
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await materialsAPI.update(id, formData);
      } else {
        await materialsAPI.create(formData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el material');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Editar Material' : 'Crear Nuevo Material'}
        </h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="codigo">Código *</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            className="form-control"
            value={formData.codigo}
            onChange={handleChange}
            required
            disabled={isEdit}
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

        <div className="form-group">
          <h3>Configuración de Reorden</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="stockMinimo">Stock Mínimo</label>
              <input
                type="number"
                id="stockMinimo"
                name="stockMinimo"
                className="form-control"
                value={formData.reordenConfig?.stockMinimo || ''}
                onChange={handleReordenChange}
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="puntoReorden">Punto de Reorden</label>
              <input
                type="number"
                id="puntoReorden"
                name="puntoReorden"
                className="form-control"
                value={formData.reordenConfig?.puntoReorden || ''}
                onChange={handleReordenChange}
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            Activo
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialFormPage;
