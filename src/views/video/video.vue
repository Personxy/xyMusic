<template>
  <div class="video">
    <headnav />
    <router-view />
  </div>
</template>

<script>
import headnav from "../../components/xymusic/video/headnav.vue"
export default {
  components: {
    headnav
  }
}
</script>

<style lang="less" scoped>
.video {
  padding: 20px 180px 50px 180px;
}
</style>
