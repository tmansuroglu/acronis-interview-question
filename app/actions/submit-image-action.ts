'use server';

import { ALLOWED_EXTENSIONS, IMAGE_INPUT_NAME } from '@/lib/constants';
import fs from 'fs';
import {
  createUploadsDirIfMissing,
  generateFilename,
  getFileExtension,
  getImagePath,
} from '@/lib/api-utils';
import { validateImageFile } from '@/lib/common-utils';

type ResponseType =
  | {
      error: string;
      success: boolean;
      imagePath?: undefined;
    }
  | {
      success: boolean;
      imagePath: string;
      error?: undefined;
    };

export async function submitImageAction(
  prevState: ResponseType,
  formData: FormData
): Promise<ResponseType> {
  try {
    const file = formData.get(IMAGE_INPUT_NAME) as File;

    const imageValidationError = validateImageFile(file);

    if (imageValidationError) {
      return imageValidationError;
    }

    const fileExtension = getFileExtension(file);

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return { error: 'Invalid file type.', success: false };
    }

    createUploadsDirIfMissing();

    const filename = generateFilename(fileExtension);

    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file to the directory
    fs.writeFileSync(getImagePath(filename), buffer);

    return {
      success: true,
      //  the API endpoint to serve the image dynamically
      imagePath: `/api/images/${filename}`,
    };
  } catch (error) {
    console.error('Error uploading image:', error);

    return { error: 'Failed to upload image.', success: false };
  }
}
