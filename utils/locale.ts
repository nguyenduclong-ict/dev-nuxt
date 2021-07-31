export const loadLocale = (data: any) => {
  const vi: any = {}
  const en: any = {}

  Object.keys(data).forEach((key) => {
    en[key] = data[key].en || key
    vi[key] = data[key].vi || key
  })

  return {
    vi,
    en,
  }
}
