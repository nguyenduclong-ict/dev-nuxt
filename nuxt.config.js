import { resolve } from 'path'
import { routes as clientRoutes } from '~/config/router'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('@nuxt/types').NuxtConfig} */
const nuxtConfig = {
  ssr: false,
  pageTransition: {
    name: 'fade-transform',
    mode: 'out-in',
  },

  srcDir: './client',

  alias: isDev
    ? {
        '~': resolve(__dirname, './client'),
        '@': __dirname,
      }
    : {
        '~': resolve(__dirname, './client'),
        '@': resolve(__dirname, './.build'),
      },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'dev-nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '/js/tinymce/tinymce.min.js',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css', '~/assets/scss/global.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/startup.ts',
    '@/plugins/element-ui',
    { src: '~/plugins/responsive.ts', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
  ],

  router: {
    middleware: ['auth', 'permission'],
    extendRoutes(routes) {
      routes.splice(0)
      routes.push(...clientRoutes)
    },
  },

  i18n: {
    parsePages: false,
    strategy: 'no_prefix',
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    vueI18n: {
      fallbackLocale: 'vi',
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieCrossOrigin: true,
    },
  },

  tailwindcss: {
    exposeConfig: true,
    configPath: process.cwd() + '/tailwind.config.js',
  },

  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          global: true,
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken',
        },
        user: {
          property: '',
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/me', method: 'get' },
        },
      },
    },
    redirect: {
      login: '/admin/login',
      logout: '/redirect/logout',
      home: '/redirect/home',
    },
    rewriteRedirects: false,
    plugins: ['~/plugins/auth.ts'],
  },

  // loaders: {
  //   ts: {
  //     silent: true,
  //   },
  //   tsx: {
  //     silent: true,
  //   },
  // },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    progress: false,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: '@/server/start.js',
    },
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
}

export default nuxtConfig
