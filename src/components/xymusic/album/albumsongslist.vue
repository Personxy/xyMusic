<template>
  <div class="albumsongslist">
    <el-table :data="newsongs"
              stripe
              style="width: 100%"
              @row-dblclick="getmusic"
              @cell-mouse-enter="hovertitle(true)"
              @cell-mouse-leave="hovertitle(false)">
      <el-table-column type="index"
                       width="50"> </el-table-column>
      <el-table-column prop="likemusicflag"
                       label="操作"
                       width="60">
        <template slot-scope="scope">
          <img style="cursor: pointer"
               src="../../../assets/images/爱心.svg"
               @click="changecollectcondition(true, scope.row.id)"
               alt=""
               v-if="!scope.row.likemusicflag" />
          <img src="../../../assets/images/爱心已收藏.svg"
               style="cursor: pointer"
               alt=""
               @click="changecollectcondition(false, scope.row.id)"
               v-if="scope.row.likemusicflag" />
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="标题"
                       width="650">
        <template slot-scope="scope">
          <div v-if="songDetails ? scope.row.id == songDetails.id : false"
               style="color: #ec4141">
            {{ scope.row.name }}
            <!-- 当前播放动画 -->
            <div v-if="playstatus"
                 style="display: inline-block">
              <playanimation />
            </div>
            <!-- 暂停图标 -->
            <img src="../../../assets/images/列表暂停图标1.svg"
                 style="margin-bottom: -1px"
                 alt=""
                 v-else />
            <!-- 操作按钮 -->
            <el-tooltip class="item"
                        effect="light"
                        content="下一首播放"
                        placement="top-start">
              <div class="songsaddbtn"
                   @click="addlistnextsong(scope.row)"><img src="../../../assets/images/加号.svg"
                     alt=""
                     v-show="showbtn"></div>
            </el-tooltip>
          </div>
          <div v-else>{{ scope.row.name }}
            <!-- 操作按钮 -->
            <el-tooltip class="item"
                        effect="light"
                        content="下一首播放"
                        placement="top-start">
              <div class="songsaddbtn"
                   @click="addlistnextsong(scope.row)"><img src="../../../assets/images/加号.svg"
                     alt=""
                     v-show="showbtn"></div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ar[0].name"
                       label="歌手"
                       width="300">
      </el-table-column>
      <el-table-column prop="al.name"
                       label="专辑"
                       width="400">
      </el-table-column>
      <el-table-column prop="dt"
                       label="时间"
                       width="60">
        <template slot-scope="dt">
          {{ (dt.row.dt / 1000) | minutesformat }}
        </template>

        <!-- <slot :dt="dt">
          {{dt.row.dt/1000 | minutesformat}}
        </slot> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import playanimation from "../animation/currentplayanimation";
export default {
  props: {
    songs: Array,
    likeplaylist: Array,

  },
  components: {
    playanimation,
  },
  data () {
    return {
      showbtn: false
    }
  },
  methods: {
    // 收藏与取消收藏
    async changecollectcondition (flag, id) {
      // console.log(flag);
      const res = await this.$http.get("/like", {
        params: {
          id: id,
          like: flag,
          cookie: this.cookie,
          timestamp: Date.now(),
        },
      });
      if (res.data.code != 200)
      {
        return this.$message({
          message: "操作频繁，请稍后再试！",
          type: "warning",
        });
      }
      this.newsongs.forEach((element) => {
        if (element.id == id)
        {
          // console.log(element.likemusicflag);
          element.likemusicflag = flag;
        }
      });
    },
    //播放音乐获取音乐src和音乐详情
    async getmusic (row) {
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: row.id,
        },
      });

      //存入下一首播放列表
      this.$store.dispatch('savenextsong', resdata.data.songs[0])
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      // //存入当前播放歌曲列表
      // this.$store.dispatch("saveplaysonglist", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
      const res = await this.$http.get("/song/url", {
        params: {
          id: row.id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null)
        return this.$message.error("没有版权哦！");
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);

    },
    // 添加到播放列表
    addlistnextsong (row) {
      //存入下一首播放列表
      this.$store.dispatch('savenextsonglist', row)
    },
    hovertitle (flag) {
      this.showbtn = flag
    }
  },
  computed: {
    newsongs () {
      // 拷贝传来的songlist
      return JSON.parse(JSON.stringify(this.songs));
    },
    ...mapGetters(["cookie", "songDetails", "playstatus"]),
  },
}
</script>

<style lang="less" scoped>
.songsaddbtn {
  float: right;
  margin-right: 50px;
  cursor: pointer;
  img {
    height: 17px;
  }
}
</style>