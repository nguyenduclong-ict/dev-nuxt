import axios from 'axios'
import cheerio from 'cheerio'
import { ISchedule, IScheduleItem, New } from '../entities'
import Cookie from './http'
import dayjs, { dNames, parseTime } from './time'

export const daotaoHost = 'https://daotao.nuce.edu.vn'

interface TietHoc {
  start: { h: number; m: number }
  end: { h: number; m: number }
}

export const tietHocs: { [x: number]: TietHoc } = {
  1: {
    start: { h: 6, m: 45 },
    end: { h: 7, m: 30 },
  },
  2: {
    start: { h: 7, m: 35 },
    end: { h: 8, m: 20 },
  },
  3: {
    start: { h: 8, m: 30 },
    end: { h: 9, m: 15 },
  },
  4: {
    start: { h: 9, m: 20 },
    end: { h: 10, m: 5 },
  },
  5: {
    start: { h: 10, m: 15 },
    end: { h: 11, m: 0 },
  },
  6: {
    start: { h: 11, m: 5 },
    end: { h: 11, m: 50 },
  },
  7: {
    start: { h: 12, m: 15 },
    end: { h: 13, m: 0 },
  },
  8: {
    start: { h: 13, m: 5 },
    end: { h: 13, m: 50 },
  },
  9: {
    start: { h: 14, m: 0 },
    end: { h: 14, m: 45 },
  },
  10: {
    start: { h: 14, m: 50 },
    end: { h: 15, m: 35 },
  },
  11: {
    start: { h: 15, m: 45 },
    end: { h: 16, m: 30 },
  },
  12: {
    start: { h: 16, m: 35 },
    end: { h: 17, m: 20 },
  },
  13: {
    start: { h: 18, m: 0 },
    end: { h: 18, m: 45 },
  },
  14: {
    start: { h: 18, m: 50 },
    end: { h: 19, m: 35 },
  },
  15: {
    start: { h: 19, m: 45 },
    end: { h: 20, m: 30 },
  },
}

export const fetchNews = async (): Promise<New[]> => {
  const endpoint = daotaoHost + '/default.aspx?page=danhsachthongtin&type=0'
  const response = await axios.get(endpoint)
  const htmlString = response.data
  const html = cheerio.load(htmlString)

  const items: New[] = []
  html('#ctl00_ContentPlaceHolder1_ctl00_tbThongTin  tr > td').each(
    (index, td) => {
      try {
        const url = daotaoHost + '/' + html(td).find('a').attr('href') || ''
        const text = html(td).find('a').text().trim()
        const time = parseTime(html(td).find('p').last().text())
        items.push({
          url,
          text,
          time,
          sourceId: new URLSearchParams(url).get('id') || '',
        })
      } catch (error) {
        console.error(error)
      }
    }
  )
  return items
}

// Lấy thông tin thời khóa biểu
export const fetchCalendar = async (
  studentId: any,
  year: number,
  term: 1 | 2 | 3
) => {
  const endpoint = `${daotaoHost}/default.aspx?page=thoikhoabieu&id=${studentId}&sta=1`
  const formData = new FormData()
  const { viewState, cookie } = await getViewState(endpoint, 'POST')
  formData.append(
    'ctl00$ContentPlaceHolder1$ctl00$ddlChonNHHK',
    '' + year + term
  )

  formData.append('__VIEWSTATE', viewState as any)
  formData.append('ctl00$ContentPlaceHolder1$ctl00$rad_ThuTiet', 'rad_ThuTiet')
  const response = await axios.post(endpoint, formData, {
    headers: {
      Cookie: cookie,
    },
  })
  const htmlString = response.data
  const html = cheerio.load(htmlString)
  const txt = html('#ctl00_ContentPlaceHolder1_ctl00_lblNote').text()
  const startDate = dayjs(
    txt.slice(txt.length - 11, txt.length - 1),
    'DD/MM/YYYY'
  ).toDate()
  console.log(txt.slice(txt.length - 11, txt.length - 1))
  const schedule: ISchedule = {
    studentId,
    studentName: html('#ctl00_ContentPlaceHolder1_ctl00_lblContentTenSV')
      .text()
      .replace(/- .*/, '')
      .trim(),
    startDate,
    endDate: startDate,
    year,
    term,
    items: [],
    subjects: [],
  }

  const dow: any[] = []
  html('#ctl00_ContentPlaceHolder1_ctl00_pnlHeader table.body-table').each(
    (index, el) => {
      const arr: string[] = []
      cheerio(el)
        .find('td')
        .map((i, e) => {
          return arr.push(cheerio(e).text().trim())
        })
      const weeks: number[] = []
      arr[13].split('').reduce((pre, e: string) => {
        if (!isNaN(e as any)) {
          weeks.push(Math.floor(pre / 10) * 10 + Number(e))
        }
        return pre + 1
      }, 0)
      weeks.forEach((week) => {
        const tbd = Number(arr[9])
        const soTiet = Number(arr[10])
        const dayOfWeek = dNames.indexOf(arr[8])
        const date = dayjs(startDate).add(week, 'week').day(dayOfWeek).toDate()
        if (!dow.includes(dayOfWeek)) {
          dow.push(dayOfWeek)
        }
        const item: IScheduleItem = {
          week,
          date,
          startTime: dayjs(date)
            .hour(tietHocs[tbd].start.h)
            .minute(tietHocs[tbd].start.m)
            .toDate(),
          endTime: dayjs(date)
            .hour(tietHocs[tbd].end.h)
            .minute(tietHocs[tbd].end.m)
            .toDate(),
          tbd,
          day: dayOfWeek,
          soTiet,
          room: arr[11],
          subject: {
            id: arr[0],
            name: arr[1],
            classCode: arr[2],
          },
        }
        schedule.items.push(item)
        if (!schedule.subjects.find((e) => e.id === item.subject.id)) {
          schedule.subjects.push(item.subject)
        }
        if (dayjs(item.date).isAfter(schedule.endDate, 'week')) {
          schedule.endDate = dayjs(item.date).endOf('week').toDate()
        }
      })
    }
  )
  return schedule
}

const getViewState = async (url: string, method: 'GET' | 'POST' = 'GET') => {
  const response = await axios.request({
    method,
    url,
    headers: {
      Cookie: true,
    },
  })
  const htmlString = response.data
  const html = cheerio.load(htmlString)
  const viewState = html('input#__VIEWSTATE').val()
  return {
    viewState,
    cookie: Cookie.toString(response.headers['set-cookie']),
  }
}
