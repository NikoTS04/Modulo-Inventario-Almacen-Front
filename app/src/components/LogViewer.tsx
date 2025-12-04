import React, { useState, useEffect } from 'react';
import { logger, LogLevel, LogCategory, LogEntry } from '../utils/logger';

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<LogCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 2000); // Auto-refresh cada 2 segundos
    return () => clearInterval(interval);
  }, []);

  const loadLogs = () => {
    setLogs(logger.getLogs());
  };

  const filteredLogs = logs.filter(log => {
    const levelMatch = filterLevel === 'ALL' || log.level === filterLevel;
    const categoryMatch = filterCategory === 'ALL' || log.category === filterCategory;
    const searchMatch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.data).toLowerCase().includes(searchQuery.toLowerCase());
    
    return levelMatch && categoryMatch && searchMatch;
  }).reverse(); // Más recientes primero

  const stats = logger.getStats();

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return '#6c757d';
      case LogLevel.INFO: return '#0dcaf0';
      case LogLevel.WARN: return '#ffc107';
      case LogLevel.ERROR: return '#dc3545';
      default: return '#000';
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los logs?')) {
      logger.clearLogs();
      loadLogs();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📊 Visor de Logs del Sistema</h2>
        <div>
          <button 
            onClick={() => logger.downloadLogs()}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: '#0d6efd',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📥 Descargar Logs
          </button>
          <button 
            onClick={handleClearLogs}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Limpiar Logs
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Total</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#e7f5ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0dcaf0' }}>{stats.byLevel.INFO}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>INFO</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{stats.byLevel.WARN}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>WARN</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{stats.byLevel.ERROR}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>ERROR</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Nivel
          </label>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ced4da' }}
          >
            <option value="ALL">Todos</option>
            {Object.values(LogLevel).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Categoría
          </label>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as LogCategory | 'ALL')}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ced4da' }}
          >
            <option value="ALL">Todas</option>
            {Object.values(LogCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Buscar
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en logs..."
            style={{ 
              width: '100%', 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          />
        </div>
      </div>

      {/* Lista de Logs */}
      <div style={{ 
        backgroundColor: '#000', 
        color: '#0f0', 
        padding: '15px', 
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d' }}>
            No hay logs que mostrar
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '8px', 
                padding: '8px',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                borderLeft: `4px solid ${getLevelColor(log.level)}`
              }}
            >
              <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                <span style={{ color: '#888' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ 
                  color: getLevelColor(log.level), 
                  fontWeight: 'bold',
                  minWidth: '50px'
                }}>
                  {log.level}
                </span>
                <span style={{ color: '#0dcaf0' }}>
                  [{log.category}]
                </span>
                {log.requestId && (
                  <span style={{ color: '#6c757d', fontSize: '10px' }}>
                    {log.requestId}
                  </span>
                )}
              </div>
              <div style={{ color: '#fff', marginLeft: '20px' }}>
                {log.message}
              </div>
              {log.data && (
                <details style={{ marginLeft: '20px', marginTop: '4px' }}>
                  <summary style={{ cursor: 'pointer', color: '#ffc107' }}>
                    Ver datos
                  </summary>
                  <pre style={{ 
                    marginTop: '4px', 
                    color: '#0f0', 
                    fontSize: '11px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '12px', color: '#6c757d' }}>
        Mostrando {filteredLogs.length} de {logs.length} logs
      </div>
    </div>
  );
};

export default LogViewer;
