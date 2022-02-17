<template>
  <div class="newsongs">
    <div class="newsongstop">
      <!-- 条件选项 -->
      <div class="newsongsconditionbox">
        <div :class="[
            newsongscontionclass,
            { newsongscontionActive: currentnewsongscontion == index },
          ]"
             v-for="(item, index) in newsongscontion"
             :key="index"
             @click="selectnewsongscontion(index, item[0])">
          {{ item[1] }}
        </div>
      </div>
      <div class="newsongscontrol">
        <!-- 播放全部 -->
        <div class="playall"
             @click="playallmusic">
          <p class="triangular"></p>
          <span>播放全部</span>
        </div>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <div class="newsongsbox"
         v-loading="loading">
      <div class="newsongsli"
           v-for="(item, index) in newsongslist"
           :key="item.id">
        <!-- index -->
        <div class="songsindex">
          {{ 10 > index + 1 ? "0" + (index + 1) : index + 1 }}
        </div>
        <div class="songscover"
             @click="playnewsong(item.id)">
          <img :src="item.album.picUrl"
               alt="" />
          <div class="playbutton">
            <img src="../../../../assets/images/显示在图片上的播放按钮.svg"
                 alt="" />
          </div>
        </div>
        <div class="songsname">{{ item.name }}</div>
        <div class="songsauthor">{{ item.artists[0].name }}</div>
        <div class="songsalbum">{{ item.album.name }}</div>
        <div class="songsduration">
          {{ (item.duration / 1000) | minutesformat }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import _ from "lodash"
export default {
  data () {
    return {
      newsongscontion: [
        [0, "全部"],
        [7, "华语"],
        [96, "欧美"],
        [8, "日本"],
        [16, "韩国"],
      ],
      newsongscontionclass: "newsongscontionclass",
      currentnewsongscontion: 0,
      newsongslist: [],
      loading: false,
      index: 0,
      newarry: [
        {
          al: {
            picUrl: "",
          },
          id: "",
          dt: "",
          ar: [{ name: "" }],
        },
      ],
    };
  },
  methods: {
    // 播放
    async playnewsong (id) {
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
      if (res.data.data[0].url == null)
      {
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
    // 添加属性
    setobjkey (obj, str, str2) {
      for (var key in obj)
      {
        if (key != str)
        {
          obj[str] = { [str2]: "" };
        }
      }
      return obj;
    },
    // 添加属性
    setarrkey (obj, str, s2) {
      for (var key in obj)
      {
        if (key != str)
        {
          obj[str] = [{ [s2]: "" }];
        }
      }
      return obj;
    },
    // 播放所有歌曲
    async playallmusic () {
      // 清除当前播放列表
      this.$store.dispatch("clearplaysonglist");
      // console.log(this.playsonglist);
      for (let i = 0; i < this.newsongslist.length; i++)
      {
        this.newsongslist[i].dt = this.newsongslist[i].duration;
        this.setobjkey(this.newsongslist[i], "al", "picUrl").al.picUrl =
          this.newsongslist[i].album.picUrl;
        this.setarrkey(this.newsongslist[i], "ar", "name").ar[0].name =
          this.newsongslist[i].artists[0].name;
      }
      this.$store.dispatch("saveplaysonglist", this.newsongslist);

      // 获取当前列表第一首
      const res = await this.$http.get("/song/url", {
        params: {
          id: this.newsongslist[this.index].id,
          // cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      // console.log(this.newsongslist[this.index]);
      if (!res.data.data[0].url)
      {
        this.index++;
        this.$message.error("没有版权即将播放下一首！");
        setTimeout(() => {
          this.playallmusic();
          // console.log(this.index);
          // this.$message.error('没有播放来源！');
        }, 3000);
      } else
      {
        this.$store.dispatch("savecurrenturl", res.data.data[0].url);
        this.$store.dispatch("saveplaystatus", true);
        //获取歌曲详情
        const resdata = await this.$http.get("/song/detail", {
          params: {
            ids: this.newsongslist[this.index].id,
          },
        });
        // console.log(resdata);
        // 存入歌曲详情
        this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
        this.index = 0;
      }
    },
    // 选择新歌条件
    async selectnewsongscontion (index, item) {
      this.loading = true;
      this.currentnewsongscontion = index;
      const { data } = await this.$http.get("/top/song", {
        params: {
          type: item,
        },
      });
      this.newsongslist = data.data;

      this.loading = false;
    },
  },
  created () {
    // this.newsongslist = _.cloneDeep(this.newsongs)
    this.selectnewsongscontion(0, 0);
  },
  computed: {
    ...mapGetters(["cookie", "playsonglist"]),
  },
};
</script>

<style lang="less" scoped>
.newsongs {
  .newsongstop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .newsongsconditionbox {
      display: flex;
      .newsongscontionclass {
        cursor: pointer;
        margin-right: 15px;
        color: #8d8a8a;
        font-size: 15px;
      }
      .newsongscontionclass:hover {
        color: #443f3f;
      }
      .newsongscontionActive {
        color: #000000;
      }
    }
    .newsongscontrol {
      width: 106px;
      height: 25px;
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
          border-width: 7px;
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
        font-size: 10px;
      }
    }
  }
  .newsongsbox .newsongsli:nth-child(even) {
    background-color: #f9f9f9;
  }
  .newsongsbox {
    margin-top: 15px;
    .newsongsli:hover {
      background-color: #efefef;
    }
    .newsongsli {
      border-radius: 2px;
      height: 80px;
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 15px;
      .songsindex {
        width: 50px;
        text-align: right;
        margin-right: 15px;
        color: #a7a1a1;
      }
      .songscover {
        cursor: pointer;
        position: relative;
        img {
          height: 60px;
          width: 60px;
          border-radius: 5px;
        }
        .playbutton {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: rgba(254, 250, 250, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 16px;
          bottom: 20px;

          img {
            width: 15px;
            height: 15px;
            margin-left: 2px;
          }
        }
      }
      .songsname {
        width: 480px;
        margin-left: 15px;
      }
      .songsauthor {
        width: 190px;
      }
      .songsalbum {
        width: 300px;
      }
    }
  }
  /deep/.el-loading-spinner {
    top: 80px;
  }
  /deep/.el-loading-mask {
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
