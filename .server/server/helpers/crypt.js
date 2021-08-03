import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const salt = bcrypt.genSaltSync();
const secret = process.env.JWT_SECRET || 'kecw6esxv0s';
export const hasPassword = (password) => {
    return bcrypt.hashSync(password, salt);
};
export const comparePassword = (password, hashed) => {
    return bcrypt.compareSync(password, hashed);
};
export function createToken(payload, expiresIn = 10 * 60 /** 10 phút */) {
    return jwt.sign(payload, secret, { expiresIn });
}
export function verifyToken(str) {
    return jwt.verify(str, secret);
}
