<template>
  <div class="newmv">
    <div class="newmvtop">
      <div class="newmvtitle">
        最新MV&nbsp;&nbsp;>
      </div>
      <div class="newmvtags">
        <div :class="[newmvtagslistclass,{active:index==currentindex}]"
             v-for="(item,index) in newmvtags"
             :key="item.id"
             @click="selecttags(index,item)">{{item}}</div>
      </div>
    </div>
    <div class="newmvlistbox">
      <div class="newmvlist"
           v-for="item in newmvlist"
           :key="item.id">
        <div class="newmvlistcover"
             @click="tovideodetail(item)">
          <el-image :src="item.cover"
                    alt=""></el-image>
          <!-- 视频播放量 -->
          <div class="newmvplaycounts">
            <img src="../../../../assets/images/歌单列表播放按钮.svg"
                 alt="" />{{
            item.playCount  | wan
          }}
          </div>
        </div>
        <div class="newmvtitle">{{item.name}}</div>
        <div class="newmvauthor">{{item.artistName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newmvlist: Array
  },
  data () {
    return {
      newmvtags: ['内地', '港台', '欧美', '日本', '韩国'],
      // class
      newmvtagslistclass: 'newmvtagslistclass',
      currentindex: 0
    }
  },
  methods: {
    selecttags (index, item) {
      // console.log(this.newmvlist);
      this.currentindex = index
      this.$emit("sendnewmv", item)
    },
    tovideodetail (data) {
      // 传递mv参数
      this.$router.push({
        path: '/home/videodetail',
        query: {
          id: data.id
        }
      })
    }
  },
  computed: {
    newmvlistdata () {
      return this.newmvlist
    }
  }

}
</script>

<style lang="less" scoped>
.newmv {
  .newmvtop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    .newmvtitle {
      font-size: 18px;
      font-weight: bold;
      text-align: left;
      padding-left: 60px;
      cursor: pointer;
    }
    .newmvtags {
      display: flex;
      font-size: 14px;
      color: #676767;
      .newmvtagslistclass {
        margin-left: 5px;
        cursor: pointer;
        padding: 2px 10px;
      }
      .active {
        background-color: #fad8d8;
        color: #ec4141;
        border-radius: 15px;
      }
    }
  }
  .newmvlistbox {
    display: flex;
    flex-wrap: wrap;
    margin-left: 60px;
    margin-top: 15px;
    .newmvlist {
      cursor: pointer;
      margin-right: 20px;
      width: 293px;
      text-align: left;
      margin-bottom: 15px;
      .newmvlistcover {
        position: relative;
        .el-image {
          width: 300px;
          height: 180px;
          border-radius: 5px;
        }
        .newmvplaycounts {
          display: flex;
          align-items: center;
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          color: white;
        }
      }
      .newmvtitle {
        font-size: 15px;
        margin-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .newmvauthor {
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
}
</style>