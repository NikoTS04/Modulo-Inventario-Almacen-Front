/**
 * Sistema de logging estructurado para el frontend
 * Proporciona niveles de log, categorías y almacenamiento persistente
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export enum LogCategory {
  API = 'API',
  HTTP = 'HTTP',
  AUTH = 'AUTH',
  NAVIGATION = 'NAVIGATION',
  UI = 'UI',
  STATE = 'STATE',
  DATABASE = 'DATABASE',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  requestId?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly storageKey = 'app_logs';

  private constructor() {
    this.loadLogsFromStorage();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private loadLogsFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading logs from storage:', error);
    }
  }

  private saveLogsToStorage(): void {
    try {
      // Mantener solo los últimos maxLogs registros
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs to storage:', error);
    }
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: any, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      requestId
    };

    this.logs.push(entry);
    this.saveLogsToStorage();

    // También logear a console para debugging
    const consoleMessage = `[${level}][${category}] ${message}`;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(consoleMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(consoleMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(consoleMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(consoleMessage, data || '');
        break;
    }
  }

  public debug(category: LogCategory, message: string, data?: any, requestId?: string): void {
    this.log(LogLevel.DEBUG, category, message, data, requestId);
  }

  public info(category: LogCategory, message: string, data?: any, requestId?: string): void {
    this.log(LogLevel.INFO, category, message, data, requestId);
  }

  public warn(category: LogCategory, message: string, data?: any, requestId?: string): void {
    this.log(LogLevel.WARN, category, message, data, requestId);
  }

  public error(category: LogCategory, message: string, data?: any, requestId?: string): void {
    this.log(LogLevel.ERROR, category, message, data, requestId);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  public getLogsByCategory(category: LogCategory): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  public clearLogs(): void {
    this.logs = [];
    sessionStorage.removeItem(this.storageKey);
    console.info('[Logger] Logs cleared');
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public downloadLogs(): void {
    const dataStr = this.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.info(LogCategory.UI, 'Logs downloaded successfully');
  }

  public getStats(): {
    total: number;
    byLevel: Record<LogLevel, number>;
    byCategory: Record<LogCategory, number>;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0
      },
      byCategory: {
        [LogCategory.API]: 0,
        [LogCategory.HTTP]: 0,
        [LogCategory.AUTH]: 0,
        [LogCategory.NAVIGATION]: 0,
        [LogCategory.UI]: 0,
        [LogCategory.STATE]: 0,
        [LogCategory.DATABASE]: 0,
        [LogCategory.PERFORMANCE]: 0,
        [LogCategory.ERROR]: 0
      }
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level]++;
      stats.byCategory[log.category]++;
    });

    return stats;
  }
}

// Exportar instancia singleton
export const logger = Logger.getInstance();

// Exportar funciones de conveniencia
export const logDebug = (category: LogCategory, message: string, data?: any, requestId?: string) => 
  logger.debug(category, message, data, requestId);

export const logInfo = (category: LogCategory, message: string, data?: any, requestId?: string) => 
  logger.info(category, message, data, requestId);

export const logWarn = (category: LogCategory, message: string, data?: any, requestId?: string) => 
  logger.warn(category, message, data, requestId);

export const logError = (category: LogCategory, message: string, data?: any, requestId?: string) => 
  logger.error(category, message, data, requestId);
