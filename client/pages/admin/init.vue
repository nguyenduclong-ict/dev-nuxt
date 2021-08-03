<template>
  <div class="page-init min-h-screen w-screen flex justify-center">
    <div class="max-w-lg w-full min-h-screen flex items-center">
      <el-card class="w-full my-8">
        <h1 class="text-center font-bold text-success mb-4">
          {{ $t('Khởi tạo dự án') }}
        </h1>

        <Form
          ref="form"
          :items="items"
          :model="form"
          @keyup.enter.native="handleInit"
        ></Form>

        <div class="flex justify-center">
          <el-button type="success" @click="handleInit">
            {{ $t('Bắt đầu') }}
          </el-button>
        </div>
      </el-card>
    </div>
    <div class="bg-image"></div>
  </div>
</template>

<script lang="tsx">
import Vue from 'vue'
import { equalToField } from '@/utils/client/validate'
import Form from '~/components/Admin/Common/Form.vue'

export default Vue.extend({
  auth: false,
  components: { Form },

  data() {
    return {
      items: [
        { type: 'slot' },
        {
          type: 'input',
          label: 'Project Name',
          key: 'projectName',
          rules: { required: true, trigger: 'change' },
        },
        {
          type: 'input',
          label: 'Email',
          key: 'email',
          rules: {
            required: true,
            type: 'email',
          },
          props: {
            name: 'email',
          },
        },
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
          props: {
            name: 'username',
          },
        },
        {
          type: 'input',
          label: 'Password',
          key: 'password',
          rules: {
            required: true,
            trigger: 'change',
            min: 4,
          },
          props: {
            showPassword: true,
          },
        },
        {
          type: 'input',
          label: 'Confirm Password',
          key: 'confirmPassword',
          rules: [
            {
              required: true,
              trigger: 'change',
              min: 4,
            },
            equalToField(this, 'form.password'),
          ],
          props: {
            name: 'confirm_password',
            showPassword: true,
          },
        },
      ] as FormItems,
      form: {
        projectName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
    }
  },

  methods: {
    async handleInit() {
      const valid = await this.$validateForm(this.$refs.form)

      if (valid) {
        try {
          const { token, refreshToken } = await this.$axios.$post(
            '/api/auth/init',
            this.form
          )
          await this.$auth.setUserToken(token, refreshToken)
          this.$auth.redirect('home')
        } catch (error) {
          this.$showError(error)
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.page-init {
  .bg-image {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-image: url(/images/typing.jpeg);
    background-repeat: no-repeat;
    background-size: auto;
    filter: blur(5px);
  }
}
</style>
