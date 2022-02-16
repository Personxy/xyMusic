<template>
  <div class="album">
    <div
      class="albumlist"
      v-for="item in result.albums"
      :key="item.id"
      @click="toalbumpage(item.id)"
    >
      <div class="cover">
        <el-image :src="item.picUrl"></el-image>
      </div>
      <div class="albumname">{{ item.name }}</div>
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
      result: {},
    };
  },
  methods: {
    async getalbumlist() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      const { data } = await this.$http.get("/cloudsearch", {
        params: {
          keywords: this.keywords,
          type: 10,
          limit: 30,
        },
      });
      this.result = data.result;
      // console.log(this.result);
      loading.close();
    },
    toalbumpage(id) {
      this.$router.push(`/home/album/${id}`);
    },
  },
  created() {
    this.getalbumlist();
  },
  watch: {
    keywords() {
      this.getalbumlist();
    },
  },
};
</script>

<style lang="less" scoped>
.album {
  .albumlist {
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
    .albumname {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .albumlist:nth-child(even) {
    background-color: #f9f9f9;
  }
  .albumlist:hover {
    background-color: #f0f1f2;
  }
}
</style>
