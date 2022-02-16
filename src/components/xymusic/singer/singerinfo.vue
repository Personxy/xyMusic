<template>
  <div class="singerinfo">
    <div class="singercover">
      <img
        :src="artist.cover"
        style="width: 250px; height: 240px; border-radius: 5px"
      />
    </div>
    <div class="rightinfo">
      <span class="name">{{ artist.name }}</span>
      <div class="result">
        <div class="singles">单曲数：{{ artist.musicSize }}</div>
        <div class="album">专辑数：{{ artist.albumSize }}</div>
        <div class="mvcount">MV数：{{ artist.mvSize }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artist: Object,
  },
  data() {
    return {
      artistinfo: {},
    };
  },
  created() {
    this.artistinfo = this.artist;
  },
};
</script>

<style lang="less" scoped>
.singerinfo {
  display: flex;
  .rightinfo {
    display: flex;
    flex-direction: column;
    margin-left: 35px;
    margin-top: 35px;
    align-items: baseline;
    .name {
      font-size: 25px;
      font-weight: bold;
    }
    .result {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: baseline;
      div {
        margin-bottom: 23px;
      }
    }
  }
}
</style>
