<template>
  <div class="banner">
    <el-carousel :interval="4000"
                 type="card"
                 height="200px">
      <el-carousel-item v-for="item in banners"
                        :key="item.id">
        <el-image style="width: 540px; height: 200px"
                  :src="item.imageUrl"
                  fit="contain"
                  @click="playmusic(item)"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      banners: [],
    };
  },
  methods: {
    // 获取banner
    async getbanner () {
      const res = await this.$http.get("/banner");
      this.banners = res.data.banners;
    },
    // 播放轮播音乐
    async playmusic (id) {
      console.log(id);
      // 如果是链接打开新窗口跳到新链接
      if (id.url) return window.open(id.url, "_blank");
      //如果是歌单跳转到歌单详情页面
      if (id.typeTitle === "歌单")
      {
        this.$router.push(`/home/playlistpage/${id.targetId}`);
        return;
      }
      if (id.typeTitle === "新碟首发")
      {
        this.$router.push(`/home/album/${id.targetId}`);
        return;
      }
      const res = await this.$http.get("/song/url", {
        params: {
          id: id.targetId,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null)
        return this.$message.error("没有版权哦！");
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: id.targetId,
        },
      });
      // console.log(resdata);
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      //存入当前播放歌曲列表
      this.$store.dispatch("saveplaysonglist", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
    },
  },
  created () {
    this.getbanner();
  },
  mounted () {
    this.$emit('bannerdone', true)
  },
  computed: {
    ...mapGetters(["cookie"]),
  },
};
</script>
<style lang="less" scoped>
.banner {
  margin-top: 30px;
  padding-right: 200px;
  padding-left: 60px;
  .el-image {
    border-radius: 10px;
  }
}
</style>
