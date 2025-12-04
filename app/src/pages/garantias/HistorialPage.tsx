import React, { useState, useEffect } from 'react';
import { garantiasAPI, HistorialMovimiento } from '../../api/garantias';
import { shouldUseMockData } from '../../config/environment';

const HistorialPage: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialMovimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, [page, filtroTipo, fechaDesde, fechaHasta]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await garantiasAPI.listarHistorial({
        page,
        limit: 20,
        tipo: filtroTipo || undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined
      });
      setHistorial(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('Error cargando historial:', err);
      // Datos mock solo si está habilitado
      if (!shouldUseMockData()) {
        setError(err.response?.data?.message || 'Error al cargar el historial');
        setLoading(false);
        return;
      }
      console.log('📦 Usando datos mock para historial');
      const mockHistorial: HistorialMovimiento[] = [
        { movimientoId: 'mov-001', devolucionId: 'dev-001', devolucionCodigo: 'DEV-2024-001', tipo: 'REGISTRO', descripcion: 'Devolución registrada en el sistema', usuario: 'admin', fecha: new Date().toISOString() },
        { movimientoId: 'mov-002', devolucionId: 'dev-001', devolucionCodigo: 'DEV-2024-001', itemId: 'item-001', materialId: 'mat-001', materialNombre: 'Laptop HP ProBook', tipo: 'INSPECCION', cantidad: 1, descripcion: 'Ítem inspeccionado - Resultado: DAÑADO', usuario: 'admin', fecha: new Date(Date.now() - 3600000).toISOString() },
        { movimientoId: 'mov-003', devolucionId: 'dev-001', devolucionCodigo: 'DEV-2024-001', itemId: 'item-001', materialId: 'mat-001', materialNombre: 'Laptop HP ProBook', tipo: 'REPARACION', cantidad: 1, descripcion: 'Producto enviado a reparación', usuario: 'admin', fecha: new Date(Date.now() - 3500000).toISOString() },
        { movimientoId: 'mov-004', devolucionId: 'dev-002', devolucionCodigo: 'DEV-2024-002', tipo: 'REGISTRO', descripcion: 'Devolución registrada en el sistema', usuario: 'admin', fecha: new Date(Date.now() - 86400000).toISOString() },
        { movimientoId: 'mov-005', devolucionId: 'dev-002', devolucionCodigo: 'DEV-2024-002', itemId: 'item-003', materialId: 'mat-003', materialNombre: 'Teclado Mecánico', tipo: 'INSPECCION', cantidad: 3, descripcion: 'Ítem inspeccionado - Resultado: APTO', usuario: 'admin', fecha: new Date(Date.now() - 82800000).toISOString() },
        { movimientoId: 'mov-006', devolucionId: 'dev-002', devolucionCodigo: 'DEV-2024-002', itemId: 'item-003', materialId: 'mat-003', materialNombre: 'Teclado Mecánico', tipo: 'REINTEGRO', cantidad: 3, descripcion: 'Producto reintegrado al stock', usuario: 'admin', fecha: new Date(Date.now() - 82700000).toISOString() },
        { movimientoId: 'mov-007', devolucionId: 'dev-002', devolucionCodigo: 'DEV-2024-002', tipo: 'COMPLETAR', descripcion: 'Devolución completada exitosamente', usuario: 'admin', fecha: new Date(Date.now() - 82600000).toISOString() },
      ];
      
      // Aplicar filtros mock
      let filtrado = mockHistorial;
      if (filtroTipo) {
        filtrado = filtrado.filter(m => m.tipo === filtroTipo);
      }
      
      setHistorial(filtrado);
      setTotalPages(1);
      setError(null);
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

  const getTipoInfo = (tipo: string) => {
    const tipos: Record<string, { icon: string; color: string; bg: string }> = {
      'REGISTRO': { icon: '📝', color: '#1e40af', bg: '#dbeafe' },
      'INSPECCION': { icon: '🔍', color: '#7c3aed', bg: '#ede9fe' },
      'REINTEGRO': { icon: '✅', color: '#065f46', bg: '#d1fae5' },
      'REPARACION': { icon: '🔧', color: '#92400e', bg: '#fef3c7' },
      'ELIMINACION': { icon: '🗑️', color: '#991b1b', bg: '#fee2e2' },
      'COMPLETAR': { icon: '✔️', color: '#166534', bg: '#dcfce7' }
    };
    return tipos[tipo] || { icon: '📋', color: '#374151', bg: '#f3f4f6' };
  };

  const limpiarFiltros = () => {
    setFiltroTipo('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Logs</h1>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Filtros */}
      <div className="filtros-panel">
        <div className="filtros-row">
          <div className="filtro-group">
            <label>Tipo de Movimiento</label>
            <select
              className="form-control"
              value={filtroTipo}
              onChange={(e) => { setFiltroTipo(e.target.value); setPage(0); }}
            >
              <option value="">Todos</option>
              <option value="REGISTRO">📝 Registro</option>
              <option value="INSPECCION">🔍 Inspección</option>
              <option value="REINTEGRO">✅ Reintegro</option>
              <option value="REPARACION">🔧 Reparación</option>
              <option value="ELIMINACION">🗑️ Eliminación</option>
              <option value="COMPLETAR">✔️ Completar</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              value={fechaDesde}
              onChange={(e) => { setFechaDesde(e.target.value); setPage(0); }}
            />
          </div>

          <div className="filtro-group">
            <label>Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              value={fechaHasta}
              onChange={(e) => { setFechaHasta(e.target.value); setPage(0); }}
            />
          </div>

          <div className="filtro-group filtro-actions">
            <button className="btn btn-secondary" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando historial...</div>
      ) : historial.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No hay movimientos registrados</h3>
          <p>El historial de acciones aparecerá aquí</p>
        </div>
      ) : (
        <>
          <div className="historial-timeline">
            {historial.map((mov) => {
              const tipoInfo = getTipoInfo(mov.tipo);
              return (
                <div key={mov.movimientoId} className="timeline-item">
                  <div 
                    className="timeline-icon"
                    style={{ backgroundColor: tipoInfo.bg, color: tipoInfo.color }}
                  >
                    {tipoInfo.icon}
                  </div>
                  
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span 
                        className="timeline-tipo"
                        style={{ backgroundColor: tipoInfo.bg, color: tipoInfo.color }}
                      >
                        {mov.tipo}
                      </span>
                      <span className="timeline-fecha">{formatearFecha(mov.fecha)}</span>
                    </div>
                    
                    <p className="timeline-descripcion">{mov.descripcion}</p>
                    
                    <div className="timeline-meta">
                      {mov.devolucionCodigo && (
                        <span className="meta-item">
                          <span className="meta-label">Devolución:</span>
                          {mov.devolucionCodigo}
                        </span>
                      )}
                      {mov.materialNombre && (
                        <span className="meta-item">
                          <span className="meta-label">Material:</span>
                          {mov.materialNombre}
                        </span>
                      )}
                      {mov.cantidad && (
                        <span className="meta-item">
                          <span className="meta-label">Cantidad:</span>
                          {mov.cantidad}
                        </span>
                      )}
                      <span className="meta-item">
                        <span className="meta-label">Usuario:</span>
                        {mov.usuario}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default HistorialPage;

