# STEP 1: THINK

## Why preview is visible?

- It is client side state. It just works.

## Is there a difference in the current working directory or path of docker container?

- No, image url in dev and prod are the same.

## Are there any early return related errors?

- No.

## Is this something I have ever encountered before?

- No.

# STEP 2: RESEARCH

- I read some articles and talked with AI. Now everything makes sense.
- When the project is run with `npm run dev` public folder is watched for changes by nextjs.
- When running a production build, public folder is not watched for changes. It is cached at the state of build time.
- `Dockerfile` content shows that `docker-compose up`command runs a production build. So, the problem occurs.

### Question: By default, is there any folder served dynamically by nextjs?

- No.

# STEP 3: FIND SOLUTIONS

## Solution 1

- Create an api endpoint to return image file from public folder. Example: `app/api/images/[filename]/route.ts`
- Make the already existing api endpoint(now server action) return get request url. Example: `` imagePath: '/api/images/blabla.png'`
- `imagePath` is used as src attribute of the preview image element. When an image is uploaded a request will be sent to `app/api/images/[filename]/route.ts` by the image element and correct image will be displayed.

## Solution 2

- Using a real storage backend(AWS) or your own db.

# STEP 4: PICK A SOLUTION

- Solution 2 is against the purpose of this exercise. Also overkill for this project.
- Solution 1 is the winner.

# STEP 5: IMPLEMENTATION

- Replaced already existing api route with a server action.

  - Deleted `app/api/upload-image/route.ts`
  - Created `app/actions/submit-image-action.ts`
  - Used `useActionState` in `page.tsx`

- Moved uploaded files outside of the `/public` folder in production

  - Changed Docker volume mount from `/app/public/uploads` => `/app/uploads`
  - Updated `Dockerfile` to create `/app/uploads` at build time
  - Modified `lib/image-utils.ts` to write to `/app/uploads` in production and keep `/public/uploads` only for local dev.

- Created utilities

  - `lib/constants.ts`: `ALLOWED_EXTENSIONS`, `MAX_FILE_SIZE_IN_BYTES`, `EXT_TO_MIME`, `MAX_MEGABYTE`, `IMAGE_CACHE_HEADERS`, `IMAGE_INPUT_NAME`
  - `lib/enums.ts`: `Status`
  - `lib/image-utils.ts`: `getImagePath`, `createUploadsDirIfMissing`, `getContentType`, `getFileExtension`, `generateFilename`, `imageExists`

- Implemented better file name generation

  - Used `crypto.randomUUID()` + only the vetted extension as the file name
  - Added strict extension allow-list

- Added Validation

  - File size limit validation
  - Extension allow-list
  - Null check on FormData
  - File instace check

- Created image serving route

  - `app/api/images/[filename]/route.ts`
  - Check if the file exists first

- Cleaned up the frontend

  - implemented Nextjs Image component
  - Removed all unnecessary code. Including the image preview.
  - Used constant for input `name`

# STEP 6: TESTING

## Make sure dev environment is functional

- Run `npm run dev`, upload an image and make sure it is visible.
- Check public folder for image.
- To avoid confusion, delete the image you uploaded from the project's public directory.

## Make sure production docker environment is functional

- Run `docker-compose down --rmi all -v` command for complete cleanup.
- Run `docker-compose up` upload an image and make sure preview is visible. Click on `View Full Image` and keep the uploaded image in new tab.
- You wont see any new image in your local project folder.
- Run `docker compose exec nextjs-app ls -1 /app/uploads` you will see the image's name in the terminal ( check the uploaded image tab url for image name http://localhost:3000/api/images/IMAGE_NAME_HERE ).
- Run `docker-compose down` to stop docker.
- Refresh the upload image's tab and you won't see anything.
- Run `docker-compose up` and refresh the tab. You will see the image again (Persistence).

# STEP 6: IMPROVEMENTS

## Implemented Improvements

### Front-end Improvements

- Removing the unused code inside `app/page.tsx`. (IMPLEMENTED)
- Using `useActionState` for server action states. (IMPLEMENTED)
- Using Nextjs's Image component to display images and setting image priorities. (IMPLEMENTED)

### Back-end Improvements

- Creating utilities to simplify code. (IMPLEMENTED)
- Adjusting folder structure and naming for more restful approach (IMPLEMENTED)
- Covering the case of `formData.get('image')` being null (IMPLEMENTED)
- Instead of using `Date.now()` as file name, using `randomUUID` from `crypto` library to guarantee unique image name (IMPLEMENTED)
- Implement status code enum for responses (IMPLEMENTED)
- Adding a file size validation. (IMPLEMENTED)
- Sanitizing file name to extract file extension safely and accurately. (IMPLEMENTED)
- Using a new folder outside of `public`folder to avoid confusion. (IMPLEMENTED)
- Using server action instead of image upload endpoint. (IMPLEMENTED)

## Suggested Improvements

- Using redis for rate limiter.
- Proper UI
- Using a real storage backend(AWS) or your own db.
- Error state handling (global error page, route error page)
- Not found page
