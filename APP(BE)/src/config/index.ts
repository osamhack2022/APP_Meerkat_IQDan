import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, HTTP_PORT, HTTPS_PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, KEY_URL, SSL_NAME } = process.env;