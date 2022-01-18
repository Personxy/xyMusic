<template>
  <div class="musicdetail">
    <musiclyric v-if="songDetails" />
    <comment v-if="songDetails" />
    <recominfo v-if="songDetails" />
  </div>
</template>

<script>
import musiclyric from "./musiclyric.vue"
import comment from "./comment.vue"
import recominfo from './recominfo.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    musiclyric,
    comment,
    recominfo
  },
  computed: {
    ...mapGetters(['songDetails'])
  },

}
</script>

<style lang="less" scoped>
.musicdetail {
  position: absolute;
  height: 85vh;
  width: 100%;
  background: #ffffff;
  bottom: 80px;
  z-index: 1700;
}
</style>