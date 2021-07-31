const fs = require('fs')
const dotenv = require('dotenv')
const tsConfigPaths = require('tsconfig-paths')
const tsConfig = require('./tsconfig.json')

let loaded = false
let loadResult

const loadEnv = () => {
  if (loaded) return loadResult

  const isDev = process.env.NODE_ENV === 'development'
  const envPath = isDev ? process.cwd() + '/.env.dev' : process.cwd() + '/.env'
  console.log('ENV=' + process.env.NODE_ENV, 'envPath=' + envPath)

  if (!fs.existsSync(envPath)) {
    console.warn('ENV', envPath, 'NOT_FOUND')
    return {}
  } else {
    const result = dotenv.config({ path: envPath }).parsed
    for (const key in result) {
      process.env[key] = result[key]
    }
    loaded = true
    loadResult = result.parsed
    return result.parsed
  }
}

tsConfigPaths.register({
  baseUrl: './',
  paths: tsConfig.compilerOptions.paths,
})

loadEnv()
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  loadEnv,
  isDev,
}
