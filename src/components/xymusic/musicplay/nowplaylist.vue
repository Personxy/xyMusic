<template>
  <div class="playlistnow"
       v-if="playsonglist">
    <div class="playlist">
      <div style="
          text-align: left;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
          margin-top: 10px;
          padding-left: 10px;
        ">
        <span>当前播放</span>
      </div>
      <div style="
          text-align: left;
          color: #cfcfcf;
          padding-left: 10px;
          font-size: 14px;
        ">
        <span>总{{ playsonglist.length }}首</span>
        <span @click="clearcurrentlist"
              style="margin-left: 300px; color: #507daf; cursor: pointer">清空列表</span>
      </div>
      <el-table :data="playsonglist"
                style="border-top: 1px solid #f2f2f2; margin-top: 15px"
                stripe
                height="calc(100% - 90px)"
                @row-dblclick="playmusic"
                empty-text="你还没有添加任何歌曲"
                ref="playlist">
        <el-table-column property="name"
                         label="标题"
                         width="200"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="songDetails ? scope.row.id == songDetails.id : false"
                 style="color: #ec4141"
                 :ref="scope.row.id+'ref'">
              {{ scope.row.name }}
              <!-- 当前播放动画 -->
              <div v-if="playstatus"
                   style="display: inline-block">
                <playanimationa />
              </div>
              <!-- 暂停图标 -->
              <img src="../../../assets/images/列表暂停图标2.svg"
                   style="display: inline-block"
                   alt=""
                   v-else />
            </div>
            <div :ref="scope.row.id+'ref'"
                 v-else>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column property="ar[0].name"
                         label="歌手"
                         width="120"
                         show-overflow-tooltip></el-table-column>
        <el-table-column property="dt"
                         label="时间"
                         width="120">
          <template slot-scope="dt">
            {{ (dt.row.dt / 1000) | minutesformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120">
          <template slot-scope="scope">
            <span @click="deleteRow(scope.$index, scope.row)"
                  style="cursor: pointer">x</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import playanimationa from "../animation/currentplayanimation";
export default {
  data () {
    return {
      openflag: false,
    };
  },
  components: {
    playanimationa,
  },
  methods: {
    // 清空播放列表
    clearcurrentlist () {
      this.$confirm("是否清空当前播放列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("clearplaysonglist");
          this.$store.dispatch("saveplaystatus", false);
          this.$store.dispatch("savesongDetails", null);
          this.$store.dispatch("savecurrenturl", "");
          this.$store.dispatch("clearnextsonglist");
        })
        .catch(() => {
          return;
        });
    },

    // 获取音乐和详情并播放
    async playmusic (row) {
      const res = await this.$http.get("/song/url", {
        params: {
          id: row.id,
          // cookie: this.cookie,
          realIP: "116.25.146.177",
        },
      });
      // console.log(res.data.data[0].url);
      if (!res.data.data[0].url) return this.$message.error("没有播放来源！");
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      this.$store.dispatch("saveplaystatus", true);

      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: row.id,
        },
      });
      // console.log(resdata);
      // 存入歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
    },

    // 删除当前歌曲
    deleteRow (index, row) {
      // rows.splice(index, 1);
      // 如果删除的是当前播放的歌曲 则跳到下一首歌曲
      if (this.playsonglist[index + 1] && this.songDetails.id == row.id)
      {
        this.playmusic(this.playsonglist[index + 1]);
      }
      this.$store.dispatch("deletesong", index, row);
      // console.log(this.playsonglist);
      if (this.playsonglist.length == 0)
      {
        this.$store.dispatch("clearplaysonglist");
        this.$store.dispatch("saveplaystatus", false);
        this.$store.dispatch("savesongDetails", null);
        this.$store.dispatch("savecurrenturl", "");
      }
    },
    // 定位到当前播放的歌曲
    changetablescroll () {
      // console.log(this.$refs.playlist);
      for (let i = 0; i <= this.playsonglist.length; i++)
      {
        if (this.playsonglist[i]?.id == this.songDetails?.id)
        {
          this.$refs.playlist.setCurrentRow(this.playsonglist[i])
          let dom = this.$refs.playlist.bodyWrapper;
          this.$nextTick(() => {
            let elref = this.playsonglist[i].id + 'ref'
            let el = this.$refs[elref].getBoundingClientRect()
            if (el.top >= 0 &&
              el.left >= 0 &&
              el.bottom <=
              (window.innerHeight - 80 || document.documentElement.clientHeight - 80) &&
              el.right <=
              (window.innerWidth || document.documentElement.clientWidth))
            //判断是否在视图内
            {
              // console.log(el.top, '顶部');
              // console.log(el.left, 'left');
              // console.log(el.bottom, '底部');
              // console.log(window.innerHeight || document.documentElement.clientHeight, 'window.innerHeight || document.documentElement.clientHeight',);
              // console.log(el.right, 'right');
              return
            } else
            {
              var top2 = this.getElementTop(this.$refs[elref]);
              dom.scrollTo(0, top2 - 140);
            }
          });

        }

      }
      // 待改进：元素看不见时，将其置为第一个看的见的，看得见时，则不做任何定位滚动操作

    },
    // 获取当前元素距离页面最顶部的距离
    getElementTop (element) {
      var actualTop = element.offsetTop;
      var current = element.offsetParent;
      while (current !== null)
      {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    }

  },
  computed: {
    ...mapGetters(["playsonglist", "cookie", "songDetails", "playstatus"]),
  },
  mounted () {
    this.changetablescroll()
  },
  watch: {
    playsonglist () {
      this.changetablescroll()
    },
    songDetails () {
      this.changetablescroll()
    }
  }

};
</script>

<style lang="less" scoped>
.playlistnow {
  z-index: 9999999999;
  ::-webkit-scrollbar-thumb {
    // 滚动条颜色
    background: #fdfdfd !important;
  }
  .playlist {
    width: 36vw;
    height: calc(100vh - 81px);
    max-width: 500px;
    // border-radius: 1px;
    border-top: 1px solid #cccc;
    // border-left: 1px solid #cccc;
    position: fixed;
    z-index: 3000;
    // border-bottom: 1px solid #cccc;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
    top: 0px;
    right: 0;
    background-color: white;

    /deep/.el-table {
      thead {
        .cell {
          text-align: left; // table 表头 左对齐
        }
      }
      .delete-row {
        color: #d8d8d8;
      }

      .el-table__expand-icon {
        //修改 el-tabel 折叠按钮的位置
        float: right;
      }

      // 去掉table的border start----------------------------
      border: 0;
      th,
      tr,
      td {
        border: 0;
        background-color: #fff;
      }
      &::before {
        height: 0px;
      }
      &::after {
        width: 0;
      }

      .el-table__fixed:before {
        height: 0;
      }
      // 去掉table的border end----------------------------
    }
  }
}
</style>
