<template>
  <div class="allsonglist">
    <!-- 采用v-infinite-scroll无限加载 -->
    <div v-infinite-scroll="getcatlist" infinite-scroll-distance="200px" infinite-scroll-delay="500" class="songlistbox">
      <div class="catlist" v-for="item in catlist" :key="item.id" @click="tolistdetail(item.id)">
        <el-image :src="item.coverImgUrl" style="width: 240px; height: 250px; border-radius: 5px"></el-image>
        <div class="shadowmask" style="width: 240px; height: 250px; border-radius: 5px" v-if="maskflag"></div>
        <span>{{ item.name }}</span>
        <!-- 播放量 -->
        <div class="playcount">
          <img src="../../../../assets/images/歌单列表播放按钮.svg" alt="" />
          {{ (item.playcount || item.playCount) | wan }}
        </div>
        <!-- 播放显示按钮显示       -->
        <div class="playbtn">
          <img src="../../../../assets/images/红色播放按钮.svg" style="" alt="" />
        </div>
      </div>
    </div>
    <div class="" v-if="loadingflag" style="margin-top: 20px; font-size: 15px">加载中<i class="el-icon-loading" style="margin-left: 5px"></i></div>
  </div>
</template>

<script>
import { bus } from '../../../../plugins/bus';
export default {
  props: {
    loading: Boolean,
  },
  data() {
    return {
      // 歌单分类名transition
      catname: '',
      // 歌单列表
      catlist: [],
      offset: 0,
      loadingflag: false,
      total: 1000,
      maskflag: false,
    };
  },
  methods: {
    // 获取歌单列表
    async getcatlist() {
      const { data } = await this.$http.get('/top/playlist', {
        params: {
          cat: this.catname,
          offset: this.offset,
          limit: 50,
        },
      });

      this.catlist.push.apply(this.catlist, data.playlists);
      // 清除重复
      this.catlist = this.catlist.filter((element, index, arr) => {
        return arr.findIndex((el) => el.id == element.id) === index;
      });
      this.total = data.total;
      this.offset = this.offset + 50;
    },
    // 跳转到歌单详情
    tolistdetail(id) {
      this.$router.push(`/home/playlistpage/${id}`);
    },
  },
  created() {
    this.getcatlist();
  },
  mounted() {
    this.maskflag = false;
  },
  beforeUpdate() {
    // 获取歌单分类名

    bus.$on('catname', (data) => {
      this.catname = data;
      this.offset = 0;
      this.catlist = [];
      this.maskflag = false;
      this.getcatlist();
    });
  },
  updated() {
    this.$nextTick(function () {
      this.$emit('loadingmethod', false);
      this.loadingflag = true;
      setTimeout(() => {
        this.maskflag = true;
      }, 500);
    });
  },
  beforeDestroy() {
    bus.$off('catname');
  },
};
</script>

<style lang="less" scoped>
.allsonglist {
  padding: 0 200px 0 129px;
  .songlistbox {
    display: flex;
    flex-wrap: wrap;
  }
  .catlist:hover .playbtn {
    opacity: 1;
  }
  .catlist {
    cursor: pointer;
    width: 240px;
    margin-right: 20px;
    margin-top: 25px;
    position: relative;

    .playcount {
      display: flex;
      align-items: center;
      position: absolute;
      top: 5px;
      right: 5px;
      color: #ffffff;
      font-size: 14px;
    }
    .shadowmask {
      position: absolute;
      top: 0;
      background: transparent;
      box-shadow: 0 0 55px #535355 inset;
    }
    .playbtn {
      position: absolute;
      right: 20px;
      bottom: 60px;
      opacity: 0;
      width: 40px;
      height: 40px;
      // -webkit-backdrop-filter: blur(8px);
      // backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid hsla(0, 0%, 100%, 0.08);
      border-radius: 50%;
      // cursor: default;
      transition: 0.5s;
      img {
        width: 22px;
        height: 22px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -11px; /* 高度的一半 */
        margin-left: -9px; /* 宽度的一半 */
      }
    }
    span {
      display: block;
      text-align: left;
      font-size: 15px;
    }
  }
}
</style>
