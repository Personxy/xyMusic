<template>
  <div class="headnav">
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
    >
      <el-menu-item index="/home/video/videopage">视频</el-menu-item>
      <el-menu-item index="/home/video/mvpage">MV</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
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
</style>
