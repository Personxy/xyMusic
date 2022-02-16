<template>
  <div class="search">
    <div class="serartitle">
      搜索 <span>{{ keywords }}</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="单曲" name="songs">
        <songs :keywords="keywords" />
      </el-tab-pane>
      <el-tab-pane label="歌手" name="singer">
        <singer :keywords="keywords" />
      </el-tab-pane>
      <el-tab-pane label="专辑" name="album">
        <album :keywords="keywords" />
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <videopage :keywords="keywords" />
      </el-tab-pane>
      <el-tab-pane label="MV" name="MV">
        <mvpage :keywords="keywords" />
      </el-tab-pane>
      <el-tab-pane label="歌单" name="songlist">
        <songlist :keywords="keywords" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import songs from "../../components/xymusic/searchresult/songs.vue";
import singer from "../../components/xymusic/searchresult/singer.vue";
import album from "../../components/xymusic/searchresult/album.vue";
import videopage from "../../components/xymusic/searchresult/video.vue";
import mvpage from "../../components/xymusic/searchresult/mv.vue";
import songlist from "../../components/xymusic/searchresult/songlist.vue";
export default {
  components: { songs, singer, album, videopage, songlist, mvpage },
  data() {
    return {
      keywords: "",
      activeName: "songs",
    };
  },
  methods: {},
  created() {
    this.keywords = this.$route.params.keywords;
  },
  watch: {
    $route() {
      this.keywords = this.$route.params.keywords;
    },
  },
};
</script>
<style lang="less" scoped>
.search {
  .serartitle {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 20px;
  }
}
</style>
