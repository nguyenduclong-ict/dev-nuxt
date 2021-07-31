<template>
  <div class="page-init min-h-screen w-screen flex justify-center">
    <div class="max-w-lg w-full min-h-screen flex items-center">
      <el-card class="w-full my-8">
        <h1 class="text-center font-bold text-success mb-4">
          {{ $t('Đăng nhập Admin Panel') }}
        </h1>

        <Form
          ref="form"
          :items="items"
          :model="form"
          @keyup.native.enter="handleLogin"
        ></Form>

        <div class="flex justify-center">
          <el-button type="success" @click="handleLogin" icon="icofont-login">
            {{ $t('Đăng nhập') }}
          </el-button>
        </div>
      </el-card>
    </div>
    <div class="bg-image"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Form from '~/components/Admin/Common/Form.vue'

export default Vue.extend({
  auth: false,
  components: { Form },

  data() {
    return {
      items: [
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
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
      ],
      form: {
        username: '',
        password: '',
      },
    }
  },

  methods: {
    async handleLogin() {
      const valid = await this.$validateForm(this.$refs.form)
      if (valid) {
        try {
          await this.$auth.loginWith('local', { data: this.form })
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
