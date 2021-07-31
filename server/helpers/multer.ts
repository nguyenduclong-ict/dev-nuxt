import { UPLOAD_PATH } from '@/server/constants'
import { kebabCase } from '@/utils/lodash'
import { nonAccentVietnamese } from '@/utils/utils'
import { ObjectId } from 'mongodb'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: UPLOAD_PATH,
  filename: (req, file, cb) => {
    cb(
      null,
      new ObjectId().toHexString() +
        '-' +
        kebabCase(nonAccentVietnamese(file.originalname))
    )
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5Mb
})

export { upload }
