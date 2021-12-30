<template>
  <div class="headtab">
    <el-menu :default-active="this.$route.path"
             class="el-menu-demo"
             mode="horizontal"
             :router="true">
      <el-menu-item index="/home/findmusic/personrecom">个性推荐</el-menu-item>
      <el-menu-item index="/home/findmusic/songlist">歌单</el-menu-item>
      <el-menu-item index="/home/findmusic/ranking">排行榜</el-menu-item>
      <el-menu-item index="/home/findmusic/singer">歌手</el-menu-item>
      <el-menu-item index="/home/findmusic/newmusic">最新音乐</el-menu-item>
    </el-menu>
  </div>

</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.headtab {
  .el-menu.el-menu--horizontal {
    border: none;
  }
  .el-menu {
    display: flex;
    justify-content: center;
    .el-menu-item {
      font-size: 18px;
      color: #373737;
    }
    .el-menu-item.is-active {
      font-weight: bold;
      font-size: 20px;
      border-bottom: 2px solid #ec4141;
    }
  }
}
</style>