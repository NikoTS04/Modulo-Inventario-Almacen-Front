import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  garantiasAPI, 
  Devolucion, 
  DestinoDevolucion, 
  InspeccionItemDTO,
  EstadoItem,
  EstadoDevolucion
} from '../../api/garantias';
import { shouldUseMockData } from '../../config/environment';

interface ItemInspeccion {
  itemId: string;
  materialCodigo?: string;
  materialNombre?: string;
  cantidad: number;
  motivo: string;
  observaciones?: string;
  estado: string;
  // Campos de inspección
  resultado: 'APTO' | 'DAÑADO' | 'NO_RECUPERABLE' | '';
  observacionesInspeccion: string;
  destino: DestinoDevolucion | '';
}

const ProcesarDevolucionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [devolucion, setDevolucion] = useState<Devolucion | null>(null);
  const [items, setItems] = useState<ItemInspeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      cargarDevolucion(id);
    }
  }, [id]);

  const cargarDevolucion = async (devolucionId: string) => {
    try {
      setLoading(true);
      const data = await garantiasAPI.obtenerDevolucion(devolucionId);
      setDevolucion(data);
      
      // Preparar items para inspección
      setItems(data.items.map(item => ({
        ...item,
        resultado: '',
        observacionesInspeccion: '',
        destino: ''
      })));
    } catch (err: any) {
      console.error('Error cargando devolución:', err);
      // Datos mock solo si está habilitado
      if (!shouldUseMockData()) {
        setError(err.response?.data?.message || 'Error al cargar la devolución');
        setLoading(false);
        return;
      }
      console.log('📦 Usando datos mock para procesar devolución');
      const mockDevolucion: Devolucion = {
        devolucionId: devolucionId,
        codigo: 'DEV-2024-001',
        fechaRegistro: new Date().toISOString(),
        estado: EstadoDevolucion.RECIBIDO,
        clienteNombre: 'Juan Pérez',
        clienteDocumento: '12345678',
        motivoGeneral: 'Producto defectuoso',
        items: [
          { itemId: 'item-001', materialId: 'mat-001', materialCodigo: 'LAPTOP-001', materialNombre: 'Laptop HP ProBook', cantidad: 1, motivo: 'No enciende', observaciones: 'Cliente reporta que dejó de funcionar hace 2 días', estado: EstadoItem.PENDIENTE },
          { itemId: 'item-002', materialId: 'mat-002', materialCodigo: 'MONITOR-001', materialNombre: 'Monitor Dell 24"', cantidad: 2, motivo: 'Pantalla dañada', observaciones: 'Líneas verticales en la pantalla', estado: EstadoItem.PENDIENTE },
          { itemId: 'item-003', materialId: 'mat-003', materialCodigo: 'TECLADO-001', materialNombre: 'Teclado Mecánico Logitech', cantidad: 1, motivo: 'Teclas no responden', estado: EstadoItem.PENDIENTE }
        ]
      };
      setDevolucion(mockDevolucion);
      setItems(mockDevolucion.items.map(item => ({
        ...item,
        resultado: '',
        observacionesInspeccion: '',
        destino: ''
      })));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const actualizarItem = (itemId: string, campo: string, valor: string) => {
    setItems(items.map(item => {
      if (item.itemId === itemId) {
        const updated = { ...item, [campo]: valor };
        
        // Auto-asignar destino basado en resultado
        if (campo === 'resultado') {
          if (valor === 'APTO') {
            updated.destino = DestinoDevolucion.REINTEGRO;
          } else if (valor === 'DAÑADO') {
            updated.destino = DestinoDevolucion.REPARACION;
          } else if (valor === 'NO_RECUPERABLE') {
            updated.destino = DestinoDevolucion.ELIMINACION;
          }
        }
        
        return updated;
      }
      return item;
    }));
  };

  const validarFormulario = (): boolean => {
    for (const item of items) {
      if (!item.resultado) {
        setError(`Debe seleccionar un resultado de inspección para todos los ítems`);
        return false;
      }
      if (!item.destino) {
        setError(`Debe seleccionar un destino para todos los ítems`);
        return false;
      }
    }
    return true;
  };

  const handleProcesar = async () => {
    if (!validarFormulario() || !devolucion) return;

    setProcesando(true);
    setError(null);

    try {
      const itemsInspeccion: InspeccionItemDTO[] = items.map(item => ({
        itemId: item.itemId,
        resultado: item.resultado as 'APTO' | 'DAÑADO' | 'NO_RECUPERABLE',
        observaciones: item.observacionesInspeccion || undefined,
        destino: item.destino as DestinoDevolucion
      }));

      await garantiasAPI.procesarDevolucion({
        devolucionId: devolucion.devolucionId,
        items: itemsInspeccion
      });

      // Redirigir según el destino
      const tieneReparacion = items.some(i => i.destino === DestinoDevolucion.REPARACION);
      if (tieneReparacion) {
        navigate('/garantias/reparacion');
      } else {
        navigate('/garantias/historial');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la devolución');
    } finally {
      setProcesando(false);
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'APTO': return '#22c55e';
      case 'DAÑADO': return '#eab308';
      case 'NO_RECUPERABLE': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const getDestinoInfo = (destino: DestinoDevolucion | '') => {
    switch (destino) {
      case DestinoDevolucion.REINTEGRO:
        return { icon: '✅', text: 'Reintegrar al stock', color: '#22c55e' };
      case DestinoDevolucion.REPARACION:
        return { icon: '🔧', text: 'Enviar a reparación', color: '#eab308' };
      case DestinoDevolucion.ELIMINACION:
        return { icon: '🗑️', text: 'Eliminar del inventario', color: '#ef4444' };
      default:
        return { icon: '❓', text: 'Sin asignar', color: '#9ca3af' };
    }
  };

  if (loading) {
    return <div className="loading">Cargando devolución...</div>;
  }

  if (!devolucion) {
    return <div className="error">No se encontró la devolución</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Procesar Devolución</h1>
          <p className="page-subtitle">Código: {devolucion.codigo}</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Información de la devolución */}
      <div className="info-card">
        <div className="info-grid">
          <div>
            <span className="info-label">Cliente:</span>
            <span>{devolucion.clienteNombre || 'No especificado'}</span>
          </div>
          <div>
            <span className="info-label">Fecha de registro:</span>
            <span>{new Date(devolucion.fechaRegistro).toLocaleDateString('es-ES')}</span>
          </div>
          <div>
            <span className="info-label">Motivo:</span>
            <span>{devolucion.motivoGeneral}</span>
          </div>
          {devolucion.observaciones && (
            <div>
              <span className="info-label">Observaciones:</span>
              <span>{devolucion.observaciones}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ítems a inspeccionar */}
      <div className="section-header">
        <h2>Inspección de Productos</h2>
        <p>Evalúe cada producto y seleccione el destino correspondiente</p>
      </div>

      <div className="items-inspection">
        {items.map((item, index) => (
          <div key={item.itemId} className="inspection-card">
            <div className="inspection-header">
              <div className="product-info">
                <span className="product-number">#{index + 1}</span>
                <div>
                  <h4>{item.materialNombre || 'Material'}</h4>
                  <p className="product-code">{item.materialCodigo}</p>
                </div>
              </div>
              <div className="product-qty">
                <span className="qty-label">Cantidad:</span>
                <span className="qty-value">{item.cantidad}</span>
              </div>
            </div>

            <div className="inspection-motivo">
              <span className="motivo-label">Motivo de devolución:</span>
              <span>{item.motivo}</span>
              {item.observaciones && (
                <p className="motivo-obs">{item.observaciones}</p>
              )}
            </div>

            <div className="inspection-form">
              {/* Resultado de inspección */}
              <div className="form-group">
                <label>Resultado de Inspección *</label>
                <div className="radio-group">
                  {[
                    { value: 'APTO', label: 'Apto para reintegro', icon: '✅' },
                    { value: 'DAÑADO', label: 'Dañado (requiere reparación)', icon: '🔧' },
                    { value: 'NO_RECUPERABLE', label: 'No recuperable', icon: '❌' }
                  ].map(opcion => (
                    <label 
                      key={opcion.value} 
                      className={`radio-option ${item.resultado === opcion.value ? 'selected' : ''}`}
                      style={{ 
                        borderColor: item.resultado === opcion.value ? getResultadoColor(opcion.value) : undefined 
                      }}
                    >
                      <input
                        type="radio"
                        name={`resultado-${item.itemId}`}
                        value={opcion.value}
                        checked={item.resultado === opcion.value}
                        onChange={(e) => actualizarItem(item.itemId, 'resultado', e.target.value)}
                      />
                      <span className="radio-icon">{opcion.icon}</span>
                      <span>{opcion.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Destino */}
              <div className="form-group">
                <label>Destino *</label>
                <select
                  className="form-control"
                  value={item.destino}
                  onChange={(e) => actualizarItem(item.itemId, 'destino', e.target.value)}
                >
                  <option value="">Seleccione destino</option>
                  <option value={DestinoDevolucion.REINTEGRO}>✅ Reintegrar al inventario</option>
                  <option value={DestinoDevolucion.REPARACION}>🔧 Enviar a reparación</option>
                  <option value={DestinoDevolucion.ELIMINACION}>🗑️ Eliminar del inventario</option>
                </select>
              </div>

              {/* Observaciones de inspección */}
              <div className="form-group">
                <label>Observaciones de Inspección</label>
                <textarea
                  className="form-control"
                  value={item.observacionesInspeccion}
                  onChange={(e) => actualizarItem(item.itemId, 'observacionesInspeccion', e.target.value)}
                  rows={2}
                  placeholder="Detalles de la inspección..."
                />
              </div>

              {/* Resumen de destino */}
              {item.destino && (
                <div 
                  className="destino-preview"
                  style={{ backgroundColor: getDestinoInfo(item.destino).color + '20', borderColor: getDestinoInfo(item.destino).color }}
                >
                  <span className="destino-icon">{getDestinoInfo(item.destino).icon}</span>
                  <span>{getDestinoInfo(item.destino).text}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de acciones */}
      <div className="actions-summary-procesar">
        <h3>Resumen de Acciones</h3>
        <div className="summary-items">
          <div className="summary-item">
            <span className="summary-icon">✅</span>
            <span className="summary-count">
              {items.filter(i => i.destino === DestinoDevolucion.REINTEGRO).length}
            </span>
            <span>a reintegrar</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🔧</span>
            <span className="summary-count">
              {items.filter(i => i.destino === DestinoDevolucion.REPARACION).length}
            </span>
            <span>a reparación</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🗑️</span>
            <span className="summary-count">
              {items.filter(i => i.destino === DestinoDevolucion.ELIMINACION).length}
            </span>
            <span>a eliminar</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="form-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/garantias/pendientes')}
          disabled={procesando}
        >
          Cancelar
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleProcesar}
          disabled={procesando}
        >
          {procesando ? 'Procesando...' : 'Confirmar y Procesar'}
        </button>
      </div>
    </div>
  );
};

export default ProcesarDevolucionPage;

