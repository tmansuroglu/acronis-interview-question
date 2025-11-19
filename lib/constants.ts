const ONE_MEGABYTE = 1024 * 1024;

export const MAX_MEGABYTE = 15;

export const MAX_FILE_SIZE_IN_BYTES = MAX_MEGABYTE * ONE_MEGABYTE;

export const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
];

type Ext = (typeof ALLOWED_EXTENSIONS)[number];

export const EXT_TO_MIME: Record<Ext, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export const IMAGE_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
};

export const IMAGE_INPUT_NAME = 'image';
