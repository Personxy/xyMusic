<template>
  <div class="videolist">
    <div
      class="videolistbox"
      v-infinite-scroll="getvideolist"
      infinite-scroll-distance="200px"
      infinite-scroll-delay="200"
    >
      <!-- 视频列表 -->

      <div
        class="videlist"
        @click="tovideodetail(item.data)"
        v-for="item in catlist"
        :key="item.id"
      >
        <!-- 视频封面 -->
        <div class="viodecover">
          <el-image :src="item.data.coverUrl" alt="" lazy></el-image>
          <!-- 视频播放量 -->
          <div class="videoplaycounts">
            <img
              src="../../../../assets/images/歌单列表播放按钮.svg"
              alt=""
            />{{ (item.data.playTime || item.data.playCount) | wan }}
          </div>
          <!-- 视频时长 -->
          <div class="videoduration">
            {{
              (item.data.durationms / 1000 || item.data.duration / 1000)
                | minutesformat
            }}
          </div>
        </div>
        <!-- 视频标题 -->
        <div class="videotitle">{{ item.data.title || item.data.name }}</div>
        <!-- 视频作者 -->
        <div class="videoauthor" v-if="item.data.creator">
          {{ item.data.creator.nickname }}
        </div>
        <div class="videoauthor" v-if="item.data.artists">
          {{ item.data.artists[0].name }}
        </div>
      </div>
    </div>
    <div class="loadbox" v-if="hasmore">
      <i class="el-icon-loading" style="margin-top: 30px"></i
      ><span style="margin-left: 10px">加载中</span>
    </div>
    <div class="nomore" v-if="!hasmore" style="margin-top: 100px">
      没有更多内容了请选择其他选项
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      catid: "全部视频",
      catlist: [],
      offset: 0,
      hasmore: true,
    };
  },
  props: {
    catId: String,
  },
  methods: {
    // 获取所有视频列表
    async getallvideolist() {
      this.$http
        .get("/video/timeline/all", {
          params: {
            // cookie: this.cookie,
            offset: this.offset,
            timeStamp: Date.now(),
          },
        })
        .then(({ data }) => {
          // console.log(data);
          this.offset = this.offset + 8;
          if (data.hasmore == false) return (this.hasmore = false);
          this.catlist.push.apply(this.catlist, data.datas);
          // 清除重复
          this.catlist = this.catlist.filter((element, index, arr) => {
            return (
              arr.findIndex((el) => el.data.vid == element.data.vid) === index
            );
          });
          // console.log(this.catlist);
          // 至少获取30条数据

          if (this.catlist.length < 30) {
            this.getallvideolist();
          }
        })
        .catch((err) => {
          if (
            err == "Error: Request failed with status code 301" &&
            this.cookie
          ) {
            this.$message.error("登录失效！请重新登陆使用视频功能");
            // this.$store.commit("changeloginbar", true);
          } else {
            this.$message.error("请登陆后使用视频功能");
            this.$store.commit("changeloginbar", true);
          }
        });
    },

    // 根据分类id获取视频列表
    async getvideolist() {
      if (this.catid === "全部视频") {
        this.getallvideolist();
      } else {
        if (this.catid === "") {
          return;
        }
        const { data } = await this.$http.get("/video/group", {
          params: {
            id: this.catid,
            offset: this.offset,
            // cookie: this.cookie,
            timeStamp: Date.now(),
          },
        });
        this.offset = this.offset + 8;
        this.catlist.push.apply(this.catlist, data.datas);
        // id为mv时
        if (this.catid === 1000) {
          // 清除重复
          this.catlist = this.catlist.filter((element, index, arr) => {
            return (
              arr.findIndex((el) => el.data.id == element.data.id) === index
            );
          });
        } else {
          // 清除重复
          this.catlist = this.catlist.filter((element, index, arr) => {
            return (
              arr.findIndex((el) => el.data.vid == element.data.vid) === index
            );
          });
        }
        // 至少获取30条数据
        if (this.catlist.length < 30) {
          this.getvideolist();
        }
      }
    },
    tovideodetail(data) {
      if (data.id) {
        // 传递mv参数

        this.$router.push({
          path: "/home/videodetail",
          query: {
            id: data.id,
          },
        });
      } else {
        // 传递视频参数

        this.$router.push({
          path: "/home/videodetail",
          query: {
            vid: data.vid,
          },
        });
      }
    },
  },

  created() {
    this.getallvideolist();
  },

  // mounted () {
  //   // bus.$off("catid");
  //   this.getallvideolist();
  //   bus.$on("catid", (data) => {
  //     this.catid = data;
  //     this.offset = 0;
  //     this.catlist = [];
  //     this.hasmore = true;
  //     this.getvideolist();
  //   });

  // },
  // beforeDestroy () {
  //   bus.$off('catid')
  // },
  watch: {
    cookie() {
      this.getallvideolist();
    },
    catId() {
      this.catid = this.catId;
      this.offset = 0;
      this.catlist = [];
      this.hasmore = true;
      this.getvideolist();
    },
  },
  // beforeDestroy () {
  //   bus.$off("catid");
  // },
  computed: {
    ...mapGetters(["cookie"]),
  },
};
</script>

<style lang="less" scoped>
.videolist {
  .videolistbox {
    display: flex;
    flex-wrap: wrap;
    .videlist {
      // width: 250px;
      width: 23.5%;
      margin-right: 8px;
      margin-top: 20px;
      text-align: left;
      font-size: 13px;
      cursor: pointer;
      .viodecover {
        position: relative;
        width: 100%;
        .el-image {
          width: 100%;
          // height: calc(@width * 0.56);
          height: 150px;
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
}
</style>
