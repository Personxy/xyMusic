<template>
  <div class="recomlist">
    <p
      style="
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        padding-left: 60px;
        cursor: pointer;
      "
      @click="tosongslistpage"
    >
      推荐歌单&nbsp;&nbsp;&nbsp;>
    </p>
    <div class="songlistbox" style="display: flex; flex-wrap: wrap">
      <!-- 每日推荐歌曲 -->
      <div class="dailysongs" @click="torecomsongspage">
        <img
          style="width: 200px; height: 200px; border-radius: 5px"
          src="../../../../assets/images/每日推荐背景图.png"
          class="dailysongsbc"
        />
        <!-- 日历 -->
        <div class="rili">
          <div class="rilibox">
            <img src="../../../../assets/images/日历.svg" alt="" />
            <span>{{ 10 > daily ? "0" + daily : daily }}</span>
          </div>
        </div>

        <p>每日歌曲推荐</p>
        <img
          src="../../../../assets/images/hover显示在歌单列表上的按钮.svg"
          style="width: 40px; height: 40px"
          alt=""
          class="dailysongsbtn"
        />
      </div>
      <!-- 其他推荐歌单 -->
      <div class="ohterrecomlist" v-for="item in recomelist" :key="item.id">
        <el-image
          :src="item.picUrl"
          style="width: 200px; height: 200px; border-radius: 5px"
          @click="changeurl(item.id)"
        ></el-image>
        <p>{{ item.name }}</p>
        <!-- 播放量 -->
        <div class="playcount">
          <img src="../../../../assets/images/歌单列表播放按钮.svg" alt="" />{{
            (item.playcount || item.playCount) | wan
          }}
        </div>
        <!-- 播放显示按钮显示       -->
        <div class="playbtn">
          <img
            src="../../../../assets/images/hover显示在歌单列表上的按钮.svg"
            style="width: 40px; height: 40px"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      recomelist: [],
      dailySongs: [],
      daily: new Date().getDate(),
    };
  },
  methods: {
    // 登陆后推荐的歌单
    async getrecomlist() {
      const res = await this.$http
        .get("/recommend/resource", {
          params: {
            cookie: this.cookie,
            timeStamp: Date.now(),
          },
        })
        .catch((err) => {
          if (
            err == "Error: Request failed with status code 301" &&
            this.cookie
          ) {
            this.$message.error("登陆过期，请重新登陆！");
            // this.$store.commit("changeloginbar", true);
          }
        });
      if (res.data) {
        res.data.recommend = res.data.recommend.slice(0, 9);
        this.recomelist = res.data.recommend;
      }
    },
    //未登录推荐的歌单
    async getohterrecomlist() {
      const res = await this.$http.get("/personalized", {
        params: {
          limit: 9,
        },
      });
      // console.log(res);
      this.recomelist = res.data.result;
    },
    // 跳转到歌单详情
    changeurl(id) {
      this.$router.push(`/home/playlistpage/${id}`);
    },
    //跳转到歌单界面
    tosongslistpage() {
      this.$router.push("/home/findmusic/songlist");
    },
    //跳转到每日推荐歌曲详情页
    torecomsongspage() {
      console.log(1);
      this.$router.push("/home/recomsongs");
    },
  },
  created() {
    if (this.userInfo) {
      // console.log(this.userInfo);
      this.getrecomlist();
    } else {
      this.getohterrecomlist();
    }

    // this.getrecomsongs();
  },
  mounted() {
    this.$emit("recomlistdone", true);
  },
  watch: {
    userInfo() {
      if (this.userInfo) {
        this.getrecomlist();
      } else {
        this.getohterrecomlist();
      }
    },
  },
  computed: {
    ...mapGetters(["cookie", "userInfo"]),
  },
};
</script>
<style lang="less" scoped>
.recomlist {
  padding: 0 85px 0 70px;
  .songlistbox {
    .dailysongs {
      .el-image {
      }
    }
    font-size: 14px;
    p {
      width: 200px;
      text-align: left;
    }
    .ohterrecomlist:hover .playbtn {
      display: block;
    }
    .ohterrecomlist {
      margin-left: 60px;
      cursor: pointer;
      position: relative;
      .playcount {
        display: flex;
        align-items: center;
        position: absolute;
        top: 5px;
        right: 5px;
        color: #ffffff;
      }
      .playbtn {
        position: absolute;
        right: 10px;
        bottom: 70px;
        display: none;
      }
    }
    .dailysongs {
      cursor: pointer;
      margin-left: 60px;
      position: relative;
      .rili {
        position: absolute;
        top: 56px;
        left: 60px;
        .rilibox {
          position: relative;
          img {
            width: 90px;
            height: 90px;
          }
          span {
            position: absolute;
            bottom: 19px;
            right: 32px;
            color: white;
            font-size: 25px;
          }
        }
      }
      .dailysongsbc {
      }
      .dailysongsbtn {
        position: absolute;
        display: none;
        right: 10px;
        bottom: 75px;
      }
    }
    .dailysongs:hover img {
      display: inline;
    }
  }
}
</style>
