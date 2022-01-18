<template>
  <div class="xymusic">
    <el-container class="bigcontainer">
      <!-- 顶部导航 -->
      <el-header>
        <div class="logobox">
          <img class="logo"
               src="../assets/images/logo1.png"
               alt="" />
        </div>
        <a class="home">羊羊音乐</a>
        <!-- 后退和前进按钮 -->
        <span href=""
              class="back"
              @click="goBack">
          <div class="arrowleft"></div>
        </span>
        <span href=""
              class="advance">
          <div class="arrowlright"></div>
        </span>
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
        <transition name="detail">
          <musicdetail v-show="songdetailflag" />
        </transition>
        <musicplay />

      </el-footer>
    </el-container>
    <!-- 登录界面 -->
    <Login v-show="loginbarflag && !userInfo" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Aside from "@/components/xymusic/aside";
import Login from "@/components/xymusic/login/login";
import loginbar from "@/components/xymusic/login/loginbar";
import search from "@/components/xymusic/search/search";
import musicplay from "../components/xymusic/musicplay/musicplay";
import musicdetail from '../components/xymusic/musicdetail/musicdetail.vue';
export default {
  name: "xymusic",
  components: { Aside, Login, loginbar, search, musicplay, musicdetail },
  data () {
    return {
      searchdata: "",
    };
  },
  computed: {
    // 控制登录面板是否打开
    loginbarflag () {
      return this.$store.state.loginflag;
    },
    ...mapGetters(["userInfo", 'songdetailflag']),
  },
  methods: {
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },

  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #ec4141;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 30px;
  color: #ffffff;
  .home {
    margin-left: 10px;
    font-family: "jdzhonyuanjian2ca53a9b9923eaa";
  }
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
  cursor: pointer;
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
.el-main {
  height: 85vh;
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
.detail-enter-active {
  animation: enterin 0.5s;
}
.detail-leave-active {
  animation: enterleave 0.5s;
}
@keyframes enterin {
  from {
    height: 0;
  }
  to {
    height: 85vh;
  }
}
@keyframes enterleave {
  0% {
    height: 85vh;
  }

  100% {
    height: 0;
  }
}
</style>
