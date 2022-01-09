<template>
  <div class="albumpage">
    <!-- 歌单信息 -->
    <albuminfo :albuminfo="albuminfo"
               :songs="songs" />
    <!-- 歌单导航 -->
    <albumnav v-loading="loading"
              :songs="songs"
              :likeplaylist="likeplaylist" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import albuminfo from "../../components/xymusic/album/albuminfo.vue"
import albumnav from "../../components/xymusic/album/albumnav.vue"
export default {
  components: {
    albuminfo,
    albumnav
  },
  data () {
    return {
      // 歌单详情
      albuminfo: {},
      songs: [],
      loading: false,
      // 喜欢的音乐列表
      likeplaylist: [],
    };
  },
  methods: {

    // 获取所有歌曲和专辑详情
    async getallalbumlist () {
      this.loading = true;
      const { data } = await this.$http.get("/album", {
        params: {
          id: this.$route.params.id,
          cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      this.songs = data.songs;
      this.albuminfo = data.album
      // 加载动画结束
      this.loading = false;
    },
    //获取喜欢的歌曲列表
    async getlikelist () {
      if (!this.userInfo) return;
      const res = await this.$http.get("/likelist", {
        params: {
          uid: this.userInfo.userInfo,
          cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      this.likeplaylist = res.data.ids;
    },
  },
  created () {
    this.getlikelist();
    this.getallalbumlist()
  },
  beforeUpdate () {
    // 对比喜欢的音乐和当前歌单添加 likemusicflag属性

    this.likeplaylist.forEach((item2, index2, arr2) => {
      this.songs.forEach((item, index, arr) => {
        if (arr2[index2] == arr[index].id)
        {
          arr[index].likemusicflag = true;
          // console.log(arr[index]);
        }
      });
    });
    this.songs.forEach((element) => {
      if (!element.likemusicflag)
      {
        element.likemusicflag = false;
      }
    });
    // console.log(this.songs);
  },
  computed: {
    ...mapGetters(["cookie", "userInfo"]),
  },

}
</script>

<style lang="less" scoped>
</style>