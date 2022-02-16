<template>
  <div class="songs">
    <div class="recomcontrol">
      <div class="playadd">
        <!-- 播放全部 -->
        <div class="playall" @click="playallmusic">
          <p class="triangular"></p>
          <span>播放全部</span>
        </div>
        <!-- 添加歌单到播放列表 -->
        <div class="add" @click="addsheettoplaylist">+</div>
      </div>
    </div>
    <!-- 播放列表 -->
    <div class="recomtable">
      <el-table
        :data="result.songs"
        stripe
        style="width: 100%"
        @row-dblclick="getmusic"
        @cell-mouse-enter="hovertitle(true)"
        @cell-mouse-leave="hovertitle(false)"
        @cell-click="tosingerpage"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- 收藏按钮
        <el-table-column prop="likemusicflag"
                         label="操作"
                         width="60">
          <template slot-scope="scope">
            <img style="cursor: pointer"
                 src="../../assets/images/爱心.svg"
                 @click="changecollectcondition(true, scope.row.id)"
                 alt=""
                 v-if="!scope.row.likemusicflag" />
            <img src="../../assets/images/爱心已收藏.svg"
                 style="cursor: pointer"
                 alt=""
                 @click="changecollectcondition(false, scope.row.id)"
                 v-if="scope.row.likemusicflag" />
          </template>
        </el-table-column> -->
        <el-table-column
          prop="name"
          label="标题"
          width="650"
          class="table-title"
        >
          <template slot-scope="scope">
            <div
              v-if="songDetails ? scope.row.id == songDetails.id : false"
              style="color: #ec4141"
            >
              {{ scope.row.name }}
              <!-- 当前播放动画 -->
              <div v-if="playstatus" style="display: inline-block">
                <playanimation />
              </div>
              <!-- 暂停图标 -->
              <img
                src="../../../assets/images/列表暂停图标1.svg"
                style="margin-bottom: -1px"
                alt=""
                v-else
              />
              <!-- 操作按钮 -->
              <el-tooltip
                class="item"
                effect="light"
                content="下一首播放"
                placement="top-start"
              >
                <div class="songsaddbtn" @click="addlistnextsong(scope.row)">
                  <img
                    src="../../../assets/images/加号.svg"
                    alt=""
                    v-show="showbtn"
                  />
                </div>
              </el-tooltip>
            </div>
            <div v-else>
              {{ scope.row.name }}
              <!-- 操作按钮 -->
              <el-tooltip
                class="item"
                effect="light"
                content="下一首播放"
                placement="top-start"
              >
                <div class="songsaddbtn" @click="addlistnextsong(scope.row)">
                  <img
                    src="../../../assets/images/加号.svg"
                    alt=""
                    v-show="showbtn"
                  />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="歌手" width="300">
          <template scope="scope">
            <span style="cursor: pointer">{{ scope.row.ar[0].name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专辑" width="400">
          <template scope="scope">
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
    </div>
  </div>
</template>

<script>
import playanimation from "../../../components/xymusic/animation/currentplayanimation.vue";
import { mapGetters } from "vuex";

export default {
  props: {
    keywords: String,
  },
  components: {
    playanimation,
  },
  data() {
    return {
      result: {},
      index: 0,
      showbtn: false,
    };
  },
  methods: {
    async getsongs() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      const { data } = await this.$http.get("/cloudsearch", {
        params: {
          keywords: this.keywords,
          type: 1,
          limit: 30,
        },
      });
      this.result = data.result;
      loading.close();
    },
    // 播放当前歌单所有歌曲 替换当前列表
    async playallmusic() {
      // loading
      const loading = this.$loading({
        lock: true,
        text: "操作中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      // 清除当前播放列表
      this.$store.dispatch("clearplaysonglist");
      // console.log(this.playsonglist);
      this.$store.dispatch("saveplaysonglist", this.result.songs);
      // 获取当前列表第一首
      const res = await this.$http.get("/song/url", {
        params: {
          id: this.result.songs[this.index].id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (!res.data.data[0].url) {
        this.index++;
        this.$message.error("没有版权即将播放下一首！");
        // const timer = setTimeout(() => {
        //   this.playallmusic();
        //   // console.log(this.index);
        //   // this.$message.error('没有播放来源！');
        // }, 3000);
        // clearInterval(timer)
        loading.close();
      } else {
        this.$store.dispatch("savecurrenturl", res.data.data[0].url);
        this.$store.dispatch("saveplaystatus", true);
        //获取歌曲详情
        const resdata = await this.$http.get("/song/detail", {
          params: {
            ids: this.result.songs[this.index].id,
          },
        });
        // console.log(resdata);
        // 存入歌曲详情
        this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
        this.index = 0;
        loading.close();
      }
    },
    //添加当前歌单到播放列表
    addsheettoplaylist() {
      // console.log(this.songs);
      this.$store.dispatch("saveplaysonglist", this.result.songs);
      return this.$message.success("添加成功！");
    },
    //播放音乐获取音乐src和音乐详情
    async getmusic(row) {
      const loading = this.$loading({
        lock: true,
        text: "播放资源获取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0,0)",
      });
      const res = await this.$http.get("/song/url", {
        params: {
          id: row.id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null) {
        loading.close();
        return this.$message.error("没有版权哦！");
      }

      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: row.id,
        },
      });
      //存入下一首播放列表
      this.$store.dispatch("savenextsong", resdata.data.songs[0]);
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      // //存入当前播放歌曲列表
      // this.$store.dispatch("saveplaysonglist", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
      loading.close();
    },
    // 添加到播放列表
    addlistnextsong(row) {
      //存入下一首播放列表
      let length = this.nextsonglist.length;
      this.$store.dispatch("savenextsonglist", row);
      if (length + 1 == this.nextsonglist.length) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "请不要重复添加",
          type: "warning",
        });
      }
    },
    hovertitle(flag) {
      this.showbtn = flag;
    },
    // 跳转到歌手或者专辑页面
    tosingerpage(row, column) {
      // console.log(row);
      // console.log(column);
      if (column.label === "歌手") {
        this.$store.dispatch("savesongdetailflag", false);
        this.$router.push(`/home/singerdetail/${row.ar[0].id}`);
      } else if (column.label === "专辑") {
        this.$store.dispatch("savesongdetailflag", false);
        this.$router.push(`/home/album/${row.al.id}`);
      }
    },
  },
  created() {
    this.getsongs();
  },
  watch: {
    keywords() {
      this.getsongs();
    },
  },
  computed: {
    ...mapGetters([
      "cookie",
      "songDetails",
      "playstatus",
      "nextsonglist",
      "playsonglist",
    ]),
  },
};
</script>

<style lang="less" scoped>
.recomcontrol {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 15px;

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
}
.songsaddbtn {
  float: right;
  margin-right: 50px;
  cursor: pointer;
  img {
    height: 15px;
  }
}
</style>
