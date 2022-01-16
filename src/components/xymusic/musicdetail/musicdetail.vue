<template>
  <div class="musicdetail">
    <musiclyric />
    <comment />
    <recominfo />
  </div>
</template>

<script>
import musiclyric from "./musiclyric.vue"
import comment from "./comment.vue"
import recominfo from './recominfo.vue'
export default {
  components: {
    musiclyric,
    comment,
    recominfo
  }
}
</script>

<style lang="less" scoped>
.musicdetail {
  position: absolute;
  height: 85vh;
  width: 100%;
  background: skyblue;
  bottom: 80px;
}
</style>