import path from 'path'
import fs from 'fs'
import cors from 'cors'
import express, { ErrorRequestHandler, RequestHandler } from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import './config/mongo'
import { INTERNAL_SERVER_ERROR, NOT_FOUND, sendError } from './helpers/errors'
import { registerRoutes } from './helpers/router'
import { initRolesAndPermissions } from './seeders/roles_permissions'
import { initFolder } from './helpers/multer'
import { startCronjobs } from './cronjob'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use((req, res, next) => {
  req.meta = req.meta || {
    // eslint-disable-next-line node/no-deprecated-api
    endpoint: req.path,
    req,
    res,
  }

  next()
})

registerRoutes(path.join(__dirname, 'routes'), app)

const handle404: RequestHandler = (_req, res, _next) => {
  // Request not match to any route
  sendError(res, NOT_FOUND)
}

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  // Request not match to any route
  console.error(err)
  return sendError(res, INTERNAL_SERVER_ERROR, {
    message: err.message || err.name,
  })
}

app.use(handle404)
app.use(handleError)

initRolesAndPermissions()
initFolder()
startCronjobs()

export default app
