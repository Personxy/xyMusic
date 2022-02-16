<template>
  <div class="video">
    <div class="videolist" v-for="item in result.mvs" :key="item.id">
      <div class="cover">
        <el-image :src="item.cover" @click="tovideodetail(item.id)"></el-image>
        <!-- 视频播放量 -->
        <div class="videoplaycounts">
          <img src="../../../assets/images/歌单列表播放按钮.svg" alt="" />{{
            item.playCount | wan
          }}
        </div>
        <!-- 视频时长 -->
        <div class="videoduration">
          {{ (item.duration / 1000) | minutesformat }}
        </div>
      </div>
      <!-- 视频标题 -->
      <div class="videotitle" @click="tovideodetail(item.vid)">
        {{ item.name }}
      </div>
      <!-- 视频作者 -->
      <div class="videoauthor">{{ item.artists[0].name }}</div>
    </div>
    <div class="nomore" v-if="!result.mvs">没有更多结果了</div>
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
    async getvideolist() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      const { data } = await this.$http.get("/cloudsearch", {
        params: {
          keywords: this.keywords,
          type: 1004,
          limit: 30,
        },
      });
      this.result = data.result;
      // console.log(this.result);
      loading.close();
    },
    tovideodetail(id) {
      // 传递视频参数
      this.$router.push({
        path: "/home/videodetail",
        query: {
          id: id,
        },
      });
    },
  },
  created() {
    this.getvideolist();
  },
  watch: {
    keywords() {
      this.getvideolist();
    },
  },
};
</script>

<style lang="less" scoped>
.video {
  display: flex;
  flex-wrap: wrap;
  .videolist {
    width: 23.5%;
    margin-right: 15px;
    margin-top: 20px;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    .cover {
      position: relative;
      width: 100%;
      .el-image {
        width: 100%;
        // height: calc(@width * 0.56);
        max-height: 220px;
        border-radius: 5px;
      }
      .videoplaycounts {
        display: flex;
        align-items: center;
        position: absolute;
        color: white;
        right: 10px;
        top: 5px;
      }
      .videoduration {
        color: white;
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
    .videotitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .videoauthor {
      margin-top: 5px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgb(179, 176, 176);
    }
  }
}
</style>
