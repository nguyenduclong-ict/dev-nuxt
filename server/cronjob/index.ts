import { CronJob } from 'cron'
import { newCronjob } from './news.cronjob'

export const startCronjobs = () => {
  const cronjobs: { [x: string]: CronJob } = {
    newCronjob,
  }

  Object.keys(cronjobs).forEach((key) => {
    console.log(`start cronjob [${key}]`)
    cronjobs[key].start()
  })
}
