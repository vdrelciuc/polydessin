import * as dotenv from 'dotenv';

dotenv.config();

// Databse
export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const DATABASE_NAME: string = process.env.DATABASE_NAME as string;
export const DATABASE_COLLECTION: string = process.env.DATABASE_COLLECTION as string;

// Image
export const SVG_SERIAL_SIGNATURE = 'data:image/svg+xml;';
export const SVG_HTML_TAG = '<defs';
export const MAX_TAGS_ALLOWED = 5;

// Mail API
export const MAIL_API_KEY: string = process.env.MAIL_API_KEY as string;
export const API_URL = 'https://log2990.step.polymtl.ca/email';
