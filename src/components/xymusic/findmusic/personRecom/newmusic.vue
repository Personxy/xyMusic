<template>
  <div class="newmusic">
    <p
      style="
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        padding-left: 130px;
        cursor: pointer;
      "
      @click="tonewmusicpage"
    >
      最新音乐 &nbsp;&nbsp;&nbsp;>
    </p>
    <div class="newsongbox">
      <div
        :class="[newsongsa, { active: index == current }]"
        v-for="(item, index) in newsongs"
        :key="item.id"
        style="width: 360px; height: 50px"
        @click="selectsong(index)"
        ref="song"
      >
        <!-- 歌曲图片 -->
        <div class="playimage" @click="playurl(item.id)">
          <el-image
            :src="item.picUrl"
            style="width: 50px; height: 50px; border-radius: 5px"
          ></el-image>
        </div>
        <!-- 歌曲信息 -->
        <div class="songinfo">
          <span class="songname">{{ item.name }}</span>
          <span class="songauthor">{{ item.song.artists[0].name }}</span>
        </div>
        <!-- 播放按钮 -->
        <img
          src="../../../../assets/images/最新音乐播放按钮.svg"
          alt=""
          class="playbtn"
          @click="playurl(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      newsongs: [],
      // 样式控制
      current: 1000,
      // 样式
      newsongsa: "newsongs",
    };
  },
  methods: {
    async getnewmusic() {
      const { data } = await this.$http.get("/personalized/newsong", {
        params: {
          limit: 12,
          // cookie: this.cookie,
        },
      });
      // console.log(data.result);
      this.newsongs = data.result;
    },
    // 点击改变当前项颜色
    selectsong(index) {
      this.current = index;
    },
    // 点击当前项图片播放音乐
    async playurl(id) {
      const loading = this.$loading({
        lock: true,
        text: "播放资源获取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0,0)",
      });
      const res = await this.$http.get("/song/url", {
        params: {
          id: id,
          // cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null) {
        loading.close();
        return this.$message.error("没有版权哦！");
      }
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: id,
        },
      });
      // console.log(resdata);
      //存入下一首播放列表
      this.$store.dispatch("savenextsong", resdata.data.songs[0]);
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
      loading.close();
    },
    tonewmusicpage() {
      this.$router.push("/home/findmusic/newmusic");
    },
  },
  created() {
    this.getnewmusic();
  },
  mounted() {
    this.$emit("getmusicdone", true);
  },
  computed: {
    ...mapGetters(["cookie"]),
  },
};
</script>

<style lang="less" scoped>
.newsongbox {
  display: flex;
  flex-direction: column;
  height: 250px;
  flex-wrap: wrap;
  padding-left: 130px;
  padding-right: 320px;
  .newsongs:hover {
    background-color: #eaeaea;
  }
  .active {
    background-color: #eaeaea;
  }
  .newsongs {
    width: 360px;
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    position: relative;
    border-radius: 5px;

    .playimage {
      cursor: pointer;
    }
    .playbtn {
      position: absolute;
      top: 11px;
      left: 11px;
      cursor: pointer;
    }
    .songinfo {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      text-align: left;
      .songname {
        font-size: 14px;
      }
      .songauthor {
        font-size: 10px;
        color: #929292;
        margin-top: 7px;
      }
    }
  }
}
</style>
