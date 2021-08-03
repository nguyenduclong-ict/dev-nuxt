const { resolve } = require('path')
const tsNode = require('ts-node')

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  tsNode.register({
    project: resolve(process.cwd(), 'tsconfig.json'),
    compilerOptions: {
      module: 'commonjs',
    },
    transpileOnly: true,
  })
}

module.exports = require('./index')
