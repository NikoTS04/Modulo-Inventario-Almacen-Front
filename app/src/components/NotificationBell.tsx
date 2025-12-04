import React, { useState, useEffect } from 'react';
import { logger, LogCategory } from '../utils/logger';

export interface Notification {
  id: string;
  materialId: string;
  materialCodigo: string;
  materialNombre: string;
  stockActual: number;
  puntoReorden: number;
  stockMinimo: number;
  timestamp: Date;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(checkReorderAlerts, 30000);
    checkReorderAlerts();
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('reorder_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
        const unread = parsed.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      logger.error(LogCategory.ERROR, 'Error loading notifications', error);
    }
  };

  const saveNotifications = (notifs: Notification[]) => {
    try {
      localStorage.setItem('reorder_notifications', JSON.stringify(notifs));
    } catch (error) {
      logger.error(LogCategory.ERROR, 'Error saving notifications', error);
    }
  };

  const checkReorderAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/materials?activo=true');
      if (!response.ok) return;
      
      const data = await response.json();
      const materials = data.items || [];
      
      const newNotifications: Notification[] = [];
      
      materials.forEach((material: any) => {
        if (material.reordenConfig && material.inventario) {
          const stockActual = material.inventario.cantidadDisponible || 0;
          const puntoReorden = material.reordenConfig.puntoReorden || 0;
          
          if (stockActual <= puntoReorden) {
            const notifId = `reorder-${material.materialId}`;
            const exists = notifications.find(n => n.id === notifId);
            
            if (!exists) {
              newNotifications.push({
                id: notifId,
                materialId: material.materialId,
                materialCodigo: material.codigo,
                materialNombre: material.nombre,
                stockActual: stockActual,
                puntoReorden: puntoReorden,
                stockMinimo: material.reordenConfig.stockMinimo || 0,
                timestamp: new Date(),
                read: false
              });
            }
          }
        }
      });
      
      if (newNotifications.length > 0) {
        const updated = [...newNotifications, ...notifications];
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
        saveNotifications(updated);
        logger.info(LogCategory.UI, `${newNotifications.length} nuevas alertas de reorden detectadas`);
      }
    } catch (error) {
      logger.error(LogCategory.API, 'Error checking reorder alerts', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    saveNotifications(updated);
  };

  const clearNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    saveNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('reorder_notifications');
  };

  const getAlertLevel = (notification: Notification): 'critical' | 'warning' => {
    if (notification.stockActual <= notification.stockMinimo) {
      return 'critical';
    }
    return 'warning';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '8px 12px',
          backgroundColor: unreadCount > 0 ? '#fff3cd' : '#f8f9fa',
          border: unreadCount > 0 ? '2px solid #ffc107' : '1px solid #dee2e6',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '20px',
          transition: 'all 0.3s ease'
        }}
        title="Alertas de reorden"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '45px',
            right: '0',
            width: '400px',
            maxHeight: '500px',
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '15px',
              borderBottom: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f9fa'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              ⚠️ Alertas de Reorden
            </h3>
            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={markAllAsRead} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Marcar todo</button>
                <button onClick={clearAll} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Limpiar</button>
              </div>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6c757d' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <p style={{ margin: 0 }}>No hay alertas de reorden</p>
              </div>
            ) : (
              notifications.map(notification => {
                const alertLevel = getAlertLevel(notification);
                const bgColor = notification.read ? '#f8f9fa' : alertLevel === 'critical' ? '#f8d7da' : '#fff3cd';
                const borderColor = alertLevel === 'critical' ? '#dc3545' : '#ffc107';

                return (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #dee2e6',
                      backgroundColor: bgColor,
                      borderLeft: `4px solid ${borderColor}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                          {alertLevel === 'critical' ? '🔴' : '⚠️'} {notification.materialNombre}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          Código: {notification.materialCodigo}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearNotification(notification.id); }}
                        style={{ padding: '2px 6px', fontSize: '12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6c757d' }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <div><strong>Stock actual:</strong> <span style={{ color: alertLevel === 'critical' ? '#dc3545' : '#ffc107', fontWeight: 'bold' }}>{notification.stockActual}</span></div>
                      <div><strong>Punto reorden:</strong> {notification.puntoReorden}</div>
                      <div><strong>Stock mínimo:</strong> {notification.stockMinimo}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '6px' }}>
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
