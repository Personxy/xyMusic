<template>
  <div class="singernav">
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲列表"
                   name="songs">
        <!-- 歌曲列表 -->
        <singersongs :songs="songs" />
      </el-tab-pane>
      <el-tab-pane label="歌手详情"
                   name="detail">
        <!-- 歌手详情 -->
        <singerdetail :introduction="introduction" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import singersongs from "./singersongs.vue"
import singerdetail from "./singerdetail.vue"
export default {
  components: {
    singersongs,
    singerdetail
  },
  props: {
    songs: Array,
    introduction: Object
  },
  data () {
    return {
      activeName: "songs"
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-tabs__nav-wrap::after {
  height: 0;
}
/deep/.el-tabs__active-bar {
  background-color: #ec4141 !important;
  height: 3px;
}
/deep/ .el-tabs__item.is-active {
  color: rgb(36, 34, 34);
  font-size: 18px;
  font-weight: bold;
}
/deep/ .el-tabs__item:hover {
  color: #141313;
}
</style>