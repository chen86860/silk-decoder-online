import { Storage } from '@google-cloud/storage'
import path from 'path'

const storage = new Storage()
const BUCKET = 'storage.emmmmm.dev'

const bucket = storage.bucket(BUCKET)
export const uploadFile = (filename: string) =>
  bucket.upload(filename, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  })

uploadFile(path.resolve(process.cwd(), 'files', 'upload_0ade40f587137430d884db91ef7135db.mp3')).catch((error) => {
  console.log('error', error)
})
