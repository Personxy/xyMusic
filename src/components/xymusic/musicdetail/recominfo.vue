<template>
  <div class="recominfo">
    <div class="recominfobox">
      <!-- 推荐歌单 -->
      <div class="recomplaylistbox">
        <div class="recomplaylisttitle">推荐歌单</div>
        <div class="recomplaylist"
             v-for="item in simisonglist"
             :key="item.id"
             @click="toplaylist(item.id)">
          <div class="recomplaylistcover">
            <el-image :src="item.coverImgUrl"
                      style="width:30px;cursor:pointer"></el-image>
          </div>
          <div class="recomplaylistname">{{item.name}}</div>
        </div>
      </div>
      <!-- //推荐歌曲 -->
      <div class="recomsongsbox">
        <div class="recomsongstitle">推荐歌曲</div>
        <div class="recomsongs"
             v-for="item in simisongs"
             :key="item.id"
             @click="getthesong(item.id)">
          <div class="recomsongscover">
            <el-image :src="item.album.picUrl"
                      style="width:30px;cursor:pointer"></el-image>
          </div>
          <div class="recomsongname">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      simisonglist: [],
      simisongs: []
    }
  },
  computed: {
    ...mapGetters(['songDetails', 'cookie', 'songdetailflag'])
  },
  methods: {
    // 获取相似歌单
    async getsimiplaylist () {
      const { data } = await this.$http.get('/simi/playlist', {
        params: {
          id: this.songDetails.id
        }
      })
      this.simisonglist = data.playlists
    },
    //获取相似歌曲
    async getsimisongs () {
      const { data } = await this.$http.get('/simi/song',
        {
          params: {
            id: this.songDetails.id
          }
        })
      this.simisongs = data.songs
    },
    // 获取歌曲
    async getthesong (id) {
      const res = await this.$http.get("/song/url", {
        params: {
          id: id,
          cookie: this.cookie,
        },
      });
      // console.log(res.data.data[0].url);
      if (res.data.data[0].url == null)
        return this.$message.error("没有版权哦！");
      this.$store.dispatch("savecurrenturl", res.data.data[0].url);
      //获取歌曲详情
      const resdata = await this.$http.get("/song/detail", {
        params: {
          ids: id
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
    },
    toplaylist (id) {
      this.$store.dispatch('savesongdetailflag', false)
      this.$router.push(`/home/playlistpage/${id}`);

    }

  },
  created () {
    this.getsimiplaylist()
    this.getsimisongs()
  },
  watch: {
    songDetails () {
      this.getsimiplaylist()
      this.getsimisongs()
    }
  }


}
</script>

<style lang="less" scoped>
.recominfo {
  width: 30%;
  margin-top: 200px;
  text-align: left;
  .recominfobox:hover {
    overflow-y: overlay;
  }
  .recominfobox {
    height: 260px;
    width: 45%;
    overflow: hidden;
    // box-shadow: 0px 0px 8px rgb(248, 245, 245) inset;
    .recomplaylistbox {
      .recomplaylisttitle {
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .recomplaylist:hover {
        background-color: #e9eaeb;
      }
      .recomplaylist {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 40px;
        cursor: pointer;
        .recomplaylistcover {
          height: 30px;
          .el-image {
            border-radius: 5px;
          }
        }
        .recomplaylistname {
          margin-left: 10px;
          font-size: 13px;
        }
      }
    }

    .recomsongsbox {
      .recomsongstitle {
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .recomsongs:hover {
        background-color: #e9eaeb;
      }
      .recomsongs {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 40px;
        cursor: pointer;
        .recomsongscover {
          height: 30px;
          .el-image {
            border-radius: 5px;
          }
        }
        .recomsongname {
          margin-left: 10px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>