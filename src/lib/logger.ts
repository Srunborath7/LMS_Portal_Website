type Level = 'info' | 'warn' | 'error';

function log(level: Level, message: string, context?: object): void {
  if (process.env.NODE_ENV === 'production') {
    // TODO: replace with Sentry or Datadog when available
    // Sentry.captureMessage(message, { level, extra: context });
    return;
  }
  const prefix = `[${level.toUpperCase()}]`;
  if (context) {
    console[level](prefix, message, context);
  } else {
    console[level](prefix, message);
  }
}

export const logger = {
  info:  (message: string, context?: object) => log('info',  message, context),
  warn:  (message: string, context?: object) => log('warn',  message, context),
  error: (message: string, context?: object) => log('error', message, context),
};
