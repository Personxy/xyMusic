<template>
  <div class="Musicplayer">
    <audio :src="currenturl" ref="audio" autoplay @ended="getnextsong" @timeupdate="getcurrentTime"></audio>
    <!-- 返回键和收藏键 -->
    <transition enter-active-class="animate__animated animate__slideInDown  animate__fast " leave-active-class="animate__animated animate__slideOutUp animate__faster">
      <div class="detailinfo" v-show="songdetailflag" @click="opendetail(!songdetailflag)" style="cursor: pointer">
        <img src="../../../assets/images/下箭头.svg" alt="" />
      </div>
    </transition>
    <!-- 歌曲信息 -->
    <transition enter-active-class="animate__animated animate__slideInUp  animate__fast" leave-active-class="animate__animated animate__slideOutDown  animate__fast">
      <div class="musicInfo" v-if="songDetails && !songdetailflag">
        <!-- 歌曲图片 -->
        <div class="songspic" @click="opendetail(!songdetailflag)" style="width: 6.8vh; cursor: pointer; height: 6.8vh">
          <el-image :src="songDetails.al.picUrl" alt="" style="width: 6.8vh; height: 6.8vh"> </el-image>
          <div class="songpictrangle"></div>
        </div>
        <!-- 歌曲名和歌手名 -->
        <div class="songNameAndAuthor">
          <div style="margin-bottom: 5px" class="songname">
            <div class="namebox">{{ songDetails.name }}</div>
            <!-- 收藏按钮 -->
            <div class="likesongbtn" style="cursor: pointer">
              <img src="../../../assets/images/爱心.svg" v-if="!likebtn" @click="likethisong(songDetails.id, true)" alt="" /><img
                src="../../../assets/images/爱心已收藏.svg"
                alt=""
                v-if="likebtn"
                @click="likethisong(songDetails.id, false)"
              />
            </div>
          </div>
          <span @click="tosingerpage(songDetails.ar[0].id)" style="cursor: pointer" class="songauthor">{{ songDetails.ar[0].name }}</span>
        </div>
      </div>
    </transition>

    <!-- 控制按钮 -->
    <div class="musicplay">
      <!-- 播放模式 -->
      <div class="playorder">
        <!-- 顺序播放 -->
        <el-tooltip class="item" effect="light" content="顺序播放" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" v-show="playorder === 1" style="font-size: 18px; cursor: pointer" @click="changeplayorder(1)">&#xe6a1;</span>
        </el-tooltip>

        <!-- 列表循环 -->
        <el-tooltip class="item" effect="light" content="列表循环" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" v-show="playorder === 2" style="font-size: 20px; cursor: pointer" @click="changeplayorder(2)">&#xe6a3;</span>
        </el-tooltip>

        <!-- 单曲循环 -->
        <el-tooltip class="item" effect="light" content="单曲循环" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" v-show="playorder === 3" style="font-size: 20px; cursor: pointer" @click="changeplayorder(3)">&#xe6a2;</span>
        </el-tooltip>

        <!-- 随机播放 -->
        <el-tooltip class="item" effect="light" content="随机播放" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" v-show="playorder === 4" style="font-size: 20px; cursor: pointer" @click="changeplayorder(4)">&#xe6a0;</span>
        </el-tooltip>
      </div>

      <!-- 上一首 -->
      <div class="lastsong" @click="getlastsong()">
        <el-tooltip class="item" effect="light" content="上一首" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" style="font-size: 25px; cursor: pointer">&#xe6ac;</span>
        </el-tooltip>
      </div>
      <!-- playAndPause -->
      <div class="playAndPause">
        <!-- 暂停按钮 -->
        <div v-if="currenturl && playstatus" @click="pause()">
          <el-tooltip class="item" effect="light" content="暂停" placement="bottom-start" :visible-arrow="false" :open-delay="500">
            <span class="iconfont pause" style="font-size: 22px; cursor: pointer" id="">&#xe61d;</span>
          </el-tooltip>
        </div>
        <!-- 播放按钮 -->
        <div v-else @click="play()">
          <el-tooltip class="item" effect="light" content="播放" placement="bottom-start" :visible-arrow="false" :open-delay="500">
            <span class="iconfont play" style="font-size: 22px; cursor: pointer">&#xe6aa;</span>
          </el-tooltip>
        </div>
      </div>
      <!-- 下一首 -->
      <div class="nextSong" @click="getnextsong()">
        <el-tooltip class="item" effect="light" content="下一首" placement="bottom-start" :visible-arrow="false" :open-delay="500">
          <span class="iconfont" style="font-size: 25px; cursor: pointer">&#xe6a9;</span>
        </el-tooltip>
      </div>
      <!-- 音量 -->
      <div class="volume">
        <img src="../../../assets/images/声音开.svg" @click="playmute" v-if="!muted" alt="" />
        <img src="../../../assets/images/声音静音.svg" v-if="muted" @click="closemute" alt="" />
        <el-slider v-model="currentvolume" class="volumebox" @input="dragvolume"></el-slider>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="progress" v-if="currenturl">
      <!-- 当前播放时间 -->
      <span class="currentTime">{{ Math.floor(progressvalue) | minutesformat }}</span>
      <el-slider
        v-model="progressvalue"
        class="progressbox"
        :max="Math.floor((songDetails ? songDetails.dt : 0) / 1000)"
        :show-tooltip="false"
        @change="changecurrentTime()"
        @mousedown.native="isdrag = true"
        @mouseup.native="isdrag = false"
        @mouseleave.native="isdrag = false"
      ></el-slider>
      <!-- 总播放时间 -->
      <span class="totalTime">{{ ((songDetails ? songDetails.dt : 0) / 1000) | minutesformat }}</span>
    </div>
    <!-- 播放列表按钮 -->
    <div class="playlistbtn">
      <img src="../../../assets/images/播放列表按钮.svg" alt="" class="listbtn" @click="openplaylist(openflag)" />
    </div>
    <nowplaylist v-show="openflag"></nowplaylist>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import nowplaylist from './nowplaylist.vue';
export default {
  computed: {
    ...mapGetters(['currenturl', 'songDetails', 'playstatus', 'playorder', 'playsonglist', 'volume', 'currentTime', 'cookie', 'userInfo', 'songdetailflag']),
    // progressvalue: {
    //   // return this.$options.filters['minutesformat'](this.currentTime / 1000);

    //   get() {
    //     return this.currentTime / 1000;
    //   },
    //   set(value) {
    //     return value
    //   },
    // },
  },

  components: {
    nowplaylist,
  },

  data() {
    return {
      // 音量
      currentvolume: 50,
      //控制播放列表打开
      openflag: false,
      //进度条
      progressvalue: 0,
      //进度条是否被拖拽
      isdrag: false,
      //是否静音
      muted: false,
      datailflag: false,
      likebtn: false,
      likemusiclist: [],
    };
  },
  methods: {
    // 播放与暂停
    play() {
      if (this.currenturl === 'null') return;
      this.$refs.audio.play();
      this.$store.dispatch('saveplaystatus', true);
    },
    pause() {
      this.$refs.audio.pause();
      this.$store.dispatch('saveplaystatus', false);
    },
    // 选择播放顺序
    changeplayorder(order) {
      order = order + 1;
      if (order > 4) order = 1;
      this.$store.dispatch('saveplayorder', order);
    },
    // 播放上一首
    getlastsong() {
      let i = '';
      for (let index = 0; index < this.playsonglist.length; index++) {
        if (this.playsonglist[index].id == this.songDetails.id) {
          i = index;
          break;
        }
      }
      if (i == 0) {
        i = this.playsonglist.length;
      }
      if (this.playorder == 4) {
        this.startsong(i);
      }
      this.startsong(i - 1);
    },

    //播放下一首
    getnextsong() {
      let i = '';
      for (let index = 0; index < this.playsonglist.length; index++) {
        if (this.playsonglist[index].id == this.songDetails.id) {
          i = index;
          break;
        }
      }
      if (i == this.playsonglist.length - 1) {
        i = -1;
      }
      if (this.playorder == 4) {
        this.startsong(i);
      }
      this.startsong(i + 1);
    },
    // 开始播放
    async startsong(i) {
      let index = '';
      switch (this.playorder) {
        case 1:
          index = this.listcircle(i);
          break;
        case 2:
          index = this.orderplay(i);
          break;
        case 3:
          index = this.replay(i);
          break;
        case 4:
          index = this.randomplay(i);
      }

      // 获取url
      this.getsongurl(this.playsonglist[index].id);
      this.$store.dispatch('saveplaystatus', true);

      this.$store.dispatch('savesongDetails', this.playsonglist[index]);
    },
    // 获取url
    async getsongurl(id) {
      const res = await this.$http.get('/song/url', {
        params: {
          id: id,
          // cookie: this.cookie,
        },
      });
      if (res.data.data[0].url == null) {
        this.getnextsong();
      }
      this.$store.dispatch('savecurrenturl', res.data.data[0].url);
    },
    // 列表循环
    listcircle(index) {
      return index;
    },
    //顺序播放
    orderplay(index) {
      return index;
    },
    //单曲循环
    replay(index) {
      return index;
    },
    //随机播放
    randomplay() {
      let i = Math.floor(Math.random() * this.playsonglist.length);
      // console.log(index);
      return i;
    },
    // 点击音量进度条改变音量
    // changevolume () {
    //   // this.$store.dispatch('savevolume', this.currentvolume);
    //   // this.$store.dispatch('savevolume', this.currentvolume);
    //   this.$refs.audio.volume = this.currentvolume
    //   console.log(this.currentvolume);
    // },
    //拖动音量进度条改变音量
    dragvolume() {
      this.closemute(false);
      if (this.currentvolume === 0) {
        this.playmute(false);
      }
      this.$refs.audio.volume = this.currentvolume / 100;
    },
    //静音
    playmute(flag) {
      // console.log(flag);
      flag && this.$store.dispatch('savevolume', this.currentvolume);
      // console.log(this.volume);
      this.currentvolume = 0;
      this.muted = true;
      this.$refs.audio.muted = true;
    },
    // 关闭静音
    closemute(flag) {
      flag && (this.currentvolume = this.volume);
      this.muted = false;
      this.$refs.audio.muted = false;
    },
    // 打开关闭播放列表
    openplaylist(flag) {
      this.openflag = !flag;
    },
    // 动态获取当前播放的时间
    getcurrentTime() {
      // 因为是动态获取所以 在拖动进度条的时候必须判定是否正在拖动 不然就会在拖动的时候依然在获取播放时间进度 导致拖动结束会使进度条回到原点
      if (this.isdrag === true) return;
      this.$nextTick(function () {
        this.progressvalue = this.$refs.audio.currentTime;
      });
      this.$store.dispatch('savecurrentTime', this.progressvalue);
    },
    //拖动进度条改变播放时间
    changecurrentTime() {
      this.$refs.audio.currentTime = this.progressvalue;
      this.isdrag = false;
    },
    //跳转到歌手详情页
    tosingerpage(id) {
      this.$router.push(`/home/singerdetail/${id}`);
    },
    // toogle详情页
    opendetail(flag) {
      this.$store.dispatch('savesongdetailflag', flag);
    },
    // 喜欢取消喜欢音乐
    async likethisong(id, flag) {
      const { data } = await this.$http.get('/like', {
        params: {
          id: id,
          cookie: this.cookie,
          like: flag,
          timestamp: Date.now(),
        },
      });
      if (data.code == 200) {
        this.likebtn = flag;
        return this.$message({
          message: '操作成功',
          type: 'success',
        });
      } else {
        return this.$message.error('操作频繁稍后再试');
      }
    },
    async getlikemusiclist() {
      const { data } = await this.$http.get('/likelist', {
        params: {
          id: this.userInfo.id,
          cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      this.likemusiclist = data.ids;
      data.ids.forEach((element) => {
        if (element == this.songDetails.id) {
          this.likebtn = true;
        }
      });
    },
  },
  created() {
    this.userInfo && this.songDetails && this.getlikemusiclist();
  },
  watch: {
    currenturl(newurl, oldurl) {
      if (newurl == oldurl) return;
      this.progressvalue = 0;
    },
    songDetails(newvalue) {
      if (!newvalue) return;
      this.likebtn = false;
      this.likemusiclist.forEach((element) => {
        if (element == newvalue.id) {
          this.likebtn = true;
        }
      });
    },
  },
};
</script>
<style type="text/css">
.icon {
  width: 25px;
  height: 25px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
<style lang="less" scoped>
.Musicplayer {
  display: flex;
  align-items: center;
  padding-left: 10px;
  position: relative;
  height: 80px;
  z-index: 1800;
  .musicInfo {
    display: flex;
    align-items: center;
    width: 25%;
    .songspic {
      position: relative;
      .el-image {
        border-radius: 5px;
      }
      .songpictrangle {
        width: 18px;
        height: 18px;
        border-right: 1px solid #f4f4f4;
        border-top: 1px solid #f4f4f4;
        position: absolute;
        display: none;
        top: 50%;
        left: 50%;
        transform: rotate(314deg) translate(0%, -60%);
      }
    }
    .songspic:hover .el-image {
      // 给图片添加滤镜 blur越大越模糊 brightness越大图片越黑
      filter: blur(1px) brightness(50%);
    }
    .songspic:hover .songpictrangle {
      display: block;
    }

    .songNameAndAuthor {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      text-align: left;
      width: 60%;
      .songname {
        display: flex;
        width: 100%;
        align-items: center;
        .namebox {
          max-width: 80%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .likesongbtn {
          width: 20%;
          margin-left: 10px;
          margin-top: 5px;
        }
      }
      .songauthor {
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .detailinfo {
    position: absolute;
    height: 40px;
    top: 30px;
    left: 30px;
  }
  .musicplay {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    position: fixed;
    left: 40%;
    bottom: 28px;
    cursor: pointer;
    .playorder {
      position: absolute;
      left: -70px;
      span:hover {
        color: #ec4141;
      }
    }
    .lastsong {
      margin-right: 60px;
    }
    .lastsong:hover {
      color: #ec4141;
    }
    .nextSong {
      cursor: pointer;
      margin-right: 60px;
    }
    .nextSong:hover {
      color: #ec4141;
    }
    .playAndPause {
      cursor: pointer;
      height: 40px;
      width: 40px;
      border-radius: 100%;
      background-color: #f4f4f4;
      margin-right: 60px;
      text-align: center;
      line-height: 40px;
    }
    .playAndPause:hover {
      background-color: #e5e5e5;
    }
    .volume {
      display: flex;
      .volumebox {
        margin-left: 10px;
      }
      /deep/.el-slider__runway {
        width: 100px;
      }
      /deep/.el-slider__button {
        background-color: #ec4141;
        border: none;
        width: 10px;
        height: 10px;
      }
      /deep/.el-slider__bar {
        background-color: #ec4141;
      }
    }
  }
  .progress {
    position: fixed;
    bottom: -4px;
    left: 30%;
    /deep/.el-slider__runway {
      width: 700px !important;
      height: 4px;
    }
    /deep/.el-slider__button {
      background-color: #ec4141;
      border: none;
      width: 8px;
      height: 8px;
    }
    /deep/.el-slider__bar {
      background-color: #ec4141;
      height: 4px;
    }
    /deep/.el-slider__button-wrapper {
      top: -16px;
    }
    .currentTime {
      color: #999999;
      position: absolute;
      left: -40px;
      top: 10px;
      font-size: 14px;
    }
    .totalTime {
      color: #999999;
      position: absolute;
      right: -40px;
      top: 10px;
      font-size: 14px;
    }
  }
  .playlistbtn {
    position: absolute;
    right: 20px;
    top: 20px;
    .listbtn {
      cursor: pointer;
    }
  }
}
</style>
<style>
.el-tooltip__popper {
  font-size: 4px;
  padding: 4px 4px;
}
</style>
