<template>
  <div class="singerdetail">
    <div v-for="item in introduction"
         :key="item.id">
      <p class="title">{{item.ti}}</p>
      <p class="content"
         style="white-space: pre-wrap;">{{item.txt}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    introduction: Array
  }
}
</script>

<style lang="less" scoped>
.singerdetail {
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