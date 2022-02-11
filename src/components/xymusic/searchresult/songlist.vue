<template>
  <div class="songslist">
    <div class="songlistbox"
         v-for="item in result.playlists"
         :key="item.id"
         @click="tolistdetail(item.id)">
      <div class="cover">
        <el-image :src="item.coverImgUrl"></el-image>
      </div>
      <div class="name">{{item.name}}</div>
      <div class="songscount">{{item.trackCount}}首</div>
      <div class="creator"><span>by</span>{{item.creator.nickname}}</div>
      <div class="playcount">
        <div class="playbtn"><img src="../../../assets/images/播放.svg"
               alt=""></div>{{item.playCount | wan}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    keywords: String
  },
  data () {
    return {
      result: {}
    }
  },
  methods: {
    async getplaylist () {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      const { data } = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keywords,
          type: 1000,
          limit: 30
        }
      })
      this.result = data.result
      // console.log(this.result);
      loading.close()
    },
    // 跳转到歌单详情
    tolistdetail (id) {
      this.$router.push(`/home/playlistpage/${id}`);
    },
  },
  created () {
    this.getplaylist()
  },
  watch: {
    keywords () {
      this.getplaylist()
    }
  }
}
</script>
<style lang="less" scoped>
.songlistbox {
  width: 100%;
  height: 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  .cover {
    .el-image {
      width: 60px;
      height: 60px;
      border-radius: 5px;
    }
  }
  .name {
    margin-left: 10px;

    width: 40%;
  }
  .songscount {
    width: 10%;
    color: #8d9094;
  }
  .creator {
    width: 35%;
    span {
      color: #8d9094;
      margin-right: 5px;
    }
  }
  .playcount {
    width: 10%;
    display: flex;
    align-items: center;
    .playbtn {
      width: 16px;
      height: 16px;
      border: 2px solid #ccc;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      margin-right: 5px;
      img {
        width: 10px;
      }
    }
  }
}
.songlistbox:nth-child(even) {
  background-color: #f9f9f9;
}
.songlistbox:hover {
  background-color: #f0f1f2;
}
</style>