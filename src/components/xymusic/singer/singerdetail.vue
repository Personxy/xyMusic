<template>
  <div class="singerdetail">
    <div class="briefDesc">{{ introduction.briefDesc }}</div>
    <div v-for="item in introduction.introduction" :key="item.id">
      <p class="title">{{ item.ti }}</p>
      <p class="content" style="white-space: pre-wrap">{{ item.txt }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    introduction: Object,
  },
};
</script>

<style lang="less" scoped>
.singerdetail {
  .briefDesc {
    text-align: left;
    font-size: 15px;
    padding-left: 2em;
    color: rgb(68, 66, 66);
    line-height: 40px;
  }
  .title {
    text-align: left;
    font-size: 17px;
    font-weight: bold;
  }
  .content {
    text-align: left;
    font-size: 15px;
    padding-left: 2em;
    color: rgb(68, 66, 66);
    line-height: 40px;
  }
}
</style>
