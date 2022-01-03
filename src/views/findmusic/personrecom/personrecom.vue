<template>
  <div class="personrecom">
    <!-- 轮播图 -->
    <banner />
    <!-- 推荐歌单 -->
    <recomlist />
    <!-- 独家放送 -->
    <broadcasting />
    <!-- 最新音乐 -->
    <newmusic />
    <!-- 推荐MV -->
    <recommv />
  </div>
</template>
<script>
import banner from "../../../components/xymusic/findmusic/personRecom/banner.vue";
import recomlist from "../../../components/xymusic/findmusic/personRecom/recomlist.vue";
import broadcasting from "../../../components/xymusic/findmusic/personRecom/broadcasting.vue";
import newmusic from "../../../components/xymusic/findmusic/personRecom/newmusic.vue";
import recommv from "../../../components/xymusic/findmusic/personRecom/recomMv.vue";
export default {
  components: {
    banner,
    recomlist,
    broadcasting,
    newmusic,
    recommv,
  },
};
</script>

<style lang="less" scoped></style>
