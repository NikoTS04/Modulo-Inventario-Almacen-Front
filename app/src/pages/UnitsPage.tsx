import React, { useEffect, useState } from 'react';
import { unitsAPI, Unit } from '../api/units';

const UnitsPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    simbolo: '', 
    tipo: 'UNIDAD', 
    activo: true 
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const data = await unitsAPI.list();
      setUnits(data);
    } catch (err: any) {
      setError('Error al cargar unidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUnit) {
        await unitsAPI.update(editingUnit.unidadId, formData);
      } else {
        await unitsAPI.create(formData);
      }
      setShowForm(false);
      setEditingUnit(null);
      setFormData({ nombre: '', simbolo: '', tipo: 'UNIDAD', activo: true });
      loadUnits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar unidad');
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      nombre: unit.nombre,
      simbolo: unit.simbolo,
      tipo: unit.tipo || 'UNIDAD',
      activo: unit.activo
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de desactivar esta unidad?')) {
      return;
    }
    try {
      await unitsAPI.delete(id);
      loadUnits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al desactivar unidad');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await unitsAPI.activate(id);
      loadUnits();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al activar unidad');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUnit(null);
    setFormData({ nombre: '', simbolo: '', tipo: 'UNIDAD', activo: true });
  };

  if (loading) {
    return <div className="loading">Cargando unidades...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Unidades de Medida</h1>
        <button className="btn btn-primary" onClick={() => {
          handleCancelForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'Cancelar' : 'Nueva Unidad'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form className="form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h3>{editingUnit ? 'Editar Unidad' : 'Nueva Unidad'}</h3>
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
            <label htmlFor="simbolo">Símbolo *</label>
            <input
              type="text"
              id="simbolo"
              className="form-control"
              value={formData.simbolo}
              onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              className="form-control"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            >
              <option value="UNIDAD">Unidad</option>
              <option value="PESO">Peso</option>
              <option value="VOLUMEN">Volumen</option>
              <option value="LONGITUD">Longitud</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingUnit ? 'Actualizar' : 'Guardar'}
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
            <th>Símbolo</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.unidadId}>
              <td>{unit.nombre}</td>
              <td>{unit.simbolo}</td>
              <td>{unit.tipo}</td>
              <td>
                <span style={{ color: unit.activo ? 'green' : 'red' }}>
                  {unit.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(unit)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Editar
                </button>
                {unit.activo ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(unit.unidadId!)}
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => handleActivate(unit.unidadId!)}
                  >
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnitsPage;
