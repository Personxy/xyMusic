<template>
  <div class="listsearch">
    <el-input v-model="searchdata" placeholder="搜索列表歌曲" size="mini" @keyup.enter.native="search" @input="search" ref="input"></el-input>
    <i class="el-icon-search" @click="search" size="mini"></i>
  </div>
</template>

<script>
export default {
  props: {
    newsongs: Array,
  },
  data() {
    return {
      searchdata: '',
    };
  },
  methods: {
    search() {
      this.$emit('search', this.searchdata);
    },
  },
};
</script>

<style lang="less" scoped>
.listsearch {
  position: absolute;
  width: 160px;
  right: 15px;
  top: 0;
}
/deep/.el-input__inner {
  border-radius: 20px;
  width: 160px;
  border: 0;
  text-indent: 12px;
  color: #363636;
  z-index: 1800;
  background-color: #f7f7f7;
}
.el-input {
  width: 10vw;
  z-index: 1800;
}
/deep/ input::-webkit-input-placeholder {
  color: #c8c8c8;
}
.el-icon-search {
  font-size: 12px;
  position: absolute;
  left: 25px;
  top: 8px;
  z-index: 1800;
  color: #4a4a4a;
}
</style>
