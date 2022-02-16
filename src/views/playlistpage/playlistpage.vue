<template>
  <div class="playlistpage">
    <!-- 歌单信息 -->
    <listinfo :playlist="playlist" :songs="songs" />
    <!-- 歌单导航 -->
    <listnav
      :songs="songs"
      v-loading="loading"
      :likeplaylist="likeplaylist"
      :playlist="playlist"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import listinfo from "../../components/xymusic/playlistpage/listinfo";
import listnav from "../../components/xymusic/playlistpage/listnav";
export default {
  components: {
    listinfo,
    listnav,
  },
  data() {
    return {
      // 歌单详情
      playlist: {
        creator: {},
      },
      songs: [],
      loading: false,
      // 喜欢的音乐列表
      likeplaylist: [],
    };
  },
  methods: {
    //获取歌单详情
    async getplaylistinfo() {
      const res = await this.$http.get("/playlist/detail", {
        params: {
          id: this.$route.params.id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data);
      this.playlist = res.data.playlist;
    },
    // 获取所有歌曲
    async getallplaylist() {
      this.loading = true;
      const resdata = await this.$http.get("/playlist/track/all", {
        params: {
          id: this.$route.params.id,
          cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      this.songs = resdata.data.songs;
      // 加载动画结束
      this.loading = false;
    },

    //获取喜欢的歌曲列表
    async getlikelist() {
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
  created() {
    this.getplaylistinfo();
    this.getallplaylist();
    this.getlikelist();
  },
  beforeUpdate() {
    // 对比喜欢的音乐和当前歌单添加 likemusicflag属性
    this.likeplaylist.forEach((item2, index2, arr2) => {
      this.songs.forEach((item, index, arr) => {
        if (arr2[index2] == arr[index].id) {
          arr[index].likemusicflag = true;
          // console.log(arr[index]);
        }
      });
    });
    this.songs.forEach((element) => {
      if (!element.likemusicflag) {
        element.likemusicflag = false;
      }
    });
    // console.log(this.songs);
  },
  // 监听路由
  watch: {
    $route() {
      // console.log(to);
      // console.log(from);
      this.getplaylistinfo();
      this.getallplaylist();
      this.getlikelist();
    },
  },
  computed: {
    ...mapGetters(["cookie", "userInfo"]),
  },
};
</script>

<style lang="less" scoped>
.playlistpage {
  height: 80vh;
}
/deep/.el-loading-spinner {
  top: 80px;
}
/deep/.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
