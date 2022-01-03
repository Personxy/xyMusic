<template>
  <div>
    <!-- 分类 -->
    <category />
    <!-- 所有歌单 -->
    <allsonglist />
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
};
</script>
<style lang="less" scoped></style>
