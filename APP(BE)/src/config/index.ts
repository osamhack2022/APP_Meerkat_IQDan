import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, HTTP_PORT, HTTPS_PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, SSL_URL, KEY_NAME, SSL_NAME, CHAIN_NAME } = process.env;