<template>
  <div class="recommv">
    <div class="recommvtitle">推荐mv&nbsp;&nbsp;></div>
    <div class="recommvlistbox">
      <div class="recommvlist"
           v-for="item in recommv"
           :key="item.id">
        <div class="recommvcover">
          <el-image :src="item.picUrl"
                    alt=""></el-image>
          <!-- 视频播放量 -->
          <div class="recommvmvplaycounts">
            <img src="../../../../assets/images/歌单列表播放按钮.svg"
                 alt="" />{{
            item.playCount  | wan
          }}
          </div>
        </div>
        <div class="recommvname">{{item.name}}</div>
        <div class="recommvauthor">{{item.artists[0].name}}</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommv: Array
  },


}
</script>

<style lang="less" scoped>
.recommv {
  margin-top: 30px;
  .recommvtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    padding-left: 60px;
    cursor: pointer;
  }
  .recommvlistbox {
    display: flex;
    flex-wrap: wrap;
    margin-left: 60px;
    margin-top: 15px;
    .recommvlist {
      cursor: pointer;
      margin-right: 20px;
      width: 293px;
      text-align: left;
      margin-bottom: 15px;
      .recommvcover {
        position: relative;
        .el-image {
          width: 300px;
          height: 180px;
          border-radius: 5px;
        }
        .recommvmvplaycounts {
          display: flex;
          align-items: center;
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          color: white;
        }
      }
      .recommvname {
        font-size: 15px;
        margin-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .recommvauthor {
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
}
</style>