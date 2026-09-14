/**
 * Sistema de logging seguro para produção
 * Remove logs sensíveis e controla níveis de log por ambiente
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  sanitize: boolean;
}

class Logger {
  private config: LogConfig;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    this.config = {
      level: isProduction ? 'warn' : 'debug',
      enableConsole: !isProduction,
      enableFile: true,
      sanitize: isProduction
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const logLevelIndex = levels.indexOf(level);
    
    return logLevelIndex >= currentLevelIndex;
  }

  private sanitizeData(data: unknown): unknown {
    if (!this.config.sanitize) return data;
    
    if (typeof data === 'string') {
      // Remove possíveis tokens, senhas, etc.
      return data.replace(/token[s]?\s*[:=]\s*[^\s,}]+/gi, 'token: [REDACTED]')
                 .replace(/password[s]?\s*[:=]\s*[^\s,}]+/gi, 'password: [REDACTED]')
                 .replace(/senha[s]?\s*[:=]\s*[^\s,}]+/gi, 'senha: [REDACTED]')
                 .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED]');
    }
    
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      const sanitized: Record<string, unknown> = {
        ...(data as Record<string, unknown>),
      };

      // Remover campos sensíveis
      const sensitiveFields = ['token', 'password', 'senha', 'authorization', 'cookie', 'secret'];

      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      }

      return sanitized;
    }
    
    return data;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const sanitizedData = data ? this.sanitizeData(data) : '';
    const dataStr = sanitizedData ? ` | ${JSON.stringify(sanitizedData)}` : '';
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
  }

  debug(message: string, data?: unknown): void {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message, data);
    
    if (this.config.enableConsole) {
      console.log(formattedMessage);
    }
  }

  info(message: string, data?: unknown): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message, data);
    
    if (this.config.enableConsole) {
      console.info(formattedMessage);
    }
  }

  warn(message: string, data?: unknown): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message, data);
    
    if (this.config.enableConsole) {
      console.warn(formattedMessage);
    }
  }

  error(message: string, data?: unknown): void {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message, data);
    
    if (this.config.enableConsole) {
      console.error(formattedMessage);
    }
  }

  // Método especial para desenvolvimento - removido em produção
  devLog(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'production') return;
    
    console.log(`🔧 [DEV] ${message}`, data);
  }
}

// Instância singleton do logger
export const logger = new Logger();

// Para compatibilidade com código existente
export const devLog = logger.devLog.bind(logger);
