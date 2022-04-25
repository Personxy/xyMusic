<template>
  <div class="creatcollectionlist">
    <div class="title">
      <span>添加到歌单</span>
      <div class="cross"><img src="../../../assets/images/叉号.svg" alt="" @click="closepanel" /></div>
    </div>
    <div class="inputname">
      <el-input v-model="collectionname" placeholder="歌单名称"></el-input>
    </div>
    <div class="checkpravite">
      <el-checkbox v-model="checked" text-color="#606266">设置为隐私歌单</el-checkbox>
    </div>
    <div class="line"></div>
    <div class="createbtn" @click="createcollect"><span>创建</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    rightmenuitem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      collectionname: '',
      checked: false,
      playListm: [],
      playListc: [],
    };
  },
  methods: {
    closepanel() {
      this.$emit('closecreate', false);
    },
    async createcollect() {
      if (this.collectionname) {
        const loading = this.$loading({
          lock: true,
          text: '创建中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)',
        });
        const { data } = await this.$http.get('/playlist/create', {
          params: {
            name: this.collectionname,
            privacy: this.checked ? 1 : 0,
          },
        });
        console.log(data);
        if (data.code == 200) {
          const { data: listdata } = await this.$http.get('/user/playlist', {
            params: { uid: this.userInfo.userId, limit: 40, timeStamp: Date.now() },
          });
          if (listdata.code == 200) {
            const { data: addsong } = await this.$http.get('/playlist/tracks', {
              params: {
                op: 'add',
                pid: data.playlist.id,
                tracks: this.rightmenuitem.id,
                timeStamp: Date.now(),
              },
            });
            // 找出个人歌单
            this.playListm = listdata.playlist.filter((element) => {
              return element.userId == this.userInfo.userId;
            });
            // 找出收藏歌单
            this.playListc = listdata.playlist.filter((element) => {
              return element.userId !== this.userInfo.userId;
            });
            // 保存歌单
            this.$store.dispatch('saveplayListMine', this.playListm);
            this.$store.dispatch('saveplayListCollect', this.playListc);
            loading.close();
            this.$emit('closecreate', false);
            this.$message({
              message: '创建成功',
              type: 'success',
            });
          } else {
            loading.close();
            this.$message({
              message: ` 创建失败,${listdata.code}`,
              type: 'error',
            });
          }
        } else {
          loading.close();
          this.$message({
            message: `创建失败，${data.code}`,
            type: 'error',
          });
        }
      }
    },
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
};
</script>

<style lang="less" scoped>
.creatcollectionlist {
  width: 420px;
  height: 180px;
  background: #fff;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1802;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  .title {
    font-weight: bold;
    font-size: 20px;
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
  .inputname {
    margin-top: 20px;
    .el-input {
      /deep/.el-input__inner {
        border: 0;
        background: #f2f2f4;
        border-radius: 5px;
      }
    }
  }
  .line {
    height: 1px;
    background: #e5e5e5;
    margin-top: 10px;
  }
  .createbtn {
    height: 30px;
    margin-top: 20px;
    background-color: #e94848;
    border-radius: 7px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    span {
      color: #fff;
      font-size: 16px;
    }
  }
  .checkpravite {
    text-align: left;
  }
  /deep/.el-checkbox {
    margin-top: 15px;
    margin-left: 2px;
  }
  /deep/.el-checkbox__inner:hover {
    border-color: #606266;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #e94848;
    border-color: #e94848;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
</style>
