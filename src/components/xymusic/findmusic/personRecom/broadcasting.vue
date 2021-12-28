<template>
  <div class="broadcasting">
    <p style="font-size:18px;font-weight:bold;text-align:left;padding-left:70px">独家放送&nbsp;&nbsp;&nbsp;></p>
    <div class="broadcastinglistbox">
      <div class="broadcastinglist"
           v-for="item in broadcasting"
           :key=item.id>
        <el-image :src="item.sPicUrl"
                  style="width:360px;height:200px;border-radius:5px"></el-image>
        <p style="font-size:14px;text-align:left;">{{item.name}}</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      broadcasting: []
    }
  },
  methods: {
    async getbroadcasting () {
      const { data } = await this.$http.get("/personalized/privatecontent")
      this.broadcasting = data.result
    }
  },
  created () {
    this.getbroadcasting()
  }
}
</script>

<style lang="less" scoped>
.broadcasting {
  padding-left: 70px;
  .broadcastinglistbox {
    padding-left: 38px;
    display: flex;
    flex-wrap: wrap;
    .broadcastinglist {
      cursor: pointer;
      margin-left: 20px;
      width: 360px;
    }
  }
}
</style>