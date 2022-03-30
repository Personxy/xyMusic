<template>
  <div class="allsonglist">
    <!-- 采用v-infinite-scroll无限加载 -->
    <div v-infinite-scroll="getcatlist" infinite-scroll-distance="200px" infinite-scroll-delay="500" class="songlistbox">
      <div class="catlist" v-for="item in catlist" :key="item.id" @click="tolistdetail(item.id)">
        <img :src="item.coverImgUrl" style="width: 240px; height: 250px; border-radius: 5px" />
        <div class="shadowmask" style="width: 240px; height: 250px; border-radius: 5px"></div>
        <span>{{ item.name }}</span>
        <!-- 播放量 -->
        <div class="playcount">
          <img src="../../../../assets/images/歌单列表播放按钮.svg" alt="" />
          {{ (item.playcount || item.playCount) | wan }}
        </div>
        <!-- 播放显示按钮显示       -->
        <div class="playbtn">
          <img src="../../../../assets/images/红色播放按钮.svg" style="width: 55%; height: 55%; margin-left: 13.1%; margin-top: 21.5%" alt="" />
        </div>
      </div>
    </div>
    <div class="" v-if="loading" style="margin-top: 20px; font-size: 15px">加载中<i class="el-icon-loading" style="margin-left: 5px"></i></div>
  </div>
</template>

<script>
import { bus } from '../../../../plugins/bus';
export default {
  data() {
    return {
      // 歌单分类名
      catname: '',
      // 歌单列表
      catlist: [],
      offset: 0,
      loading: false,
      total: 1000,
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
      this.loading = true;
      this.catlist.push.apply(this.catlist, data.playlists);
      // 清除重复
      this.catlist = this.catlist.filter((element, index, arr) => {
        return arr.findIndex((el) => el.id == element.id) === index;
      });
      // console.log(this.catlist);
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
    // 获取歌单分类名
    bus.$on('catname', (data) => {
      this.catname = data;
      this.offset = 0;
      this.catlist = [];
      this.getcatlist();
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
    display: block;
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
      display: none;
      height: 13%;
      width: 17%;
      background: #fafafb;
      // -webkit-backdrop-filter: blur(8px);
      // backdrop-filter: blur(8px);
      // background: hsla(0, 0%, 100%, 0.14);
      border: 1px solid hsla(0, 0%, 100%, 0.08);
      border-radius: 50%;
      // cursor: default;
      transition: 0.2s;
    }
    span {
      display: block;
      text-align: left;
      font-size: 15px;
    }
  }
}
</style>
