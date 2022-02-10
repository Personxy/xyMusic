<template>
  <div class="video"></div>
</template>

<script>
export default {
  props: {
    keywords: String
  },
  data () {
    return {

    }
  },
  methods: {
    async getvideolist () {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      const { data } = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keywords,
          type: 1014,
          limit: 30
        }
      })
      this.result = data.result
      console.log(this.result);
      loading.close()
    },
  },
  created () {
    this.getvideolist()
  },
  watch () {
    this.getvideolist()
  }

}
</script>

<style lang="less" scoped>
</style>