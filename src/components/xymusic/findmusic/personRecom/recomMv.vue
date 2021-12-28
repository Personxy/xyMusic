<template>
  <div class="recommv">
    <p style="font-size:18px;font-weight:bold;text-align:left;padding-left:130px">推荐MV
      &nbsp;&nbsp;&nbsp;></p>
    <div class="mvbox">
      <div class="mvs"
           v-for="item in mvlist"
           :key="item.id">

        <el-image :src="item.picUrl"
                  style="width:260px;height:150px;border-radius:5px"></el-image>
        <span style="font-size:14px">{{item.name}}</span>
        <span style="font-size:12px">{{item.artistName}}</span>
        <div class="playcount"><img src="../../../../assets/images/歌单列表播放按钮.svg"
               alt="">{{(item.playcount||item.playCount)| wan}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mvlist: []
    }
  },
  methods: {
    async getMV () {
      const { data } = await this.$http.get("/personalized/mv")
      this.mvlist = data.result
    }
  },
  created () {
    this.getMV()
  }
}
</script>

<style lang="less" scoped>
.mvbox {
  display: flex;
  margin-left: 115px;
  .mvs {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    cursor: pointer;
    position: relative;
    span {
      width: 260px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 5px;
    }
    .playcount {
      display: flex;
      align-items: center;
      color: #ffffff;
      position: absolute;
      top: 7px;
      right: 10px;
      font-size: 14px;
    }
  }
}
</style>