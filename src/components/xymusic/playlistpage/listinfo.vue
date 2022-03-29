<template>
  <div>
    <div class="listdetail">
      <!-- 封面 -->
      <img :src="playlist.coverImgUrl" alt="" class="cover" />
      <div class="rightinfo">
        <!-- 歌单标题 -->
        <div class="title">
          <div class="tag">歌单</div>
          <div class="titlename">
            <span>{{ playlist.name }}</span>
          </div>
        </div>
        <!-- 歌单创建时间和创建者 -->
        <div class="creator">
          <img :src="playlist.creator.avatarUrl" alt="" />
          <!-- 创建者 -->
          <p>{{ playlist.creator.nickname }}</p>
          <!-- 创建时间 -->
          <span>{{ playlist.createTime | dateFormat }} </span>创建
        </div>
        <!-- 操作按钮 -->
        <div class="controlBtn">
          <div class="playadd">
            <!-- 播放全部 -->
            <div class="playall" @click="playallmusic">
              <p class="triangular"></p>
              <span>播放全部</span>
            </div>
            <!-- 添加歌单到播放列表 -->
            <div class="add" @click="addsheettoplaylist">+</div>
          </div>
          <!-- 收藏按钮 -->
          <div>
            <div
              class="collect"
              v-if="userInfo && playlist.creator.userId == userInfo.userId"
              style="width: 110px; color: #b2b2b2"
            >
              <img src="../../../assets/images/收藏.svg" alt="" />
              收藏(0)
            </div>
          </div>
          <!-- 显示已收藏 -->
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="取消收藏？"
            confirm-button-type="danger"
            @confirm="changcollect"
            trigger="click"
          >
            <div slot="reference">
              <div
                class="collect"
                v-if="
                  userInfo &&
                  playlist.subscribed &&
                  playlist.creator.userId != userInfo.userId
                "
              >
                <img src="../../../assets/images/已收藏.svg" alt="" />
                已收藏({{ playlist.subscribedCount | wan }})
              </div>
            </div>
          </el-popconfirm>

          <!-- 显示未收藏 -->
          <div
            class="collect"
            @click="changcollect"
            v-if="
              userInfo &&
              !playlist.subscribed &&
              playlist.creator.userId != userInfo.userId
            "
          >
            <img src="../../../assets/images/收藏.svg" alt="" />
            收藏({{ playlist.subscribedCount | wan }})
          </div>
        </div>
        <!-- 标签 -->
        <div class="playlistTag">
          <span>标签:</span>
          <p>
            <span v-for="(item, i) in playlist.tags" :key="i.id"
              >&nbsp;{{ item }}&nbsp;/</span
            >
          </p>
        </div>
        <!-- 歌曲总数与总播放量 -->
        <div class="playCount">
          <span
            >歌曲:&nbsp;{{ playlist.trackCount }}&nbsp;&nbsp;播放:&nbsp;{{
              playlist.playCount | wan
            }}</span
          >
        </div>
        <!-- 简介 -->
        <div class="brief-introduction" v-if="playlist.description">
          <el-collapse>
            <el-collapse-item
              :title="playlist.description.substring(0, 5) + '...'"
            >
              <div>{{ playlist.description }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    playlist: Object,
    songs: Array,
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "cookie",
      "currentactive",
      "playListCollect",
      "currenturl",
      "playsonglist",
    ]),
  },
  data() {
    return {
      index: 0,
    };
  },
  methods: {
    // 收藏歌单与否
    async changcollect() {
      const loading = this.$loading({
        lock: true,
        text: "操作中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      if (this.playlist.subscribed) {
        // 取消收藏歌单
        const res = await this.$http.get("/playlist/subscribe", {
          params: {
            t: 2,
            id: this.playlist.id,
            // cookie: this.cookie,
            timestamp: Date.now(),
          },
        });
        // console.log(res);
        if (res.data.code == 200) {
          this.updateplaylist();
          this.playlist.subscribed = false;
          loading.close();
          // this.$store.dispatch("savecurrentactive", "")
        }
      } else {
        // 收藏歌单
        const resa = await this.$http.get("/playlist/subscribe", {
          params: {
            t: 1,
            id: this.playlist.id,
            cookie: this.cookie,
            timestamp: Date.now(),
          },
        });
        // console.log(resa);
        if (resa.data.code == 200) {
          // this.$store.dispatch("savecurrentactive", "/home/playlistpage/" + this.playListCollect[0].id)
          this.updateplaylist();
          this.playlist.subscribed = true;
          loading.close();
        }
      }
    },
    // 更新歌单
    async updateplaylist() {
      let resdata = await this.$http.get("/user/playlist", {
        // 一定要加时间戳和cooke不然获取不到最新的歌单列表
        params: {
          uid: this.userInfo.userId,
          limit: 100,
          timestamp: Date.now(),
          cookie: this.cookie,
        },
      });
      // 找出个人歌单
      let playListm = resdata.data.playlist.filter((element) => {
        return element.userId == this.userInfo.userId;
      });
      // 找出收藏歌单
      let playListc = resdata.data.playlist.filter((element) => {
        return element.userId !== this.userInfo.userId;
      });
      // // console.log(playListc);
      // playListc.forEach(element => {
      //   console.log(element.name);
      // });
      // console.log("------");
      // 保存歌单
      this.$store.dispatch("saveplayListMine", playListm);
      this.$store.dispatch("saveplayListCollect", playListc);
      // this.$store.dispatch("savecurrentactive", "")
    },
    // 播放当前歌单所有歌曲 替换当前列表
    async playallmusic() {
      // loading
      const loading = this.$loading({
        lock: true,
        text: "操作中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      // 清除当前播放列表
      this.$store.dispatch("clearplaysonglist");
      // console.log(this.playsonglist);
      this.$store.dispatch("saveplaysonglist", this.songs);

      // 获取当前列表第一首
      const res = await this.$http.get("/song/url", {
        params: {
          id: this.songs[this.index].id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (!res.data.data[0].url) {
        this.index++;
        this.$message.error("没有版权即将播放下一首！");
        const timer = setTimeout(() => {
          this.playallmusic();
          // console.log(this.index);
          // this.$message.error('没有播放来源！');
        }, 3000);
        clearInterval(timer);
        loading.close();
      } else {
        this.$store.dispatch("savecurrenturl", res.data.data[0].url);
        this.$store.dispatch("saveplaystatus", true);
        //获取歌曲详情
        const resdata = await this.$http.get("/song/detail", {
          params: {
            ids: this.songs[this.index].id,
          },
        });
        // console.log(resdata);
        // 存入歌曲详情
        this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
        this.index = 0;
        loading.close();
      }
    },
    //添加当前歌单到播放列表
    addsheettoplaylist() {
      // console.log(this.songs);
      this.$store.dispatch("saveplaysonglist", this.songs);
      return this.$message.success("添加成功！");
    },
  },
};
</script>

<style lang="less" scoped>
.listdetail {
  // height: 250px;

  display: flex;
  img.cover {
    width: 250px;
    border-radius: 10px;
    height: 250px;
  }
  .rightinfo {
    margin-left: 30px;
    .title {
      display: flex;
      align-items: center;
      .tag {
        width: 50px;
        height: 28px;
        border: 1px solid #ec4141;
        border-radius: 5px;
        line-height: 28px;
        font-size: 14px;
        color: #ec4141;
        margin-right: 10px;
      }
      .titlename {
        font-weight: bold;
        font-size: 24px;
        text-align: left;
      }
    }
    .creator {
      display: flex;
      align-items: center;
      font-size: 14px;
      img {
        border-radius: 50%;
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
      p {
        color: #3b90b4;
      }
      span {
        margin-right: 3px;
        margin-left: 8px;
      }
    }
    .controlBtn {
      display: flex;
      align-items: center;
      margin-top: 5px;
      .playadd {
        width: 150px;
        height: 40px;
        border-radius: 20px;
        background-color: #ec4141;
        color: #ffffff;
        display: flex;
        align-items: center;

        .playall {
          display: flex;
          align-items: center;
          margin-left: 20px;
          cursor: pointer;
          .triangular {
            font-size: 0;
            line-height: 0;
            border-width: 8px;
            border-color: #ffffff;
            border-right-width: 0;
            border-style: dashed;
            border-left-style: solid;
            border-top-color: transparent;
            border-bottom-color: transparent;
            width: 10px;
          }
          width: 110px;
          height: 40px;
          font-size: 16px;
          border-right: 1px solid #da4848;
        }
        .add {
          width: 40px;
          height: 40px;
          font-size: 28px;
          line-height: 42px;
          font-weight: 100;
          cursor: pointer;
        }
      }
      .collect {
        cursor: pointer;
        width: 150px;
        height: 40px;
        border-radius: 30px;
        border: 1px solid #d8d8d8;
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          margin-right: 5px;
        }
      }
    }
    .playlistTag {
      display: flex;
      align-items: center;
      p {
        margin-left: 8px;
        span {
          color: #3b90b4;
        }
      }
    }
    .playCount {
      display: flex;
    }
    .brief-introduction {
      white-space: pre-line;
      margin-top: 6px;
      div {
        text-align: left;
      }
    }
  }
  /deep/ .el-popconfirm .el-button--primary {
    background-color: #ec4141 !important;
    border-color: #ec4141 !important;
  }
  .el-collapse {
    border: none;
  }
  /deep/ .el-collapse-item__header {
    border-bottom: none;
    width: 500px;
  }
}
</style>
