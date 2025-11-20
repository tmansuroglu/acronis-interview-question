import { MAX_FILE_SIZE_IN_BYTES, MAX_MEGABYTE } from './constants';

export const validateImageFile = (file: File | null) => {
  if (!file || !(file instanceof File)) {
    return { error: 'No image uploaded.', success: false };
  }

  if (file.size > MAX_FILE_SIZE_IN_BYTES) {
    return {
      error: `File too large. Maximum size is ${MAX_MEGABYTE} MB.`,
      success: false,
    };
  }
};
