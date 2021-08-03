import { New } from '@/server/entities'
import { fetchNews } from '@/server/helpers/daotao'
import { CronJob } from 'cron'
import { newRepository } from '../repository'

async function handler() {
  console.log('*** cronjob crawl news start')
  let news = await fetchNews()
  const listNews: New[] = []

  const inited = !!(await newRepository.findOne({}))

  if (inited) {
    news = news.slice(0, 20)
  }

  await Promise.all(
    news.map(async (item) => {
      let doc = await newRepository.findOne({
        query: {
          sourceId: item.sourceId,
        },
      })
      if (!doc) {
        doc = await newRepository.create({ data: item })
        listNews.push(doc)
      }
    })
  )

  console.log('*** cronjob crawl news success', 'news: ', listNews.length)

  return listNews
}

export const newCronjob = new CronJob(
  '* * * * *',
  handler,
  null,
  true,
  'Asia/Ho_Chi_Minh'
)
