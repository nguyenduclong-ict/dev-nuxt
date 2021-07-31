import { Plugin } from '@nuxt/types'
import { throttle } from 'lodash'

const ResponsivePlugin: Plugin = ({ store }) => {
  const breakpoints = [
    [0, 'xs'],
    [768, 'sm'],
    [992, 'md'],
    [1200, 'lg'],
    [1920, 'xl'],
  ]

  const state: { responsive: string } = store.state

  const toggleSidebar = (point: string) => {
    if (point === 'sm') store.commit('admin/toggleSidebar', true)
    else store.commit('admin/toggleSidebar', false)
  }

  const getPoint = () =>
    // @ts-ignore
    breakpoints.find((item) => item[0] > window.innerWidth)[1] as string

  const point = getPoint()
  store.commit('setResponsive', getPoint())
  toggleSidebar(point)

  window.onresize = throttle(
    () => {
      const point = getPoint()
      state.responsive !== 'xs' && toggleSidebar(point)
      store.commit('setResponsive', point)
    },
    100,
    { leading: false, trailing: true }
  )
}

export default ResponsivePlugin
