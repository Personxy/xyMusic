<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲列表"
                   name="songlist">
        <playlist :songs="songs"
                  :likeplaylist="likeplaylist"></playlist>
      </el-tab-pane>
      <el-tab-pane label="评论"
                   name="comments">
        <comment></comment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import playlist from "./playlist.vue"
import comment from "./comment.vue"
export default {
  components: {
    playlist,
    comment,
  },
  props: {
    songs: Array,
    likeplaylist: Array

  },
  methods: {

  },
  data () {
    return {
      activeName: "songlist"
    }
  }
}
</script>

<style lang="less" scoped>
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
  font-size: 20px;
}
/deep/.el-tabs__active-bar {
  background-color: #ec4141 !important;
  height: 3px;
}
</style>