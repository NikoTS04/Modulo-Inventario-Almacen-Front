import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { garantiasAPI, DevolucionCreateDTO } from '../../api/garantias';
import { materialsAPI, Material } from '../../api/materials';
import { shouldUseMockData } from '../../config/environment';

interface ItemFormulario {
  id: string;
  materialId: string;
  cantidad: number;
  motivo: string;
  observaciones: string;
}

const NuevaDevolucionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materiales, setMateriales] = useState<Material[]>([]);

  // Datos del formulario
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteDocumento, setClienteDocumento] = useState('');
  const [motivoGeneral, setMotivoGeneral] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ItemFormulario[]>([
    { id: '1', materialId: '', cantidad: 1, motivo: '', observaciones: '' }
  ]);

  useEffect(() => {
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    try {
      const response = await materialsAPI.list({ limit: 100, activo: true });
      setMateriales(response.items);
    } catch (err) {
      console.error('Error cargando materiales:', err);
      // Datos mock solo si está habilitado
      if (shouldUseMockData()) {
        console.log('📦 Usando datos mock para materiales');
        setMateriales([
          { materialId: 'mat-001', codigo: 'LAPTOP-001', nombre: 'Laptop HP ProBook', activo: true, categoriaId: '1', unidadBaseId: '1' },
          { materialId: 'mat-002', codigo: 'MONITOR-001', nombre: 'Monitor Dell 24"', activo: true, categoriaId: '1', unidadBaseId: '1' },
          { materialId: 'mat-003', codigo: 'TECLADO-001', nombre: 'Teclado Mecánico Logitech', activo: true, categoriaId: '1', unidadBaseId: '1' },
          { materialId: 'mat-004', codigo: 'MOUSE-001', nombre: 'Mouse Inalámbrico', activo: true, categoriaId: '1', unidadBaseId: '1' },
          { materialId: 'mat-005', codigo: 'CABLE-HDMI', nombre: 'Cable HDMI 2m', activo: true, categoriaId: '2', unidadBaseId: '1' },
          { materialId: 'mat-006', codigo: 'AURICULAR-001', nombre: 'Auriculares Bluetooth', activo: true, categoriaId: '1', unidadBaseId: '1' },
          { materialId: 'mat-007', codigo: 'CARGADOR-001', nombre: 'Cargador Universal 65W', activo: true, categoriaId: '2', unidadBaseId: '1' },
          { materialId: 'mat-008', codigo: 'USB-HUB', nombre: 'Hub USB 4 puertos', activo: true, categoriaId: '2', unidadBaseId: '1' },
        ]);
      }
    }
  };

  const agregarItem = () => {
    const nuevoId = String(Date.now());
    setItems([...items, { id: nuevoId, materialId: '', cantidad: 1, motivo: '', observaciones: '' }]);
  };

  const eliminarItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const actualizarItem = (id: string, campo: keyof ItemFormulario, valor: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!motivoGeneral.trim()) {
      setError('Debe ingresar un motivo general de la devolución');
      return;
    }

    const itemsValidos = items.filter(item => item.materialId && item.cantidad > 0 && item.motivo);
    if (itemsValidos.length === 0) {
      setError('Debe agregar al menos un ítem con material, cantidad y motivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: DevolucionCreateDTO = {
        clienteNombre: clienteNombre || undefined,
        clienteDocumento: clienteDocumento || undefined,
        motivoGeneral,
        observaciones: observaciones || undefined,
        items: itemsValidos.map(item => ({
          materialId: item.materialId,
          cantidad: item.cantidad,
          motivo: item.motivo,
          observaciones: item.observaciones || undefined
        }))
      };

      await garantiasAPI.registrarDevolucion(data);
      navigate('/garantias/pendientes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la devolución');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Registrar Nueva Devolución</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Datos del Cliente */}
        <div className="form-section">
          <h3 className="form-section-title">Datos del Cliente (Opcional)</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clienteNombre">Nombre del Cliente</label>
              <input
                type="text"
                id="clienteNombre"
                className="form-control"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="clienteDocumento">Documento/NIT</label>
              <input
                type="text"
                id="clienteDocumento"
                className="form-control"
                value={clienteDocumento}
                onChange={(e) => setClienteDocumento(e.target.value)}
                placeholder="Número de documento"
              />
            </div>
          </div>
        </div>

        {/* Motivo General */}
        <div className="form-section">
          <h3 className="form-section-title">Información de la Devolución</h3>
          <div className="form-group">
            <label htmlFor="motivoGeneral">Motivo General *</label>
            <input
              type="text"
              id="motivoGeneral"
              className="form-control"
              value={motivoGeneral}
              onChange={(e) => setMotivoGeneral(e.target.value)}
              placeholder="Ej: Producto defectuoso, error en pedido, etc."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones Generales</label>
            <textarea
              id="observaciones"
              className="form-control"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        {/* Items de la Devolución */}
        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Productos a Devolver *</h3>
            <button type="button" className="btn btn-success" onClick={agregarItem}>
              + Agregar Producto
            </button>
          </div>

          <div className="items-list">
            {items.map((item, index) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <span className="item-number">Producto #{index + 1}</span>
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarItem(item.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label>Material *</label>
                    <select
                      className="form-control"
                      value={item.materialId}
                      onChange={(e) => actualizarItem(item.id, 'materialId', e.target.value)}
                      required
                    >
                      <option value="">Seleccione un material</option>
                      {materiales.map(mat => (
                        <option key={mat.materialId} value={mat.materialId}>
                          {mat.codigo} - {mat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Cantidad *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={item.cantidad}
                      onChange={(e) => actualizarItem(item.id, 'cantidad', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Motivo de devolución *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.motivo}
                    onChange={(e) => actualizarItem(item.id, 'motivo', e.target.value)}
                    placeholder="Ej: Defecto de fábrica, daño en transporte..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Observaciones del ítem</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.observaciones}
                    onChange={(e) => actualizarItem(item.id, 'observaciones', e.target.value)}
                    placeholder="Detalles adicionales..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/garantias')}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Devolución'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaDevolucionPage;

