import React, { useState, useEffect } from 'react';
import { garantiasAPI, Devolucion, EstadoDevolucion } from '../../api/garantias';
import { shouldUseMockData } from '../../config/environment';

const EnReparacionPage: React.FC = () => {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoItem, setProcesandoItem] = useState<string | null>(null);

  useEffect(() => {
    cargarReparaciones();
  }, []);

  const cargarReparaciones = async () => {
    try {
      setLoading(true);
      const response = await garantiasAPI.listarEnReparacion({ limit: 50 });
      setDevoluciones(response.items);
    } catch (err: any) {
      console.error('Error cargando reparaciones:', err);
      // Datos mock solo si está habilitado
      if (shouldUseMockData()) {
        console.log('📦 Usando datos mock para reparaciones');
        setDevoluciones([
          {
            devolucionId: 'dev-003',
            codigo: 'DEV-2024-003',
            fechaRegistro: new Date(Date.now() - 172800000).toISOString(),
            estado: EstadoDevolucion.EN_REPARACION,
            clienteNombre: 'Carlos López',
            motivoGeneral: 'Garantía por defecto',
            items: [
              { itemId: 'item-004', materialId: 'mat-004', materialCodigo: 'MOUSE-001', materialNombre: 'Mouse Inalámbrico', cantidad: 2, motivo: 'Botón izquierdo no funciona', estado: 'EN_REPARACION' as any, resultadoInspeccion: 'Daño en el switch interno' }
            ]
          },
          {
            devolucionId: 'dev-004',
            codigo: 'DEV-2024-004',
            fechaRegistro: new Date(Date.now() - 259200000).toISOString(),
            estado: EstadoDevolucion.EN_REPARACION,
            clienteNombre: 'Ana Martínez',
            motivoGeneral: 'Producto dañado',
            items: [
              { itemId: 'item-005', materialId: 'mat-006', materialCodigo: 'AURICULAR-001', materialNombre: 'Auriculares Bluetooth', cantidad: 1, motivo: 'No carga la batería', estado: 'EN_REPARACION' as any, resultadoInspeccion: 'Puerto de carga dañado' }
            ]
          }
        ]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Error al cargar productos en reparación');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompletarReparacion = async (
    devolucionId: string, 
    itemId: string, 
    resultado: 'REINTEGRAR' | 'ELIMINAR'
  ) => {
    setProcesandoItem(itemId);
    try {
      await garantiasAPI.completarReparacion(devolucionId, itemId, resultado);
      await cargarReparaciones();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al completar la reparación');
    } finally {
      setProcesandoItem(null);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Extraer todos los items en reparación de todas las devoluciones
  const itemsEnReparacion = devoluciones.flatMap(dev => 
    dev.items
      .filter(item => item.estado === 'EN_REPARACION')
      .map(item => ({
        ...item,
        devolucionId: dev.devolucionId,
        devolucionCodigo: dev.codigo,
        fechaDevolucion: dev.fechaRegistro
      }))
  );

  if (loading) {
    return <div className="loading">Cargando productos en reparación...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Productos en Reparación</h1>
        <div className="header-stats">
          <span className="stat-badge">
            🔧 {itemsEnReparacion.length} producto(s) en reparación
          </span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {itemsEnReparacion.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>No hay productos en reparación</h3>
          <p>Los productos enviados a reparación aparecerán aquí</p>
        </div>
      ) : (
        <div className="reparacion-list">
          {itemsEnReparacion.map(item => (
            <div key={item.itemId} className="reparacion-card">
              <div className="reparacion-header">
                <div className="reparacion-producto">
                  <h4>{item.materialNombre || 'Material'}</h4>
                  <p className="producto-codigo">{item.materialCodigo}</p>
                </div>
                <div className="reparacion-cantidad">
                  <span className="cantidad-label">Cantidad</span>
                  <span className="cantidad-value">{item.cantidad}</span>
                </div>
              </div>

              <div className="reparacion-info">
                <div className="info-row">
                  <span className="info-label">Devolución:</span>
                  <span className="info-value">{item.devolucionCodigo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha:</span>
                  <span className="info-value">{formatearFecha(item.fechaDevolucion)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Motivo:</span>
                  <span className="info-value">{item.motivo}</span>
                </div>
                {item.resultadoInspeccion && (
                  <div className="info-row">
                    <span className="info-label">Inspección:</span>
                    <span className="info-value">{item.resultadoInspeccion}</span>
                  </div>
                )}
              </div>

              <div className="reparacion-estado">
                <span className="estado-badge en-reparacion">
                  🔧 En Reparación
                </span>
              </div>

              <div className="reparacion-actions">
                <p className="actions-label">¿Reparación completada?</p>
                <div className="actions-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => handleCompletarReparacion(item.devolucionId, item.itemId, 'REINTEGRAR')}
                    disabled={procesandoItem === item.itemId}
                  >
                    ✅ Reintegrar al Stock
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCompletarReparacion(item.devolucionId, item.itemId, 'ELIMINAR')}
                    disabled={procesandoItem === item.itemId}
                  >
                    🗑️ No se pudo reparar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnReparacionPage;

