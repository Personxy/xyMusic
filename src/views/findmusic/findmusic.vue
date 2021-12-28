<template>
  <div class="findmusic">
    <!-- 头部 -->
    <headtab />
    <div>
      <router-view />
    </div>
  </div>
</template>
<script>
import headtab from "../../components/xymusic/findmusic/headTab.vue"
export default {
  components: {
    headtab
  }
}
</script>

<style lang="less" scoped>
.findmusic {
  height: 80vh;
}
</style>