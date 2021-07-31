import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const salt = bcrypt.genSaltSync()
const secret = process.env.JWT_SECRET || 'kecw6esxv0s'

export const hasPassword = (password: string) => {
  return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password: string, hashed: string) => {
  return bcrypt.compareSync(password, hashed)
}

export function createToken<T = any>(
  payload: T,
  expiresIn: string | number = 10 * 60 /** 10 phút */
) {
  return jwt.sign(payload as any, secret, { expiresIn })
}

export function verifyToken<T = undefined>(str: string) {
  return jwt.verify(str, secret) as T & jwt.JwtPayload
}
