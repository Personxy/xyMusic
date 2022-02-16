<template>
  <div class="videorecom">
    <div class="recomtitle">相关推荐</div>
    <div class="recomvideobox" v-if="simvideo.length !== 0">
      <div class="recomvideolist" v-for="item in simvideo" :key="item.id">
        <div class="videocover">
          <el-image
            :src="item.coverUrl"
            @click="tovideopage(item.vid)"
          ></el-image>
        </div>
        <div class="videoinfo">
          <div class="videoname">{{ item.title }}</div>
          <div class="videoauthor">by{{ item.creator[0].userName }}</div>
          <div class="videoplaycounts">
            <img src="../../../assets/images/歌单列表播放按钮.svg" alt="" />{{
              item.playTime | wan
            }}
          </div>
          <!-- 视频时长 -->
          <div class="videoduration">
            {{ (item.durationms / 1000) | minutesformat }}
          </div>
        </div>
      </div>
    </div>
    <div class="recomvideobox" v-if="simimv.length !== 0">
      <div class="recomvideolist" v-for="item in simimv" :key="item.id">
        <div class="videocover" @click="tomvpage(item.id)">
          <el-image :src="item.cover"></el-image>
        </div>
        <div class="videoinfo">
          <div class="videoname">{{ item.name }}</div>
          <div class="videoauthor">{{ item.artistName }}</div>
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    vid: String,
    id: Number,
  },
  data() {
    return {
      simvideo: [],
      simimv: [],
    };
  },
  methods: {
    async getrelatevideo() {
      const { data } = await this.$http.get("related/allvideo", {
        params: {
          id: this.videoid,
        },
      });
      this.simvideo = data.data;
    },
    async getrecommv() {
      const { data } = await this.$http.get("/simi/mv", {
        params: {
          mvid: this.mvid,
        },
      });
      this.simimv = data.mvs;
    },
    tovideopage(id) {
      this.$emit("sendvideoid", id);
    },
    tomvpage(id) {
      this.$emit("sendmvid", id);
    },
  },
  mounted() {
    if (this.vid) {
      this.getrelatevideo();
    } else {
      this.getrecommv();
    }
  },
  computed: {
    mvid() {
      return this.id;
    },
    videoid() {
      return this.vid;
    },
  },
  watch: {
    vid: {
      handler() {
        this.getrelatevideo();
      },
      deep: true,
    },
    id: {
      handler() {
        this.getrecommv();
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.videorecom {
  margin-left: 30px;
  .recomtitle {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .recomvideobox {
    width: 280px;
    height: 450px;
    .recomvideolist {
      display: flex;
      margin-bottom: 15px;

      .videocover {
        cursor: pointer;
        .el-image {
          width: 140px;
          height: 80px;
          border-radius: 5px;
        }
      }
      .videoinfo {
        font-size: 14px;
        margin-left: 10px;
        position: relative;
        .videoname {
          cursor: pointer;
          margin-top: 8px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .videoauthor {
          cursor: pointer;
          margin-top: 20px;
          font-size: 12px;
          color: #a3a29b;
        }
        .videoplaycounts {
          display: flex;
          align-items: center;
          position: absolute;
          top: 4px;
          left: -53px;
          color: white;
          font-size: 12px;
        }
        .videoduration {
          position: absolute;
          bottom: 4px;
          left: -46px;
          color: white;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
