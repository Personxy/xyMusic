<template>
  <div class="mvranking">
    <div class="mvrankingtop">
      <div class="mvrankingtitle">MV排行榜&nbsp;&nbsp;></div>
      <div class="mvrankingtags">
        <div
          :class="[mvrankingtagslistclass, { active: index == currentindex }]"
          v-for="(item, index) in mvrankingtags"
          :key="item.id"
          @click="selectranktags(index, item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="mvrankinglistbox">
      <div
        class="mvrankinglist"
        v-for="(item, index) in rankingmvlist"
        :key="item.id"
      >
        <div class="mvrankingindex">
          {{ 9 > index ? "0" + (index + 1) : index + 1 }}
        </div>
        <div class="mvrankcover" @click="tovideodetail(item)">
          <el-image :src="item.cover" lazy></el-image>
          <!-- 视频得分 -->
          <div class="mvrankscore">
            <img
              src="../../../../assets/images/歌单列表播放按钮.svg"
              alt=""
            />{{ item.playCount }}
          </div>
        </div>
        <div class="mvrankinfo">
          <div class="mvrankname">{{ item.name }}</div>
          <div class="mvrankauthor">{{ item.artistName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rankingmvlist: Array,
  },
  data() {
    return {
      mvrankingtags: ["内地", "港台", "欧美", "日本", "韩国"],
      currentindex: 0,
      mvrankingtagslistclass: "mvrankingtagslistclass",
    };
  },
  methods: {
    selectranktags(index, item) {
      // console.log(this.newmvlist);
      this.currentindex = index;
      this.$emit("sendrankmvtag", item);
    },
    tovideodetail(data) {
      // 传递mv参数
      this.$router.push({
        path: "/home/videodetail",
        query: {
          id: data.id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mvranking {
  margin-top: 30px;
  .mvrankingtop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    .mvrankingtitle {
      font-size: 18px;
      font-weight: bold;
      text-align: left;
      padding-left: 60px;
      cursor: pointer;
    }
    .mvrankingtags {
      display: flex;
      font-size: 14px;
      color: #676767;
      .mvrankingtagslistclass {
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
  .mvrankinglistbox .mvrankinglist:nth-child(even) {
    border-right: none;
  }
  .mvrankinglistbox {
    margin-left: 45px;
    flex-wrap: wrap;
    display: flex;
    .mvrankinglist {
      height: 130px;
      width: 50%;
      box-sizing: border-box;
      display: flex;
      border-right: 1px solid #f3f3f3;
      border-bottom: 1px solid #f3f3f3;
      align-items: center;
      .mvrankingindex {
        line-height: 110px;
        font-size: 22px;
        margin-right: 15px;
        margin-left: 15px;
      }
      .mvrankcover {
        position: relative;
        cursor: pointer;
        .el-image {
          width: 180px;
          height: 95px;
          border-radius: 10px;
        }
        .mvrankscore {
          display: flex;
          align-items: center;
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 10px;
          color: white;
        }
      }
      .mvrankinfo {
        text-align: left;
        margin-left: 10px;
        margin-top: -50px;
        .mvrankname {
          font-size: 15px;
        }
        .mvrankauthor {
          margin-top: 10px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
