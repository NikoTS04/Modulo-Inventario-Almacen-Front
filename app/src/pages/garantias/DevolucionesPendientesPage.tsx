import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { garantiasAPI, Devolucion, EstadoDevolucion } from '../../api/garantias';
import { shouldUseMockData } from '../../config/environment';

const DevolucionesPendientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    cargarDevoluciones();
  }, [page]);

  const cargarDevoluciones = async () => {
    try {
      setLoading(true);
      const response = await garantiasAPI.listarDevoluciones({
        page,
        limit: 10,
        estado: EstadoDevolucion.RECIBIDO
      });
      setDevoluciones(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('Error cargando devoluciones:', err);
      // Datos mock solo si está habilitado
      if (shouldUseMockData()) {
        console.log('📦 Usando datos mock para devoluciones pendientes');
        setDevoluciones([
          {
            devolucionId: 'dev-001',
            codigo: 'DEV-2024-001',
            fechaRegistro: new Date().toISOString(),
            estado: EstadoDevolucion.RECIBIDO,
            clienteNombre: 'Juan Pérez',
            clienteDocumento: '12345678',
            motivoGeneral: 'Producto defectuoso',
            items: [
              { itemId: 'item-001', materialId: 'mat-001', materialCodigo: 'LAPTOP-001', materialNombre: 'Laptop HP ProBook', cantidad: 1, motivo: 'No enciende', estado: 'PENDIENTE' as any },
              { itemId: 'item-002', materialId: 'mat-002', materialCodigo: 'MONITOR-001', materialNombre: 'Monitor Dell 24"', cantidad: 2, motivo: 'Pantalla dañada', estado: 'PENDIENTE' as any }
            ]
          },
          {
            devolucionId: 'dev-002',
            codigo: 'DEV-2024-002',
            fechaRegistro: new Date(Date.now() - 86400000).toISOString(),
            estado: EstadoDevolucion.RECIBIDO,
            clienteNombre: 'María García',
            motivoGeneral: 'Error en pedido',
            items: [
              { itemId: 'item-003', materialId: 'mat-003', materialCodigo: 'TECLADO-001', materialNombre: 'Teclado Mecánico', cantidad: 3, motivo: 'Producto equivocado', estado: 'PENDIENTE' as any }
            ]
          }
        ]);
        setTotalPages(1);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Error al cargar devoluciones');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: EstadoDevolucion) => {
    const estilos: Record<EstadoDevolucion, { bg: string; text: string }> = {
      [EstadoDevolucion.RECIBIDO]: { bg: '#fef3c7', text: '#92400e' },
      [EstadoDevolucion.EN_REVISION]: { bg: '#dbeafe', text: '#1e40af' },
      [EstadoDevolucion.PENDIENTE_DECISION]: { bg: '#fce7f3', text: '#9d174d' },
      [EstadoDevolucion.EN_REPARACION]: { bg: '#fed7aa', text: '#c2410c' },
      [EstadoDevolucion.COMPLETADO]: { bg: '#d1fae5', text: '#065f46' },
      [EstadoDevolucion.CANCELADO]: { bg: '#f3f4f6', text: '#374151' }
    };

    const estilo = estilos[estado];
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: estilo.bg, color: estilo.text }}
      >
        {estado}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Cargando devoluciones pendientes...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Devoluciones Pendientes</h1>
        <Link to="/garantias/devoluciones">
          <button className="btn btn-primary">+ Nueva Devolución</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {devoluciones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay devoluciones pendientes</h3>
          <p>Todas las devoluciones han sido procesadas</p>
          <Link to="/garantias/devoluciones">
            <button className="btn btn-primary">Registrar Nueva Devolución</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="cards-grid">
            {devoluciones.map(devolucion => (
              <div key={devolucion.devolucionId} className="devolucion-card">
                <div className="devolucion-header">
                  <span className="devolucion-codigo">{devolucion.codigo}</span>
                  {getEstadoBadge(devolucion.estado)}
                </div>
                
                <div className="devolucion-body">
                  <div className="devolucion-info">
                    <span className="info-label">Fecha:</span>
                    <span>{formatearFecha(devolucion.fechaRegistro)}</span>
                  </div>
                  
                  {devolucion.clienteNombre && (
                    <div className="devolucion-info">
                      <span className="info-label">Cliente:</span>
                      <span>{devolucion.clienteNombre}</span>
                    </div>
                  )}
                  
                  <div className="devolucion-info">
                    <span className="info-label">Motivo:</span>
                    <span>{devolucion.motivoGeneral}</span>
                  </div>
                  
                  <div className="devolucion-info">
                    <span className="info-label">Ítems:</span>
                    <span>{devolucion.items.length} producto(s)</span>
                  </div>
                </div>

                <div className="devolucion-items-preview">
                  {devolucion.items.slice(0, 2).map(item => (
                    <div key={item.itemId} className="item-preview">
                      <span className="item-name">{item.materialNombre || item.materialCodigo}</span>
                      <span className="item-qty">x{item.cantidad}</span>
                    </div>
                  ))}
                  {devolucion.items.length > 2 && (
                    <div className="item-more">+{devolucion.items.length - 2} más</div>
                  )}
                </div>

                <div className="devolucion-actions">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => navigate(`/garantias/procesar/${devolucion.devolucionId}`)}
                  >
                    Procesar Devolución
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {page + 1} de {totalPages}
              </span>
              <button
                className="btn"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DevolucionesPendientesPage;

