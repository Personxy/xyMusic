<template>
  <div>
    <div class="songlist">
      <!-- 分类 -->
      <category :loading="loading" v-show="!loading" />
      <!-- 所有歌单 -->
      <allsonglist v-show="!loading" :loading="loading" @loadingmethod="loadingchange" />
    </div>
    <div class="loading" v-show="loading"><i class="el-icon-loading" style="margin-top: 30px"></i><span style="margin-left: 10px">加载中</span></div>
  </div>
</template>
<script>
import category from '../../../components/xymusic/findmusic/songlist/category.vue';
import allsonglist from '../../../components/xymusic/findmusic/songlist/allsonglist.vue';
export default {
  components: {
    category,
    allsonglist,
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    loadingchange(data) {
      this.loading = data;
    },
  },
  created() {},
};
</script>
<style lang="less" scoped></style>
