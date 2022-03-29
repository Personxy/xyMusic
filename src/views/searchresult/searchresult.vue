<template>
  <div class="search">
    <div class="serartitle">
      搜索 <span>{{ keywords }}</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="单曲" name="songs">
        <keep-alive>
          <songs :keywords="keywords" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="歌手" name="singer">
        <keep-alive>
          <singer :keywords="keywords" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="专辑" name="album">
        <keep-alive>
          <album :keywords="keywords" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <keep-alive>
          <videopage :keywords="keywords" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="MV" name="MV">
        <keep-alive>
          <mvpage :keywords="keywords" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="songlist">
        <keep-alive>
          <songlist :keywords="keywords" />
        </keep-alive>
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
  .el-tabs {
    margin-top: 50px;
  }
  /deep/.el-tabs__item {
    color: rgb(78, 72, 72);
  }
  /deep/.el-tabs__item:hover {
    color: black;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 0 !important;
  }
  /deep/.el-tabs .el-tabs__item.is-active {
    color: #373737 !important;
    font-weight: bold;
    // font-size: 20px;
  }
  /deep/.el-tabs__active-bar {
    background-color: #ec4141 !important;
    height: 3px;
  }
}
</style>
