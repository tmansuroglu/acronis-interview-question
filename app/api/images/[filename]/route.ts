import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getContentType, getImagePath, imageExists } from '@/lib/image-utils';
import { IMAGE_CACHE_HEADERS } from '@/lib/constants';
import { Status } from '@/lib/enums';

type Params = { params: Promise<{ filename: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { filename } = await params;

    if (!imageExists(filename)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: Status.NotFound }
      );
    }

    const fileBuffer = fs.readFileSync(getImagePath(filename));

    const fileExtension = path.extname(filename).toLowerCase();

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(fileExtension),
        ...IMAGE_CACHE_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: Status.InternalServerError }
    );
  }
}
