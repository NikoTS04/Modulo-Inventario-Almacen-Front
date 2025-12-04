import React, { useEffect, useState } from 'react';
import { categoriesAPI, Category } from '../api/categories';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', activo: true });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.list();
      setCategories(data);
    } catch (err: any) {
      setError('Error al cargar categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.categoriaId, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ nombre: '', descripcion: '', activo: true });
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar categoría');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      activo: category.activo
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de desactivar esta categoría?')) {
      return;
    }
    try {
      await categoriesAPI.delete(id);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al desactivar categoría');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await categoriesAPI.activate(id);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al activar categoría');
    }
  };

  const handleDeletePermanent = async (id: string, nombre: string) => {
    try {
      // Primero verificar si tiene materiales
      const hasMaterials = await categoriesAPI.hasMaterials(id);
      
      if (hasMaterials) {
        alert(
          `No se puede eliminar la categoría "${nombre}" porque tiene materiales asignados.\n\n` +
          'Primero debe reasignar o eliminar los materiales asociados.'
        );
        return;
      }

      if (!window.confirm(
        `¿Está seguro de ELIMINAR PERMANENTEMENTE la categoría "${nombre}"?\n\n` +
        'Esta acción NO se puede deshacer. La categoría será eliminada de la base de datos.'
      )) {
        return;
      }

      await categoriesAPI.deletePermanent(id);
      alert(`Categoría "${nombre}" eliminada permanentemente.`);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ nombre: '', descripcion: '', activo: true });
  };

  if (loading) {
    return <div className="loading">Cargando categorías...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Categorías</h1>
        <button className="btn btn-primary" onClick={() => {
          handleCancelForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'Cancelar' : 'Nueva Categoría'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form className="form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              className="form-control"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" className="btn" onClick={handleCancelForm} style={{ background: '#6c757d', color: 'white' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoriaId}>
              <td>{category.nombre}</td>
              <td>{category.descripcion}</td>
              <td>
                <span style={{ color: category.activo ? 'green' : 'red' }}>
                  {category.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(category)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Editar
                </button>
                {category.activo ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(category.categoriaId)}
                  >
                    Desactivar
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleActivate(category.categoriaId)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Activar
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeletePermanent(category.categoriaId, category.nombre)}
                      style={{ background: '#dc3545', color: 'white' }}
                      title="Eliminar permanentemente (solo si no tiene materiales)"
                    >
                      🗑️ Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
