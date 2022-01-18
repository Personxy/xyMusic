<template>
  <div class="musiclyric"
       v-show="songdetailflag">
    <!-- 唱片和拨片 -->
    <div class="discimg">
      <!-- 拨片 -->
      <div :class="{disctriger:playstatus,nodisctriger:!playstatus}"><img src="../../../assets/images/player_bar.png"
             alt=""></div>
      <!-- 唱片 -->
      <div :class="{discroate:playstatus,nodiscroate:!playstatus}"><img src="../../../assets/images/disc.png"
             alt="">
        <el-image :src="songDetails.al.picUrl"
                  alt=""
                  class="detailcover"></el-image>
      </div>
    </div>
    <!-- 歌词部分 -->
    <div class="lyricbox">
      <!-- 标题和演唱者 -->
      <div class="lyrictitle">
        <div :class="{titleactive:titlewidth>650,titlebox:true}"
             ref="lyrictitleinfo">{{songDetails.name}}</div>
      </div>
      <div class="songauthorandalubm">
        <span @click="tosingerpage(songDetails.ar[0].id)"
              class="detailsinger">{{songDetails.ar[0].name}}-</span>
        <span @click="toalbumpage(songDetails.al.id)"
              class="detailalbum">{{songDetails.al.name}}</span>
      </div>
      <!-- 歌词展示 -->
      <div class="lryicul"
           ref="lyricScroll">
        <ul ref="lyric"
            class="lyric"
            v-if="lrcObject.length > 1">
          <li v-for="(item, index) in lrcObject"
              :class="{lyricliactive:lyricIndex === index}"
              :key="index"
              :ref="lyricIndex === index ? 'lyricRef' : ''">
            {{ item.c }}
          </li>
        </ul>
        <div class="div"
             v-else>纯音乐，请欣赏</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      lyricinfo: '',
      lrcObject: [],
      lyricIndex: 0,
      titlewidth: 0
    }
  },
  methods: {
    // 获取歌词
    async getlyric () {
      const { data } = await this.$http.get("/lyric", {
        params: {
          id: this.songDetails.id
        }
      })
      this.lyricinfo = data.lrc.lyric
      this.makelyricarr(this.lyricinfo)
    },
    // 跳转到专辑页面
    toalbumpage (id) {
      this.$store.dispatch('savesongdetailflag', false)
      this.$router.push(`/home/album/${id}`)
    },
    // 跳转到歌手页面
    tosingerpage (id) {
      this.$store.dispatch('savesongdetailflag', false)
      this.$router.push(`/home/singerdetail/${id}`)
    },
    // 处理歌词
    makelyricarr (lrc) {
      var oLRC = {
        ms: [], //歌词数组{t:时间,c:歌词}
      };
      if (lrc.length == 0) return;
      var lrcs = lrc.split("\n"); //用回车拆分成数组 (每一句歌词都用换行隔开了)
      for (let i in lrcs)
      {
        //遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
        var start = 0;
        for (let k in arr)
        {
          start += arr[k].length; //计算歌词位置 长度叠加
        }

        var content = lrcs[i].substring(start); //获取歌词内容 相当于减去时间字符串的长度剩下的就是内容
        for (let k in arr)
        {
          var t = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
          // var t = arr[k]
          var s = t.split(":"); //分离:前后文字 便于计算成毫秒数
          oLRC.ms.push({
            //对象{t:时间,c:歌词}加入ms数组
            // t: t,
            t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
            c: content === "" ? "\n" : content,
          });
        }
      }
      oLRC.ms.sort(function (a, b) {
        //按时间顺序排序
        return a.t - b.t;
      });
      this.lrcObject = oLRC.ms;
      // console.log(this.lrcObject);
    },

  },
  created () {
    this.getlyric()
  },
  beforeUpdate () {
    this.titlewidth = this.$refs.lyrictitleinfo.clientWidth

  },
  watch: {
    songDetails () {
      this.getlyric()
      this.lyricIndex = 0;
      this.$refs.lyricScroll.scrollTop = 0

    },
    currentTime () {
      //对每次进来的进度条进行判断
      // 跟下一句台词时长是否匹配,如果匹配则当前高亮的索引值+1
      //使用循环找到最接近当前播放时间的歌词

      for (let i = 0; i < this.lrcObject.length; i++)
      {
        //这里使用小于符号判断是为了 保证回退音乐进度事件的效果实现性
        if (this.currentTime <= parseFloat(this.lrcObject[i].t))
        {
          if (this.lyricIndex === i - 1)
          {
            break;
          }
          //找到比当前时间点 大一点的后一位的歌词的索引值
          this.lyricIndex = i - 1;
          //动态绑定ref 根据距离顶部不同的位置来控制歌词滚动 (原生的滚动条动画效果未实现，需要的话可能需要换其他滚动条，eg:bater-scroll)
          //这里加入了一个效果就是滑下去查看歌词时，不会自动滑动 只有到了高亮显示在可视区才会滚动
          if (!this.$refs.lyricRef[0]) return
          if (this.$refs.lyricRef[0].offsetTop > 100)
          {

            this.$refs.lyricScroll.scrollTop = this.$refs.lyricRef[0].offsetTop - 100;
          } else if (this.$refs.lyricRef[0].offsetTop < -100)
          {
            console.log(1);
            this.$refs.lyricScroll.scrollTop = this.$refs.lyricRef[0].offsetTop + 100;
          }
          //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
          if (this.lyricIndex === this.lrcObject.length - 1)
          {
            this.lyricIndex = 0;
          }
          break;
        }

      }
    }
  },
  computed: {
    ...mapGetters(["songDetails", 'playstatus', 'songdetailflag', 'currentTime'])
  }

}
</script>

<style lang="less" scoped>
.musiclyric {
  height: 60%;
  text-align: left;
  display: flex;
  .discimg {
    width: 30%;
    position: relative;
    left: 12%;
    user-select: none;
    .disctriger {
      img {
        transform: rotate(0deg);
        transform-origin: 0 0;
        animation: disctrigeran;
        animation-duration: 0.4s;
        @keyframes disctrigeran {
          from {
            transform: rotate(-35deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      }
      position: absolute;
      left: 122px;
      top: 47px;
      z-index: 9999999;
    }
    .nodisctriger {
      img {
        transform: rotate(-35deg);
        transform-origin: 0 0;
        animation: nodisctrigeran;
        animation-duration: 0.4s;
        @keyframes nodisctrigeran {
          from {
            transform: rotate(0);
          }
          to {
            transform: rotate(-35deg);
          }
        }
      }
      position: absolute;
      left: 122px;
      top: 47px;
      z-index: 9999999;
    }
    .discroate {
      position: relative;
      top: 114px;
      width: 255px;
      transform: rotate(360deg);
      animation: discroatean;
      animation-duration: 18s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      @keyframes discroatean {
        from {
          animation-fill-mode: backwards;
          transform: rotate(0);
        }
        to {
          animation-fill-mode: forwards;

          transform: rotate(360deg);
        }
      }
      .detailcover {
        width: 143px;
        border-radius: 50%;
        position: absolute;
        left: 56px;
        top: 55px;
        transition: all 0.5s linear 0.1s;
      }
    }
    .nodiscroate {
      position: relative;
      top: 114px;
      .detailcover {
        width: 143px;
        border-radius: 50%;
        position: absolute;
        left: 56px;
        top: 55px;
        transition: all 0.5s linear 0.1s;
      }
    }
  }
  .lyricbox {
    width: 40%;
    text-align: center;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .lyrictitle {
      font-size: 32px;
      position: relative;
      overflow: hidden;
      max-width: 651px;
      .titlebox {
        overflow: hidden;
        white-space: nowrap;
      }
      .titleactive {
        white-space: nowrap;
        display: inline-block;
      }
      .titleactive:hover {
        animation: move 5s infinite alternate linear;
      }
      @keyframes move {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(calc(-100% + 651px), 0);
        }
      }
    }
    .songauthorandalubm {
      margin-top: 10px;
      font-size: 14px;
      color: #928f90;
      .detailsinger {
        cursor: pointer;
      }
      .detailsinger:hover {
        color: #235d9d;
      }
      .detailalbum {
        cursor: pointer;
      }
      .detailalbum:hover {
        color: #235d9d;
      }
    }
  }
  .lryicul:hover {
    overflow-y: overlay;
  }
  .lryicul {
    position: relative;
    width: 600px;
    height: 400px;
    overflow: hidden;
    margin-top: 25px;
    transition: scrollTop 0.3s;
    .lyric {
      list-style-type: none;
      padding-inline-start: 0px;
      li {
        margin-top: 15px;
        color: #656564;
        font-size: 16px;
      }
      .lyricliactive {
        font-size: 20px;
        font-weight: bold;
        color: black;
      }
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #cecdd3;
        border-radius: 3px;
      }
    }
  }
}
</style>