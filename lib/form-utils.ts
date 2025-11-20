import { FormEventHandler } from 'react';
import { IMAGE_INPUT_NAME } from './constants';
import { validateImageFile } from './common-utils';

export const handleImageFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  const formData = new FormData(e.currentTarget);
  const file = formData.get(IMAGE_INPUT_NAME) as File;

  const imageValidationError = validateImageFile(file);

  if (imageValidationError?.error) {
    alert(imageValidationError.error);
    e.preventDefault();
  }
};
