<template>
  <div class="singer">
    <div
      class="singerlist"
      v-for="item in result.artists"
      :key="item.id"
      @click="tosingerpage(item.id)"
    >
      <div class="cover">
        <el-image :src="item.picUrl"></el-image>
      </div>
      <div class="singername">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keywords: String,
  },
  data() {
    return {
      result: [],
    };
  },
  methods: {
    async getsingerlist() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      const { data } = await this.$http.get("/cloudsearch", {
        params: {
          keywords: this.keywords,
          type: 100,
          limit: 30,
        },
      });
      this.result = data.result;

      loading.close();
    },
    tosingerpage(id) {
      this.$router.push(`/home/singerdetail/${id}`);
    },
  },
  created() {
    this.getsingerlist();
  },
  watch: {
    keywords() {
      this.getsingerlist();
    },
  },
};
</script>

<style lang="less" scoped>
.singer {
  .singerlist {
    width: 100%;
    height: 80px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .cover {
      .el-image {
        width: 60px;
        height: 60px;
        border-radius: 5px;
      }
    }
    .singername {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .singerlist:nth-child(even) {
    background-color: #f9f9f9;
  }
  .singerlist:hover {
    background-color: #f0f1f2;
  }
}
</style>
