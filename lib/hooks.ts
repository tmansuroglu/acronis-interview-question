'use client';

import { ChangeEvent, useState } from 'react';

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImagePreviewChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("Can't find image to preview");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return { imagePreview, handleImagePreviewChange };
};
