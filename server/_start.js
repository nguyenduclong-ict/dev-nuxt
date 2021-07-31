const { resolve } = require('path')
const tsNode = require('ts-node')

tsNode.register({
  project: resolve(process.cwd(), 'tsconfig.json'),
  compilerOptions: {
    module: 'commonjs',
  },
  transpileOnly: true,
})

const app = require('.')

module.exports = app
