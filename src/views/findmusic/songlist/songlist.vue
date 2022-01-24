<template>
  <div>
    <div class="songlist"
         v-show="load">
      <!-- 分类 -->
      <category />
      <!-- 所有歌单 -->
      <allsonglist />
    </div>
    <div class="loading"
         v-show="!load">
      <i class="el-icon-loading"
         style="margin-top:30px"></i><span style="margin-left:10px">加载中</span>
    </div>
  </div>
</template>
<script>
import category from "../../../components/xymusic/findmusic/songlist/category.vue";
import allsonglist from "../../../components/xymusic/findmusic/songlist/allsonglist.vue";
export default {
  components: {
    category,
    allsonglist,
  },
  data () {
    return {
      load: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.load = true
    }, 500);
  }
};
</script>
<style lang="less" scoped></style>
