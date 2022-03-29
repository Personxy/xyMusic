<template>
  <div class="videopage">
    <videocategory @sendcatid="getcatid" />
    <videolist :catId="catid" />
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
  data() {
    return {
      catid: "",
    };
  },
  methods: {
    getcatid(data) {
      this.catid = data;
    },
  },
};
</script>

<style lang="less" scoped></style>
