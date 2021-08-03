import { CronJob } from 'cron'

export const startCronjobs = () => {
  const cronjobs: { [x: string]: CronJob } = {}

  Object.keys(cronjobs).forEach((key) => {
    console.log(`start cronjob [${key}]`)
    cronjobs[key].start()
  })
}
