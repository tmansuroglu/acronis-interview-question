'use client';

import { useActionState } from 'react';
import { submitImageAction } from './actions/submit-image-action';
import Image from 'next/image';
import { IMAGE_INPUT_NAME } from '@/lib/constants';

export default function Home() {
  const [state, formAction, isPending] = useActionState(submitImageAction, {
    success: false,
    imagePath: '',
  });

  return (
    <div className='max-w-md mx-auto p-4'>
      {/* Image uploader */}
      <div className='p-4 border rounded'>
        <h2 className='text-xl font-semibold mb-3'>Upload Image</h2>
        <form action={formAction} className='space-y-4'>
          <div>
            <label htmlFor='image' className='block mb-1'>
              Select Image
            </label>
            <input
              id='image'
              type='file'
              accept='image/*'
              className='w-full p-2 border rounded'
              required
              name={IMAGE_INPUT_NAME}
            />
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50'
          >
            {isPending ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
        {state.imagePath && (
          <div className='mt-4 p-3 bg-green-100 rounded'>
            <p>Image uploaded successfully!</p>
            <div className='mt-2'>
              <Image
                src={state.imagePath}
                alt='Uploaded image'
                className='max-h-60 rounded'
                width={100}
                height={100}
              />
            </div>
            <a
              href={state.imagePath}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline block mt-2'
            >
              View Full Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
