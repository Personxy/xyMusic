<template>
  <div class="collectlist">
    <div class="title">
      <span>添加到歌单</span>
      <div class="cross"><img src="../../../assets/images/叉号.svg" alt="" @click="closepanel" /></div>
    </div>
    <!-- 新建歌单 -->
    <div class="createcollectlist" @click="tocreateadialog">
      <img src="../../../assets/images/加号黑色.svg" alt="" />
      <span>新建歌单</span>
    </div>
    <div class="allsongslist">
      <div class="listitem" v-for="item in playListMine" :key="item.id">
        <div class="coverimgae"><el-image :src="item.coverImgUrl" alt=""></el-image></div>
        <div class="nameAndInfo">
          <div class="name">
            <span>{{ item.name }}</span>
          </div>
          <div class="info">
            <span>{{ item.trackCount }}&nbsp;首</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  methods: {
    closepanel() {
      this.$emit('closecollectlist', false);
    },
    tocreateadialog() {
      this.$emit('tocreateadialog', true);
    },
  },
  computed: {
    ...mapGetters(['playListMine']),
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.collectlist {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 440px;
  height: 650px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  .title {
    font-weight: bold;
    font-size: 22px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cross {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 15px;
        height: 15px;
      }
      &:hover {
        cursor: pointer;
        background: #f2f2f4;
        border-radius: 50%;
        transition: all 0.3s;
      }
    }
  }
  .createcollectlist {
    width: 440px;
    height: 50px;
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f2f4;
    border-radius: 6px;
    &:hover {
      cursor: pointer;
      background: #e6e8eb;
      color: #333;
    }
    img {
      margin-right: 5px;
    }
  }
  .allsongslist {
    height: 520px;
    overflow: hidden;
    &:hover {
      overflow: auto;
    }
    .listitem {
      height: 40px;
      width: 440px;
      display: flex;
      align-items: center;
      border-radius: 5px;
      margin-bottom: 5px;
      padding-top: 4px;
      &:hover {
        background: #f1f1f3;
        cursor: pointer;
      }
      .coverimgae {
        .el-image {
          width: 35px;
          height: 35px;
          border-radius: 5px;
        }
      }
      .nameAndInfo {
        margin-left: 10px;
        .name {
          span {
            font-size: 15px;
            color: #333;
          }
        }
        .info {
          text-align: left;
          span {
            font-size: 13px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
