<template>
  <div class="ranking"
       v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <!-- 官方榜 -->
    <div class="top5ranking">
      <span class="title">官方榜</span>
      <div class="top5box"
           v-for="item in top5ranking "
           :key="item.id">
        <!-- 封面 -->
        <div class="imgdiv">
          <img :src="item.coverImgUrl"
               alt=""
               @click="toranklist(item.id)"
               class="coverimg">
          <img src="../../../../assets/images/hover显示在歌单列表上的按钮.svg"
               style="width: 40px; height: 40px"
               alt=""
               class="playbtn"
               @click="toranklist(item.id)" />
        </div>

        <!-- 右边前五首 -->
        <div class="rightsongsbox">
          <div :class="[rightsongs, { active: item1.id == current.index&&item.id==current.id }]"
               v-for="(item1,index1) in item.tracks"
               :key="item1.id"
               @click="selectsong(item1.id,item.id)"
               @dblclick="getmusic(item1)">
            <div class="index_name"><span class="index">{{index1+1}}</span> <span class="name">{{item1.name}}</span></div> <span class="author">{{item1.ar[0].name}}</span>
          </div>
          <div class="checkall"
               @click="toranklist(item.id)">
            查看全部 &nbsp;>
          </div>
        </div>

      </div>
    </div>
    <!-- 全球榜 -->
    <div class="otherranking">
      <div class="title">全球榜</div>
      <div class="otherbox">
        <div class="ranking"
             v-for="item in otherranking"
             :key="item.id">
          <!-- 封面 -->
          <div class="othercover"
               @click="toranklist(item.id)">
            <img :src="item.coverImgUrl"
                 alt=""
                 class="othercoverimg">
            <!-- 播放量 -->
            <div class="playcount">
              <img src="../../../../assets/images/歌单列表播放按钮.svg"
                   alt="" />{{
            (item.playcount || item.playCount) | wan
          }}
            </div>
            <img src="../../../../assets/images/hover显示在歌单列表上的按钮.svg"
                 style="width: 40px; height: 40px"
                 alt=""
                 class="playbtn"
                 @click="toranklist(item.id)" />
          </div>
          <!-- 标题 -->
          <div class="othername">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      top5ranking: [],
      otherranking: [],
      // class
      rightsongs: "rightsongs",
      current: {
        index: 1000,
        id: 0
      },
      loading: false
    };
  },
  methods: {
    async getallranking () {
      this.loading = true
      // 获取所有榜单列表
      const { data } = await this.$http.get("/toplist");
      this.top5ranking = data.list.slice(0, 4)
      this.otherranking = data.list.slice(4)
      // console.log(this.top5ranking);
      //获取前五首歌曲
      for (let index = 0; index < this.top5ranking.length; index++)
      {
        const { data } = await this.$http.get("/playlist/detail", {
          params: {
            id: this.top5ranking[index].id
          }
        })
        // console.log(this.top5ranking[index]);
        // 把前五首放到榜单里
        this.top5ranking[index]["tracks"] = data.playlist.tracks.slice(0, 5)
        // console.log(this.top5ranking[index]);
      }
      this.loading = false
    },
    // 点击改变当前项颜色
    selectsong (index, id) {
      this.current.index = index;
      this.current.id = id

    },
    //播放音乐获取音乐src和音乐详情
    async getmusic (item) {
      const loading = this.$loading({
        lock: true,
        text: '播放资源获取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0,0)'
      });
      const res = await this.$http.get("/song/url", {
        params: {
          id: item.id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null)
      {
        loading.close()
        return this.$message.error("没有版权哦！");
      }
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: item.id,
        },
      });
      // console.log(resdata);
      //存入下一首播放列表
      this.$store.dispatch('savenextsong', resdata.data.songs[0])
      // 当前播放歌曲详情
      this.$store.dispatch("savesongDetails", resdata.data.songs[0]);
      //当前播放状态
      this.$store.dispatch("saveplaystatus", true);
      loading.close()

    },
    // 跳转到音乐详情
    toranklist (id) {
      this.$router.push({ path: `/home/playlistpage/${id}` },)
    }
  },
  created () {
    this.getallranking();
  },
  computed: {
    ...mapGetters(['cookie'])
  }

};
</script>
<style lang="less" scoped>
.ranking {
  .top5ranking {
    text-align: left;
    margin-top: 30px;
    .title {
      padding-left: 300px;
      font-weight: bold;
      font-size: 20px;
    }
    .top5box {
      margin-top: 20px;
      padding: 0 500px 0 300px;
      display: flex;
      margin-bottom: 30px;
      .imgdiv:hover .playbtn {
        display: block;
      }
      .imgdiv {
        position: relative;
        .coverimg {
          cursor: pointer;
          width: 200px;
          height: 200px;
          border-radius: 5px;
        }
        .playbtn {
          cursor: pointer;
          position: absolute;
          left: 40.3%;
          top: 37%;
          display: none;
        }
      }

      .rightsongsbox {
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        .rightsongs {
          width: 914px;
          height: 40px;
          display: flex;
          align-items: center;
          border-radius: 5px;
          font-size: 15px;
          justify-content: space-between;
          text-align: left;
          .index {
            margin-left: 5px;
            margin-right: 5px;
          }
          .author {
            margin-right: 12px;
          }
        }
        .rightsongs:hover {
          background-color: #f4f4f4;
        }
        .active {
          background-color: #efefef !important;
        }
        .checkall {
          margin-top: 8px;
          cursor: pointer;
          width: 90px;
          font-size: 15px;
        }
        .rightsongs:nth-child(odd) {
          background: #f9f9f9;
        }
        .rightsongs:nth-child(-n + 3) {
          .index {
            color: #ee6841;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .otherranking {
    padding: 0 200px 0 300px;
    .title {
      text-align: left;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .otherbox {
      display: flex;
      flex-wrap: wrap;
      .ranking {
        margin-bottom: 15px;
        margin-right: 20px;
        .othercover:hover .playbtn {
          display: block;
        }
        .othercover {
          position: relative;
          cursor: pointer;
          .othercoverimg {
            width: 215px;
            height: 215px;
            border-radius: 5px;
          }
          .playcount {
            display: flex;
            align-items: center;
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 14px;
            color: #efefef;
          }
          .playbtn {
            position: absolute;
            left: 91px;
            top: 84px;
            display: none;
          }
        }
        .othername {
          text-align: left;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
