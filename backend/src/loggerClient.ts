// backend/src/loggerClient.ts
import { Log } from '../../logging-middleware/src/index';

// Auth configuration for logging
const AUTH_CONFIG = {
  authUrl: 'http://20.244.56.144/evaluation-service/auth',
  authBody: {
    "email": "22l31a5478@gmail.com",
    "name": "polamreddy chiranjeevi reddy",
    "rollNo": "22l31a5478",
    "accessCode": "YzuJeU",
    "clientID": "dfdbb650-ab55-43d6-a7a0-f54f446c1c5d",
    "clientSecret": "ZPFYtetxJqQTmSPk"
  }
};

export async function logInfo(pkg: string, message: string, meta?: Record<string, any>) {
  await Log('backend', 'info', pkg, message, meta, AUTH_CONFIG);
}

export async function logError(pkg: string, message: string, meta?: Record<string, any>) {
  await Log('backend', 'error', pkg, message, meta, AUTH_CONFIG);
}

export async function logWarn(pkg: string, message: string, meta?: Record<string, any>) {
  await Log('backend', 'warn', pkg, message, meta, AUTH_CONFIG);
}

export async function logDebug(pkg: string, message: string, meta?: Record<string, any>) {
  await Log('backend', 'debug', pkg, message, meta, AUTH_CONFIG);
}
