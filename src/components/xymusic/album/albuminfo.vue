<template>
  <div class="albuminfo">
    <div class="albumdetailcover">
      <img :src="albuminfo.blurPicUrl" />
    </div>
    <div class="albumrightinfo">
      <!-- 歌单标题 -->
      <div class="albumtitle">
        <div class="albumtag">专辑</div>
        <div class="albumtitlename">
          <span>{{ albuminfo.name }}</span>
        </div>
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
        <!-- 收藏按钮
        <div>
          <div class="collect"
               v-if="userInfo && playlist.creator.userId == userInfo.userId"
               style="width: 110px; color: #b2b2b2">
            <img src="../../../assets/images/收藏.svg"
                 alt="" />
            收藏(0)
          </div>
        </div> -->
        <!-- 显示已收藏
        <el-popconfirm confirm-button-text="好的"
                       cancel-button-text="不用了"
                       icon="el-icon-info"
                       icon-color="red"
                       title="取消收藏？"
                       confirm-button-type="danger"
                       @confirm="changcollect"
                       trigger="click">
          <div slot="reference">
            <div class="collect"
                 v-if="
                  userInfo &&
                  albuminfo.info.liked
                ">
              <img src="../../../assets/images/已收藏.svg"
                   alt="" />
              已收藏({{ albuminfo.info.likedCount | wan }})
            </div>
          </div>
        </el-popconfirm>

        <! 显示未收藏 -->
        <!-- <div class="collect"
             @click="changcollect"
             v-if="
              userInfo &&
              !albuminfo.info.liked
            ">
          <img src="../../../assets/images/收藏.svg"
               alt="" />
          收藏({{ albuminfo.info.likedCount | wan }})
        </div> -->
        <!-- 歌手姓名 -->
      </div>
      <div class="albumauthor">
        歌手：<span
          style="color: #767db6"
          @click="tosingerpage(albuminfo.artist.id)"
          >{{ albuminfo && albuminfo.artist && albuminfo.artist.name }}</span
        >
      </div>
      <!-- 发布时间 -->
      <div class="auhorpublishtime">
        发布时间：{{ albuminfo.publishTime | dateFormat }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    albuminfo: Object,
    songs: Array,
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "cookie",
      "currentactive",
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
      if (this.albuminfo.info.liked) {
        // 取消收藏歌单
        const res = await this.$http.get("/album/sub", {
          params: {
            t: 2,
            id: this.albuminfo.album.id,
            cookie: this.cookie,
            timestamp: Date.now(),
          },
        });
        // console.log(res);
        if (res.data.code == 200) {
          this.albuminfo.info.liked = false;
          // this.$store.dispatch("savecurrentactive", "")
        } else {
          return this.$message({
            showClose: true,
            message: "操作失败！请稍后再试",
            type: "error",
          });
        }
      } else {
        // 收藏歌单
        const resa = await this.$http.get("/album/sublist", {
          params: {
            t: 1,
            id: this.albuminfo.album.id,
            cookie: this.cookie,
            timestamp: Date.now(),
          },
        });
        // console.log(resa);
        if (resa.data.code == 200) {
          // this.$store.dispatch("savecurrentactive", "/home/playlistpage/" + this.playListCollect[0].id)
          this.albuminfo.info.liked = true;
        } else {
          return this.$message({
            showClose: true,
            message: "操作失败！请稍后再试",
            type: "error",
          });
        }
      }
    },
    // 播放当前歌单所有歌曲 替换当前列表
    async playallmusic() {
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
        setTimeout(() => {
          this.playallmusic();
          // console.log(this.index);
          // this.$message.error('没有播放来源！');
        }, 3000);
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
      }
    },
    //添加当前歌单到播放列表
    addsheettoplaylist() {
      // console.log(this.songs);
      this.$store.dispatch("saveplaysonglist", this.songs);
    },
    //跳转到歌手详情页
    tosingerpage(id) {
      this.$router.push(`/home/singerdetail/${id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.albuminfo {
  display: flex;

  .albumdetailcover {
    img {
      width: 250px;
      border-radius: 10px;
      height: 250px;
    }
  }
  .albumrightinfo {
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    .albumtitle {
      display: flex;
      align-items: center;

      .albumtag {
        width: 50px;
        height: 28px;
        border: 1px solid #ec4141;
        border-radius: 5px;
        line-height: 28px;
        font-size: 14px;
        color: #ec4141;
        margin-right: 10px;
      }
      .albumtitlename {
        font-weight: bold;
        font-size: 24px;
        text-align: left;
      }
    }
    .controlBtn {
      display: flex;
      align-items: center;
      margin-top: 5px;
      margin-top: 20px;
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
    .albumauthor {
      text-align: left;
      margin-top: 20px;
      font-size: 15px;
      cursor: pointer;
    }
    .auhorpublishtime {
      text-align: left;
      margin-top: 20px;
      font-size: 15px;
    }
  }
}
</style>
