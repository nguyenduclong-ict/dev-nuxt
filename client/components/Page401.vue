<template>
  <div class="errPage-container">
    <el-row class="p-4">
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <div class="text-4xl font-bold my-3">{{ error.statusCode }}</div>
        <h6>{{ error.message || '403 UnAuthorize' }}</h6>

        <div class="mt-6">
          <el-button
            icon="el-icon-arrow-left"
            class="pan-back-btn"
            round
            type="primary"
            @click="back"
          >
            Back
          </el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="随便看">
      <img :src="ewizardClap" class="pan-img" />
    </el-dialog>
  </div>
</template>

<script>
import errGif from '~/assets/401_images/401.gif'
export default {
  name: 'Page401',
  props: {
    error: Object,
  },
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap:
        'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false,
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>
