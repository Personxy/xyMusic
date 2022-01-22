<template>
  <div class="personrecom">
    <div class="personrecomdiv"
         v-show="load">
      <!-- 轮播图 -->
      <banner @bannerdone="getbannerload" />
      <!-- 推荐歌单 -->
      <recomlist @recomlistdone="getrecomlistload" />
      <!-- 独家放送 -->
      <broadcasting @boradcastdone="boradcastload" />
      <!-- 最新音乐 -->
      <newmusic @getmusicdone="getmusicload" />
      <!-- 推荐MV -->
      <recommv @mvdone="mvload" />
    </div>
    <div class="loading"
         v-show="!load">
      <i class="el-icon-loading"
         style="margin-top:30px"></i><span style="margin-left:10px">加载中</span>
    </div>

  </div>
</template>
<script>
import banner from "../../../components/xymusic/findmusic/personRecom/banner.vue";
import recomlist from "../../../components/xymusic/findmusic/personRecom/recomlist.vue";
import broadcasting from "../../../components/xymusic/findmusic/personRecom/broadcasting.vue";
import newmusic from "../../../components/xymusic/findmusic/personRecom/newmusic.vue";
import recommv from "../../../components/xymusic/findmusic/personRecom/recomMv.vue";
export default {
  components: {
    banner,
    recomlist,
    broadcasting,
    newmusic,
    recommv,
  },
  data () {
    return {
      load: false,
      banner: false,
      recomlist: false,
      broadcasting: false,
      boradcast: false,
      mv: false
    }
  },
  methods: {
    getbannerload (data) {
      this.banner = data
    },
    getrecomlistload (data) {
      this.recomlist = data
    },
    getmusicload (data) {
      this.broadcasting = data
    },
    boradcastload (data) {
      this.boradcast = data
    },
    mvload (data) {
      this.mv = data
    }

  },
  mounted () {
    setTimeout(() => {
      if (this.banner && this.recomlist && this.recomlist && this.boradcast && this.mv)
      {
        this.load = true
      }
    }, 500);

  }

};
</script>

<style lang="less" scoped></style>
