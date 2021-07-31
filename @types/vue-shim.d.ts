import { getErrorMessage } from '@/utils'
import {
  ElMessageComponent,
  ElMessageOptions,
  MessageType,
} from 'element-ui/types/message'
import { LoDashStatic } from 'lodash'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $getErrorMessage: typeof getErrorMessage
    $showError(error: any): void
    $showMessage(
      message: string | ElMessageOptions,
      type?: MessageType
    ): ElMessageComponent
    // elForm
    $validateElForm(form: any): Promise<boolean>
    $clearElFormValidate(form: any): void
    // Custom form
    $validateForm(form: any): Promise<boolean>
    $clearFormValidate(form: any): void
    $copyClipboard(text: string, message?: string): void
    _: LoDashStatic
  }

  export type _CombinedVueInstance<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = Data & Methods & Computed & Props & Instance

  export type _ExtendedVue<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = VueConstructor<
    _CombinedVueInstance<Instance, Data, Methods, Computed, Props> &
      Vue & { __props: Props }
  >

  interface VueConstructor<V extends Vue = Vue> {
    extend<Data, Methods, Computed, Props>(
      options?: ThisTypedComponentOptionsWithRecordProps<
        V,
        Data,
        Methods,
        Computed,
        Props
      >
    ): _ExtendedVue<V, Data, Methods, Computed, Props>
  }
}

declare module '*.vue' {
  export default Vue
}
