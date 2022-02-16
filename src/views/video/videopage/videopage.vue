<template>
  <div class="videopage">
    <videocategory />
    <videolist />
  </div>
</template>

<script>
import videocategory from "../../../components/xymusic/video/videopage/videcategory.vue";
import videolist from "../../../components/xymusic/video/videopage/videolist.vue";
export default {
  components: {
    videocategory,
    videolist,
  },
};
</script>

<style lang="less" scoped></style>
