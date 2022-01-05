<template>
  <div class="singerpage">
    <!-- 歌手信息 -->
    <singerinfo :artist="artist" />
    <!-- 导航栏 -->
    <singernav :songs="songs"
               :introduction="introduction" />
  </div>
</template>

<script>
import singerinfo from "../../components/xymusic/singer/singerinfo.vue"
import singernav from "../../components/xymusic/singer/singernav.vue"
export default {
  components: {
    singerinfo,
    singernav
  }, data () {
    return {
      artist: {},
      songs: [],
      introduction: []
    }
  },
  methods: {
    // 歌手信息
    async getsingerinfo () {
      const { data: { data } } = await this.$http.get("/artist/detail", {
        params: {
          id: this.$route.params.id
        }
      })
      this.artist = data.artist
    },
    // 歌手全部歌曲
    async getallsongs () {
      const { data } = await this.$http.get('/artist/songs', {
        params: {
          id: this.$route.params.id,
          limit: 150
        }
      })
      this.songs = data.songs
    },
    //歌手详情
    async getsingerdetail () {
      const { data } = await this.$http.get('/artist/desc', {
        params: {
          id: this.$route.params.id
        }
      })
      this.introduction = data.introduction
    }
  },
  created () {
    this.getsingerinfo()
    this.getallsongs()
    this.getsingerdetail()
  }


}
</script>

<style lang="less" scoped>
</style>