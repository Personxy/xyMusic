<template>
  <div class="songtablist">
    <el-table :data="newsongs" stripe style="width: 100%" @row-dblclick="getmusic" @cell-mouse-enter="hovertitle(true)" @cell-mouse-leave="hovertitle(false)" @cell-click="tosingerpage" v-if="false">
      <el-table-column type="index" width="50"> </el-table-column>
      <!-- 收藏按钮 -->
      <el-table-column prop="likemusicflag" label="操作" width="60">
        <template slot-scope="scope">
          <img style="cursor: pointer" src="../../../assets/images/爱心.svg" @click="changecollectcondition(true, scope.row.id)" alt="" v-if="!scope.row.likemusicflag" />
          <img src="../../../assets/images/爱心已收藏.svg" style="cursor: pointer" alt="" @click="changecollectcondition(false, scope.row.id)" v-if="scope.row.likemusicflag" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" width="650" class="table-title">
        <template slot-scope="scope">
          <div v-if="songDetails ? scope.row.id == songDetails.id : false" style="color: #ec4141">
            {{ scope.row.name }}
            <!-- 当前播放动画 -->
            <div v-if="playstatus" style="display: inline-block">
              <playanimation />
            </div>
            <!-- 暂停图标 -->
            <img src="../../../assets/images/列表暂停图标1.svg" style="margin-bottom: -1px" alt="" v-else />
            <!-- 操作按钮 -->
            <el-tooltip class="item" effect="light" content="下一首播放" placement="top-start">
              <div class="songsaddbtn" @click="addlistnextsong(scope.row)">
                <img src="../../../assets/images/加号.svg" alt="" v-show="showbtn" />
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            {{ scope.row.name }}
            <!-- 操作按钮 -->
            <el-tooltip class="item" effect="light" content="下一首播放" placement="top-start">
              <div class="songsaddbtn" @click="addlistnextsong(scope.row)">
                <img src="../../../assets/images/加号.svg" alt="" v-show="showbtn" />
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌手" width="300">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{ scope.row.ar[0].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专辑" width="400">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{ scope.row.al.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dt" label="时间" width="60">
        <template slot-scope="dt">
          {{ (dt.row.dt / 1000) | minutesformat }}
        </template>

        <!-- <slot :dt="dt">
          {{dt.row.dt/1000 | minutesformat}}
        </slot> -->
      </el-table-column>
    </el-table>
    <div class="tablehead">
      <span></span>
    </div>
    <RecycleScroller class="scroller" :items="newsongs" :item-size="50" key-field="id" v-slot="{ item, index }">
      <div class="songrow" @dblclick="getmusic(item)" @mouseover="hoveron(true, index)" @mouseleave="hoverleave(false)">
        <div class="songindex">{{ index + 1 >= 10 ? index + 1 : '0' + (index + 1) }}</div>
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
          <!-- 添加下一首 -->
          <el-tooltip class="item" effect="light" content="下一首播放" placement="top-start">
            <div class="songsaddbtn" @click="addlistnextsong(item)">
              <img src="../../../assets/images/加号.svg" alt="" v-show="showbtn && currentindex == index" />
            </div>
          </el-tooltip>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import playanimation from '../animation/currentplayanimation';
export default {
  props: {
    songs: Array,
    likeplaylist: Array,
  },
  components: {
    playanimation,
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
    //播放音乐获取音乐src和音乐详情
    async getmusic(row) {
      const loading = this.$loading({
        lock: true,
        text: '播放资源获取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0,0)',
      });
      const res = await this.$http.get('/song/url', {
        params: {
          id: row.id,
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
          ids: row.id,
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
    addlistnextsong(row) {
      //存入下一首播放列表
      let length = this.nextsonglist.length;
      this.$store.dispatch('savenextsonglist', row);
      if (length + 1 == this.nextsonglist.length) {
        this.$message({
          message: '添加成功',
          type: 'success',
        });
      } else {
        this.$message({
          message: '请不要重复添加',
          type: 'warning',
        });
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
};
</script>

<style lang="less" scoped>
.scroller {
  height: 100%;
}
/deep/.vue-recycle-scroller__item-view {
  position: static;
  // display: flex;
  font-size: 15px;
  // text-align: left;
  // align-items: center;
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
.songsaddbtn {
  float: right;
  margin-right: 50px;
  cursor: pointer;
  img {
    height: 14px;
  }
}
</style>
