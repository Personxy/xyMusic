<template>
  <div class="aside">
    <el-menu
      class="el-menu-vertical-demo"
      text-color="#535353"
      active-text-color="#313131"
      :default-active="'/' + this.$route.path.split('/')[1] + '/' + this.$route.path.split('/')[2]"
      :router="true"
    >
      <el-menu-item index="/home/findmusic">
        <span slot="title">发现音乐</span>
      </el-menu-item>
      <el-menu-item index="/home/podcast">
        <span slot="title">播客</span>
      </el-menu-item>
      <el-menu-item index="/home/video">
        <span slot="title">视频</span>
      </el-menu-item>
      <el-menu-item index="/home/privatefm">
        <span slot="title">私人FM</span>
      </el-menu-item>
      <p>我的音乐</p>
      <el-menu-item index="/home/recently" class="otheritem">
        <i class="el-icon-pie-chart"></i>
        <span slot="title">最近播放</span>
      </el-menu-item>
      <el-menu-item index="/home/cloudmusic" class="otheritem">
        <i class="el-icon-upload"></i>
        <span slot="title">我的音乐云盘</span>
      </el-menu-item>
      <!-- <el-menu-item index="/home/mycollect"
                    class="otheritem">
        <i class="el-icon-star-off"></i>
        <span slot="title">我的收藏</span>
      </el-menu-item> -->
      <el-submenu index="1" class="createplaylist">
        <template slot="title">创建的歌单</template>
        <el-menu-item :index="'/home/playlistpage/' + item.id" class="otheritem" v-for="(item, index) in (playListMine || []).slice(0, 1)" :key="index.id"
          ><img src="../../assets/images/爱心.svg" alt="" />{{ item.name }}</el-menu-item
        >
        <el-menu-item :index="'/home/playlistpage/' + item.id" class="otheritem" v-for="item in playListMine == null ? [] : playListMine.slice(1)" :key="item.id"
          ><img src="../../assets/images/音乐.svg" alt="" />{{ item.name }}</el-menu-item
        >
      </el-submenu>
      <el-submenu index="2" ref="menu">
        <template slot="title">收藏的歌单</template>
        <el-menu-item :index="'/home/playlistpage/' + item.id" class="otheritem" v-for="item in playListCollect" :key="item.id"
          ><img src="../../assets/images/音乐.svg" alt="" />{{ item.name }}</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Aside',
  props: {},
  data() {
    return {
      current: '',
    };
  },
  methods: {},
  computed: {
    ...mapGetters(['playListMine', 'playListCollect', 'currentactive']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.el-col {
  height: 84vh;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
}
.el-col:hover {
  overflow-y: overlay;
}
.el-menu {
  height: 84vh;
  padding: 0 5px 2px;
  margin-top: 8px;
  border-right: 0;
  overflow: hidden;
}
.el-menu:hover {
  overflow-y: auto;
}
.el-menu-item {
  padding: 0 5px !important;
  text-align: left;
  font-size: 14px;
  height: 40px;
  margin-top: 3px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 189px;
}
.el-menu-item.is-active {
  background-color: #e6e7ea !important;
  font-size: 18px;
  font-weight: bold;
}
/deep/.el-menu-item.otheritem.is-active {
  font-size: 14px;
  font-weight: normal;
}
/deep/.el-menu-item.otheritem:focus {
  color: rgb(49, 49, 49) !important;
  text-align: left !important;
  font-size: 14px;
  font-weight: normal;
}
.el-menu p {
  font-size: 10px;
  color: #929297;
  text-align: left;
  margin-left: 7px;
}
.el-menu-item:hover {
  background-color: #e6e7ea;
}
.el-menu-item:focus {
  background-color: #e6e7ea !important;
  font-size: 18px;
  font-weight: bold;
  color: rgb(49, 49, 49) !important;
}
.el-menu-item img {
  margin-right: 5px;
}
/deep/.el-submenu__title {
  color: #929297 !important;
  padding-left: 5px !important;
  text-align: left;
  font-size: 10px;
  width: 180px;
}
/deep/.el-submenu__title:hover {
  background-color: #ffffff;
}
/deep/.el-submenu__icon-arrow.el-icon-arrow-down::before {
  content: '\e791';
}
/deep/.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(90deg);
}

/deep/.el-submenu .el-menu-item {
  min-width: 0;
}
/deep/.el-submenu .el-menu-item:focus {
  color: rgb(49, 49, 49) !important;
  text-align: left !important;
  font-size: 14px;
  font-weight: normal;
}
/deep/.el-submenu__icon-arrow {
  right: 100px;
}
</style>
