/* eslint-disable no-console */

const isProd = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const log = (level: LogLevel, message: string, ...extra: any[]) => {
  if (isProd && level !== 'error' && level !== 'warn') return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'info':
      console.info(prefix, message, ...extra);
      break;
    case 'warn':
      console.warn(prefix, message, ...extra);
      break;
    case 'error':
      console.error(prefix, message, ...extra);
      break;
    case 'debug':
      console.debug(prefix, message, ...extra);
      break;
  }
};

export const logger = {
  info: (message: string, ...extra: any[]) => log('info', message, ...extra),
  warn: (message: string, ...extra: any[]) => log('warn', message, ...extra),
  error: (message: string, ...extra: any[]) => log('error', message, ...extra),
  debug: (message: string, ...extra: any[]) => log('debug', message, ...extra),
};

export default logger;
