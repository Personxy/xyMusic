<template>
  <div class="newmusic">
    <div class="newmusictab">
      <div :class="[newsongstab,{activetab:current==0}]"
           @click="changemusictab(0)">新歌速递</div>
      <div :class="[newalbumtab,{activetab:current==1}]"
           @click="changemusictab(1)">新碟上架</div>
    </div>
    <newsongs v-if='current==0' />
    <newalbum v-if='current==1' />
  </div>
</template>
<script>
import newsongs from "../../../components/xymusic/findmusic/newmusic/newsongs.vue"
import newalbum from "../../../components/xymusic/findmusic/newmusic/newalbum.vue"
export default {
  components: {
    newsongs,
    newalbum
  },
  data () {
    return {
      newsongstab: 'newsongstab',
      newalbumtab: "newalbumtab",
      current: 0,
    }
  },
  methods: {
    changemusictab (index) {
      this.current = index
    },
    // 新歌速递
    // async getnewsongs () {
    //   const { data } = await this.$http.get('/top/song', {
    //     params: {
    //       type: this.type
    //     }
    //   })
    //   this.newsongs = data.data
    // }
  },
  created () {

  }
};
</script>
<style lang="less" scoped>
.newmusic {
  padding: 0px 200px 0 300px;
  .newmusictab {
    margin: 20px auto;
    width: 250px;
    height: 36px;
    border: 1px solid #ccc;
    border-radius: 20px;
    display: flex;
    align-items: center;
    .newsongstab {
      cursor: pointer;
      width: 125px;
      height: 36px;
      border-radius: 20px;
      line-height: 36px;
    }
    .activetab {
      background: #bbbbbb;
      // 禁用hover
      pointer-events: none;
    }
    .newsongstab:hover {
      background-color: #f4f4f4;
    }
    .newalbumtab:hover {
      background-color: #f4f4f4;
    }
    .newalbumtab {
      cursor: pointer;
      width: 125px;
      height: 36px;
      border-radius: 20px;
      line-height: 36px;
    }
  }
}
</style>
