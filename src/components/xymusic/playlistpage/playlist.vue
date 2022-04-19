<template>
  <div class="songtablist">
    <div class="tablehead">
      <div class="likehead">操作</div>
      <div class="songtitle">标题</div>
      <div class="singer">歌手</div>
      <div class="albumtitle">专辑</div>
      <div class="songstimetitle">时间</div>
    </div>
    <RecycleScroller class="scroller" :items="newsongs" :item-size="50" key-field="id" v-slot="{ item, index }">
      <div class="songrow" @dblclick="getmusic(item)" @mouseover="hoveron(true, index)" @mouseleave="hoverleave(false)" @contextmenu.prevent="rightClick($event, item)">
        <div class="songindex">
          {{ index + 1 >= 10 ? index + 1 : '0' + (index + 1) }}
        </div>
        <div class="likesong">
          <img style="cursor: pointer" src="../../../assets/images/爱心.svg" @click="changecollectcondition(true, item.id)" alt="" v-if="!item.likemusicflag" />
          <img src="../../../assets/images/爱心已收藏.svg" style="cursor: pointer" alt="" @click="changecollectcondition(false, item.id)" v-if="item.likemusicflag" />
        </div>
        <div class="songname" :style="songDetails && item.id == songDetails.id ? currentplaycolor : othercolor">
          {{ item.name }}
          <div v-if="playstatus && songDetails && item.id == songDetails.id" style="display: inline-block">
            <playanimation />
          </div>
          <img src="../../../assets/images/列表暂停图标1.svg" style="margin-bottom: -1px" alt="" v-if="!playstatus && songDetails && item.id == songDetails.id" />
        </div>
        <div class="singer">
          <span @click="tosingerpage(item)">{{ item.ar[0].name }}</span>
        </div>
        <div class="album">
          <span @click="toalbumpage(item)">{{ item.al.name }}</span>
        </div>
        <div class="songtime">{{ (item.dt / 1000) | minutesformat }}</div>
      </div>
    </RecycleScroller>
    <!-- 右键菜单 -->
    <div class="rightmenu" v-show="showrightmenu" ref="rightmenu" @click="closeMenu">
      <div class="rightmenuitemname">{{ rightmenuitem.name }}</div>
      <div class="rightmenuitem" @click="getmusic(rightmenuitem)">
        <span>播放</span>
      </div>
      <div class="rightmenuitem" @click="addlistnextsong()">
        <span>下一首播放</span>
      </div>
      <div class="rightmenuitem" @click="openaddtocollectlist">
        <span>添加到歌单</span>
      </div>
    </div>
    <collectionlist v-show="collectflag" @closecollectlist="toclosecollectlist" @tocreateadialog="createcollectlist" />
    <creatcollectionlist v-show="createflag" @closecreate="toclosecreate" :rightmenuitem="rightmenuitem" />
    <cover v-show="coverflag" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import playanimation from '../animation/currentplayanimation';
import collectionlist from './collectionlist.vue';
import creatcollectionlist from './creatcollectionlist.vue';
import cover from './cover.vue';

export default {
  props: {
    songs: Array,
    likeplaylist: Array,
  },
  components: {
    playanimation,
    collectionlist,
    creatcollectionlist,
    cover,
  },
  data() {
    return {
      showbtn: false,
      currentplaycolor: {
        color: '#ec4141',
      },
      othercolor: {
        color: 'black',
      },
      currentindex: Number,
      showrightmenu: false,
      rightmenuitem: {},
      collectflag: false,
      createflag: false,
      coverflag: false,
    };
  },
  methods: {
    // 收藏与取消收藏
    async changecollectcondition(flag, id) {
      const loading = this.$loading({
        lock: true,
        text: '操作中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)',
      });
      const res = await this.$http.get('/like', {
        params: {
          id: id,
          like: flag,
          // cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      if (res.data.code != 200) {
        loading.close();
        return this.$message({
          message: '操作频繁，请稍后再试！',
          type: 'warning',
        });
      }
      this.newsongs.forEach((element) => {
        if (element.id == id) {
          // console.log(element.likemusicflag);

          element.likemusicflag = flag;
        }
      });
      loading.close();
    },
    // 右键点击
    rightClick(e, item) {
      this.showrightmenu = true;
      this.rightmenuitem = item;
      this.$nextTick(
        function () {
          let largesetwidth = window.innerWidth - this.$refs.rightmenu.offsetWidth - 20;
          let largeestheight = window.innerHeight - this.$refs.rightmenu.offsetHeight - 80;
          if (e.x > largesetwidth) {
            this.$refs.rightmenu.style.left = largesetwidth + 'px';
          } else {
            this.$refs.rightmenu.style.left = e.x + 'px';
          }
          if (e.y > largeestheight) {
            this.$refs.rightmenu.style.top = largeestheight + 'px';
          } else {
            this.$refs.rightmenu.style.top = e.y + 'px';
          }
        }.bind(this)
      );
    },
    closeMenu() {
      this.showrightmenu = false;
    },
    createcollectlist() {
      this.collectflag = false;
      this.coverflag = true;
      this.createflag = true;
    },
    openaddtocollectlist() {
      this.showrightmenu = false;
      this.coverflag = true;
      this.collectflag = true;
    },
    toclosecollectlist() {
      this.collectflag = false;
      this.coverflag = false;
    },
    toclosecreate() {
      this.createflag = false;
      this.coverflag = false;
    },

    //播放音乐获取音乐src和音乐详情
    async getmusic(item) {
      const loading = this.$loading({
        lock: true,
        text: '播放资源获取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0,0)',
      });
      const res = await this.$http.get('/song/url', {
        params: {
          id: item.id,
          // cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null) {
        loading.close();
        return this.$message.error('没有版权哦！');
      }
      this.$store.dispatch('savecurrenturl', res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get('/song/detail', {
        params: {
          ids: item.id,
        },
      });
      //存入下一首播放列表
      this.$store.dispatch('savenextsong', resdata.data.songs[0]);
      // 当前播放歌曲详情
      this.$store.dispatch('savesongDetails', resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch('saveplaystatus', true);
      loading.close();
    },
    // 添加到播放列表
    addlistnextsong() {
      //存入下一首播放列表
      this.$store.dispatch('savenextsonglist', this.rightmenuitem);

      this.$message({
        message: '添加成功',
        type: 'success',
      });
      if (this.playsonglist.length === 0) {
        this.getmusic(this.rightmenuitem);
      }
    },
    hoveron(flag, index) {
      this.showbtn = flag;
      this.currentindex = index;
    },
    hoverleave(flag) {
      this.showbtn = flag;
    },
    //
    tosingerpage(item) {
      this.$store.dispatch('savesongdetailflag', false);
      this.$router.push(`/home/singerdetail/${item.ar[0].id}`);
    },
    toalbumpage(item) {
      this.$store.dispatch('savesongdetailflag', false);
      this.$router.push(`/home/album/${item.al.id}`);
    },
  },
  computed: {
    newsongs() {
      // 拷贝传来的songlist
      return JSON.parse(JSON.stringify(this.songs));
    },
    ...mapGetters(['cookie', 'songDetails', 'playstatus', 'nextsonglist', 'playsonglist']),
  },
  created() {},
  mounted() {
    //点击其他地方隐藏右键菜单
    document.onclick = function () {
      this.closeMenu();
    }.bind(this);
  },
};
</script>

<style lang="less" scoped>
.scroller {
  height: 100%;
}
.tablehead {
  height: 40px;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 15px;
  .likehead {
    width: 2%;
    margin-left: 3%;
    padding-left: 6px;
    min-width: 33px;
  }
  .songtitle {
    width: 40%;
    padding-left: 14px;
    padding-right: 12px;
  }
  .singer {
    width: 20%;
  }
  .albumtitle {
    width: 20%;
  }
  .songstimetitle {
    width: 10%;
  }
}
/deep/.vue-recycle-scroller__item-view {
  position: static;
  font-size: 15px;
  border-radius: 5px;
  .songrow {
    height: 50px;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: 15px;
    .songindex {
      width: 3%;
      padding-left: 10px;
    }
    .songname {
      width: 40%;
      padding: 0 12px;
      // display: flex;
      // align-items: center;
      // height: 50px;
    }
    .likesong {
      width: 2%;
      min-width: 33px;
      img {
        margin-top: 5px;
      }
    }
    .singer {
      width: 20%;
      span:hover {
        cursor: pointer;
      }
    }

    .album {
      width: 20%;
      span:hover {
        cursor: pointer;
      }
    }

    .songtime {
      width: 10%;
    }
  }
}
/deep/.vue-recycle-scroller__item-view:nth-child(odd) {
  background: #f9f9f9;
}
/deep/.vue-recycle-scroller__item-view:hover {
  background: #f0f1f2;
}
.rightmenu {
  position: fixed;
  width: 235px;
  background: #fff;
  border-left: 1px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 6px;

  z-index: 999;
  .rightmenuitemname {
    font-size: 15px;
    color: #333;
    margin-bottom: 6px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    width: 210px;
    padding-left: 5px;
    margin-left: 12px;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rightmenuitem {
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    text-align: left;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    img {
      margin-right: 10px;
    }

    &:hover {
      background: #f0f1f2;
    }
  }
}

.songsaddbtn {
  float: right;
  margin-right: 50px;
  cursor: pointer;
  img {
    height: 14px;
  }
}
</style>
