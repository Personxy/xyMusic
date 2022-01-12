<template>
  <div class="mvpage">
    <newmv :newmvlist='newmvlist'
           @sendnewmv="getnewmvtag" />
    <recommv :recommv='recommv' />
    <wangyimv :wamgyimvlist='wamgyimvlist' />
    <rankingmv :rankingmvlist='rankingmvlist' />
  </div>
</template>

<script>
import newmv from "../../../components/xymusic/video/mvpage/newmv.vue"
import recommv from '../../../components/xymusic/video/mvpage/recommv.vue'
import wangyimv from "../../../components/xymusic/video/mvpage/wangyimv.vue"
import rankingmv from "../../../components/xymusic/video/mvpage/mvranking.vue"
export default {
  components: {
    newmv,
    recommv,
    wangyimv,
    rankingmv
  },
  data () {
    return {
      newmvlist: [],
      newmvarea: "内地",
      recommv: [],
      rankingarea: "内地",
      wamgyimvlist: [],
      rankingmvlist: []
    }
  },
  created () {
    this.getnewmv()
    this.getrecommv()
    this.getwangyimv()
    this.getranking()
  },
  methods: {
    // 获取最新mv
    async getnewmv () {
      const { data } = await this.$http.get('/mv/first', {
        params: {
          area: this.newmvarea,
          limit: 8
        }
      })
      this.newmvlist = data.data
    },
    getnewmvtag (data) {
      this.newmvarea = data
      this.getnewmv()
    },
    // 推荐mv
    async getrecommv () {
      const { data } = await this.$http.get('/personalized/mv')
      this.recommv = data.result
    },


    // 网易出品
    async getwangyimv () {
      const { data } = await this.$http.get("mv/exclusive/rcmd", {
        params: {
          limit: 8
        }
      })
      this.wamgyimvlist = data.data
    },

    //排行榜
    async getranking () {
      const { data } = await this.$http.get('/top/mv', {
        params: {
          limit: 10,
          area: this.rankingarea
        }
      })
      this.rankingmvlist = data.data
    }
  },



}
</script>

<style lang="less" scoped>
</style>