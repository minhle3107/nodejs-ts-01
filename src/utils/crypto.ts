import { createHash } from 'node:crypto'
import * as process from 'process'

/**
 * Returns a SHA256 hash using SHA-2 for the given `content`.
 *
 * @see https://en.wikipedia.org/wiki/SHA-2
 *
 * @param {String} content
 *
 * @returns {String}
 */
export const sha256 = (content: string) => {
  return createHash('sha256').update(content).digest('hex')
}

export const handleHashPassword = (password: string) => {
  return sha256(`${password}${process.env.PASSWORD_SECRET}`)
}
