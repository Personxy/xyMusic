<template>
  <div class="xymusic">
    <el-container class="bigcontainer">
      <!-- 顶部导航 -->
      <el-header>
        <div class="logobox">
          <img class="logo" src="../assets/images/logo1.png" alt="" />
        </div>
        <a class="home">羊羊音乐</a>
        <!-- 后退和前进按钮 -->
        <a href="" class="back">
          <div class="arrowleft"></div>
        </a>
        <a href="" class="advance">
          <div class="arrowlright"></div>
        </a>
        <!-- 搜索页面 -->
        <search />
        <!-- 点击出现登陆面板或在此显示用户头像 -->
        <loginbar />
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <Aside></Aside>
        </el-aside>
        <!-- 内容展示区域 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <!-- 播放器区域 -->
      <el-footer>
        <musicplay></musicplay>
      </el-footer>
    </el-container>
    <!-- 登录界面 -->
    <Login v-show="loginbarflag && !userInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Aside from '@/components/xymusic/aside';
import Login from '@/components/xymusic/login/login';
import loginbar from '@/components/xymusic/login/loginbar';
import search from '@/components/xymusic/search/search';
import musicplay from '../components/xymusic/musicplay/musicplay';
export default {
  name: 'xymusic',
  components: { Aside, Login, loginbar, search, musicplay },
  data() {
    return {
      searchdata: '',
    };
  },
  computed: {
    // 控制登录面板是否打开
    loginbarflag() {
      return this.$store.state.loginflag;
    },
    ...mapGetters(['userInfo']),
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #ec4141;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #ffffff;
  font-family: 'jdlibianjian2bfc78d6df23eaa';
  font-size: 30px;
}
.logobox {
  background-color: #ffffff;
  border-radius: 50%;
  overflow: hidden;
  width: 4vh;
  height: 4vh;
}
.back,
.advance {
  width: 22px;
  height: 22px;
  background-color: #d93b3b;
  border-radius: 50%;
  position: relative;
  margin-top: 7px;
}
.back {
  margin-left: 90px;
}
.arrowleft {
  width: 7px;
  height: 7px;
  border-top: 1px solid white;
  border-right: 1px solid white;
  transform: rotate(230deg);
  margin: 0 auto;
  position: absolute;
  top: 6px;
  left: 9px;
}
.arrowlright {
  width: 7px;
  height: 7px;
  border-top: 1px solid white;
  border-right: 1px solid white;
  transform: rotate(45deg);
  position: absolute;
  top: 6px;
  right: 9px;
}
.advance {
  margin-left: 10px;
}

.home {
  margin-left: 10px;
}
.logo {
  width: 100%;
  height: 100%;
}

.el-aside {
  border-right: 1px solid #e1e1e1;
}

.el-footer {
  // box-shadow: 0 0 1px 1px #b9b5b5;
  border-top: 1px solid #e1e1e1;
  bottom: 0;
  background: #ffffff;
  z-index: 1800;
  padding-left: 0;
  position: fixed;
  height: 80px !important;
  width: 100%;
}
</style>
