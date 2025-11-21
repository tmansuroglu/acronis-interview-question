# STEP 1: THINK

## Why the preview works?

- It is just a client side state. Unrelated to upload bug.

## Is there a difference in the current working directory or path of docker container?

- No, image url in dev and prod are the same.

## Are there any early return related errors?

- No.

## Is this something I have ever encountered before?

- No.

# STEP 2: RESEARCH

- I read some articles and talked with AI. Now everything makes sense.
- When you run `npm run dev`, the public folder is watched for changes by nextjs.
- When you run a production build, the public folder is not watched for changes. It is cached at the build time.
- `Dockerfile` content shows that `docker-compose up`command runs a production build. So, the problem occurs.

### Question: By default, is there any folder served dynamically by nextjs?

- No.

# STEP 3: FIND SOLUTIONS

## Solution 1

- Create an api endpoint to return image file from public folder. Example: `app/api/images/[filename]/route.ts`
- Make the already existing api endpoint (now server action) return get request url. Example: `imagePath: '/api/images/blabla.png'`
- `imagePath` is used as src attribute of the preview image element. When an image is uploaded a request will be sent to `app/api/images/[filename]/route.ts` by the image element and correct image will be displayed.

## Solution 2

- Using a real storage backend(AWS) or your own db.

# STEP 4: PICK A SOLUTION

- Solution 2 is against the purpose of this exercise. Also an overkill for this project.
- Solution 1 is the winner.

# STEP 5: IMPLEMENTATION

- Replaced the existing api route with a server action.

  - Deleted `app/api/upload-image/route.ts`
  - Created `app/actions/submit-image-action.ts`
  - Used `useActionState` in `page.tsx`

- Moved the uploaded files outside of the `/public` folder in production

  - Updated the Docker volume configuration (`docker-compose.yml`) so uploads are now stored at `/app/uploads` instead of `/app/public/uploads`.
  - For persistence, switched from a bind mount to a named volume. (`docker-compose.yml`)
  - Updated `Dockerfile` to create `/app/uploads` at build time
  - Modified `lib/image-utils.ts` to write to `/app/uploads` in production and keep `/public/uploads` only for local dev.

- Created utilities

  - `lib/constants.ts`: `ONE_MEGABYTE_IN_BYTES`, `MAX_MEGABYTE`, `MAX_FILE_SIZE_IN_BYTES`, `ALLOWED_EXTENSIONS`, `EXT_TO_MIME`, `IMAGE_CACHE_HEADERS`, `IMAGE_INPUT_NAME`
  - `lib/enums.ts`: `Status`
  - `lib/common-utils.ts`: `validateImageFile`
  - `lib/form-utils.ts`: `handleImageFormSubmit`
  - `lib/api-utils.ts`: `uploadsDir`, `getImagePath`, `createUploadsDirIfMissing`, `MIME_TO_EXT`, `getContentType`, `getFileExtension`, `generateFilename`, `doesImageExist`
  - `lib/hooks.ts`: `useImagePreview`,

- Implemented a better file name generation.

  - With `generateFilename` function (located in`lib/image-utils'`) implemented `crypto.randomUUID()` as the file name.

- Created image serving route

  - `app/api/images/[filename]/route.ts`

- Added Security & Validation

  - File size limit validation. Implemented at `/app/actions/submit-image-action.ts` line 40.
  - Extension allow-list. Implemented at `/app/actions/submit-image-action.ts` line 49.
  - File instance and null check on FormData. Implemented at `/app/actions/submit-image-action.ts` line 34.
  - Image existence check. Implemented at `/app/api/images[filename]/route.ts` line 18.
  - Updated image headers to block MIME sniffing and SVG XSS

- Cleaned up & improved the frontend

  - implemented Nextjs Image component
  - Removed all unnecessary code.
  - Used constant for input `name`
  - Started to use `submitImageAction` server action.
  - Implemented `useImagePreview` hook to keep track of preview.
  - Used `handleImageFormSubmit` to provide form validation.
  - Set server action body size limit as 5MB.

# STEP 6: TESTING

- If the packages are not installed, run `npm install`

## Make sure dev environment is functional

- Run `npm run dev`, upload an image and make sure it is visible.
- Check public folder for image.
- To avoid confusion, delete the image you uploaded from the project's public directory.

## Make sure production docker environment is functional

- Run `docker-compose down --rmi all -v` command for complete cleanup.
- Run `docker-compose up` upload an image and make sure preview is visible. Click on `View Full Image` and keep the uploaded image in new tab.
- You wont see any new images in your local project folder.
- Run `docker compose exec nextjs-app ls -1 /app/uploads` you will see the image's name in the terminal ( check the uploaded image tab url for image name http://localhost:3000/api/images/IMAGE_NAME_HERE ).
- Run `docker-compose down` to stop docker.
- Refresh the upload image's tab and you won't see anything.
- Run `docker-compose up` and refresh the tab. You will see the image again (Persistence).

# STEP 6: IMPROVEMENTS

## Implemented Improvements

### Front-end Improvements

- Removing the unused code inside `app/page.tsx`.
- Using `useActionState` for server action states.
- Using Nextjs's Image component to display images and setting image priority.
- Form validation.
- Set server action body size limit as 5MB in `next.config.ts`

### Back-end Improvements

- Creating utilities to simplify code.
- Adjusting folder structure and naming for more restful approach.
- Covering the case of `formData.get('image')` being null.
- Instead of using `Date.now()` as file name, using `randomUUID` from `crypto` library to guarantee unique image name.
- Implement status code enum for responses.
- Adding a file size validation.
- Sanitizing file name to extract file extension safely and accurately.
- Using a new folder outside of `public`folder to avoid confusion.
- Using server action instead of image upload endpoint.
- Updated image headers to block MIME sniffing and SVG XSS

## Suggested Improvements

### If the project grows, I suggest

- Using redis or memory for a rate limiter.
- Periodic image file cleanup.
- Having a real storage backend(AWS) or your own db.
- Form error display.
- Global error page.
- Route error page.
- Not found page.
- Error tracker(like Sentry).
- Analytics tools(like Google Analytics, Datadog etc.).
- Proper Design.
