import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { EXT_TO_MIME } from './constants';

const uploadsDir =
  process.env.NODE_ENV === 'development'
    ? path.join(process.cwd(), 'public', 'uploads')
    : path.join(process.cwd(), 'uploads');

export function getImagePath(filename: string) {
  return path.join(uploadsDir, filename);
}

export function createUploadsDirIfMissing() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const MIME_TO_EXT = Object.fromEntries(
  Object.entries(EXT_TO_MIME).map(([ext, mime]) => [mime, ext])
);

export const getContentType = (ext: string) =>
  EXT_TO_MIME[ext.toLowerCase()] || 'application/octet-stream';

export const getFileExtension = (file: File) => {
  return path.extname(file.name) || MIME_TO_EXT[file.type];
};

export const generateFilename = (ext: string) => {
  return `${randomUUID()}${ext.toLowerCase()}`;
};

export const imageExists = (filename: string) =>
  fs.existsSync(getImagePath(filename));
