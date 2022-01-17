<template>
  <div class="musiclyric">
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
      <div class="lyrictitle">
        {{songDetails.name}}
      </div>
      <div class="songauthorandalubm">
        <span @click="tosingerpage(songDetails.ar[0].id)"
              class="detailsinger">{{songDetails.ar[0].name}}-</span>
        <span @click="toalbumpage(songDetails.al.id)"
              class="detailalbum">{{songDetails.al.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      lyricinfo: {}
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
      this.lyricinfo = data
      console.log(this.songDetails);
    },
    toalbumpage (id) {
      this.$store.dispatch('savesongdetailflag', false)
      this.$router.push(`/home/album/${id}`)
    },
    tosingerpage (id) {
      this.$store.dispatch('savesongdetailflag', false)
      this.$router.push(`/home/singerdetail/${id}`)
    }
  },
  created () {
    this.getlyric()
  },
  computed: {
    ...mapGetters(["songDetails", 'playstatus', 'songdetailflag'])
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
    .lyrictitle {
      font-size: 32px;
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
}
</style>