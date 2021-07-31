import Vue from 'vue'
import { dayjs, getErrorMessage, lodash, numeral } from '@/utils'
import { MessageType } from 'element-ui/types/message'
import VueClipboard from 'vue-clipboard2'

const { get, set } = lodash

Vue.use(VueClipboard)

export const registerGlobalMixin = () => {
  if (get(Vue, '__global_mixin')) {
    return
  }

  set(Vue, '__global_mixin', true)

  Vue.mixin({
    filters: {
      date(value: any, format = 'DD/MM/YYYY', options: any) {
        options = lodash.defaultsDeep(options, {
          error: 'Invalid Date',
        })
        const date = dayjs(value, options.inputFormat)
        if (!date.isValid()) {
          return options.error
        }
        return date.format(format)
      },
      number(value: any, format = '0,0.[000000000]') {
        return numeral(value).format(format)
      },
      money(value: any, format = '0,0.[000000000]') {
        let unit = '₫'
        let suffix

        if (this.$i18n) {
          unit = this.$t('$currencyUnit') || '₫'
          const locale = (this.$i18n as any).locale
          suffix = locale === 'vi'
        }

        const num = numeral(value).format(format) + this.$t('₫')
        return suffix ? num + unit : unit + num
      },
      dayOfWeek(value: any) {
        return value < 6 ? 'Thứ ' + (value + 2) : 'Chủ nhật'
      },
    },

    inject: {
      _: { default: lodash },
      dayjs: { default: dayjs },
    },

    methods: {
      $clearElFormValidate(refForm) {
        refForm.resetFields()
        this.$nextTick(() => refForm.clearValidate())
      },

      $validateElForm(form) {
        return new Promise((resolve) =>
          form.validate((valid: boolean) => {
            resolve(valid)
          })
        )
      },

      $clearFormValidate(refForm) {
        return refForm.clearValidate()
      },

      $validateForm(form) {
        return form.validate()
      },

      getImageSrc(value, width, height) {
        let url = value?.url || value
        if (!url) return null
        if (width || height) {
          url += `?size=${width}x${height}`
        }
        return url
      },

      $initTable(config) {
        return config
      },
      $initSelectEntity(config) {
        return config
      },

      $getErrorMessage: getErrorMessage,

      $showError(error) {
        if (error.isAxiosError && error.displayed) return
        this.$message.error({
          message: this.$t(this.$getErrorMessage(error)) as string,
          center: true,
          customClass: 'custom-el-message',
        })
      },
      $showMessage(message = {}, type: MessageType) {
        const data = typeof message === 'object' ? message : { message }

        this.$message({
          type,
          center: true,
          customClass: 'custom-el-message',
          ...data,
        })
      },

      $copyClipboard(text, message = 'Coppied') {
        this.$copyText(text)
        this.$showMessage({
          message,
          type: 'success',
        })
      },
    },
  })
}
