const fs = require('fs')
const tsConfigPaths = require('tsconfig-paths')
const dotenv = require('dotenv')

const isDev = process.env.NODE_ENV === 'development'

const loadEnv = () => {
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
    return result.parsed
  }
}

if (isDev) {
  tsConfigPaths.register({
    baseUrl: './',
    paths: {
      '~/*': ['./client/*'],
      '@/*': ['./*'],
    },
  })
} else {
  tsConfigPaths.register({
    baseUrl: './',
    paths: {
      '~/*': ['./client/*'],
      '@/*': ['./.build/*'],
    },
  })
}

loadEnv()
