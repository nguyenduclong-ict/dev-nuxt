import path from 'path'

export const UPLOAD_PATH = path.join(
  process.cwd(),
  process.env.UPLOAD_PATH || 'upload'
)
