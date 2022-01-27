<template>
  <div class="wangyimv">
    <div class="wymvtitle">网易出品&nbsp;&nbsp;></div>
    <div class="wymvlistbox">
      <div class="wymvlist"
           v-for="item in wamgyimvlist"
           :key="item.id">
        <div class="wymvcover"
             @click="tovideodetail(item)">
          <el-image :src="item.cover"
                    lazy></el-image>
          <!-- 视频播放量 -->
          <div class="wymvplaycounts">
            <img src="../../../../assets/images/歌单列表播放按钮.svg"
                 alt="" />{{
            item.playCount  | wan
          }}
          </div>
        </div>
        <div class="wymvname">{{item.name}}</div>
        <div class="wymvauthor">{{item.artistName}}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    wamgyimvlist: Array
  },
  methods: {
    tovideodetail (data) {
      // 传递mv参数
      this.$router.push({
        path: '/home/videodetail',
        query: {
          id: data.id
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
.wangyimv {
  margin-top: 30px;

  .wymvtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    padding-left: 60px;
    cursor: pointer;
  }
  .wymvlistbox {
    display: flex;
    flex-wrap: wrap;
    margin-left: 60px;
    margin-top: 15px;
    .wymvlist {
      cursor: pointer;
      margin-right: 20px;
      width: 293px;
      text-align: left;
      margin-bottom: 15px;
      .wymvcover {
        position: relative;
        .el-image {
          width: 300px;
          height: 180px;
          border-radius: 5px;
        }
        .wymvplaycounts {
          display: flex;
          align-items: center;
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          color: white;
        }
      }
      .wymvname {
        font-size: 15px;
        margin-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .wymvauthor {
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
}
</style>